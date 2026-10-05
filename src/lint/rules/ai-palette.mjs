import { eachDecl, resolveVars, finding } from '../context.mjs';
import { parseColor, toOklch } from '../color.mjs';

// Tailwind indigo, violet, purple and fuchsia, 400 to 700.
const STOCK = new Set(
  ('#818cf8 #6366f1 #4f46e5 #4338ca #a78bfa #8b5cf6 #7c3aed #6d28d9 #c084fc #a855f7 #9333ea #7e22ce #e879f9 #d946ef #c026d3 #a21caf')
    .split(' '),
);
const hex = (c) => `#${[c.r, c.g, c.b].map((n) => n.toString(16).padStart(2, '0')).join('')}`;
const COLOR_TOKEN = /#[0-9a-f]{3,8}\b|(?:rgba?|hsla?|oklch)\([^)]*\)/gi;

export default {
  id: 'ai-palette',
  severity: 'fail',
  describe: 'stock indigo and violet colours, or a cyan-to-violet gradient',
  run(ctx) {
    const out = [];
    eachDecl(ctx, null, (decl, unit, line) => {
      if (decl.prop.startsWith('--')) return;
      const value = resolveVars(ctx, decl.value);
      const colors = (value.match(COLOR_TOKEN) || []).map((t) => parseColor(t)).filter(Boolean);
      const stock = colors.find((c) => STOCK.has(hex(c)));
      if (stock) {
        out.push(finding('ai-palette', unit.file, line, `${hex(stock)} in ${decl.prop} is a stock indigo or violet; pick a colour drawn from the subject instead`));
        return;
      }
      if (!/gradient\(/i.test(value)) return;
      const hues = colors.map((c) => toOklch(c)).filter((o) => o.c > 0.03).map((o) => o.h);
      if (hues.some((h) => h >= 180 && h <= 210) && hues.some((h) => h >= 260 && h <= 310)) {
        out.push(finding('ai-palette', unit.file, line, `gradient in ${decl.prop} runs from cyan to violet; use one hue family or a flat colour`));
      }
    });
    return out;
  },
};
