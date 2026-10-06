import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir, mkdtemp, writeFile, readFile, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFile } from 'node:child_process';
import path from 'node:path';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lint, loadRules, normalizeFinding } from '../src/lint/runner.mjs';
import { buildContext } from '../src/lint/context.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixtures = path.join(here, 'fixtures', 'lint');

// One distinctive run, long enough to trip the 8-word window in reference-copy.
const REFERENCE = [
  'we build storage buildings that outlast the weather and the paperwork',
  'a short run',
];

// A fixture that carries a history.jsonl runs with --history pointing at it.
const withHistory = (dir) => {
  const historyPath = path.join(dir, 'history.jsonl');
  return { referenceTexts: REFERENCE, ...(existsSync(historyPath) && { historyPath }) };
};

const all = (res) => [...res.failures, ...res.warnings];

// A directory no rule has anything to say about.
const CLEAN_DIR = path.join(fixtures, 'legal-links', 'pass');

const dirs = (await readdir(fixtures, { withFileTypes: true }))
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

test('every rule has a fixture directory and every fixture directory has a rule', () => {
  const ids = loadRules().map((r) => r.id).sort();
  assert.deepEqual(ids, dirs);
});

test('rules declare a describe string', () => {
  for (const rule of loadRules()) {
    assert.equal(typeof rule.describe, 'string', `${rule.id} needs a describe`);
    assert.ok(rule.describe.length > 0);
  }
});

for (const id of dirs) {
  test(`${id}: pass fixture is clean`, async () => {
    const res = await lint(path.join(fixtures, id, 'pass'), withHistory(path.join(fixtures, id, 'pass')));
    const hits = all(res).filter((f) => f.rule === id);
    assert.deepEqual(
      hits.map((f) => `${path.basename(f.file)}:${f.line} ${f.message}`),
      [],
      `${id} fired on its own pass fixture`,
    );
  });

  test(`${id}: fail fixture is caught`, async () => {
    const res = await lint(path.join(fixtures, id, 'fail'), withHistory(path.join(fixtures, id, 'fail')));
    const hits = all(res).filter((f) => f.rule === id);
    assert.ok(hits.length >= 1, `${id} missed its own fail fixture`);
    for (const f of hits) {
      assert.ok(typeof f.file === 'string' && f.file.length > 0, `${id} finding needs a file`);
      assert.ok(Number.isInteger(f.line) && f.line >= 1, `${id} finding needs a line >= 1, got ${f.line}`);
      assert.ok(typeof f.message === 'string' && f.message.length > 0, `${id} finding needs a message`);
      assert.ok(['fail', 'warn'].includes(f.severity));
    }
  });

  test(`${id}: fail fixture line points inside the file`, async () => {
    const res = await lint(path.join(fixtures, id, 'fail'), withHistory(path.join(fixtures, id, 'fail')));
    for (const f of all(res).filter((x) => x.rule === id)) {
      // A rule that judges the run as a whole names the directory; it has no line to point at.
      if ((await stat(f.file)).isDirectory()) {
        assert.equal(f.line, 1, `${id} named a directory, so its line must be 1`);
        continue;
      }
      const lines = (await readFile(f.file, 'utf8')).split('\n');
      assert.ok(f.line <= lines.length, `${id} line ${f.line} past end of ${path.basename(f.file)}`);
    }
  });
}

test('fail-severity rules report failures, warn-severity rules report warnings', async () => {
  for (const rule of loadRules()) {
    const res = await lint(path.join(fixtures, rule.id, 'fail'), withHistory(path.join(fixtures, rule.id, 'fail')));
    const bucket = rule.severity === 'fail' ? res.failures : res.warnings;
    assert.ok(bucket.some((f) => f.rule === rule.id), `${rule.id} landed in the wrong bucket`);
  }
});

async function siteDir(files) {
  const dir = await mkdtemp(path.join(tmpdir(), 'fdlint-'));
  for (const [name, text] of Object.entries(files)) await writeFile(path.join(dir, name), text);
  return dir;
}

const hitsFor = (res, id) => all(res).filter((f) => f.rule === id);

test('a clean directory passes', async () => {
  const res = await lint(CLEAN_DIR, { referenceTexts: REFERENCE });
  assert.equal(res.ok, true);
  assert.deepEqual(res.failures, []);
});

test('a stylesheet that will not parse is reported, not dropped', async () => {
  const dir = await siteDir({
    'broken.css': 'body { color: #123456; }\n',
    'index.html': '<!doctype html><html><body><style>h1 { color: red; }</style></body></html>\n',
  });
  const res = await lint(dir, {
    parse: () => {
      throw new Error('parser gave up');
    },
  });
  const hits = hitsFor(res, 'parse-error');
  assert.equal(hits.length, 2, 'the css file and the inline style block each report');
  for (const f of hits) {
    assert.equal(f.severity, 'warn');
    assert.equal(f.line, 1);
    assert.match(f.message, /parser gave up/);
  }
  assert.deepEqual(hits.map((f) => path.basename(f.file)).sort(), ['broken.css', 'index.html']);
});

