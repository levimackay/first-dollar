import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { resolveBrowser, launch } from '../src/check/browser.mjs';
import { palette } from '../src/check/palette.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;
const fx = (n) => new URL(`./fixtures/check/${n}`, import.meta.url).pathname;
const found = resolveBrowser();

test('a settle timeout is named in the hidden-after-reveal detail', (t) => {
  if (!found) return t.skip('no browser');
  const out = mkdtempSync(join(tmpdir(), 'fd-settle-'));
  spawnSync('node', [cli, fx('long-delay'), '--out', out], { encoding: 'utf8' });
  const json = JSON.parse(readFileSync(join(out, 'check.json'), 'utf8'));
  const mine = json.checks.filter((c) => c.id === 'hidden-after-reveal' && !c.ok);
  assert.ok(mine.length > 0);
  assert.ok(mine.every((c) => c.detail.includes('animations still running after 8s')), JSON.stringify(mine));
});

test('a 5s one-shot reveal passes hidden-after-reveal and 1440.png shows the final state', async (t) => {
  if (!found) return t.skip('no browser');
  const out = mkdtempSync(join(tmpdir(), 'fd-settle-'));
  spawnSync('node', [cli, fx('slow-reveal'), '--out', out], { encoding: 'utf8' });
  const json = JSON.parse(readFileSync(join(out, 'check.json'), 'utf8'));
  const mine = json.checks.filter((c) => c.id === 'hidden-after-reveal');
  assert.ok(mine.length > 0 && mine.every((c) => c.ok), JSON.stringify(mine));
  const browser = await launch(found);
  const colors = await palette(browser, join(out, '1440.png'), 2);
  await browser.close();
  assert.ok(colors.some((c) => c.rgb.r > 190 && c.rgb.g < 40), JSON.stringify(colors));
});
