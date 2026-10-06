import { htmlFiles, elLine, finding } from '../context.mjs';

const NAMED = /testimonial|review|quote/i;
const ATTRIB_CLASS = /author|attrib|byline|customer|reviewer/i;
// A first name and an initial, or a first name on its own. Both are what a page
// prints when there is nobody real behind the quote.
const THIN_NAME = /^[A-Z][a-z]+(?:\s+[A-Z]\.?)?$/;
const STARS = /(?:[★☆⭐]\s*){5}/;
const PRAISE = /^(amazing|great|excellent|highly recommend|best|love)\b/i;
const LEAD_TRIM = /^[\s"'“‘★☆⭐\u2013\u2014-]+/;
const ATTRIB_DASH = /^[\s]*[\u2013\u2014-]\s*(.+)$/;

function ancestors(el) {
  const out = [];
  let node = el.parent;
  while (node && node.type === 'tag') {
    out.push(node);
    node = node.parent;
  }
  return out;
}

function sourced(el) {
  return [el, ...ancestors(el)].some((node) => node.attribs && 'data-source' in node.attribs);
}

function isTarget(el) {
  if (el.tagName === 'blockquote' || el.tagName === 'q') return true;
  const a = el.attribs || {};
  return NAMED.test(String(a.class || '')) || NAMED.test(String(a.id || ''));
}

function attributions(file, el) {
  const $ = file.$;
  const out = [];
  $(el).find('cite, footer, [class]').each((_, node) => {
    if (node.tagName !== 'cite' && node.tagName !== 'footer' && !ATTRIB_CLASS.test(String(node.attribs?.class || ''))) return;
    const text = $(node).text().replace(/\s+/g, ' ').trim();
    if (text) out.push(text);
  });
  // An attribution written as loose text rather than markup: a dash, then a name.
  const walk = (node) => {
    for (const child of node.children || []) {
      if (child.type === 'text') {
        const m = ATTRIB_DASH.exec(child.data.replace(/\s+/g, ' '));
        if (m && m[1].trim()) out.push(m[1].trim());
      } else if (child.type === 'tag') walk(child);
    }
  };
  walk(el);
  return out;
}

function copyOf(file, el) {
  const clone = file.$(el).clone();
  clone.find('cite, footer, [class*="author"], [class*="attrib"], [class*="byline"]').remove();
  return clone.text().replace(/\s+/g, ' ').replace(LEAD_TRIM, '').trim();
}

export default {
  id: 'testimonial-signature',
  severity: 'fail',
  describe: 'a testimonial with the signatures of an invented one',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const targets = $('*').toArray().filter(isTarget);
      const set = new Set(targets);
      // One quote is one finding. The unit is the innermost quote block, widened
      // to a wrapper that holds nothing but that quote, so a `<cite>` sitting
      // beside the `<blockquote>` still counts as its attribution while a section
      // holding six reviews does not swallow all six.
      const innermost = targets.filter((el) => !$(el).find('*').toArray().some((kid) => set.has(kid)));
      for (const inner of innermost) {
        let el = inner;
        for (const up of ancestors(inner)) {
          if (!set.has(up)) break;
          const held = $(up).find('*').toArray().filter((node) => set.has(node));
          if (!held.every((node) => node === inner || $(node).find('*').toArray().includes(inner))) break;
          el = up;
        }
        if (sourced(el)) continue;
        const line = elLine(file, el);
        const say = (message) => out.push(finding('testimonial-signature', file, line, message));

        for (const name of attributions(file, el)) {
          const cleaned = name.replace(/[.,;:]+$/, '').trim();
          if (THIN_NAME.test(cleaned) || THIN_NAME.test(name)) {
            say(`testimonial signed "${name}"; a real one carries a full name and a data-source`);
            break;
          }
        }
        const text = $(el).text().replace(/\s+/g, ' ');
        const starClasses = $(el).find('[class*="star"]').length;
        if (STARS.test(text) || starClasses >= 5) {
          say('five star run in a testimonial; show the review it came from with data-source');
        }
        const copy = copyOf(file, el);
        if (PRAISE.test(copy)) {
          say(`testimonial opens on generic praise ("${copy.slice(0, 40).trim()}"); quote what the customer actually said`);
        }
      }
    }
    return out;
  },
};
