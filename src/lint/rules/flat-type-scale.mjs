import { eachDecl, resolveVars, parsePx, finding } from '../context.mjs';

const MIN_RATIO = 2.5;

// The largest px or rem length in a value, so clamp(1rem, 4vw, 3rem) counts as 48px.
function sizeOf(value) {
  const sizes = (value.match(/-?\d*\.?\d+(?:px|rem)\b/gi) || []).map(parsePx).filter((n) => n !== null);
  return sizes.length ? Math.max(...sizes) : null;
}

const SCREEN = 1440;

function lengthPx(v) {
  const m = /^(-?\d*\.?\d+)(px|em|rem)$/i.exec(v.trim());
  if (!m) return null;
  return m[2].toLowerCase() === 'px' ? parseFloat(m[1]) : parseFloat(m[1]) * 16;
}

// One media query (no commas) holds on a 1440px screen. Anything that is not a width
// condition or the screen/all types (print, orientation, hover, prefers-*) does not apply.
function queryHolds(query) {
  const q = query.trim().toLowerCase();
  if (!q || /^not\b/.test(q)) return false;
  return q.replace(/^only\s+/, '').split(/\s+and\s+/).every((part) => {
    part = part.trim();
    if (part === 'screen' || part === 'all') return true;
    const m = /^\(\s*(min|max)-width\s*:\s*([^)]+)\)$/.exec(part);
    if (!m) return false;
    const px = lengthPx(m[2]);
    return px !== null && (m[1] === 'min' ? px <= SCREEN : px >= SCREEN);
  });
}

// A declaration counts when every @media around it holds at 1440px; top-level rules always do.
function appliesAtDesktop(node) {
  for (let p = node.parent; p; p = p.parent) {
    if (p.type === 'atrule' && /^media$/i.test(p.name) && !p.params.split(',').some(queryHolds)) return false;
  }
  return true;
}

export default {
  id: 'flat-type-scale',
  severity: 'fail',
  describe: 'a page whose largest type is under 2.5 times the body size',
  run(ctx) {
    let base = 16;
    let largest = null;
    let unmeasurable = false;
    eachDecl(ctx, /^font-size$/, (decl, unit, line) => {
      if (!appliesAtDesktop(decl)) return;
      const value = resolveVars(ctx, decl.value).trim();
      // Only plain px/rem lengths and clamp() are measurable; vw, %, em, keywords and calc()
      // could be any size, so the page gets no verdict.
      const px = /^-?\d*\.?\d+(px|rem)$/i.test(value) || /^clamp\(/i.test(value) ? sizeOf(value) : null;
      if (px === null) { unmeasurable = true; return; }
      if (/^(body|html|:root)$/i.test(String(decl.parent?.selector || '').trim())) base = px;
      if (!largest || px > largest.px) largest = { px, unit, line };
    });
    if (unmeasurable || !largest || largest.px / base >= MIN_RATIO) return [];
    return [finding('flat-type-scale', largest.unit.file, largest.line,
      `largest type is ${largest.px}px against a ${base}px body, a ${(largest.px / base).toFixed(1)}x ratio; make the headline at least ${MIN_RATIO}x the body size`)];
  },
};
