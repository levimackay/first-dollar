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
    if (err.code === 'ENOENT') return null;
    throw err;
  }
  const ids = [];
  for (const name of names.filter((n) => n.endsWith('.mjs') && n !== 'index.mjs')) {
    const src = await readFile(new URL(name, dir), 'utf8');
    ids.push(src.match(/\bid:\s*['"]([\w-]+)['"]/)?.[1] ?? name.slice(0, -4));
  }
  return ids;
}

test('slop-rules.md documents every lint rule', async (t) => {
  const ids = await ruleIds();
  if (ids === null) return t.skip('src/lint/rules/ does not exist on this branch');
  assert.ok(ids.length > 0, 'src/lint/rules/ holds no rules');
  const doc = await readFile(new URL('references/slop-rules.md', skill), 'utf8');
  const missing = ids.filter((id) => !doc.includes(`\`${id}\``));
  assert.deepEqual(missing, [], `add these rule ids to slop-rules.md: ${missing.join(', ')}`);
});

test('references, assets and credits contain no em or en dash', async () => {
  const files = [new URL('CREDITS.md', root)];
  for (const sub of ['references/', 'assets/']) {
    const names = await readdir(new URL(sub, skill), { recursive: true });
    for (const name of names.filter((n) => /\.\w+$/.test(n))) files.push(new URL(sub + name, skill));
  }
  const hits = [];
  for (const file of files) {
    const lines = (await readFile(file, 'utf8')).split('\n');
    lines.forEach((line, i) => /[\u2013\u2014]/.test(line) && hits.push(`${file.pathname}:${i + 1}`));
  }
  assert.deepEqual(hits, []);
});
