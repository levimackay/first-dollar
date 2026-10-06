import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const skill = path.join(root, 'skills', 'first-dollar');

// Words that identify each eval case. If the skill's own text uses them, an eval
// agent copies the skill's example instead of designing, and the score means nothing.
const CASES = {
  'b2b-pilot': ['tidemark', 'remittance', 'dental', 'eob'],
  'consumer-preorder': ['loam', 'compost'],
  'high-ticket-loi': ['northstand', 'bleachers?'],
  'low-ticket-app': ['halves'],
  'local-service': ['ridgeback', 'sharpen\\w*'],
  'one-liner': ['piano', 'lesson notes', 'practice plan'],
};

async function files(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await files(p)));
    else if (/\.(md|html|css|js|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}

test('every eval case is listed here', async () => {
  const cases = (await readdir(path.join(root, 'evals', 'cases'))).filter((f) => f.endsWith('.md')).map((f) => f.slice(0, -3));
  assert.deepEqual(cases.sort(), Object.keys(CASES).sort());
});

test('the skill never uses an eval case as its example', async () => {
  const hits = [];
  for (const file of await files(skill)) {
    const text = await readFile(file, 'utf8');
    for (const [name, words] of Object.entries(CASES)) {
      for (const w of words) {
        const m = text.match(new RegExp(`\\b${w}\\b`, 'i'));
        if (m) hits.push(`${path.relative(root, file)}: "${m[0]}" (${name})`);
      }
    }
  }
  assert.deepEqual(hits, []);
});
