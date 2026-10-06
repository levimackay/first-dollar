import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readDesign } from '../src/lint/design-md.mjs';
import { lint } from '../src/lint/runner.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const good = path.join(here, 'fixtures', 'lint', 'design-tokens', 'pass', 'DESIGN.md');
const malformed = path.join(here, 'fixtures', 'design-md', 'malformed');

test('readDesign extracts colors, fonts, rounded and spacing', async () => {
  const res = await readDesign(good);
  assert.equal(res.ok, true);
  const { colors, fonts, rounded, spacing } = res.tokens;
  assert.deepEqual([...colors.keys()].sort(), ['accent', 'paper', 'primary']);
  assert.deepEqual(colors.get('primary'), { r: 26, g: 61, b: 43, a: 1 });
  assert.deepEqual([...fonts].sort(), ['fraunces', 'source serif 4']);
  assert.deepEqual([...rounded].sort((a, b) => a - b), [4, 8]);
  assert.deepEqual([...spacing].sort((a, b) => a - b), [8, 24]);
});

test('readDesign reports a missing file', async () => {
  const res = await readDesign(path.join(here, 'nope', 'DESIGN.md'));
  assert.equal(res.ok, false);
  assert.match(res.reason, /DESIGN\.md/);
});

test('readDesign reports bad YAML and missing front matter without throwing', async () => {
  const bad = await readDesign(path.join(malformed, 'DESIGN.md'));
  assert.equal(bad.ok, false);
  assert.ok(bad.reason.length > 0);
  const none = await readDesign(path.join(here, '..', 'package.json'));
  assert.equal(none.ok, false);
});

test('malformed DESIGN.md gives design-tokens exactly one warn and no fail', async () => {
  const res = await lint(malformed);
  const hits = [...res.failures, ...res.warnings].filter((f) => f.rule === 'design-tokens');
  assert.equal(hits.length, 1);
  assert.equal(hits[0].severity, 'warn');
  assert.equal(res.failures.filter((f) => f.rule === 'design-tokens').length, 0);
});

test('unfilled template slots give one warn per token group, naming the tokens', async () => {
  const dir = path.join(here, 'fixtures', 'design-md', 'unfilled');
  const res = await lint(dir);
  const hits = [...res.failures, ...res.warnings].filter((f) => f.rule === 'design-tokens');
  assert.equal(hits.length, 2, hits.map((h) => h.message).join(' | '));
  assert.ok(hits.every((h) => h.severity === 'warn'));
  const colors = hits.find((h) => /colors/.test(h.message));
  assert.match(colors.message, /primary/);
  assert.match(colors.message, /accent/);
  assert.match(hits.find((h) => /typography/.test(h.message)).message, /display/);
});

test('a token reference resolves to the referenced color', async () => {
  const { resolveRef } = await import('../src/lint/design-md.mjs');
  assert.equal(resolveRef('{colors.primary}', { colors: { primary: '#fff' } }), '#fff');
  assert.equal(resolveRef('#000', {}), '#000');
});
