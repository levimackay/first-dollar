import path from 'node:path';
import { htmlFiles, elLine, finding } from '../context.mjs';

const WAITLIST = /waitlist|wait list|notify me|get notified|join the list|sign up for updates/i;
const SOON = /coming soon|\btodo\b|\btbd\b/i;
const MONEY = /[$£€¥]\s?\d/;
const NEED_PRICE = /\[NEED: price\]/i;
const NON_FIELD = new Set(['hidden', 'submit', 'button']);

function deadHref(href) {
  if (href == null) return true;
  const h = href.trim();
  if (h.startsWith('[NEED:')) return false;
  return h === '' || h.startsWith('#') || /^javascript:/i.test(h);
}

// True when the form around the button asks for nothing but an email address.
function emailOnly($, el) {
  const form = el.tagName === 'form' ? $(el) : $(el).closest('form');
  if (!form.length) return false;
  const fields = form.find('input, textarea, select').toArray()
    .filter((f) => !(f.tagName === 'input' && NON_FIELD.has((f.attribs.type || 'text').toLowerCase())));
  const isEmail = (f) => (f.attribs.type || '').toLowerCase() === 'email'
    || /email/i.test(`${f.attribs.name || ''} ${f.attribs.id || ''}`);
  return fields.length > 0 && fields.every(isEmail);
}

export default {
  id: 'commitment-cta',
  severity: 'fail',
  describe: 'the main button has to ask for something real',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const els = $('[data-commitment]').toArray();
      if (!els.length && path.basename(file.path) !== 'index.html') continue;
      const add = (line, msg) => out.push(finding('commitment-cta', file, line, msg, 'fail'));
      if (!els.length) {
        add(1, 'no-commitment: no element carries data-commitment; mark the one button that asks for a payment, deposit, pre-order or signed letter of intent');
        continue;
      }
      for (const el of els) {
        const line = elLine(file, el);
        const text = $(el).text().replace(/\s+/g, ' ').trim();
        const priced = MONEY.test(text);
        if (el.tagName === 'a' && deadHref(el.attribs.href)) {
          add(line, `dead-link: the commitment button points at "${el.attribs.href ?? ''}"; link it to the real checkout or write href="[NEED: checkout link]"`);
        }
        if (emailOnly($, el)) {
          add(line, 'email-only: the form only collects an email address, which is a free signup; ask for a payment, deposit or signed letter of intent');
        }
        if (WAITLIST.test(text) && !priced) {
          add(line, `waitlist: "${text}" is a free waitlist; put a price on it (a deposit) or ask for a pre-order`);
        }
        if (!priced && !NEED_PRICE.test(text)) {
          add(line, `no-price: "${text}" shows no amount; state the price or write [NEED: price]`);
        }
        if (SOON.test(text) || el.attribs.disabled !== undefined || el.attribs['aria-disabled'] === 'true') {
          add(line, `coming-soon: "${text}" is inert or unfinished; the button has to work today`);
        }
      }
    }
    return out;
  },
};
