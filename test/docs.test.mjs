import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const skill = new URL('skills/first-dollar/', root);

async function ruleIds() {
  const dir = new URL('src/lint/rules/', root);
  let names;
  try {
    names = await readdir(dir);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  const ids = [];
  for (const name of names.filter((n) => n.endsWith('.mjs') && n !== 'index.mjs')) {
    const src = await readFile(new URL(name, dir), 'utf8');
    ids.push(src.match(/\bid:\s*['"]([\w-]+)['"]/)?.[1] ?? name.slice(0, -4));
  }
  return ids;
}

test('slop-rules.md documents every lint rule', async () => {
  const doc = await readFile(new URL('references/slop-rules.md', skill), 'utf8');
  const missing = (await ruleIds()).filter((id) => !doc.includes(`\`${id}\``));
  assert.deepEqual(missing, [], `add these rule ids to slop-rules.md: ${missing.join(', ')}`);
});

test('references, assets and credits contain no em dash', async () => {
  const files = [new URL('CREDITS.md', root)];
  for (const sub of ['references/', 'assets/']) {
    for (const name of await readdir(new URL(sub, skill))) files.push(new URL(sub + name, skill));
  }
  const hits = [];
  for (const file of files) {
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, i) => line.includes('—') && hits.push(`${file.pathname}:${i + 1}`));
  }
  assert.deepEqual(hits, []);
});
