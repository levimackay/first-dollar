import { cssUnits, unitLine, parsePx, finding } from '../context.mjs';

const BUDGET = 2;
const BLUR_LIMIT = 20;

export default {
  id: 'gradient-budget',
  severity: 'fail',
  describe: 'gradients past a budget of two, any radial gradient, and blurred glow orbs',
  run(ctx) {
    const out = [];
    const linear = [];
    for (const unit of cssUnits(ctx)) {
      unit.root.walkDecls((decl) => {
        const value = String(decl.value);
        if (/\b(linear-gradient|conic-gradient)\s*\(/i.test(value)) {
          linear.push({ unit, decl, line: unitLine(unit, decl) });
        }
        if (/\bradial-gradient\s*\(/i.test(value)) {
          out.push(finding('gradient-budget', unit.file, unitLine(unit, decl), `radial-gradient in ${decl.prop}; radial glows read as machine-made`));
        }
        if (decl.prop.toLowerCase() !== 'filter' && decl.prop.toLowerCase() !== 'backdrop-filter') return;
        // rem and em blurs are the same glow written in another unit.
        const blur = value.match(/blur\(\s*(-?\d*\.?\d+(?:px|rem|em))\s*\)/i);
        if (!blur) return;
        const px = parsePx(blur[1]);
        if (px === null || px <= BLUR_LIMIT) return;
        const parent = decl.parent;
        const selector = String(parent?.selector || '');
        const pseudo = /::?(before|after)\b/.test(selector);
        const positioned = parent?.some?.((d) => d.type === 'decl' && d.prop.toLowerCase() === 'position' && /absolute|fixed/i.test(d.value));
        if (pseudo || positioned) {
          out.push(finding('gradient-budget', unit.file, unitLine(unit, decl), `blur(${px}px) on a positioned layer reads as a glow orb`));
        }
      });
    }
    for (const extra of linear.slice(BUDGET)) {
      out.push(finding('gradient-budget', extra.unit.file, extra.line, `gradient ${linear.indexOf(extra) + 1} of ${linear.length}; the budget is ${BUDGET}`));
    }
    return out;
  },
};
