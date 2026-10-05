import { cssUnits, htmlFiles, elLine, elementChildren, selectorParts, finding } from '../context.mjs';

const LABEL_MAX = 40;
const SUB_MAX = 120;

function structural(selector) {
  return selector
    .replace(/::[a-z-]+(\([^)]*\))?/gi, '')
    .replace(/:(hover|focus|focus-visible|active|visited|target|checked|disabled)\b/gi, '')
    .trim();
}

function collectSelectors(ctx, prop, valueTest) {
  const out = [];
  for (const unit of cssUnits(ctx)) {
    unit.root.walkRules((rule) => {
      rule.walkDecls((decl) => {
        if (decl.prop.toLowerCase() !== prop) return;
        if (!valueTest.test(decl.value)) return;
        out.push(...selectorParts(rule).map(structural).filter(Boolean));
      });
    });
  }
  return out;
}

function matches(file, el, selectors) {
  for (const s of selectors) {
    try {
      if (file.$(el).is(s)) return true;
    } catch {
      // selector this matcher cannot evaluate
    }
  }
  return false;
}

function descendants(el) {
  const out = [];
  const visit = (node) => {
    for (const kid of elementChildren(node)) {
      out.push(kid);
      visit(kid);
    }
  };
  visit(el);
  return out;
}

export default {
  id: 'centred-hero',
  severity: 'fail',
  describe: 'the full centred hero template: eyebrow, headline, one line of subhead and two side-by-side buttons',
  run(ctx) {
    const centred = collectSelectors(ctx, 'text-align', /^\s*center\s*$/i);
    const upper = collectSelectors(ctx, 'text-transform', /uppercase/i);
    const mono = collectSelectors(ctx, 'font-family', /\bmono/i);
    const painted = /^(?!\s*(none|transparent|0|initial|inherit)\s*$)/i;
    const filled = [
      ...collectSelectors(ctx, 'background', painted),
      ...collectSelectors(ctx, 'background-color', painted),
      ...collectSelectors(ctx, 'border', painted),
    ];
    // A link only counts as a button when it is one: a button element, role, a btn/cta class, or a painted box.
    const isButton = (file, n) =>
      n.tagName === 'button' ||
      n.attribs?.role === 'button' ||
      /\b(btn|button|cta)/i.test(String(n.attribs?.class || '')) ||
      /(background|border)[a-z-]*\s*:\s*(?!\s*(none|transparent|0)\s*(;|$))/i.test(String(n.attribs?.style || '')) ||
      matches(file, n, filled);
    const out = [];

    for (const file of htmlFiles(ctx)) {
      // The first candidate in document order is usually a nav header, and the hero is
      // the one after it. Take the first candidate that actually holds the h1.
      const candidates = file.$('section, header, main > *').toArray();
      if (candidates.length === 0) continue;
      const el = candidates.find((c) => file.$(c).find('h1').length > 0) || candidates[0];

      const inlineCentred = /text-align\s*:\s*center/i.test(String(el.attribs?.style || ''));
      let isCentred = inlineCentred || matches(file, el, centred);
      if (!isCentred) {
        for (let p = el.parent; p && p.type === 'tag'; p = p.parent) {
          if (matches(file, p, centred)) {
            isCentred = true;
            break;
          }
        }
      }
      if (!isCentred) continue;

      const nodes = descendants(el);
      const h1 = nodes.findIndex((n) => n.tagName === 'h1');
      if (h1 < 0) continue;

      const isLabel = (n) => {
        const text = file.$(n).text().trim();
        if (!text || text.length > LABEL_MAX || !/[a-z]/i.test(text)) return false;
        if (elementChildren(n).length > 0) return false;
        return text === text.toUpperCase() || matches(file, n, upper) || matches(file, n, mono);
      };
      if (!nodes.slice(0, h1).some(isLabel)) continue;

      const para = nodes.findIndex((n, i) => i > h1 && n.tagName === 'p');
      if (para < 0) continue;
      // Static check: a one-line subhead is short, so judge by length (no layout is measured here).
      if (file.$(nodes[para]).text().trim().length > SUB_MAX) continue;

      const index = new Map(nodes.map((n, i) => [n, i]));
      let buttons = false;
      for (const parent of [el, ...nodes]) {
        const kids = elementChildren(parent);
        for (let i = 0; i + 1 < kids.length; i++) {
          const [a, b] = [kids[i], kids[i + 1]];
          if (!/^(a|button)$/.test(a.tagName) || !/^(a|button)$/.test(b.tagName)) continue;
          if ((index.get(a) ?? -1) > para && isButton(file, a) && isButton(file, b)) buttons = true;
        }
      }
      if (!buttons) continue;

      out.push(finding('centred-hero', file, elLine(file, el), 'centred label, headline, one subhead and two side-by-side buttons; the template hero'));
    }
    return out;
  },
};
