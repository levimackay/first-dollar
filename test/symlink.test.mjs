import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, symlinkSync, realpathSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const scripts = new URL('../skills/first-dollar/scripts/', import.meta.url).pathname;
const fail = new URL('./fixtures/lint/em-dash/fail', import.meta.url).pathname;
const tmp = realpathSync(mkdtempSync(join(tmpdir(), 'fd-link-')));
symlinkSync(join(scripts, 'first-dollar-lint.mjs'), join(tmp, 'lint-link.mjs'));
symlinkSync(join(scripts, 'first-dollar-check.mjs'), join(tmp, 'check-link.mjs'));
symlinkSync(scripts, join(tmp, 'dir-link'));

for (const lintPath of ['lint-link.mjs', 'dir-link/first-dollar-lint.mjs']) {
  test(`lint bundle lints when launched through ${lintPath}`, () => {
    const r = spawnSync('node', [join(tmp, lintPath), fail], { encoding: 'utf8' });
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stdout, /FAIL/);
  });
}

for (const checkPath of ['check-link.mjs', 'dir-link/first-dollar-check.mjs']) {
  test(`check bundle runs when launched through ${checkPath}`, () => {
    const r = spawnSync('node', [join(tmp, checkPath), '--palette'], { encoding: 'utf8' });
    assert.equal(r.status, 3, r.stdout + r.stderr);
  });
}
