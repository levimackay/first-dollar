// Shared parsing + measurement helpers for the lint rules.
import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import * as cheerio from 'cheerio';
import safeParser from 'postcss-safe-parser';
import { hashesFor } from './text-hash.mjs';

export const SCANNED = new Set(['.html', '.css']);

export async function walk(root) {
  const out = [];
  const info = await stat(root);
  if (info.isFile()) {
    if (SCANNED.has(path.extname(root).toLowerCase())) out.push(root);
    return out;
  }
  async function rec(dir) {
    const entries = await readdir(dir, { withFileTypes: true });
    entries.sort((a, b) => (a.name < b.name ? -1 : 1));
    for (const e of entries) {
      if (e.name.startsWith('.')) continue;
      if (e.isDirectory()) {
        if (e.name === 'node_modules') continue;
        await rec(path.join(dir, e.name));
      } else if (e.isFile() && SCANNED.has(path.extname(e.name).toLowerCase())) {
        out.push(path.join(dir, e.name));
      }
    }
  }
  await rec(root);
  return out;
}

function safeParse(text) {
  return safeParser(text, { from: undefined });
}

export async function buildContext(root, { referenceTexts = [], referenceHashes = [], designPath = null, parse = safeParse } = {}) {
  const abs = path.resolve(root);
  const paths = await walk(abs);
  const files = [];
  // A stylesheet nobody could parse is reported as a warning rather than dropped in
  // silence, so a run never looks clean because half of it never got read.
  const parseErrors = [];
  const tryParse = (text, file) => {
    try {
      return parse(text);
    } catch (err) {
      parseErrors.push(finding('parse-error', file, 1, `stylesheet did not parse: ${err.message}`, 'warn'));
      return null;
    }
  };
  for (const p of paths) {
    const text = await readFile(p, 'utf8');
    const kind = path.extname(p).toLowerCase() === '.css' ? 'css' : 'html';
    const file = {
      path: p,
      rel: path.relative(abs, p) || path.basename(p),
      kind,
      text,
      lines: text.split('\n'),
      styles: [],
    };
    if (kind === 'html') {
      file.$ = cheerio.load(text, { sourceCodeLocationInfo: true });
      file.$('style').each((_, el) => {
        const css = file.$(el).html() || '';
        const parsed = tryParse(css, file);
        if (!parsed) return;
        const endLine = el.sourceCodeLocation?.startTag?.endLine;
        file.styles.push({ root: parsed, offset: endLine ? endLine - 1 : 0 });
      });
    } else {
      const parsed = tryParse(text, file);
      if (parsed) file.css = parsed;
    }
    files.push(file);
  }
  // Reference copy reaches a rule as hashes only. Plain text is accepted for
  // convenience (--reference-text, tests) and hashed here, never kept alongside.
  const hashes = new Set(referenceHashes);
  for (const h of hashesFor(referenceTexts)) hashes.add(h);
  // With no explicit design file, a DESIGN.md at the root of the linted directory is used.
  const defaultDesign = path.join(abs, 'DESIGN.md');
  const resolvedDesign = designPath
    ?? (statSync(abs).isDirectory() && existsSync(defaultDesign) ? defaultDesign : null);
  const ctx = { root: abs, files, referenceHashes: hashes, designPath: resolvedDesign, parseErrors };
  ctx.customProps = collectCustomProps(ctx);
  return ctx;
}

// Every custom property the run can see. `:root` declarations are read first so a
// later, more specific declaration of the same name wins.
export function collectCustomProps(ctx) {
  const props = new Map();
  const units = cssUnits(ctx);
  for (const rootFirst of [true, false]) {
    for (const unit of units) {
      unit.root.walkDecls((decl) => {
        if (!decl.prop.startsWith('--')) return;
        const inRoot = /(^|[\s,])(:root|html)\b/.test(decl.parent?.selector || '');
        if (inRoot !== rootFirst) return;
        props.set(decl.prop.trim(), decl.value.trim());
      });
    }
  }
  return props;
}

// Splits `var(--name, fallback)` at its first top-level comma.
function splitVarArgs(inner) {
  let depth = 0;
  for (let i = 0; i < inner.length; i++) {
    const c = inner[i];
    if (c === '(') depth += 1;
    else if (c === ')') depth -= 1;
    else if (c === ',' && depth === 0) return [inner.slice(0, i).trim(), inner.slice(i + 1).trim()];
  }
  return [inner.trim(), null];
}

const VAR_DEPTH = 8;

/**
 * Expand every var() in a declaration value against the properties the run
 * collected. An undeclared property falls back to its fallback, or to nothing.
 */
