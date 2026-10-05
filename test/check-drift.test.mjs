import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, cpSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { found, makePng } from './png-helper.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const good = new URL('./fixtures/check/good', import.meta.url).pathname;

// A copy of the white "good" page (optionally recolored), with an optional reference.
// ref: a color (1440.png only, 900px) or { shot, full } of html bodies; at: reference folder under .first-dollar/reference.
async function site(ref, { page: pageBg, at = 'example.com' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'fd-drift-'));
  cpSync(good, dir, { recursive: true });
  if (pageBg) {
    const f = join(dir, 'index.html');
    writeFileSync(f, readFileSync(f, 'utf8').replace('background:#fff}', `background:${pageBg}}`));
  }
  if (ref) {
    const d = at ? join(dir, '.first-dollar', 'reference', at) : join(dir, '.first-dollar', 'reference');
    mkdirSync(d, { recursive: true });
    const { shot, full } = typeof ref === 'string' ? { shot: `<div style="height:900px;background:${ref}"></div>` } : ref;
    await makePng(shot, join(d, '1440.png'), { width: 1440, height: 900 });
    if (full) await makePng(full, join(d, 'full-1440.png'), { width: 1440, height: 3000 });
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

test('a white reference against a cream page fails reference-drift', async (t) => {
  if (!found) return t.skip('no browser');
  const { checks } = await site('#ffffff', { page: '#f5efe0' });
  assert.equal(checks[0].ok, false, checks[0].detail);
});

test('white against white passes with a full-page reference too', async (t) => {
  if (!found) return t.skip('no browser');
  const white = (h) => `<div style="height:${h}px;background:#fff"></div>`;
  const { checks } = await site({ shot: white(900), full: white(3000) });
  assert.equal(checks[0].ok, true, checks[0].detail);
});

test('a dark photo hero on a light full page does not make the reference dark', async (t) => {
  if (!found) return t.skip('no browser');
  const dark = '<div style="height:900px;background:#0b0b0c"></div>';
  const full = dark + '<div style="height:2100px;background:#fff"></div>';
  const { checks } = await site({ shot: dark, full });
  assert.equal(checks[0].ok, true, checks[0].detail);
});

test('URL mode also writes full-1440.png, bounded to 20000px', async (t) => {
  if (!found) return t.skip('no browser');
  const { createServer } = await import('node:http');
  const srv = createServer((q, s) => {
    s.setHeader('content-type', 'text/html');
    s.end('<body style="margin:0"><div style="height:30000px;background:#fff"></div>');
  });
  await new Promise((r) => srv.listen(0, '127.0.0.1', r));
  const cwd = mkdtempSync(join(tmpdir(), 'fd-url-'));
  const url = `http://127.0.0.1:${srv.address().port}/`;
  // async spawn: spawnSync would block the event loop that serves the page
  const r = await new Promise((done) => {
    const c = spawn('node', [cli, url], { cwd });
    let stdout = '';
    c.stdout.on('data', (d) => (stdout += d));
    c.on('close', (status) => done({ status, stdout }));
  });
  srv.close();
  assert.ok(r.status === 0 || r.status === 1, r.stdout);
  const dir = join(cwd, '.first-dollar', 'reference');
  const host = new URL(url).host;
  const full = join(dir, host, 'full-1440.png');
  assert.ok(existsSync(full), r.stdout);
  const buf = readFileSync(full);
  assert.ok(buf.readUInt32BE(20) <= 20000, `height ${buf.readUInt32BE(20)}`);
});
