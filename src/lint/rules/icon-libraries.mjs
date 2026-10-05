import { htmlFiles, elLine, textNodes, finding } from '../context.mjs';

// Emoji_Presentation covers the glyphs that render in colour by default and
// leaves (c), (r) and bare digits alone; the FE0F pair catches the rest.
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u;
const SPARKLE = /sparkle/i;

function isLucideShaped(el) {
  const a = el.attribs || {};
  const box = String(a.viewbox || a.viewBox || '').trim();
  return (
    /^0\s+0\s+24\s+24$/.test(box) &&
    /^round$/i.test(a['stroke-linecap'] || '') &&
    /^round$/i.test(a['stroke-linejoin'] || '') &&
    String(a['stroke-width'] || '').trim() === '2'
  );
}

export default {
  id: 'icon-libraries',
  severity: 'fail',
  describe: 'stock icon sets, sparkles and emoji',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      $('*').each((_, el) => {
        const a = el.attribs || {};
        if ('data-lucide' in a) {
          out.push(finding('icon-libraries', file, elLine(file, el), 'data-lucide icon; draw the mark or drop it'));
          return;
        }
        if (/(^|\s)lucide(-|\s|$)|lucide-icon/i.test(String(a.class || ''))) {
          out.push(finding('icon-libraries', file, elLine(file, el), 'Lucide icon class; draw the mark or drop it'));
          return;
        }
        if (el.tagName === 'svg' && isLucideShaped(el)) {
          out.push(finding('icon-libraries', file, elLine(file, el), '24x24 round-capped 2px stroke svg is the Lucide signature'));
          return;
        }
        if (el.tagName === 'svg' || el.tagName === 'use' || el.tagName === 'i') {
          for (const [name, value] of Object.entries(a)) {
            if (SPARKLE.test(String(value)) || SPARKLE.test(name)) {
              out.push(finding('icon-libraries', file, elLine(file, el), `sparkle icon (${name}="${value}")`));
              return;
            }
          }
        }
      });
      for (const t of textNodes(file)) {
        const m = EMOJI.exec(t.text);
        if (m) out.push(finding('icon-libraries', file, t.line, `emoji ${JSON.stringify(m[0])} in copy`));
      }
    }
    return out;
  },
};
