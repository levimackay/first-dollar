import { htmlFiles, textNodes, finding } from '../context.mjs';

export default {
  id: 'empty-shell',
  severity: 'warn',
  describe: 'the page renders its copy with script, so the lint cannot see it',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const words = textNodes(file).map((t) => t.text).join(' ').trim().split(/\s+/).filter(Boolean).length;
      if (words < 20 && file.$('script[src]').length > 0) {
        out.push(finding('empty-shell', file, 1, `${words} words of copy in the HTML; render to static HTML or lint the built output`));
      }
    }
    return out;
  },
};
