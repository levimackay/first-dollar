import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { lint } from '../src/lint/runner.mjs';

const page = (body, css = '') => `<!doctype html><html lang="en"><head><title>Test</title><style>${css}</style></head><body><main>${body}</main></body></html>`;
const slot = (name) => `<figure><figcaption>[PLACEHOLDER: ${name}, daylight, 4:3]</figcaption></figure>`;
const hits = (result, rule) => [...result.failures, ...result.warnings].filter((f) => f.rule === rule);
async function site(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'fd-v4-'));
  for (const [name, text] of Object.entries(files)) await writeFile(path.join(dir, name), text);
  return dir;
}

test('photo slots: third visible HTML slot fails, while legal copy and metadata do not count', async () => {
  const dir = await site({
    'index.html': page(`${slot('hero')} ${slot('founder')} ${slot('product')}`),
    'privacy.html': page('<p>[PLACEHOLDER: legal address]</p>'),
  });
  const result = await lint(dir);
  assert.equal(hits(result, 'photo-slot-budget').length, 1);
  assert.match(hits(result, 'photo-slot-budget')[0].message, /3 photo slots/);
  const clean = await site({ 'index.html': page(`${slot('hero')} ${slot('founder')}<template>${slot('template')}</template>`) });
  assert.deepEqual(hits(await lint(clean), 'photo-slot-budget'), []);
});

test('photo slots count markers in plain containers once through nested wrappers', async () => {
  const dir = await site({
    'index.html': page('<div class="visual"><div><span>[PLACEHOLDER: hero image]</span></div></div><div>[PLACEHOLDER: founder image]</div><div>[PLACEHOLDER: product image]</div><div hidden>[PLACEHOLDER: hidden image]</div><template>[PLACEHOLDER: template image]</template>'),
  });
  const [finding] = hits(await lint(dir), 'photo-slot-budget');
  assert.match(finding.message, /4 photo slots/);
});

test('a visible photo figure counts when CSS hides only its figcaption', async () => {
  const css = '.ph figcaption { display: none; } .gone { display: none; }';
  const body = '<div>[PLACEHOLDER: hero image]</div><div>[PLACEHOLDER: product image]</div><figure class="ph"><figcaption>[PLACEHOLDER: founder portrait]</figcaption></figure><figure class="ph gone"><figcaption>[PLACEHOLDER: hidden portrait]</figcaption></figure>';
  const dir = await site({ 'index.html': page(body, css) });
  const [finding] = hits(await lint(dir), 'photo-slot-budget');
  assert.match(finding.message, /4 photo slots/);
});

// R83: hiding never removes a slot from the count; only inert markup (template, script) is skipped.
test('photo slots hidden by aria-hidden, the hidden attribute or a media query still count', async () => {
  const aria = '<figure aria-hidden="true"><figcaption>[PLACEHOLDER: a, 4:3]</figcaption></figure>'.repeat(3);
  assert.match(hits(await lint(await site({ 'index.html': page(aria) })), 'photo-slot-budget')[0]?.message ?? '', /3 photo slots/);
  const attr = `${slot('a')}${slot('b')}<div hidden>${slot('c')}</div>`;
  assert.equal(hits(await lint(await site({ 'index.html': page(attr) })), 'photo-slot-budget').length, 1);
  const media = `${slot('a')}${slot('b')}<figure class="ph narrow-only"><figcaption>[PLACEHOLDER: c, 4:3]</figcaption></figure>`;
  assert.equal(hits(await lint(await site({ 'index.html': page(media, '@media (max-width: 600px) { .narrow-only { display: none; } }') })), 'photo-slot-budget').length, 1);
});

test('photo slot labels set in SVG text count', async () => {
  const svgSlot = (n) => `<svg viewBox="0 0 400 300" role="img" aria-label="slot"><rect width="400" height="300" fill="url(#hatch)" /><text x="12" y="24">[PLACEHOLDER: ${n}, 4:3]</text></svg>`;
  const [f] = hits(await lint(await site({ 'index.html': page(svgSlot('a') + svgSlot('b') + svgSlot('c')) })), 'photo-slot-budget');
  assert.match(f?.message ?? '', /3 photo slots/);
});

