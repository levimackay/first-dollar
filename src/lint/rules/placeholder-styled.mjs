import { htmlFiles, elLine, finding } from '../context.mjs';
import { declarationsFor } from '../style-lookup.mjs';

const PLACEHOLDER = /\[(?:PLACEHOLDER|NEED:)/i;
const PAINTED = /gradient\(|url\(/i;
const BG_PROPS = ['background', 'background-image'];
const STOP_TAGS = new Set(['body', 'html', 'main', 'head']);
const IMAGERY = 'img, picture, video, canvas';
// How much extra copy an ancestor may hold before it stops being the placeholder
// box and starts being the section around it.
const SLACK = 60;

function ancestors(el) {
  const out = [];
  let node = el.parent;
  while (node && node.type === 'tag') {
    out.push(node);
    node = node.parent;
  }
  return out;
}

function painted(ctx, el) {
  for (const d of declarationsFor(ctx, el)) {
    if (!BG_PROPS.includes(d.prop)) continue;
    if (PAINTED.test(d.value)) return d.value.trim();
  }
  return null;
}

export default {
  id: 'placeholder-styled',
  severity: 'warn',
  describe: 'a placeholder dressed up to look finished',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const holding = $('*').toArray().filter((el) => PLACEHOLDER.test($(el).text()));
      const set = new Set(holding);
      for (const el of holding) {
        if ($(el).find('*').toArray().some((kid) => set.has(kid))) continue;
        const own = $(el).text().replace(/\s+/g, ' ').trim();
        // The box is the placeholder element itself or the wrapper drawn around
        // it. Anything holding much more copy than the note is the page, not the
        // gap, and its background is not this rule's business.
        const boxes = [el];
        for (const up of ancestors(el)) {
          if (STOP_TAGS.has(up.tagName)) break;
          if ($(up).text().replace(/\s+/g, ' ').trim().length > own.length + SLACK) break;
          boxes.push(up);
        }
        let reason = null;
        for (const box of boxes) {
          const paint = painted(ctx, box);
          if (paint) {
            reason = `its background is a ${/gradient\(/i.test(paint) ? 'gradient' : 'image'}`;
            break;
          }
          if ($(box).find(IMAGERY).length) {
            reason = 'it already carries an image';
            break;
          }
        }
        if (reason) {
          out.push(finding('placeholder-styled', file, elLine(file, el), `placeholder made to look finished: ${reason}; leave the gap visible so it gets filled`));
        }
      }
    }
    return out;
  },
};
