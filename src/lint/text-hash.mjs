// Sliding-window text hashes. Reference copy is stored as these hashes instead of
// the words themselves, so lifted copy can be detected without keeping the source text.
// The reference-copy lint rule reads them.
//
// Accepted gap: reference windows run across a whole page's text, but the lint
// rule hashes per text node on the linted page. A run of copied words split
// across separate elements there will not line up with a reference window and so
// will not be caught.
import { createHash } from 'node:crypto';

export const WINDOW = 8;

// lowercase, punctuation stripped, whitespace collapsed into single tokens.
export function words(text) {
  return String(text ?? '')
    .toLowerCase()
    .replace(/[‘’]/g, "'")
    .split(/[^a-z0-9'-]+/)
    .filter(Boolean);
}

export function hashRun(run) {
  return createHash('sha256').update(run).digest('hex');
}

// Every WINDOW-word window of the text, hashed. Short text yields nothing.
export function windowHashes(text, window = WINDOW) {
  const w = words(text);
  const out = [];
  for (let i = 0; i + window <= w.length; i++) out.push(hashRun(w.slice(i, i + window).join(' ')));
  return out;
}

export function hashesFor(texts, window = WINDOW) {
  const set = new Set();
  for (const text of texts) for (const h of windowHashes(text, window)) set.add(h);
  return set;
}
