import { htmlFiles, elLine, finding } from '../context.mjs';

// A number that carries a claim. The trailing boundary sits inside the word
// alternation on purpose: `98%` has no word character after the sign, so a
// boundary applied to the whole group would never match a percentage.
const CLAIM = /\b\d[\d,.]*\s*(?:%|\+|(?:percent|k|m|million|customers|clients|projects|years|stars|reviews|countries|users)\b)/i;
// Multiplier claims: "3x faster", "10\u00d7 more". A digit run before the x keeps "4x4" and "1920x1080" out.
const MULTIPLIER = /\b\d[\d,.]*x\b(?!\d)|\b\d[\d,.]*\s*\u00d7/i;
const LEAD_IN = /\b(?:over|more than|nearly|trusted by)\s+\d/i;

// A claim the reader can check is a short one. A number buried in a long
// sentence is prose, not a stat, and chasing it is where false positives live.
const SENTENCE_MAX = 80;

// A number carrying a unit the browser understands is a parameter: a duration, a
// length, a frame rate. Those describe the interface, not the business, and they
// are read out of the code, so they are taken off the text before it is judged.
const MEASURE = /\b\d[\d,.]*\s*(?:ms|s|px|pt|em|rem|vw|vh|vmin|vmax|ch|fps|deg|hz|dpi|kb|mb|gb)\b/gi;

const SOURCED = /\[SOURCE|\[PLACEHOLDER|\[NEED:/i;
const CURRENCY = /[$£€¥]\s*$/;
const PHONE = /(?:\+?\d[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}/;
const POSTAL = /\b\d{5}(?:-\d{4})?\b\s*$/;
const EXEMPT_TAGS = new Set(['code', 'pre', 'time', 'script', 'style']);

function ancestors(el) {
  const out = [];
  let node = el.parent;
  while (node && node.type === 'tag') {
    out.push(node);
    node = node.parent;
  }
  return out;
}

// Element text with script and style contents left out, whitespace flattened.
function ownText(el) {
  let out = '';
  const visit = (node) => {
    for (const child of node.children || []) {
      if (child.type === 'text') out += child.data;
      else if (child.type === 'tag' && !EXEMPT_TAGS.has(child.tagName)) visit(child);
    }
  };
  if (el.type === 'tag' && EXEMPT_TAGS.has(el.tagName)) return '';
  visit(el);
  return out.replace(/\s+/g, ' ').trim();
}

function claims(text) {
  const judged = String(text).replace(MEASURE, ' ');
  return CLAIM.test(judged) || LEAD_IN.test(judged) || MULTIPLIER.test(judged);
}

function sentences(text) {
  return text.split(/(?<=[.!?])\s+/).filter(Boolean);
}

// The shortest claim in the block, so a stat sitting beside a paragraph is still
// judged on its own length.
function shortestClaim(text) {
  const parts = sentences(text).filter(claims);
  if (!parts.length) return null;
  return parts.sort((a, b) => a.length - b.length)[0];
}

function hasSource(file, el) {
  for (const node of [el, ...ancestors(el)]) {
    if (node.attribs && 'data-source' in node.attribs) return true;
    if (EXEMPT_TAGS.has(node.tagName)) return true;
    if (node.tagName === 'a' && /^tel:/i.test(node.attribs?.href || '')) return true;
  }
  const parent = el.parent && el.parent.type === 'tag' ? el.parent : el;
  const scope = file.$(parent);
  if (scope.find('cite').length || scope.find('a').length) return true;
  if (SOURCED.test(scope.text())) return true;
  return false;
}

function priced(text, claim) {
  const at = text.indexOf(claim);
  const before = text.slice(0, at < 0 ? 0 : at + claim.search(/\d/));
  return CURRENCY.test(before);
}

export default {
  id: 'invented-metric',
  severity: 'fail',
  describe: 'a number-bearing claim with nothing behind it',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const matching = new Set();
      $('*').each((_, el) => {
        if (claims(ownText(el))) matching.add(el);
      });
      for (const el of matching) {
        // Only the innermost element holding the claim reports, so one number
        // does not turn into a finding for every wrapper above it.
        if ($(el).find('*').toArray().some((kid) => matching.has(kid))) continue;
        const text = ownText(el);
        const claim = shortestClaim(text);
        if (!claim || claim.length >= SENTENCE_MAX) continue;
        if (PHONE.test(claim) || POSTAL.test(claim)) continue;
        if (priced(text, claim)) continue;
        if (hasSource(file, el)) continue;
        out.push(finding('invented-metric', file, elLine(file, el), `unsourced number in "${claim}"; mark it with data-source or drop it`));
      }
    }
    return out;
  },
};
