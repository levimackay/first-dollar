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
