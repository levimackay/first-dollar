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
  const clean = await site({ 'index.html': page(`${slot('hero')} ${slot('founder')}<div hidden>${slot('hidden')}</div>`) });
  assert.deepEqual(hits(await lint(clean), 'photo-slot-budget'), []);
});

test('photo slots count markers in plain containers once through nested wrappers', async () => {
  const dir = await site({
    'index.html': page('<div class="visual"><div><span>[PLACEHOLDER: hero image]</span></div></div><div>[PLACEHOLDER: founder image]</div><div>[PLACEHOLDER: product image]</div><div hidden>[PLACEHOLDER: hidden image]</div><template>[PLACEHOLDER: template image]</template>'),
  });
  const [finding] = hits(await lint(dir), 'photo-slot-budget');
  assert.match(finding.message, /3 photo slots/);
});

test('a visible photo figure counts when CSS hides only its figcaption', async () => {
  const css = '.ph figcaption { display: none; } .gone { display: none; }';
  const body = '<div>[PLACEHOLDER: hero image]</div><div>[PLACEHOLDER: product image]</div><figure class="ph"><figcaption>[PLACEHOLDER: founder portrait]</figcaption></figure><figure class="ph gone"><figcaption>[PLACEHOLDER: hidden portrait]</figcaption></figure>';
  const dir = await site({ 'index.html': page(body, css) });
  const [finding] = hits(await lint(dir), 'photo-slot-budget');
  assert.match(finding.message, /3 photo slots/);
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
