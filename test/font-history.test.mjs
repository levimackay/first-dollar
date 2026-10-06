import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { lint } from '../src/lint/runner.mjs';

async function site(history) {
  const dir = await mkdtemp(path.join(tmpdir(), 'fd-hist-'));
  await writeFile(path.join(dir, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>T</title><link rel="stylesheet" href="s.css"></head><body><h1>Hi</h1></body></html>');
  await writeFile(path.join(dir, 's.css'), 'h1 { font-family: "Familjen Grotesk", sans-serif; }');
  const historyPath = path.join(dir, 'h.jsonl');
  if (history !== null) await writeFile(historyPath, history);
  return { dir, historyPath };
}
const line = (display, i = 0) => JSON.stringify({ date: `2026-09-${10 + i}`, idea: 'dog grooming', display, text: 'Public Sans' });
const hits = (res) => [...res.failures, ...res.warnings].filter((f) => f.rule === 'font-history');

test('a repeat of a recent display face fails with the build and date', async () => {
  const { dir, historyPath } = await site(line('Familjen Grotesk') + '\n');
  const [f] = hits(await lint(dir, { historyPath }));
  assert.equal(f.message, '"Familjen Grotesk" was used by your build of dog grooming on 2026-09-10; pick a different face so your pages do not share a look');
});

test('a face older than the last 10 lines passes', async () => {
  const lines = [line('Familjen Grotesk'), ...Array.from({ length: 10 }, (_, i) => line('Fraunces', i + 1))];
  const { dir, historyPath } = await site(lines.join('\n') + '\n');
  assert.deepEqual(hits(await lint(dir, { historyPath })), []);
});

test('a missing or empty history file passes, and no flag means no rule', async () => {
  const missing = await site(null);
  assert.deepEqual(hits(await lint(missing.dir, { historyPath: missing.historyPath })), []);
  const empty = await site('');
  assert.deepEqual(hits(await lint(empty.dir, { historyPath: empty.historyPath })), []);
  const flagless = await site(line('Familjen Grotesk'));
  assert.deepEqual(hits(await lint(flagless.dir)), []);
});

test('entries from the page being linted are skipped, other pages still fire', async () => {
  const own = await site('');
  const entry = (page) => JSON.stringify({ date: '2026-09-10', idea: 'dog grooming', display: 'Familjen Grotesk', text: 'Public Sans', page });
  await writeFile(own.historyPath, entry(own.dir) + '\n');
  assert.deepEqual(hits(await lint(own.dir, { historyPath: own.historyPath })), []);
  // A single-file target reads only that file, so the face goes inline; the check stays the same.
  const inline = await site(null);
  const page = path.join(inline.dir, 'index.html');
  await writeFile(page, '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>T</title><style>h1 { font-family: "Familjen Grotesk", sans-serif; }</style></head><body><h1>Hi</h1></body></html>');
  await writeFile(inline.historyPath, entry('/some/other/page') + '\n');
  assert.equal(hits(await lint(page, { historyPath: inline.historyPath })).length, 1);
  await writeFile(inline.historyPath, entry(inline.dir) + '\n');
  assert.deepEqual(hits(await lint(page, { historyPath: inline.historyPath })), []);
  await writeFile(own.historyPath, entry(own.dir) + '\n' + entry('/some/other/page') + '\n');
  assert.equal(hits(await lint(own.dir, { historyPath: own.historyPath })).length, 1);
});

test('malformed lines do not use up the 10-entry window', async () => {
  const lines = [line('Familjen Grotesk'), ...Array.from({ length: 9 }, (_, i) => line('Fraunces', i + 1)), 'junk', '{bad'];
  const { dir, historyPath } = await site(lines.join('\n'));
  assert.equal(hits(await lint(dir, { historyPath })).length, 1);
});

test('malformed lines are skipped with one warning', async () => {
  const { dir, historyPath } = await site(['not json', '{bad', line('Fraunces')].join('\n'));
  const res = await lint(dir, { historyPath });
  assert.equal(res.warnings.filter((w) => w.rule === 'parse-error' && /history/.test(w.message)).length, 1);
  assert.deepEqual(hits(res), []);
});
