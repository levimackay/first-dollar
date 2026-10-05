import { eachRule, resolveVars, parsePx, finding } from '../context.mjs';

const SIDE = /^border-(left|right)(-width|-color)?$/;
const TRANSPARENT = /^(transparent|none|hidden|rgba?\([^)]*[,/ ]\s*0(\.0+)?%?\s*\))$/i;

export default {
  id: 'side-stripe',
  severity: 'fail',
  describe: 'a coloured stripe down one side of a card',
  run(ctx) {
    const out = [];
    eachRule(ctx, (rule, unit, line) => {
      let padded = false;
      const sides = {};
      rule.each((d) => {
        if (d.type !== 'decl') return;
        const prop = d.prop.toLowerCase();
        if (prop === 'padding' || prop === 'background' || prop === 'background-color') padded = true;
        const m = SIDE.exec(prop);
        if (!m) return;
        const s = (sides[m[1]] ||= { width: null, color: null });
        const value = resolveVars(ctx, d.value);
        if (m[2] === '-width') s.width = parsePx(value);
        else if (m[2] === '-color') s.color = value;
        else {
          const w = value.match(/(-?\d*\.?\d+(?:px|rem|em))/i);
          if (w) s.width = parsePx(w[1]);
          if (/^(none|0)\b/i.test(value)) { s.width = 0; return; }
          s.color = value.replace(/(-?\d*\.?\d+(?:px|rem|em)?)/i, '').replace(/\b(solid|dashed|dotted|double)\b/i, '').trim() || 'currentcolor';
        }
      });
      if (!padded) return;
      for (const [side, s] of Object.entries(sides)) {
        if (s.width !== null && s.width >= 2 && !TRANSPARENT.test(s.color ?? 'currentcolor')) {
          out.push(finding('side-stripe', unit.file, line, `"${rule.selector}" has a ${s.width}px coloured border-${side}, a coloured stripe down one side of a card; use a full 1px border or none`));
        }
      }
    });
    return out;
  },
};
