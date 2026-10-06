import { htmlFiles, elLine, finding } from '../context.mjs';

const LABEL_ONLY = /^(?:(?:an?\s+)?(?:photo|photograph|image|illustration|diagram|drawing|render|rendering|graphic|visual|placeholder)(?:\s+(?:of|showing)\s+(?:the\s+)?(?:product|service|founder|team|process|site|scene))?)[.!\s]*(?:numbers? (?:are|is) examples?[.!\s]*)?$/i;
const CONSTRUCTION_NOTE = /^(?:(?:notes? for [^.]{1,80}\.\s*)?(?:concept|illustration|photo|image|diagram|drawing|render|rendering|mockup)(?:[.,]\s*.*(?:\bexamples?\b|not to scale))?|(?:names and amounts|numbers?) are examples?|not to scale)[.!?\s]*$/i;
const SELF_REFERENCE = /^(?:the sentence this is built around|the problem, as (?:one|a|an|the) [^,.]{1,60} put it)[.!?\s]*$/i;
const clean = (text) => text.replace(/\[NEED:[^\]]*\]/gi, '').replace(/\s+/g, ' ').trim();
const isSelfDescription = (text) => LABEL_ONLY.test(text) || CONSTRUCTION_NOTE.test(text) || SELF_REFERENCE.test(text);

export default {
  id: 'self-describing-caption',
  severity: 'fail',
  describe: 'a caption that labels the medium instead of describing the subject',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const footerNotes = [];
      file.$('p, small, figcaption, span, cite').each((_, el) => {
        const copy = clean(file.$(el).text());
        if (!isSelfDescription(copy)) return;
        if (file.$(el).find('p, small, figcaption, span, cite').toArray().some((child) => isSelfDescription(clean(file.$(child).text())))) return;
        if (file.$(el).closest('footer').length) footerNotes.push(el);
        else out.push(finding('self-describing-caption', file, elLine(file, el), `"${copy}" describes the page's construction; remove it or keep one necessary honesty line in the footer`));
      });
      for (const el of footerNotes.slice(1)) {
        out.push(finding('self-describing-caption', file, elLine(file, el), 'more than one self-describing honesty line in the footer; keep at most one'));
      }
    }
    return out;
  },
};
