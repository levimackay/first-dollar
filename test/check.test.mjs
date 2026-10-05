import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import http from 'node:http';
import { serve } from '../src/check/serve.mjs';
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

test('a missing og.html is not verified (exit 3)', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const out = mkdtempSync(join(tmpdir(), 'fd-check-'));
  const r = spawnSync('node', [cli, fx('good'), '--og', '--out', out], { encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
});

test('a URL that answers 404 is not verified (exit 3)', async (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const srv = await serve(fx('good'));
  const out = mkdtempSync(join(tmpdir(), 'fd-check-'));
  const r = await new Promise((done) => {
    let stdout = '';
    const p = spawn('node', [cli, srv.url + 'missing.html', '--out', out]);
    p.stdout.on('data', (d) => (stdout += d));
    p.on('close', (status) => done({ status, stdout }));
  });
  await srv.close();
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
});

test('an invalid URL argument exits 3', () => {
  const r = spawnSync('node', [cli, 'http://'], { encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
});

test('--out with no value exits 3', () => {
  const r = spawnSync('node', [cli, fx('good'), '--out'], { encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
});

test('serve refuses path traversal', async () => {
  const srv = await serve(fx('good'));
  const { port } = new URL(srv.url);
  const get = (path) =>
    new Promise((done) =>
      http.get({ host: '127.0.0.1', port, path }, (res) => {
        let body = '';
        res.on('data', (d) => (body += d));
        res.on('end', () => done({ status: res.statusCode, body }));
      }),
    );
  for (const p of ['/../../../../package.json', '/%2e%2e/%2e%2e/%2e%2e/%2e%2e/package.json', '/..%2f..%2f..%2f..%2fpackage.json']) {
    const r = await get(p);
    assert.notEqual(r.status, 200, p);
    assert.ok(!r.body.includes('"name"'), p);
  }
  await srv.close();
});
