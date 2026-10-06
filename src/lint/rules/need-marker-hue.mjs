// The NEED marker has to read as a gap, not as the page's own highlight or accent. Its fill
// (the background that wins the cascade, gradient stops included) is compared with every
// background the page itself paints and with each DESIGN.md accent.
import { htmlFiles, elLine, finding, cssUnits, unitLine, resolveVars } from '../context.mjs';
import { declarationsFor, cascadedDecl, selectorReaches } from '../style-lookup.mjs';
import { parseColor, deltaE, hueDeltaE, toOklch } from '../color.mjs';
import { readDesign } from '../design-md.mjs';

const NEED = /\[NEED:\s*[^\]]+\]/i;
const TOO_CLOSE = 0.04;
const MARKER_FLOOR = 0.012; // a pale tint still has a hue
const HUE_FLOOR = 0.03; // a page color or accent needs this much chroma to own a hue
const NON_ACCENT = /^(?:neutral|surface|ink(?:-|$)|line|highlight|on-accent(?:-|$))/i;
const FILL_PROPS = ['background', 'background-color', 'background-image'];
const COLOR_RE = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch)\([^)]*\)|\b(?:white|black)\b/gi;

const fills = (value) => [...String(value || '').matchAll(COLOR_RE)].map((m) => parseColor(m[0])).filter((c) => c && c.a > 0);
const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
const unpseudo = (sel) => sel.replace(/::?[\w-]+(?:\([^)]*\))?/g, '').trim();
const sameHue = (fill, other) => (hueDeltaE(fill, other, MARKER_FLOOR, HUE_FLOOR) ?? Infinity) < TOO_CLOSE;

export default {
  id: 'need-marker-hue',
  severity: 'fail',
  describe: 'a NEED marker fill reuses a color the page paints or shares the hue of an accent',
  async run(ctx) {
    let accents = [];
    if (ctx.designPath) {
      const design = await readDesign(ctx.designPath);
      if (design.ok) accents = [...design.tokens.colors].filter(([name, color]) => !NON_ACCENT.test(name) && toOklch(color).c >= HUE_FLOOR);
    }
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const markers = $('*').toArray().filter((el) => NEED.test($(el).text()) && !$(el).children().toArray().some((kid) => NEED.test($(kid).text())));
      if (!markers.length) continue;
      const isMarker = (el) => markers.includes(el);

      // Every background the page paints anywhere but on the markers themselves.
      const page = [];
      for (const unit of cssUnits(ctx)) {
        unit.root.walkRules((rule) => {
          const parts = String(rule.selector || '').split(',').map((s) => s.trim()).filter(Boolean);
          if (parts.some((sel) => markers.some((m) => selectorReaches(m, unpseudo(sel))))) return;
          rule.walkDecls((decl) => {
            if (!FILL_PROPS.includes(decl.prop.trim().toLowerCase())) return;
            for (const c of fills(resolveVars(ctx, decl.value))) page.push({ color: c, where: `${rule.selector.trim()} (${unit.file.rel}:${unitLine(unit, decl)})` });
          });
        });
      }
      $('[style]').each((_, el) => {
        if (isMarker(el)) return;
        for (const d of declarationsFor(ctx, el).filter((d) => d.spec[0] === Infinity && FILL_PROPS.includes(d.prop))) {
          for (const c of fills(d.value)) page.push({ color: c, where: `the inline style on line ${elLine(file, el)}` });
        }
      });

      const seen = new Set();
      for (const el of markers) {
        const won = cascadedDecl(ctx, el, FILL_PROPS);
        for (const fill of fills(won?.value)) {
          const accent = accents.find(([, a]) => sameHue(fill, a));
          const reused = page.find((p) => deltaE(fill, p.color) < TOO_CLOSE || sameHue(fill, p.color));
          const key = `${hex(fill)}|${accent?.[0] ?? ''}|${reused?.where ?? ''}`;
          if ((!accent && !reused) || seen.has(key)) continue;
          seen.add(key);
          const why = accent
            ? `shares the hue of DESIGN.md ${accent[0]} (hue deltaE ${hueDeltaE(fill, accent[1], MARKER_FLOOR, HUE_FLOOR).toFixed(3)})`
            : `matches ${hex(reused.color)}, which the page also paints on ${reused.where}`;
          out.push(finding('need-marker-hue', file, elLine(file, el), `NEED marker background ${hex(fill)} ${why}; give the marker a color nothing else on the page uses, or remove the fill and underline it`));
        }
      }
    }
    return out;
  },
};

