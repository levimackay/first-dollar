import { htmlFiles, elLine, elementChildren, finding } from '../context.mjs';
import { declaredHeightPx } from '../style-lookup.mjs';

const MARKER = /trusted by|as seen in|our clients|partners|featured in/i;
const WRAPPERS = new Set(['a', 'li', 'div', 'span', 'figure', 'picture', 'p']);
const MIN_MARKS = 4;
const MARK_MAX_PX = 80;
const SPREAD = 1.2;

// A mark is an img or an inline svg, on its own or inside a wrapper that holds
// nothing else. A wrapper carrying copy is a card, and a row of cards is a
// different problem with a different rule.
function markIn(file, child) {
  if (child.tagName === 'img' || child.tagName === 'svg') return child;
  if (!WRAPPERS.has(child.tagName)) return null;
  if (file.$(child).text().trim()) return null;
  const marks = file.$(child).find('img, svg').toArray();
  return marks.length === 1 ? marks[0] : null;
}

function precedingText(file, el) {
  let node = el;
  let out = '';
  for (let up = 0; up < 3 && node && node.type === 'tag'; up++) {
    for (const sib of elementChildren(node.parent || {})) {
      if (sib === node) break;
      out += ` ${file.$(sib).text()}`;
    }
    node = node.parent;
  }
  return out;
}

export default {
  id: 'logo-row',
  severity: 'fail',
  describe: 'a row of borrowed logos standing in for evidence',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      file.$('*').each((_, el) => {
        const kids = elementChildren(el);
        if (kids.length < MIN_MARKS) return;
        const marks = kids.map((kid) => markIn(file, kid));
        if (marks.some((m) => m === null)) return;
        const label = `${file.$(el).text()} ${precedingText(file, el)}`;
        const claim = MARKER.exec(label);
        if (!claim) return;
        const heights = marks.map((m) => declaredHeightPx(ctx, m)).filter((h) => h !== null && h > 0);
        if (heights.length) {
          // Declared heights are the way out: tall marks are photographs, and
          // marks of unrelated heights were not normalised into a wall.
          if (heights.some((h) => h >= MARK_MAX_PX)) return;
          if (Math.max(...heights) / Math.min(...heights) > SPREAD) return;
        }
        out.push(finding('logo-row', file, elLine(file, el), `${marks.length} marks in a row under "${claim[0]}"; borrowed logos are not evidence`));
      });
    }
    return out;
  },
};
