// What a rule needs when it has to ask "how tall is this element" or "does this
// box carry a background image": a small, deliberately conservative matcher from
// an element to the declarations that reach it. It understands tag, class and id
// compounds joined by descendant or child combinators, and refuses to match
// anything else, so a rule built on it under-reports rather than guesses.
import { cssUnits, resolveVars, parsePx } from './context.mjs';

const COMPOUND = /^(?:[a-z][a-z0-9-]*)?(?:[.#][A-Za-z_][\w-]*)*$/;

function parseCompound(part) {
  if (!COMPOUND.test(part) || part === '') return null;
  const tag = /^[a-z][a-z0-9-]*/.exec(part);
  const classes = [...part.matchAll(/\.([A-Za-z_][\w-]*)/g)].map((m) => m[1]);
  const id = /#([A-Za-z_][\w-]*)/.exec(part);
  return { tag: tag ? tag[0] : null, classes, id: id ? id[1] : null };
}

function matchesCompound(el, compound) {
  if (!el || el.type !== 'tag') return false;
  if (compound.tag && compound.tag !== '*' && compound.tag !== el.tagName) return false;
  const a = el.attribs || {};
  if (compound.id && compound.id !== a.id) return false;
  if (compound.classes.length) {
    const have = new Set(String(a.class || '').split(/\s+/).filter(Boolean));
    if (!compound.classes.every((c) => have.has(c))) return false;
  }
  return true;
}

function ancestorList(el) {
  const out = [];
  let node = el.parent;
  while (node && node.type === 'tag') {
    out.push(node);
    node = node.parent;
  }
  return out;
}

// A selector reaches an element when its last compound matches the element and
// the compounds before it match ancestors in order. Combinators are read loosely
// as "descendant", which can only widen a match, never invent one.
export function selectorReaches(el, selector) {
  const raw = String(selector).trim();
  if (!raw || /[[:]/.test(raw)) return false;
  const parts = raw.split(/\s*>\s*|\s+/).filter(Boolean).map(parseCompound);
  if (parts.some((p) => p === null)) return false;
  const last = parts[parts.length - 1];
  if (!matchesCompound(el, last)) return false;
  let chain = ancestorList(el);
  for (let i = parts.length - 2; i >= 0; i--) {
    const at = chain.findIndex((node) => matchesCompound(node, parts[i]));
    if (at < 0) return false;
    chain = chain.slice(at + 1);
  }
  return true;
}

function inlineDecls(el) {
  const out = [];
  for (const chunk of String(el.attribs?.style || '').split(';')) {
    const at = chunk.indexOf(':');
    if (at < 0) continue;
    const prop = chunk.slice(0, at).trim().toLowerCase();
    const value = chunk.slice(at + 1).trim();
    if (prop && value) out.push({ prop, value });
  }
  return out;
}

/**
 * Every declaration that reaches an element, in source order, inline style last.
 * Values arrive with var() already resolved.
 */
export function declarationsFor(ctx, el) {
  const out = [];
  for (const unit of cssUnits(ctx)) {
    unit.root.walkRules((rule) => {
      const parts = String(rule.selector || '').split(',').map((s) => s.trim()).filter(Boolean);
      if (!parts.some((sel) => selectorReaches(el, sel))) return;
      rule.walkDecls((decl) => out.push({ prop: decl.prop.trim().toLowerCase(), value: resolveVars(ctx, decl.value) }));
    });
  }
  for (const d of inlineDecls(el)) out.push({ prop: d.prop, value: resolveVars(ctx, d.value) });
  return out;
}

export function declaredValue(ctx, el, props) {
  let found = null;
  for (const d of declarationsFor(ctx, el)) {
    if (props.includes(d.prop)) found = d.value;
  }
  return found;
}

/** Declared height in px, from CSS, an inline style, or the height attribute. */
export function declaredHeightPx(ctx, el) {
  const css = declaredValue(ctx, el, ['height', 'max-height']);
  const fromCss = parsePx(css || '');
  if (fromCss !== null) return fromCss;
  const attr = String(el.attribs?.height || '').trim();
  if (/^\d+(\.\d+)?(px)?$/.test(attr)) return parseFloat(attr);
  return null;
}
