import { eachDecl, resolveVars, parsePx, finding } from '../context.mjs';

const MIN_RATIO = 2.5;

// The largest px or rem length in a value, so clamp(1rem, 4vw, 3rem) counts as 48px.
function sizeOf(value) {
  const sizes = (value.match(/-?\d*\.?\d+(?:px|rem)\b/gi) || []).map(parsePx).filter((n) => n !== null);
  return sizes.length ? Math.max(...sizes) : null;
}

export default {
  id: 'flat-type-scale',
  severity: 'fail',
  describe: 'a page whose largest type is under 2.5 times the body size',
  run(ctx) {
    let base = 16;
    let largest = null;
    eachDecl(ctx, /^font-size$/, (decl, unit, line) => {
      const px = sizeOf(resolveVars(ctx, decl.value));
      if (px === null) return;
      if (/^(body|html|:root)$/i.test(String(decl.parent?.selector || '').trim())) base = px;
      if (!largest || px > largest.px) largest = { px, unit, line };
    });
    if (!largest || largest.px / base >= MIN_RATIO) return [];
    return [finding('flat-type-scale', largest.unit.file, largest.line,
      `largest type is ${largest.px}px against a ${base}px body, a ${(largest.px / base).toFixed(1)}x ratio; make the headline at least ${MIN_RATIO}x the body size`)];
  },
};
