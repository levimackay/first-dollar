import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { found, makePng } from './png-helper.mjs';

const cli = new URL('../src/check/cli.mjs', import.meta.url).pathname;

const dir = mkdtempSync(join(tmpdir(), 'fd-palette-'));

test('--palette prints the dominant colors with coverage', async (t) => {
  if (!found) return t.skip('no browser');
  const png = join(dir, 'blocks.png');
  await makePng('<div style="height:300px;background:linear-gradient(90deg,#c0392b 75%,#2980b9 75%)"></div>', png);
  const r = spawnSync('node', [cli, '--palette', png, '--json'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stdout + r.stderr);
  const { colors } = JSON.parse(r.stdout);
  assert.equal(colors[0].hex, '#c0392b');
  assert.ok(Math.abs(colors[0].coverage - 75) < 2, String(colors[0].coverage));
  assert.equal(colors[1].hex, '#2980b9');
  assert.ok(colors.length <= 6);
  const text = spawnSync('node', [cli, '--palette', png], { encoding: 'utf8' });
  assert.match(text.stdout, /#c0392b\s+7\d(\.\d)?%/);
});

test('--palette without a browser exits 3 with "not verified"', () => {
  const png = join(dir, 'x.png');
  mkdirSync(dir, { recursive: true });
  writeFileSync(png, '');
  const cache = mkdtempSync(join(tmpdir(), 'fd-cache-'));
  const r = spawnSync('node', [cli, '--palette', png], {
    encoding: 'utf8',
    env: { ...process.env, FIRST_DOLLAR_CHROME: '/nonexistent', FIRST_DOLLAR_CACHE: cache },
  });
  assert.equal(r.status, 3);
  assert.match(r.stdout, /not verified/);
});
