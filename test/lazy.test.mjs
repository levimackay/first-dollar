import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { serve } from '../src/check/serve.mjs';
import { resolveBrowser, launch } from '../src/check/browser.mjs';
import { palette } from '../src/check/palette.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const fx = (n) => new URL(`./fixtures/check/${n}`, import.meta.url).pathname;
const found = resolveBrowser();

test('URL mode captures lazy-loaded images, not their placeholder color', async (t) => {
  if (!found) return t.skip('no browser');
  const srv = await serve(fx('lazy-images'));
  const out = mkdtempSync(join(tmpdir(), 'fd-lazy-'));
  const code = await new Promise((done) => spawn('node', [cli, srv.url, '--out', out], { stdio: 'ignore' }).on('exit', done));
  await srv.close();
  assert.equal(code, 0);
  const browser = await launch(found);
  const colors = await palette(browser, join(out, 'full-1440.png'), 3);
  await browser.close();
  assert.ok(colors.some((c) => c.rgb.r > 190 && c.rgb.g < 40), JSON.stringify(colors));
});

test('URL mode waits for a delayed scroll reveal before the full-page still', async (t) => {
  if (!found) return t.skip('no browser');
  const srv = await serve(fx('reference-reveal'));
  const out = mkdtempSync(join(tmpdir(), 'fd-reveal-'));
  const code = await new Promise((done) => spawn('node', [cli, srv.url, '--out', out], { stdio: 'ignore' }).on('exit', done));
  await srv.close();
  assert.equal(code, 0);
  const browser = await launch(found);
  try {
    const page = await browser.newPage();
    const pixel = await page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 700, 1300, 1, 1, 0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    }, `data:image/png;base64,${readFileSync(join(out, 'full-1440.png')).toString('base64')}`);
    assert.ok(pixel.every((channel) => channel < 50), `unrevealed pixel: ${pixel}`);
  } finally {
    await browser.close();
  }
});

// R84: a full-page shot never paints position:fixed media layers, so URL mode also keeps a
// still per screen while it scrolls down the page.
test('URL mode saves one viewport still per screen, showing fixed background layers', async (t) => {
  if (!found) return t.skip('no browser');
  const srv = await serve(fx('fixed-media-layers'));
  const out = mkdtempSync(join(tmpdir(), 'fd-scroll-'));
  const code = await new Promise((done) => spawn('node', [cli, srv.url, '--out', out], { stdio: 'ignore' }).on('exit', done));
  await srv.close();
  assert.equal(code, 0);
  for (const n of ['00', '01', '02']) assert.ok(existsSync(join(out, `scroll-${n}.png`)), `scroll-${n}.png`);
  const browser = await launch(found);
  try {
    const page = await browser.newPage();
    const center = (file) => page.evaluate(async (src) => {
      const img = new Image();
      img.src = src;
      await img.decode();
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = 1;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 300, 450, 1, 1, 0, 0, 1, 1);
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    }, `data:image/png;base64,${readFileSync(join(out, file)).toString('base64')}`);
    const [r0, , b0] = await center('scroll-00.png');
    const [r1, , b1] = await center('scroll-01.png');
    assert.ok(r0 > 150 && b0 < 80, `first screen ${r0},${b0}`);
    assert.ok(b1 > 150 && r1 < 80, `second screen ${r1},${b1}`);
  } finally {
    await browser.close();
  }
});
