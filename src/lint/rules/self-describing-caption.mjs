// Captions that describe how the page was made ("Concept. Numbers are examples.") instead of
// what the product shows. Read as families of phrasing, not a list of past outputs, over every
// caption-like element: figcaption, small and cite always; p, div, li, span and their kin when
// they are caption-classed or caption-sized (a short line of at most 14 words).
import { htmlFiles, elLine, finding } from '../context.mjs';

const MEDIUM = String.raw`(?:concept|illustration|illustrative|example|sample|sketch|mock-?up|demo|render(?:ing)?|artist['’]?s impression|placeholder)`;
const TAIL = String.raw`(?:only|page|screen|screens|image|images|art|artwork|data|figures?|numbers?|values?|view|design|purposes|shot|photo|version|layout|interface|ui)`;
const FAMILIES = [
  // A medium label opens the line: "Concept.", "Concept screen.", "For illustration only.", "Sample data."
  new RegExp(String.raw`^(?:(?:an?|for|just|only|this is(?: an?| the)?)\s+)?${MEDIUM}(?:\s+${TAIL})?(?:\s+only)?\s*(?:[.,:;!?)]|$)`, 'i'),
  // The medium named with a generic subject: "Photo of the product", "Illustration".
  /^(?:an?\s+)?(?:photo|photograph|image|illustration|diagram|drawing|render|rendering|graphic|visual|placeholder)(?:\s+(?:of|showing)\s+(?:the\s+)?(?:product|service|founder|team|process|site|scene))?[.!\s]*$/i,
  // "Numbers are examples", "Names are made up", "The screen is an example".
  /\b(?:numbers?|figures?|names?|values?|data|prices?|amounts?|dates?|details?|people|quotes?|screens?|pieces|images?|photos?|everything)\b[^.!?]{0,40}?\b(?:are|is)\s+(?:(?:only|just|all|purely)\s+)?(?:an?\s+)?(?:examples?|illustrative|made[- ]up|invented|fictional|fictitious|placeholders?|samples?|not real)\b/i,
  /\bnot to scale\b/i,
  /(?:^|[.!?;,]\s+)not (?:an? )?(?:real|actual)\b/i,
  // "The problem, in the buyer's words."
  /\bin (?:the |a |an |one |our |their )?(?:buyer|founder|customer|client|owner|user|maker|reader|visitor)s?['’]?s? (?:own )?words\b/i,
  /^this (?:page|section|sentence|screen|image|mock(?:-?up)?|figure|panel|block) is\b/i,
  /^(?:the sentence this is built around|the problem,? as (?:one|a|an|the) [^,.]{1,60} put it)[.!?\s]*$/i,
];
const ALWAYS = new Set(['figcaption', 'small', 'cite']);
const SHORT = new Set(['p', 'div', 'li', 'span', 'dd', 'td', 'em', 'strong', 'label', 'footer']);
const CAPTION_CLASS = /cap|note|fine|small|meta|credit|legend|disclaim/i;
const EXEMPT = '[data-mock], [role="tab"], [role="button"], button, a';
const MAX_WORDS = 14;

const clean = (text) => text.replace(/\[NEED:[^\]]*\]/gi, '').replace(/\s+/g, ' ').trim();
const words = (text) => text.split(' ').filter(Boolean).length;

export default {
  id: 'self-describing-caption',
  severity: 'fail',
  describe: 'a caption that labels the medium instead of describing the subject',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const $ = file.$;
      const captionLike = (el) => {
        const tag = el.tagName;
        const role = el.attribs?.role === 'caption';
        if (!ALWAYS.has(tag) && !role && !SHORT.has(tag)) return false;
        if ($(el).closest(EXEMPT).length) return false;
        if (ALWAYS.has(tag) || role) return true;
        const n = words(clean($(el).text()));
        if (CAPTION_CLASS.test(`${el.attribs?.class || ''} ${el.attribs?.id || ''}`)) return n > 0;
        return n > 0 && n <= MAX_WORDS && (tag === 'p' || tag === 'footer' || n > 2);
      };
      const describesItself = (el) => captionLike(el) && FAMILIES.some((re) => re.test(clean($(el).text())));
      // The page footer: a footer that is not part of an article, section, quote or figure.
      const pageFooter = (el) => {
        const footer = $(el).closest('footer');
        return footer.length > 0 && footer.parents('article, section, blockquote, figure, aside').length === 0;
      };
      const footerNotes = [];
      $('*').each((_, el) => {
        if (!describesItself(el)) return;
        if ($(el).find('*').toArray().some(describesItself)) return;
        const copy = clean($(el).text());
        if (pageFooter(el)) footerNotes.push(el);
        else out.push(finding('self-describing-caption', file, elLine(file, el), `"${copy}" describes the page's construction; remove it or keep one necessary honesty line in the page footer`));
      });
      for (const el of footerNotes.slice(1)) {
        out.push(finding('self-describing-caption', file, elLine(file, el), 'more than one self-describing honesty line in the footer; keep at most one'));
      }
    }
    return out;
  },
};
