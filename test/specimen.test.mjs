import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveBrowser } from '../src/check/browser.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const hasBrowser = !!resolveBrowser();
const online = await fetch('https://fonts.googleapis.com/css2?family=Funnel+Sans', { signal: AbortSignal.timeout(5000) })
  .then((r) => r.ok)
  .catch(() => false);

test('--specimen screenshots a family that exists', (t) => {
  if (!hasBrowser || !online) return t.skip('no browser or network');
  const out = mkdtempSync(join(tmpdir(), 'fd-spec-'));
  const r = spawnSync('node', [cli, '--specimen', 'Funnel Sans', '--out', out], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(join(out, 'specimen.png')));
});

test('--specimen exits 3 and takes no screenshot when the family does not exist', (t) => {
  if (!hasBrowser || !online) return t.skip('no browser or network');
  const out = mkdtempSync(join(tmpdir(), 'fd-spec-'));
  const r = spawnSync('node', [cli, '--specimen', 'Zzyzx Nonexistent Face', '--out', out], { encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified: font did not load/);
  assert.ok(!existsSync(join(out, 'specimen.png')));
});