test('an unlabeled hatched region counts as a slot, and a label inside a hatched region counts once', async () => {
  const band = '<div class="band"><svg class="ph-hatch" aria-hidden="true"><rect width="100%" height="100%" fill="url(#hatch)" /></svg></div>';
  const [f] = hits(await lint(await site({ 'index.html': page(`${slot('a')}${slot('b')}${band}`) })), 'photo-slot-budget');
  assert.match(f?.message ?? '', /3 photo slots/);
  const labeled = '<div class="band"><svg aria-hidden="true"><rect width="100%" height="100%" fill="url(#hatch)" /></svg><p>[PLACEHOLDER: the yard at dawn, 16:9]</p></div>';
  assert.deepEqual(hits(await lint(await site({ 'index.html': page(labeled + labeled) })), 'photo-slot-budget'), []);
});

test('the photo budget message points to the reference\'s non-photo device, never drawings', async () => {
  const [f] = hits(await lint(await site({ 'index.html': page(`${slot('a')}${slot('b')}${slot('c')}`) })), 'photo-slot-budget');
  assert.match(f.message, /non-photo device/);
  assert.doesNotMatch(f.message, /draw/i);
});

test('self-describing captions outside footer fail; descriptive and footer captions pass', async () => {
  const dir = await site({ 'index.html': page('<figure><figcaption>Illustration</figcaption></figure><figure><figcaption>Photo of the product</figcaption></figure><figure><figcaption>The forge at sunrise</figcaption></figure><footer><figcaption>Illustration</figcaption></footer>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 2);
});

test('construction labels and honesty notes fail outside the footer', async () => {
  const dir = await site({ 'index.html': page('<p>Numbers are examples.</p><small>Not to scale.</small><figcaption>Concept</figcaption><footer><p>Numbers are examples.</p></footer>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 3);
});

test('compound construction notes fail without catching subject captions', async () => {
  const dir = await site({ 'index.html': page('<p>Concept. Names and amounts are examples.</p><figcaption>Illustration. Not to scale.</figcaption><figcaption>Steel gate at the north end of the yard.</figcaption>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 2);
});

test('construction notes with named examples and screen examples fail', async () => {
  const dir = await site({ 'index.html': page('<p>Concept. Names and pieces are examples.</p><p>Notes for Student A. Concept, the names and pieces are examples.</p><small>Concept. The screen is an example.</small><figcaption>The student opens the reading list.</figcaption>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 3);
});

test('self-referential quote labels fail without catching product captions', async () => {
  const dir = await site({ 'index.html': page('<blockquote><cite>The sentence this is built around. <span class="need">[NEED: source]</span></cite></blockquote><p class="cap">The problem, as one homeowner put it</p><figcaption>The push mower beside the driveway at sunset.</figcaption>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 2);
});

test('only one honesty line may remain in the footer', async () => {
  const dir = await site({ 'index.html': page('<footer><p>Illustration.</p><p>Numbers are examples.</p></footer>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 1);
});

test('NEED marker must differ from every DESIGN.md accent; underline works with no fill', async () => {
  const design = `---\ncolors:\n  accent: '#cc3300'\n  accent-hover: '#dd4400'\n  highlight: '#cc3300'\n---\n`;
  const body = '<p><span class="need">[NEED: a real price]</span></p>';
  const bad = await site({ 'index.html': page(body, '.need { background: #cc3300; }'), 'DESIGN.md': design });
  assert.equal(hits(await lint(bad), 'need-marker-hue').length, 1);
  const good = await site({ 'index.html': page(body, '.need { background: none; text-decoration: underline; }'), 'DESIGN.md': design });
  assert.deepEqual(hits(await lint(good), 'need-marker-hue'), []);
  const clashingUnderlined = await site({ 'index.html': page(body, '.need { background: #cc3300; text-decoration: underline; }'), 'DESIGN.md': design });
  assert.equal(hits(await lint(clashingUnderlined), 'need-marker-hue').length, 1);
  const second = await site({ 'index.html': page(body, '.need { background: #dd4400; }'), 'DESIGN.md': design });
  assert.equal(hits(await lint(second), 'need-marker-hue').length, 1);
  const token = await site({ 'index.html': page(body, ':root { --highlight: #dd4400; } .need { background: var(--highlight); }'), 'DESIGN.md': design });
  assert.equal(hits(await lint(token), 'need-marker-hue').length, 1);
});

test('NEED marker pale yellow clashes with a saturated yellow banner, not neutrals', async () => {
  const design = `---\ncolors:\n  neutral: '#fafafa'\n  surface: '#eaeaea'\n  banner: '#fbcc0a'\n  highlight: '#fff1a8'\n---\n`;
  const body = '<p><span class="need">[NEED: owner fact]</span></p>';
  const bad = await site({ 'index.html': page(body, ':root { --highlight: #fff1a8; } .need { background: var(--highlight); }'), 'DESIGN.md': design });
  const [finding] = hits(await lint(bad), 'need-marker-hue');
  assert.match(finding.message, /banner/);
  const underlined = await site({ 'index.html': page(body, '.need { background: #fff1a8; text-decoration: underline; }'), 'DESIGN.md': design });
  assert.equal(hits(await lint(underlined), 'need-marker-hue').length, 1);
  const neutralOnly = await site({ 'index.html': page(body, '.need { background: #fafafa; }'), 'DESIGN.md': `---\ncolors:\n  neutral: '#fafafa'\n  surface: '#eaeaea'\n  accent: '#111111'\n  highlight: '#fafafa'\n---\n` });
  assert.deepEqual(hits(await lint(neutralOnly), 'need-marker-hue'), []);
});

// R82: the reviewer's paraphrases, each in a caption-like element outside the page footer.
const PARAPHRASES = [
  'Concept page. Figures are examples.',
  'For illustration only.',
  'Sample data.',
  "Artist's impression.",
  'Mock-up. Numbers are examples.',
  "The problem, in the buyer's words.",
  'Illustrative, not to scale.',
  'Concept screen. Names are made up.',
];

for (const text of PARAPHRASES) {
  test(`self-describing caption paraphrase fails: ${text}`, async () => {
    const dir = await site({ 'index.html': page(`<figure><svg role="img" aria-label="x"></svg><figcaption>${text}</figcaption></figure><p class="note">${text}</p>`) });
    assert.equal(hits(await lint(dir), 'self-describing-caption').length, 2);
  });
}

test('self-describing captions in a caption div or a list item fail', async () => {
  const dir = await site({ 'index.html': page('<div class="caption">Illustration.</div><ul><li>Concept. Numbers are examples.</li></ul><span class="fine">Not a real product.</span><p>This section is the pricing.</p>') });
  assert.equal(hits(await lint(dir), 'self-describing-caption').length, 4);
});

test('mock tabs, buttons and subject captions are not self-describing', async () => {
  const body = [
    '<div data-mock><span>Render</span> <span>Diagram</span> <span>Photo</span><p>Concept board, three columns</p></div>',
    '<div role="tablist"><span role="tab">Render</span><span role="tab">Sample</span></div><button>Demo</button>',
    '<nav><span>Render</span> <span>Photo</span></nav>',
    '<figure><figcaption>The Model 2 kettle, side view, on the counter.</figcaption></figure>',
    '<figure><figcaption>Render of the Halden 40 frame in oak.</figcaption></figure>',
    '<p>Concept to delivery in four weeks.</p><p>Demo day is Friday at the yard.</p>',
  ].join('');
  assert.deepEqual(hits(await lint(await site({ 'index.html': page(body) })), 'self-describing-caption'), []);
});

test('only the page footer may hold the honesty line, not a footer inside a section or quote', async () => {
  const body = '<section><p>Text</p><footer><p>Concept. Numbers are examples.</p></footer></section><blockquote><p>Words.</p><footer>Illustration.</footer></blockquote><footer><p>Prices on this page are examples until launch.</p></footer>';
  assert.equal(hits(await lint(await site({ 'index.html': page(body) })), 'self-describing-caption').length, 2);
});

// R81: the marker's fill is compared with every color the page itself uses.
test('a NEED marker that reuses a page highlight fails, with or without DESIGN.md', async () => {
  const css = 'mark { background: #fff1a8; } .need { background: #fff1a8; }';
  const body = '<p>Practice <mark>this bar</mark> daily.</p><p><span class="need">[NEED: price]</span></p>';
  const design = `---\ncolors:\n  accent: '#1f4fd1'\n  highlight: '#fff1a8'\n---\n`;
  assert.equal(hits(await lint(await site({ 'index.html': page(body, css), 'DESIGN.md': design })), 'need-marker-hue').length, 1);
  assert.equal(hits(await lint(await site({ 'index.html': page(body, css) })), 'need-marker-hue').length, 1);
  const lone = '.need { background: #1f4fd1; color: #fff; }';
  assert.deepEqual(hits(await lint(await site({ 'index.html': page('<p><span class="need">[NEED: price]</span></p>', lone) })), 'need-marker-hue'), []);
});

test('a pale tint of an accent fails as a NEED marker', async () => {
  const design = `---\ncolors:\n  accent: '#1f4fd1'\n---\n`;
  const body = '<p><span class="need">[NEED: price]</span></p>';
  assert.equal(hits(await lint(await site({ 'index.html': page(body, '.need { background: #e4ebfa; }'), 'DESIGN.md': design })), 'need-marker-hue').length, 1);
  const orange = `---\ncolors:\n  accent: '#e8590c'\n---\n`;
  assert.equal(hits(await lint(await site({ 'index.html': page(body, '.need { background: #fde9e1; }'), 'DESIGN.md': orange })), 'need-marker-hue').length, 1);
});

test('a gradient highlighter is read by its color stops', async () => {
  const design = `---\ncolors:\n  accent: '#cc3300'\n---\n`;
  const body = '<p><span class="need">[NEED: price]</span></p>';
  const css = '.need { background: linear-gradient(transparent 60%, #cc3300 60%); }';
  assert.equal(hits(await lint(await site({ 'index.html': page(body, css), 'DESIGN.md': design })), 'need-marker-hue').length, 1);
});

test('the NEED marker fill follows specificity, not source order', async () => {
  const design = `---\ncolors:\n  accent: '#cc3300'\n---\n`;
  const body = '<p><span class="need">[NEED: price]</span></p>';
  const clash = 'p .need { background: #cc3300; } .need { background: #fff1a8; }';
  assert.equal(hits(await lint(await site({ 'index.html': page(body, clash), 'DESIGN.md': design })), 'need-marker-hue').length, 1);
  const fine = 'p .need { background: #fff1a8; } .need { background: #cc3300; }';
  assert.deepEqual(hits(await lint(await site({ 'index.html': page(body, fine), 'DESIGN.md': design })), 'need-marker-hue'), []);
});

// R77: each built section records the reference section it adapts.
test('DESIGN.md Layout with fewer adapts: lines than built sections warns', async () => {
  const design = (n) => `---\ncolors:\n  neutral: '#ffffff'\n  ink: '#111111'\n---\n\n## Layout\n\n${Array.from({ length: n }, (_, i) => `- Section ${i + 1} | adapts: Part ${i + 1} | text`).join('\n')}\n\n## Shapes\n`;
  const body = '<section><h2>One</h2><section><h3>Inner</h3></section></section><section><h2>Two</h2></section><section><h2>Three</h2></section>';
  const short = hits(await lint(await site({ 'index.html': page(body), 'DESIGN.md': design(2) })), 'design-tokens').filter((f) => /adapts:/.test(f.message));
  assert.equal(short.length, 1);
  assert.equal(short[0].severity, 'warn');
  assert.match(short[0].message, /2 .*3 /);
  const full = hits(await lint(await site({ 'index.html': page(body), 'DESIGN.md': design(3) })), 'design-tokens').filter((f) => /adapts:/.test(f.message));
  assert.deepEqual(full, []);
});
