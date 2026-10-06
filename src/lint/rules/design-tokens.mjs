import { eachDecl, resolveVars, firstFamily, parsePx, finding } from '../context.mjs';
import { parseColor, deltaE } from '../color.mjs';
import { readDesign } from '../design-md.mjs';

const TOLERANCE = 0.02;
const GENERIC = new Set(['serif', 'sans-serif', 'monospace']);
const COLOR_RE = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\([^)]*\)/gi;
const LENGTH_RE = /-?\d*\.?\d+(?:px|rem|em)?(?![\w%])|-?\d*\.?\d+%/g;

function nearestColor(color, tokens) {
  let best = { name: '', d: Infinity };
  for (const [name, tc] of tokens) {
    const d = deltaE(color, tc);
    if (d < best.d) best = { name, d };
  }
  return best;
}

export default {
  id: 'design-tokens',
  severity: 'fail',
  describe: 'the built page must stay inside the colors, fonts and radii declared in DESIGN.md',
  async run(ctx) {
    if (!ctx.designPath) return [];
    const design = await readDesign(ctx.designPath);
    if (!design.ok) return [finding('design-tokens', ctx.designPath, 1, `design contract not enforced: ${design.reason}`, 'warn')];
    const { colors, fonts, rounded } = design.tokens;
    const out = [];
    for (const [group, names] of Object.entries(design.unparsed)) {
      if (names.length) {
        out.push(finding('design-tokens', ctx.designPath, 1, `DESIGN.md ${group} token${names.length > 1 ? 's' : ''} not filled in or not parseable: ${names.join(', ')}; that part of the contract is not enforced`, 'warn'));
      }
    }

    eachDecl(ctx, null, (decl, unit, line) => {
      const prop = decl.prop.toLowerCase();
      const value = decl.value.replace(/url\([^)]*\)/gi, '');

      if (colors.size) {
        for (const m of value.matchAll(COLOR_RE)) {
          const c = parseColor(m[0]);
          if (!c) continue;
          const near = nearestColor(c, colors);
          if (near.d > TOLERANCE) {
            out.push(finding('design-tokens', unit.file, line, `color ${m[0]} is not a DESIGN.md color; nearest is "${near.name}" (deltaE ${near.d.toFixed(3)})`));
          }
        }
      }

      if (prop === 'font-family' && fonts.size) {
        const first = firstFamily(resolveVars(ctx, decl.value));
        if (first && !GENERIC.has(first) && !fonts.has(first) && !/^(inherit|initial|unset)$/.test(first)) {
          out.push(finding('design-tokens', unit.file, line, `font-family "${first}" is not a DESIGN.md font (${[...fonts].join(', ')})`));
        }
      }

      if (/^border(-[a-z]+){0,2}-radius$/.test(prop) && rounded.size) {
        const resolved = resolveVars(ctx, decl.value).split('/').join(' ');
        for (const m of resolved.matchAll(LENGTH_RE)) {
          if (m[0].endsWith('%')) continue;
          const px = parsePx(m[0]);
          if (px === null || px === 0 || px >= 999 || rounded.has(px)) continue;
          const nearest = [...rounded].sort((a, b) => Math.abs(a - px) - Math.abs(b - px))[0];
          out.push(finding('design-tokens', unit.file, line, `border-radius ${m[0]} is not in DESIGN.md rounded; nearest is ${nearest}px`));
        }
      }
    });
    return out;
  },
};
