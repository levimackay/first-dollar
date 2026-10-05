import { htmlFiles, elLine, elementChildren, finding } from '../context.mjs';

const NUMBER = /^\W?\d[\d.,]*[%kKmM+x]?$/;
const CAPTION_MAX = 40;
const LEADING_TAGS = new Set(['strong', 'span', 'div', 'b', 'p']);

function statShape(file, child) {
  const kids = elementChildren(child);
  if (kids.length === 0) return false;
  const lead = kids[0];
  if (!LEADING_TAGS.has(lead.tagName)) return false;
  const number = file.$(lead).text().trim();
  if (!NUMBER.test(number)) return false;
  const whole = file.$(child).text().trim();
  const caption = whole.slice(whole.indexOf(number) + number.length).trim();
  return caption.length > 0 && caption.length < CAPTION_MAX;
}

export default {
  id: 'stat-row',
  severity: 'fail',
  describe: 'a row of big numbers with small captions',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      file.$('*').each((_, el) => {
        const kids = elementChildren(el);
        if (kids.length !== 3 && kids.length !== 4) return;
        if (!kids.every((kid) => statShape(file, kid))) return;
        out.push(finding('stat-row', file, elLine(file, el), `${kids.length} number-and-caption blocks in a row; show evidence, not an achievement counter`));
      });
    }
    return out;
  },
};