test('a DESIGN.md at the root is picked up unless a path is passed', async () => {
  const withDesign = await siteDir({ 'index.html': '<!doctype html><p>hi</p>', 'DESIGN.md': '# design\n' });
  const without = await siteDir({ 'index.html': '<!doctype html><p>hi</p>' });
  assert.equal(path.basename((await buildContext(withDesign)).designPath), 'DESIGN.md');
  assert.equal((await buildContext(without)).designPath, null);
  assert.equal((await buildContext(withDesign, { designPath: '/x/OTHER.md' })).designPath, '/x/OTHER.md');
});

test('a finding whose rule id is not the module id is rejected', () => {
  const rule = { id: 'em-dash', severity: 'fail', describe: 'em dash' };
  assert.throws(
    () => normalizeFinding(rule, { rule: 'banned-font-family', file: 'a.css', line: 3, message: 'x' }),
    /em-dash: finding declares rule "banned-font-family"/,
  );
  assert.throws(() => normalizeFinding(rule, { rule: 'em-dash', file: 'a.css', severity: 'loud' }), /bad severity/);
  assert.throws(() => normalizeFinding(rule, { rule: 'em-dash', message: 'x' }), /without a file/);
  assert.deepEqual(normalizeFinding(rule, { rule: 'em-dash', file: 'a.css', line: 3, message: 'x' }), {
    rule: 'em-dash',
    severity: 'fail',
    file: 'a.css',
    line: 3,
    message: 'x',
  });
});

const cli = path.join(here, '..', 'src', 'lint', 'cli.mjs');
const runCli = (...args) =>
  new Promise((resolve) => execFile(process.execPath, [cli, ...args], (err, stdout, stderr) => resolve({ code: err ? err.code : 0, stdout, stderr })));

test('cli exits 1 and prints a FAIL line on a failing directory, 0 on a clean one', async () => {
  const bad = await runCli(path.join(fixtures, 'em-dash', 'fail'));
  assert.equal(bad.code, 1);
  assert.match(bad.stdout, /^FAIL .*\[em-dash\]/m);
  const clean = await runCli(CLEAN_DIR);
  assert.equal(clean.code, 0);
  assert.match(clean.stdout, /lint: 0 failures/);
});

test('cli refuses a directory with no html unless told otherwise', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'fdlint-empty-'));
  const refused = await runCli(dir);
  assert.equal(refused.code, 1);
  assert.match(refused.stderr, /no html files/);
  assert.equal((await runCli(dir, '--allow-no-html')).code, 0);
});

test('cli --reference-text flags lifted copy', async () => {
  const dir = await siteDir({
    'index.html': '<!doctype html><html lang="en"><body><main><p>we build storage buildings that outlast the weather and the paperwork</p></main></body></html>',
  });
  const ref = path.join(dir, 'ref.txt');
  await writeFile(ref, `${REFERENCE[0]}\n`);
  const res = await runCli(dir, '--reference-text', ref);
  assert.equal(res.code, 1);
  assert.match(res.stdout, /\[reference-copy\]/);
});

test('cli exits 2 with usage on a missing option value or a path that does not exist', async () => {
  for (const args of [
    [CLEAN_DIR, '--design'],
    [CLEAN_DIR, '--reference-text'],
    [CLEAN_DIR, '--design', '--json'],
    [CLEAN_DIR, '--design', path.join(tmpdir(), 'fdlint-nope.md')],
    [CLEAN_DIR, '--reference-text', path.join(tmpdir(), 'fdlint-nope.txt')],
    [path.join(tmpdir(), 'fdlint-no-such-dir')],
    [CLEAN_DIR, '--bogus'],
  ]) {
    const r = await runCli(...args);
    assert.equal(r.code, 2, args.join(' '));
    assert.match(r.stderr, /usage: first-dollar-lint/);
  }
});

test('cli --rank works without a built site and exits 1 on a family to avoid', async () => {
  const popular = await runCli('--rank', 'Outfit');
  assert.equal(popular.code, 1);
  assert.match(popular.stdout, /#31 of 1950.*top 200.*snapshot.*; choose another family/);
  for (const family of ['Arial', 'Gloock']) assert.equal((await runCli('--rank', family)).code, 1, family);
  const free = await runCli('--rank', 'Wix Madefor Text');
  assert.equal(free.code, 0);
  assert.match(free.stdout, /outside the top 200/);
  assert.equal((await runCli('--rank', 'Not A Catalogued Face')).code, 0);
  const missing = await runCli('--rank');
  assert.equal(missing.code, 2);
});
