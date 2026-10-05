import { htmlFiles, elLine, finding } from '../context.mjs';

// A card is a class token that is exactly "card" or ends in "-card" (feature-card, price-card).
// Whole tokens only: card-body, discard-pile and cardigan are not cards.
const isCard = (el) => String(el.attribs?.class || '').split(/\s+/).some((t) => t === 'card' || t.endsWith('-card'));

export default {
  id: 'nested-cards',
  severity: 'fail',
  describe: 'a card inside a card',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      file.$('*').each((_, el) => {
        if (!isCard(el)) return;
        for (let p = el.parent; p && p.type === 'tag'; p = p.parent) {
          if (isCard(p)) {
            out.push(finding('nested-cards', file, elLine(file, el), `<${el.tagName}> is a card inside another card; flatten the inner one into plain type and spacing`));
            return;
          }
        }
      });
    }
    return out;
  },
};
