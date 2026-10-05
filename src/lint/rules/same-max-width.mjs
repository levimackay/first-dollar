import { eachDecl, parsePx, resolveVars, finding } from '../context.mjs';

const MIN_OCCURRENCES = 4;
const SPREAD_LIMIT = 0.05;

export default {
  id: 'same-max-width',
  severity: 'warn',
  describe: 'every measure set to the same width',
  run(ctx) {
    const values = [];
    eachDecl(ctx, /^max-width$/, (decl, unit, line) => {
      const px = parsePx(resolveVars(ctx, decl.value));
      if (px === null || px <= 0) return;
      values.push({ px, unit, line });
    });
    if (values.length < MIN_OCCURRENCES) return [];
    const nums = values.map((v) => v.px);
    const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
    const spread = (Math.max(...nums) - Math.min(...nums)) / mean;
    if (spread > SPREAD_LIMIT) return [];
    const first = values[0];
    return [
      finding('same-max-width', first.unit.file, first.line, `${values.length} max-widths all within ${Math.round(spread * 100)}% of ${Math.round(mean)}px; vary the measure`),
    ];
  },
};
