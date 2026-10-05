// Reads the token tables out of a DESIGN.md: YAML front matter between the first two `---` lines.
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import { parseColor } from './color.mjs';
import { parsePx } from './context.mjs';

// `{colors.primary}` -> the value at that path in the parsed front matter; anything else is returned as is.
export function resolveRef(value, doc, depth = 0) {
  const m = typeof value === 'string' && /^\{([\w.-]+)\}$/.exec(value.trim());
  if (!m || depth > 8) return value;
  let cur = doc;
  for (const key of m[1].split('.')) cur = cur?.[key];
  return cur === undefined ? value : resolveRef(cur, doc, depth + 1);
}

const entries = (obj) => (obj && typeof obj === 'object' ? Object.entries(obj) : []);

export async function readDesign(path) {
  let text;
  try {
    text = await readFile(path, 'utf8');
  } catch {
    return { ok: false, reason: `DESIGN.md not readable at ${path}` };
  }
  const m = /^﻿?---\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/.exec(text);
  if (!m) return { ok: false, reason: 'DESIGN.md has no YAML front matter between --- lines' };
  let doc;
  try {
    doc = parse(m[1]);
  } catch (err) {
    return { ok: false, reason: `DESIGN.md front matter is not valid YAML: ${String(err.message).split('\n')[0]}` };
  }
  if (!doc || typeof doc !== 'object') return { ok: false, reason: 'DESIGN.md front matter is empty' };

  const colors = new Map();
  const unparsed = { colors: [], typography: [] };
  for (const [name, raw] of entries(doc.colors)) {
    const c = parseColor(resolveRef(raw, doc));
    if (c) colors.set(name, c);
    else unparsed.colors.push(name);
  }
  const fonts = new Set();
  for (const [name, t] of entries(doc.typography)) {
    const family = t?.fontFamily;
    // An unfilled template slot such as <display font> is not a font name.
    if (family && /[<>{}]/.test(String(family))) unparsed.typography.push(name);
    else if (family) fonts.add(String(family).split(',')[0].trim().replace(/^["']|["']$/g, '').toLowerCase());
  }
  const px = (table) => {
    const out = new Set();
    for (const [, v] of entries(table)) {
      const n = parsePx(String(resolveRef(v, doc)));
      if (n !== null) out.add(n);
    }
    return out;
  };
  return { ok: true, unparsed, tokens: { colors, fonts, rounded: px(doc.rounded), spacing: px(doc.spacing) } };
}
