import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { found, makePng } from './png-helper.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const good = new URL('./fixtures/check/good', import.meta.url).pathname;

// A copy of the white "good" page, with an optional reference screenshot filled with one color.
async function site(referenceColor) {
  const dir = mkdtempSync(join(tmpdir(), 'fd-drift-'));
  cpSync(good, dir, { recursive: true });
  if (referenceColor) {
    const ref = join(dir, '.first-dollar', 'reference', 'example.com');
    mkdirSync(ref, { recursive: true });
    await makePng(`<div style="height:900px;background:${referenceColor}"></div>`, join(ref, '1440.png'), { width: 1440, height: 900 });
  }
  const out = mkdtempSync(join(tmpdir(), 'fd-check-'));
  const r = spawnSync('node', [cli, dir, '--out', out], { encoding: 'utf8' });
  return { r, checks: JSON.parse(readFileSync(join(out, 'check.json'), 'utf8')).checks.filter((c) => c.id === 'reference-drift') };
}

test('a dark reference with a light page fails reference-drift and names both hexes', async (t) => {
  if (!found) return t.skip('no browser');
  const { r, checks } = await site('#0b0b0c');
  assert.equal(r.status, 1, r.stdout);
  assert.equal(checks.length, 1);
  assert.equal(checks[0].ok, false);
  assert.match(checks[0].detail, /#0b0b0c/);
  assert.match(checks[0].detail, /#ffffff/);
});

test('a matching reference passes reference-drift', async (t) => {
  if (!found) return t.skip('no browser');
  const { r, checks } = await site('#ffffff');
  assert.equal(r.status, 0, r.stdout);
  assert.equal(checks.length, 1);
  assert.equal(checks[0].ok, true);
});

test('no reference image: reference-drift is skipped, not counted', async (t) => {
  if (!found) return t.skip('no browser');
  const { r, checks } = await site(null);
  assert.equal(r.status, 0, r.stdout);
  assert.deepEqual(checks, []);
});
