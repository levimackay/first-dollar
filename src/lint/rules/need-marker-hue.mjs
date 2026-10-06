import { htmlFiles, elLine, finding } from '../context.mjs';
import { declarationsFor } from '../style-lookup.mjs';
import { parseColor, hueDeltaE, toOklch } from '../color.mjs';
import { readDesign } from '../design-md.mjs';

const NEED = /\[NEED:\s*[^\]]+\]/i;
const TOO_CLOSE = 0.04;
const NON_ACCENT = /^(?:neutral|surface|ink(?:-|$)|line|highlight|on-accent(?:-|$))/i;

export default {
  id: 'need-marker-hue',
  severity: 'fail',
  describe: 'a NEED marker fill shares the hue of a DESIGN.md accent',
  async run(ctx) {
    if (!ctx.designPath) return [];
    const design = await readDesign(ctx.designPath);
    if (!design.ok) return [];
    const accents = [...design.tokens.colors].filter(([name, color]) => !NON_ACCENT.test(name) && toOklch(color).c >= 0.03);
    if (!accents.length) return [];
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const seen = new Set();
      file.$('*').each((_, el) => {
        if (!NEED.test(file.$(el).text()) || file.$(el).children().toArray().some((kid) => NEED.test(file.$(kid).text()))) return;
        const declarations = declarationsFor(ctx, el);
        const backgrounds = declarations.filter(({ prop }) => prop === 'background' || prop === 'background-color');
        const raw = backgrounds.at(-1)?.value || '';
        const color = parseColor(raw);
        if (!color) return;
        const match = accents.find(([, accent]) => (hueDeltaE(color, accent) ?? Infinity) < TOO_CLOSE);
        if (!match) return;
        const key = `${raw}|${match[0]}`;
        if (seen.has(key)) return;
        seen.add(key);
        out.push(finding('need-marker-hue', file, elLine(file, el), `NEED marker background shares the hue of DESIGN.md ${match[0]} (hue deltaE ${hueDeltaE(color, match[1]).toFixed(3)}); change its hue, or remove the fill and underline the marker`));
      });
    }
    return out;
  },
};
