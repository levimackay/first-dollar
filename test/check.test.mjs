import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync, spawn } from 'node:child_process';
import http from 'node:http';
import { serve } from '../src/check/serve.mjs';
import { mkdtempSync, readFileSync, existsSync, mkdirSync, writeFileSync, cpSync } from 'node:fs';
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

test('text held below a line mask fails hidden-after-reveal', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('clip-mask'));
  const mine = json.checks.filter((c) => c.id === 'hidden-after-reveal' && !c.ok);
  assert.ok(mine.length, JSON.stringify(json.checks));
  assert.match(mine[0].detail, /This line never rises/);
  assert.match(mine[0].detail, /clipped by an ancestor/);
  const reduced = json.checks.find((c) => c.id === 'reduced-motion');
  assert.equal(reduced.ok, false);
  assert.match(reduced.detail, /clipped by an ancestor/);
});

test('a visible photo slot in the first viewport fails at both capture widths', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { r, json } = run(fx('hero-photo-slot'));
  assert.equal(r.status, 1);
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-above-fold' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
    assert.match(mine.detail, /PLACEHOLDER: founder portrait/);
  }
});

test('a photo slot below the first viewport passes the fold check', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-photo-slot'));
  const mine = json.checks.filter((c) => c.id === 'photo-slot-above-fold');
  assert.deepEqual(mine.map((c) => c.width), [390, 1440]);
  assert.ok(mine.every((c) => c.ok), JSON.stringify(mine));
});

test('a first-viewport photo slot revealed by scrolling still fails', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('hero-photo-slot-reveal'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-above-fold' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
  }
});

test('a visible first-viewport photo slot fails with a hidden figcaption', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('hero-photo-slot-hidden-label'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-above-fold' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
  }
});

test('a full-bleed photo slot below the first viewport fails placement', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-full-bleed-slot'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
    assert.match(mine.detail, /full bleed/);
  }
});

test('a tall inline photo slot below the first viewport fails placement', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-tall-slot'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
    assert.match(mine.detail, /one third/);
  }
});

test('a near-full-width desktop slot fails placement while an inset mobile slot passes', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-near-width-slot'));
  const mobile = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === 390);
  const desktop = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === 1440);
  assert.equal(mobile?.ok, true, JSON.stringify(json.checks));
  assert.equal(desktop?.ok, false, JSON.stringify(json.checks));
  assert.match(desktop.detail, /nearly full width/);
});

// R83: the check measures the slot box (the hatched region), never its label.
test('a full-bleed hatched band fails placement by its own box, not its small label', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-hatched-band'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
    assert.match(mine.detail, /PLACEHOLDER: the yard at dawn.*full bleed/);
    assert.match(mine.detail, /520px tall/);
  }
});

test('a full-bleed hatched band with no label fails placement', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-unlabeled-hatch'));
  for (const width of [390, 1440]) {
    const mine = json.checks.find((c) => c.id === 'photo-slot-placement' && c.width === width);
    assert.equal(mine?.ok, false, JSON.stringify(json.checks));
    assert.match(mine.detail, /unlabeled hatched region.*full bleed/);
  }
});

test('an inline slot a little over one third of the viewport passes placement', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('below-fold-slot-tolerance'));
  const mine = json.checks.filter((c) => c.id === 'photo-slot-placement');
  assert.deepEqual(mine.map((c) => c.width), [390, 1440]);
  assert.ok(mine.every((c) => c.ok), JSON.stringify(mine));
});

test('a mock cropped sideways so its total column is hidden fails hidden-after-reveal at 390', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('mock-crop-sideways'));
  const narrow = json.checks.find((c) => c.id === 'hidden-after-reveal' && c.width === 390);
  assert.equal(narrow?.ok, false, JSON.stringify(json.checks));
  assert.match(narrow.detail, /\$62\.00.*clipped by an ancestor/);
  assert.equal(json.checks.find((c) => c.id === 'hidden-after-reveal' && c.width === 1440)?.ok, true);
});

test('a row clipped sideways, like a ticker, passes hidden-after-reveal', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('clip-ticker'));
  assert.ok(json.checks.filter((c) => c.id === 'hidden-after-reveal').every((c) => c.ok), JSON.stringify(json.checks));
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

test('a one-line button with min-height does not fail two-line-button', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('tall-button'));
  const mine = json.checks.filter((c) => c.id === 'two-line-button');
  assert.ok(mine.length > 0 && mine.every((c) => c.ok), JSON.stringify(mine));
});

test('a button whose label wraps fails two-line-button at 390', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('wrap-button'));
  assert.ok(json.checks.some((c) => c.id === 'two-line-button' && c.width === 390 && !c.ok));
});

test('an unwritable --out after the browser launched still exits 3 with "not verified"', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const r = spawnSync('node', [cli, fx('good'), '--out', '/dev/null/x'], { encoding: 'utf8' });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
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

test('--og reads .first-dollar/og.html and writes og.png', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const site = mkdtempSync(join(tmpdir(), 'fd-og-'));
  cpSync(fx('good'), site, { recursive: true });
  mkdirSync(join(site, '.first-dollar'));
  writeFileSync(join(site, '.first-dollar', 'og.html'), '<!doctype html><html lang="en"><body style="margin:0"><h1>og</h1></body></html>');
  const out = mkdtempSync(join(tmpdir(), 'fd-check-'));
  const r = spawnSync('node', [cli, site, '--og', '--out', out], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.ok(existsSync(join(out, 'og.png')));
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

function reduced(name) {
  const { json } = run(fx(name));
  return json.checks.filter((c) => c.id === 'reduced-motion');
}

test('a reveal that never fires under reduced motion fails reduced-motion and not hidden-after-reveal', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const { json } = run(fx('reduced-fail'));
  assert.ok(json.checks.some((c) => c.id === 'reduced-motion' && !c.ok), JSON.stringify(json.checks));
  assert.ok(json.checks.filter((c) => c.id === 'hidden-after-reveal').every((c) => c.ok));
});

test('a reveal with a reduced-motion branch passes reduced-motion', (t) => {
  if (!hasBrowser) return t.skip('no browser');
  const mine = reduced('reduced-pass');
  assert.ok(mine.length > 0 && mine.every((c) => c.ok), JSON.stringify(mine));
});
