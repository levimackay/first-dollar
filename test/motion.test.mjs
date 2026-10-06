import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const skill = new URL('../skills/first-dollar/', import.meta.url);
const RECIPES = [
  'mechanism-sequence',
  'split-line-reveal',
  'stroke-draw',
  'pinned-steps',
  'ticker-proof',
  'sticky-stack',
  'pinned-mask-reveal',
  'parallax-frame',
  'spring-settle',
  'center-stagger-grid',
  'scroll-rule',
  'ring-fill',
];
// The recipes built on the motion library, and the one URL they may load it from.
const MOTION = ['parallax-frame', 'spring-settle', 'center-stagger-grid', 'scroll-rule', 'ring-fill'];
const MOTION_URL = 'https://cdn.jsdelivr.net/npm/motion@14.0.0/+esm';
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'inherit', 'initial', 'unset']);
const read = (name) => readFile(new URL(`assets/motion/${name}.html`, skill), 'utf8');

// The parts an agent copies: markup between the HTML markers, CSS and script between the comment markers.
function snippet(src, name) {
  const between = (open, close) => {
    const out = [];
    let at = 0;
    for (;;) {
      const a = src.indexOf(open, at);
      if (a < 0) return out;
      const b = src.indexOf(close, a);
      assert.ok(b > a, `unclosed snippet marker ${open}`);
      out.push(src.slice(a + open.length, b));
      at = b;
    }
  };
  const markup = between(`<!-- snippet: ${name} -->`, '<!-- end snippet -->');
  const code = between(`/* ---- snippet: ${name} ---- */`, '/* ---- end snippet ---- */');
  return { markup, css: code[0], js: code[1] };
}

for (const name of RECIPES) {
  test(`${name}: header, markers, reduced motion, no named font`, async () => {
    const src = await read(name);
    assert.match(src, /^<!--[^]*?What it does:[^]*?How to adapt:[^]*?Reduced motion:[^]*?-->/, 'starts with the comment block');
    const part = snippet(src, name);
    assert.equal(part.markup.length, 1, 'one markup snippet');
    assert.ok(part.css && part.js, 'a CSS snippet and a script snippet');
    assert.match(part.css, /@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{/, 'has a reduced-motion CSS block');
    assert.match(part.js, /matchMedia\('\(prefers-reduced-motion: reduce\)'\)/, 'the script checks reduced motion');
    assert.doesNotMatch(src, /fonts\.(googleapis|gstatic)\.com|@font-face|@import/i, 'loads no font');
    // Every family value is a token reference or a generic keyword, never a named face.
    const values = [...src.matchAll(/(?:font-family|--fd-font-[\w-]+|(?<![\w-])font)\s*:\s*([^;}]+)/g)].map((m) => m[1]);
    for (const value of values) {
      const rest = value.replace(/var\([^)]*\)/g, '').split(',').map((s) => s.trim()).filter(Boolean);
      const named = rest.filter((part) => !GENERIC.has(part));
      assert.deepEqual(named, [], `names a font: ${value.trim()}`);
    }
  });

  test(`${name}: the snippet works pasted alone`, async () => {
    const { markup, css, js } = snippet(await read(name), name);
    const all = [css, js, ...markup].join('\n');
    // A custom property read without a fallback must be one the snippet sets itself.
    const defined = new Set([
      ...[...all.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]),
      ...[...all.matchAll(/setProperty\('(--[\w-]+)'/g)].map((m) => m[1]),
    ]);
    const bare = [...all.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)].map((m) => m[1]).filter((v) => !defined.has(v));
    assert.deepEqual([...new Set(bare)], [], 'read these with a fallback or define them inside the snippet');
    // The page has one hatch defs block (design-rules.md); a recipe only references #hatch.
    assert.doesNotMatch(markup.join('\n'), /<pattern|id="hatch"/, 'the markup snippet defines the hatch');
    // The page owns its ask: no recipe styles [data-commitment] or an ask class.
    assert.doesNotMatch(css, /data-commitment|-ask\b[^-]/, 'the snippet CSS styles the ask');
  });
}

for (const name of MOTION) {
  test(`${name}: a module script that imports motion from the pinned URL only`, async () => {
    const src = await read(name);
    assert.match(src, /<script type="module">/, 'the script is a module');
    const { js } = snippet(src, name);
    const from = [...js.matchAll(/\bfrom\s*(["'])([^"']+)\1/g)].map((m) => m[2]);
    assert.deepEqual(from, [MOTION_URL], 'one import, from the pinned URL');
    assert.doesNotMatch(js, /import\s*\(/, 'no dynamic import');
  });
}

test('no recipe loads a library from @latest', async () => {
  for (const name of RECIPES) assert.doesNotMatch(await read(name), /@latest\b/, name);
});

test('motion.md stays under 260 lines and covers every recipe', async () => {
  const doc = await readFile(new URL('references/motion.md', skill), 'utf8');
  assert.ok(doc.split('\n').length <= 260, 'motion.md is over 260 lines');
  const missing = RECIPES.filter((name) => !doc.includes(`### ${name}`));
  assert.deepEqual(missing, []);
  assert.doesNotMatch(doc, /count-to-price/, 'count-to-price was removed');
});
