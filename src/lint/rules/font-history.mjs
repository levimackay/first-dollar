// With --history <file>, a face that one of your last 10 builds already used reads as a shared look.
import { realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { finding } from '../context.mjs';
import { eachFamily } from './font-popularity.mjs';

const real = (p) => {
  try {
    return realpathSync(p);
  } catch {
    return path.resolve(p);
  }
};

// Cuts of one named superfamily (its Display, Sans, Serif, Mono, Condensed or numbered
// versions) repeat the same visual identity, so compare names with those words stripped.
const CUT = /\s+(?:display|text|sans|serif|mono|slab|condensed|semi ?condensed|expanded|sc|\d+)$/i;
const stem = (name) => {
  let s = String(name || '').toLowerCase().trim();
  while (CUT.test(s)) s = s.replace(CUT, '');
  return s;
};

export default {
  id: 'font-history',
  severity: 'fail',
  describe: 'a face one of your last 10 builds already used (needs --history)',
  run(ctx) {
    const out = [];
    const seen = new Set();
    // Entries recorded for this very page folder are its own earlier build, not a rival's.
    // A single-file target (page/index.html) belongs to its folder.
    const target = real(ctx.root);
    const here = statSync(target, { throwIfNoEntry: false })?.isFile() ? path.dirname(target) : target;
    const recent = [...(ctx.history || [])].filter((h) => typeof h.page !== 'string' || real(h.page) !== here).reverse();
    eachFamily(ctx, (file, line, family) => {
      const key = family.toLowerCase();
      if (!key || seen.has(key)) return;
      const hit = recent.find((h) => [h.display, h.text].some((f) => typeof f === 'string' && stem(f) === stem(key)));
      if (!hit) return;
      seen.add(key);
      const matched = [hit.display, hit.text].find((f) => typeof f === 'string' && stem(f) === stem(key));
      const relation = matched.toLowerCase() === key ? '' : ` (same superfamily as "${matched}")`;
      out.push(
        finding('font-history', file, line, `"${family}"${relation} was used by your build of ${hit.idea ?? hit.name ?? 'an earlier idea'} on ${hit.date ?? 'an earlier date'}; pick a different face so your pages do not share a look`),
      );
    });
    return out;
  },
};
