import { eachRule, htmlFiles, selectorParts, finding } from '../context.mjs';

const stripState = (s) => s.replace(/:hover\b/gi, '').replace(/::[a-z-]+(\([^)]*\))?/gi, '').trim();

export default {
  id: 'hover-zoom',
  severity: 'warn',
  describe: 'an image that scales up on hover',
  run(ctx) {
    const out = [];
    eachRule(ctx, (rule, unit, line) => {
      const scales = rule.some?.((d) => d.type === 'decl' && d.prop.toLowerCase() === 'transform' && /scale(3d|x|y)?\(/i.test(d.value));
      if (!scales) return;
      for (const sel of selectorParts(rule).filter((s) => /:hover\b/i.test(s))) {
        const base = stripState(sel) || '*';
        let hit = /\bimg\b/i.test(base);
        if (!hit) {
          for (const file of htmlFiles(ctx)) {
            try {
              hit = file.$(base).is((_, el) => el.tagName === 'img' || file.$(el).find('img').length > 0);
            } catch {
              hit = false;
            }
            if (hit) break;
          }
        }
        if (hit) {
          out.push(finding('hover-zoom', unit.file, line, `"${sel}" scales an image on hover; change opacity or reveal a caption instead`));
          break;
        }
      }
    });
    return out;
  },
};
