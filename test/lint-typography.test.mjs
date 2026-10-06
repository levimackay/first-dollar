import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '../src/lint/runner.mjs';
import { rankFamily } from '../src/lint/rules/font-popularity.mjs';

const fx = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'lint');
const hits = async (rule, dir) => {
  const res = await lint(path.join(fx, rule, dir));
  return [...res.failures, ...res.warnings].filter((f) => f.rule === rule);
};

test('font-popularity names the rank, the total and the snapshot', async () => {
  const [f] = await hits('font-popularity', 'fail');
  assert.match(f.message, /^"Outfit" is #31 of 1950 Google Fonts by popularity \(snapshot \d{4}-\d\d-\d\d\); use the reference's own face/);
});

test('font-popularity fails Georgia (trend list) and reports Google Fonts link families once', async () => {
  const g = await hits('font-popularity', 'fail-georgia');
  assert.equal(g.length, 1);
  assert.match(g[0].message, /"Georgia"/);
  const l = await hits('font-popularity', 'fail-link');
  assert.deepEqual(l.map((f) => /"([^"]+)"/.exec(f.message)[1]), ['Hanken Grotesk']);
});

test('font-popularity leaves a low-ranked family, a custom @font-face name and generics alone', async () => {
  assert.deepEqual(await hits('font-popularity', 'pass'), []);
});

test('mono-prose names the element and the face', async () => {
  const [f] = await hits('mono-prose', 'fail');
  assert.match(f.message, /p\.terms/);
  assert.match(f.message, /IBM Plex Mono/);
  assert.match(f.message, /running text set in monospace reads as machine-made; use the text face, or mark the element data-mono only if the reference sets this exact text in mono/);
  assert.doesNotMatch(f.message, /short labels/);
});

test('mono-prose exempts code, pre, table cells, data-mono and short labels', async () => {
  assert.deepEqual(await hits('mono-prose', 'pass-exempt'), []);
  assert.deepEqual(await hits('mono-prose', 'pass'), []);
});

test('font rank lookup names snapshot and top-200 or banned status before a build', () => {
  assert.match(rankFamily('Outfit'), /#31 of 1950.*top 200.*snapshot/);
  assert.match(rankFamily('Arial'), /banned.*snapshot/);
  assert.match(rankFamily('Wix Madefor Text'), /#475 of 1950.*outside the top 200.*snapshot/);
  assert.match(rankFamily('Not A Catalogued Face'), /not in the Google Fonts snapshot/);
  assert.match(rankFamily('Gloock'), /trend face.*blocked.*snapshot/);
});

test('mono prose ignores table and NEED marker content', async () => {
  const { mkdtemp, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const dir = await mkdtemp(path.join(tmpdir(), 'fd-mono-'));
  await writeFile(path.join(dir, 'index.html'), `<!doctype html><html><head><style>body { font-family: "IBM Plex Mono"; }</style></head><body><table><tr><td><p>These are seven words inside a data table cell.</p></td></tr></table><p><span class="need">[NEED: this is an owner provided sentence here]</span></p></body></html>`);
  assert.deepEqual((await lint(dir)).failures.filter((f) => f.rule === 'mono-prose'), []);
});

test('mono prose ignores cells of an ARIA table or grid built from divs', async () => {
  const { mkdtemp, writeFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const dir = await mkdtemp(path.join(tmpdir(), 'fd-mono-'));
  const cell = (t) => `<div role="cell">${t}</div>`;
  await writeFile(path.join(dir, 'index.html'), `<!doctype html><html><head><style>.tbl { font-family: "Martian Mono"; }</style></head><body><div class="tbl" role="table"><div role="row">${cell('Claims sent back for a missing code are fixed and resubmitted the same day')}${cell('Within two business days')}</div></div><div role="grid"><div role="row"><span role="gridcell">Each line of the batch is matched to its payer record before export</span></div></div></body></html>`);
  assert.deepEqual((await lint(dir)).failures.filter((f) => f.rule === 'mono-prose'), []);
});
