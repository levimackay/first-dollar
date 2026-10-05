import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveBrowser } from '../src/check/browser.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const fx = (n) => new URL(`./fixtures/check/${n}`, import.meta.url).pathname;
const hasBrowser = !!resolveBrowser();

function run(dir, env = {}) {
  const out = mkdtempSync(join(tmpdir(), 'fd-check-'));
  const r = spawnSync('node', [cli, dir, '--out', out], { encoding: 'utf8', env: { ...process.env, ...env } });
  const file = join(out, 'check.json');
  const json = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
  return { r, out, json };
}

test('good passes all checks and writes screenshots', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { r, out, json } = run(fx('good'));
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(json.verified, true);
  assert.ok(json.checks.every((c) => c.ok));
  for (const f of ['1440.png', '390.png', 'full-1440.png', 'full-390.png']) assert.ok(existsSync(join(out, f)), f);
});

test('overflow fails overflow at 320', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { r, json } = run(fx('overflow'));
  assert.equal(r.status, 1);
  assert.ok(json.checks.some((c) => c.id === 'overflow' && c.width === 320 && !c.ok));
});

test('hidden fails hidden-after-reveal', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { r, json } = run(fx('hidden'));
  assert.equal(r.status, 1);
  assert.ok(json.checks.some((c) => c.id === 'hidden-after-reveal' && !c.ok));
});

test('no browser exits 3 with "not verified"', () => {
  const cache = mkdtempSync(join(tmpdir(), 'fd-cache-'));
  const { r } = run(fx('good'), { FIRST_DOLLAR_CHROME: '/nonexistent', FIRST_DOLLAR_CACHE: cache });
  assert.equal(r.status, 3);
  assert.match(r.stdout + r.stderr, /not verified/);
});
