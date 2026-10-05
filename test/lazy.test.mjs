import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
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
