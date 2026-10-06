import { htmlFiles, finding } from '../context.mjs';

const LEGAL = /privacy|terms/i;

function hasLegalLink(file) {
  const $ = file.$;
  let found = false;
  $('a').each((_, el) => {
    if (found) return;
    if (LEGAL.test(el.attribs?.href || '') || LEGAL.test($(el).text())) found = true;
  });
  return found;
}

export default {
  id: 'legal-links',
  severity: 'fail',
  describe: 'no privacy policy or terms link',
  // Once per run, not once per file: a multi-page site links these from one
  // shared footer, so the site as a whole either has them or it does not.
  run(ctx) {
    const files = htmlFiles(ctx);
    if (!files.length) return [];
    if (files.some(hasLegalLink)) return [];
    // The missing link belongs to the site, not to whichever page happened to sort
    // first, so the finding names the run's root rather than an arbitrary file.
    return [finding('legal-links', ctx.root || 'site', 1, 'no privacy or terms link in any page')];
  },
};
