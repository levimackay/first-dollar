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

// Display and Text cuts from one named superfamily repeat the same visual identity.
const stem = (name) => String(name || '').toLowerCase().replace(/\s+(?:display|text)$/i, '');

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
