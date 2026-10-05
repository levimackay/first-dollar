import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { lint } from '../src/lint/runner.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'lint', 'centred-hero');
const hits = async (name) => {
  const res = await lint(path.join(root, name));
  return [...res.failures, ...res.warnings].filter((f) => f.rule === 'centred-hero');
};

test('centred hero with a single ask passes', async () => assert.deepEqual(await hits('pass-single'), []));
test('centred hero with one button and a plain text link passes', async () => assert.deepEqual(await hits('pass-text-link'), []));
test('a long paragraph after the headline is not a one-line subhead', async () => assert.deepEqual(await hits('pass-long-sub'), []));
test('full template (two buttons) still fails', async () => assert.equal((await hits('fail')).length, 1));
