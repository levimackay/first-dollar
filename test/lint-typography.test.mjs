import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '../src/lint/runner.mjs';

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
