import { cssUnits, unitLine, selectorParts, htmlFiles, elementChildren, finding } from '../context.mjs';
import { declarationsFor } from '../style-lookup.mjs';

const CONTAINER = /(^|[\s,>+~])\.(container|wrap|wrapper|inner|content)\b|section\s*>\s*div/i;

const NO_BG = /^(none|transparent|inherit|initial|unset|revert)$/i;

// A top-level band (direct child of body or main, or a section) that paints its own
// background and sets no max-width spans the viewport even when its content is contained.
function hasBand(ctx) {
  for (const file of htmlFiles(ctx)) {
    const tops = file.$('body, main').toArray().flatMap(elementChildren);
    for (const el of new Set([...tops, ...file.$('section').toArray()])) {
      const decls = declarationsFor(ctx, el);
      if (decls.some((d) => d.prop === 'max-width' && !/^none$/i.test(d.value))) continue;
      if (decls.some((d) => /^background(-color|-image)?$/.test(d.prop) && d.value && !NO_BG.test(d.value.trim()))) return true;
    }
  }
  return false;
}

export default {
  id: 'no-full-bleed',
  severity: 'warn',
  describe: 'every section inside the same container with nothing full-bleed',
  run(ctx) {
    let container = null;
    let bleed = false;
    for (const unit of cssUnits(ctx)) {
      unit.root.walkRules((rule) => {
        const parts = selectorParts(rule);
        const isContainer = parts.some((s) => CONTAINER.test(s));
        rule.walkDecls((decl) => {
          const prop = decl.prop.toLowerCase();
          const value = decl.value.trim().toLowerCase();
          if (prop === 'max-width' && isContainer && !container) {
            container = { unit, line: unitLine(unit, decl), selector: rule.selector };
          }
          if ((prop === 'width' || prop === 'min-width') && /^100vw$/.test(value)) bleed = true;
          if (prop === 'grid-column' && /^1\s*\/\s*-1$/.test(value)) bleed = true;
          if (/^margin(-inline|-left|-right)?$/.test(prop) && /calc\([^)]*50vw/i.test(value)) bleed = true;
        });
      });
    }
    if (!container || bleed || hasBand(ctx)) return [];
    return [
      finding('no-full-bleed', container.unit.file, container.line, `"${container.selector}" caps every section and nothing escapes it; let one thing run full-bleed`),
    ];
  },
};
