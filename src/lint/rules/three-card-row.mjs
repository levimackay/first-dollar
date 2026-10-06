import { cssUnits, htmlFiles, elLine, elementChildren, selectorParts, finding } from '../context.mjs';

function isThreeUp(value) {
  const v = String(value).toLowerCase();
  if (/repeat\(\s*3[\s,)]/.test(v)) return true;
  return (v.match(/\b1fr\b/g) || []).length === 3;
}

// css-select cannot evaluate pseudo-elements or state pseudo-classes; drop them
// so the structural part of the selector still matches.
function structural(selector) {
  return selector
    .replace(/::[a-z-]+(\([^)]*\))?/gi, '')
    .replace(/:(hover|focus|focus-visible|active|visited|target|checked|disabled)\b/gi, '')
    .trim();
}

function matchesAny(file, el, selectors) {
  for (const selector of selectors) {
    const s = structural(selector);
    if (!s) continue;
    try {
      if (file.$(el).is(s)) return selector;
    } catch {
      // selector this matcher cannot evaluate
    }
  }
  return null;
}

function classSet(el) {
  return new Set(String(el.attribs?.class || '').split(/\s+/).filter(Boolean));
}

export default {
  id: 'three-card-row',
  severity: 'fail',
  describe: 'three feature cards in a row',
  run(ctx) {
    const gridThree = [];
    const flexParents = [];
    const percentChildren = [];
    for (const unit of cssUnits(ctx)) {
      unit.root.walkRules((rule) => {
        const parts = selectorParts(rule);
        rule.walkDecls((decl) => {
          const prop = decl.prop.toLowerCase();
          if (prop === 'grid-template-columns' && isThreeUp(decl.value)) gridThree.push(...parts);
          if (prop === 'grid-template' && isThreeUp(decl.value)) gridThree.push(...parts);
          if (prop === 'display' && /^(inline-)?flex$/i.test(decl.value.trim())) flexParents.push(...parts);
          if ((prop === 'flex-basis' || prop === 'width') && /%\s*$/.test(decl.value.trim())) {
            for (const p of parts) percentChildren.push({ selector: p, value: decl.value.trim() });
          }
          if (prop === 'flex') {
            const basis = decl.value.trim().split(/\s+/)[2];
            if (basis && /%$/.test(basis)) for (const p of parts) percentChildren.push({ selector: p, value: basis });
          }
        });
      });
    }

    const out = [];
    for (const file of htmlFiles(ctx)) {
      file.$('*').each((_, el) => {
        const kids = elementChildren(el);
        if (kids.length !== 3) return;
        const shared = kids.map(classSet).reduce((acc, set) => new Set([...acc].filter((c) => set.has(c))));
        if (shared.size === 0) return;

        const inline = String(el.attribs?.style || '');
        const inlineGrid = /grid-template-columns\s*:([^;]*)/i.exec(inline);
        if (inlineGrid && isThreeUp(inlineGrid[1])) {
          out.push(finding('three-card-row', file, elLine(file, el), `three children in a three-column grid (inline style); break the row`));
          return;
        }
        const grid = matchesAny(file, el, gridThree);
        if (grid) {
          out.push(finding('three-card-row', file, elLine(file, el), `three children under "${grid}" (three-column grid); break the row`));
          return;
        }
        const flex = matchesAny(file, el, flexParents);
        if (!flex) return;
        const widths = kids.map((kid) => {
          const hit = percentChildren.find((c) => {
            const s = structural(c.selector);
            if (!s) return false;
            try {
              return file.$(kid).is(s);
            } catch {
              return false;
            }
          });
          return hit ? hit.value : null;
        });
        if (widths.every((w) => w && w === widths[0])) {
          out.push(finding('three-card-row', file, elLine(file, el), `three flex children each at ${widths[0]}; break the row`));
        }
      });
    }
    return out;
  },
};