export function resolveVars(ctx, value, depth = 0) {
  const text = String(value ?? '');
  if (depth >= VAR_DEPTH || !text.includes('var(')) return text;
  let out = '';
  let i = 0;
  while (i < text.length) {
    const start = text.toLowerCase().indexOf('var(', i);
    if (start < 0) {
      out += text.slice(i);
      break;
    }
    out += text.slice(i, start);
    let depthParen = 0;
    let end = -1;
    for (let j = start + 3; j < text.length; j++) {
      if (text[j] === '(') depthParen += 1;
      else if (text[j] === ')') {
        depthParen -= 1;
        if (depthParen === 0) { end = j; break; }
      }
    }
    if (end < 0) {
      out += text.slice(start);
      break;
    }
    const [name, fallback] = splitVarArgs(text.slice(start + 4, end));
    const declared = ctx.customProps?.get(name);
    const replacement = declared !== undefined ? declared : (fallback ?? '');
    out += resolveVars(ctx, replacement, depth + 1);
    i = end + 1;
  }
  return out.replace(/\s+/g, ' ').trim();
}

// Every stylesheet the run knows about: real .css files plus inline <style> blocks.
// Inline blocks carry a line offset so findings point at the right HTML line.
export function cssUnits(ctx) {
  const units = [];
  for (const f of ctx.files) {
    if (f.css) units.push({ file: f, root: f.css, offset: 0 });
    for (const s of f.styles) units.push({ file: f, root: s.root, offset: s.offset });
  }
  return units;
}

export function unitLine(unit, node) {
  return Math.max(1, (node?.source?.start?.line || 1) + unit.offset);
}

export function eachDecl(ctx, propTest, cb) {
  for (const unit of cssUnits(ctx)) {
    unit.root.walkDecls((decl) => {
      if (propTest && !propTest.test(decl.prop.toLowerCase())) return;
      cb(decl, unit, unitLine(unit, decl));
    });
  }
}

export function eachRule(ctx, cb) {
  for (const unit of cssUnits(ctx)) {
    unit.root.walkRules((rule) => cb(rule, unit, unitLine(unit, rule)));
  }
}

export function htmlFiles(ctx) {
  return ctx.files.filter((f) => f.kind === 'html');
}

export function lineAtIndex(text, idx) {
  return text.slice(0, Math.max(0, idx)).split('\n').length;
}

export function elLine(file, el) {
  const loc = el?.sourceCodeLocation;
  const line = loc?.startTag?.startLine ?? loc?.startLine;
  if (line) return line;
  if (typeof el?.startIndex === 'number') return lineAtIndex(file.text, el.startIndex);
  if (el?.tagName) {
    const idx = file.text.indexOf(`<${el.tagName}`);
    if (idx >= 0) return lineAtIndex(file.text, idx);
  }
  return 1;
}

export function textNodes(file) {
  const out = [];
  const visit = (node) => {
    for (const child of node.children || []) {
      if (child.type === 'text') {
        if (child.data && child.data.trim()) {
          out.push({ node: child, text: child.data, line: elLine(file, child) });
        }
      } else if (child.type === 'tag') {
        if (child.tagName === 'script' || child.tagName === 'style') continue;
        visit(child);
      }
    }
  };
  visit(file.$.root()[0]);
  return out;
}

export const COPY_ATTRS = ['title', 'alt', 'placeholder', 'aria-label', 'content', 'value'];

export function copyAttrs(file) {
  const out = [];
  file.$('*').each((_, el) => {
    for (const name of COPY_ATTRS) {
      const v = el.attribs?.[name];
      if (v && v.trim()) out.push({ el, name, value: v, line: elLine(file, el) });
    }
  });
  return out;
}

export function elementChildren(el) {
  return (el.children || []).filter((c) => c.type === 'tag');
}

export function parsePx(value) {
  if (typeof value !== 'string') return null;
  const v = value.trim();
  let m = v.match(/^(-?\d*\.?\d+)px$/i);
  if (m) return parseFloat(m[1]);
  m = v.match(/^(-?\d*\.?\d+)rem$/i);
  if (m) return parseFloat(m[1]) * 16;
  m = v.match(/^(-?\d*\.?\d+)em$/i);
  if (m) return parseFloat(m[1]) * 16;
  if (/^0$/.test(v)) return 0;
  return null;
}

export function firstToken(value) {
  return String(value).trim().split(/\s+/)[0];
}

export function coefficientOfVariation(nums) {
  if (nums.length === 0) return Infinity;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  if (mean === 0) return 0;
  const variance = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  return Math.sqrt(variance) / Math.abs(mean);
}

// First family of a font-family stack, unquoted and lowercased.
export function firstFamily(value) {
  const raw = String(value).split(',')[0] || '';
  return raw.trim().replace(/^["']|["']$/g, '').trim().toLowerCase();
}

export function normalizeStack(value) {
  return String(value)
    .split(',')
    .map((s) => s.trim().replace(/^["']|["']$/g, '').toLowerCase())
    .filter(Boolean)
    .join(', ');
}

export function selectorParts(rule) {
  return String(rule.selector || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

export function finding(rule, file, line, message, severity) {
  return {
    rule,
    severity,
    file: typeof file === 'string' ? file : file.path,
    line: Math.max(1, Math.round(line || 1)),
    message,
  };
}
