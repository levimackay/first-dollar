import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const skill = new URL('../skills/first-dollar/', import.meta.url);
const RECIPES = [
  'mechanism-sequence',
  'split-line-reveal',
  'stroke-draw',
  'pinned-steps',
  'count-to-price',
  'ticker-proof',
  'sticky-stack',
  'pinned-mask-reveal',
];
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'inherit', 'initial', 'unset']);
const read = (name) => readFile(new URL(`assets/motion/${name}.html`, skill), 'utf8');

for (const name of RECIPES) {
  test(`${name}: header, reduced motion, no named font`, async () => {
    const src = await read(name);
    assert.match(src, /^<!--[^]*?What it does:[^]*?How to adapt:[^]*?Reduced motion:[^]*?-->/, 'starts with the comment block');
    assert.match(src, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/, 'has a reduced-motion CSS block');
    assert.match(src, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/, 'the script checks reduced motion');
    assert.doesNotMatch(src, /fonts\.(googleapis|gstatic)\.com|@font-face|@import/i, 'loads no font');
    // Every family value is a token reference or a generic keyword, never a named face.
    const values = [...src.matchAll(/(?:font-family|--fd-font-[\w-]+|(?<![\w-])font)\s*:\s*([^;}]+)/g)].map((m) => m[1]);
    for (const value of values) {
      const rest = value.replace(/var\([^)]*\)/g, '').split(',').map((s) => s.trim()).filter(Boolean);
      const named = rest.filter((part) => !GENERIC.has(part));
      assert.deepEqual(named, [], `names a font: ${value.trim()}`);
    }
  });
}

test('motion.md stays under 220 lines and covers every recipe', async () => {
  const doc = await readFile(new URL('references/motion.md', skill), 'utf8');
  assert.ok(doc.split('\n').length <= 220, 'motion.md is over 220 lines');
  const missing = RECIPES.filter((name) => !doc.includes(`### ${name}`));
  assert.deepEqual(missing, []);
});
