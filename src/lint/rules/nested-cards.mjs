import { cssUnits, htmlFiles, elLine, selectorParts, finding } from '../context.mjs';

const CARD = /\bcard\b|card-|-card\b/;

const structural = (s) => s.replace(/::[a-z-]+(\([^)]*\))?/gi, '').replace(/:(hover|focus|focus-visible|active|visited)\b/gi, '').trim();

export default {
  id: 'nested-cards',
  severity: 'fail',
  describe: 'a card inside a card',
  run(ctx) {
    // Selectors whose rule draws a surface: a border or shadow together with rounded corners.
    const surfaces = [];
    for (const unit of cssUnits(ctx)) {
      unit.root.walkRules((rule) => {
        let edge = false;
        let radius = false;
        rule.each((d) => {
          if (d.type !== 'decl') return;
          const prop = d.prop.toLowerCase();
          if (/^(border|border-(top|right|bottom|left)|box-shadow)$/.test(prop) && !/^(none|0)$/i.test(d.value.trim())) edge = true;
          if (prop === 'border-radius' && !/^0(px)?$/.test(d.value.trim())) radius = true;
        });
        if (edge && radius) surfaces.push(...selectorParts(rule).map(structural).filter(Boolean));
      });
    }
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const isSurface = (el) => {
        if (CARD.test(String(el.attribs?.class || ''))) return true;
        return surfaces.some((s) => {
          try { return file.$(el).is(s); } catch { return false; }
        });
      };
      file.$('*').each((_, el) => {
        if (!isSurface(el)) return;
        for (let p = el.parent; p && p.type === 'tag'; p = p.parent) {
          if (isSurface(p)) {
            out.push(finding('nested-cards', file, elLine(file, el), `<${el.tagName}> is a card inside another card; flatten the inner one into plain type and spacing`));
            return;
          }
        }
      });
    }
    return out;
  },
};
