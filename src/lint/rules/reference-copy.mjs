import { htmlFiles, textNodes, finding } from '../context.mjs';
import { WINDOW, words, hashRun } from '../text-hash.mjs';

export default {
  id: 'reference-copy',
  severity: 'fail',
  describe: 'copy lifted verbatim from the reference site',
  // The reference is a set of sha256 hashes of 8-word windows, so the match is
  // reported without the reference site's words ever being on disk.
  run(ctx) {
    const reference = ctx.referenceHashes;
    if (!reference || reference.size === 0) return [];

    const out = [];
    for (const file of htmlFiles(ctx)) {
      for (const t of textNodes(file)) {
        const w = words(t.text);
        for (let i = 0; i + WINDOW <= w.length; i++) {
          const run = w.slice(i, i + WINDOW).join(' ');
          if (!reference.has(hashRun(run))) continue;
          out.push(finding('reference-copy', file, t.line, `copy matches the reference site verbatim; write your own: "${run}"`));
          break;
        }
      }
    }
    return out;
  },
};
