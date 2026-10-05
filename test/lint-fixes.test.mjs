import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { lint } from '../src/lint/runner.mjs';

async function siteDir(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'fdfix-'));
  for (const [name, text] of Object.entries(files)) await writeFile(path.join(dir, name), text);
  return dir;
}

const page = (css, body) =>
  `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>t</title><style>${css}</style></head><body>${body}</body></html>`;

const hitsFor = (res, id) => [...res.failures, ...res.warnings].filter((f) => f.rule === id);

test('flat-type-scale ignores font sizes inside @media blocks', async () => {
  const css = 'body { font-size: 18px; } h1 { font-size: 30px; } @media (max-width: 480px) { h1 { font-size: 60px; } }';
  const dir = await siteDir({ 'index.html': page(css, '<h1>Hi</h1>') });
  const hits = hitsFor(await lint(dir), 'flat-type-scale');
  assert.equal(hits.length, 1, 'the 60px mobile override must not count as the largest size');
  assert.match(hits[0].message, /30px/);
});

const BAND = '.wrap { max-width: 1080px; margin-inline: auto; } .band { background: #eef2ee; padding: 48px 0; }';
const bandBody = '<main><section class="band"><div class="wrap"><p>Copy</p></div></section></main>';

test('no-full-bleed counts a full-width background band as full-bleed', async () => {
  const dir = await siteDir({ 'index.html': page(BAND, bandBody) });
  assert.deepEqual(hitsFor(await lint(dir), 'no-full-bleed'), []);
});

test('no-full-bleed still warns when the section has no background or has a max-width', async () => {
  for (const css of ['.wrap { max-width: 1080px; } .band { padding: 48px 0; }', '.wrap { max-width: 1080px; } .band { background: #eee; max-width: 1080px; }']) {
    const dir = await siteDir({ 'index.html': page(css, bandBody) });
    assert.equal(hitsFor(await lint(dir), 'no-full-bleed').length, 1, css);
  }
});

test('invented-metric catches multiplier claims, not dimensions or sourced ones', async () => {
  const body = (t) => page('', `<main><p>${t}</p></main>`);
  for (const t of ['3x faster invoicing', 'Close 10\u00d7 more jobs', 'Get 2.5x the leads']) {
    const dir = await siteDir({ 'index.html': body(t) });
    assert.equal(hitsFor(await lint(dir), 'invented-metric').length, 1, t);
  }
  for (const t of ['A 4x4 grid of photos', 'Photos are 1920x1080', '3x faster [SOURCE: needed]']) {
    const dir = await siteDir({ 'index.html': body(t) });
    assert.equal(hitsFor(await lint(dir), 'invented-metric').length, 0, t);
  }
});
