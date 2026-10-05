import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { lint } from '../src/lint/runner.mjs';

const fixtures = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures', 'lint', 'commitment-cta');

async function findings(sub) {
  const res = await lint(path.join(fixtures, sub));
  return [...res.failures, ...res.warnings].filter((f) => f.rule === 'commitment-cta');
}

test('a priced checkout link passes, and legal pages are never judged', async () => {
  const hits = await findings('pass');
  assert.deepEqual(hits.map((f) => `${path.basename(f.file)}: ${f.message}`), []);
});

// Each fail fixture shows one way a button can look like an ask without being one.
const MODES = {
  'index.html': 'no-commitment',
  'dead-link.html': 'dead-link',
  'email-only.html': 'email-only',
  'waitlist.html': 'waitlist',
  'no-price.html': 'no-price',
  'coming-soon.html': 'coming-soon',
  'email-consent.html': 'email-only',
  'submit-value.html': 'waitlist',
};

for (const [file, mode] of Object.entries(MODES)) {
  test(`${file} is caught as ${mode}`, async () => {
    const hits = (await findings('fail')).filter((f) => path.basename(f.file) === file);
    const messages = hits.map((f) => f.message);
    assert.ok(
      messages.some((m) => m.startsWith(`${mode}:`)),
      `expected a "${mode}: ..." finding in ${file}, got ${JSON.stringify(messages)}`
    );
    for (const f of hits) assert.equal(f.severity, 'fail');
  });
}

// A form that asks for more than an email (a name, a card) is not a free signup.
for (const [name, fields] of Object.entries({
  'email and name': '<input type="email" name="email"><input type="text" name="name">',
  'email and card': '<input type="email" name="email"><input type="text" name="card">',
})) {
  test(`${name} is not email-only`, async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'cta-'));
    await writeFile(path.join(dir, 'index.html'), `<!doctype html><html><body><form>${fields}<button data-commitment>Reserve for $49</button></form></body></html>`);
    const res = await lint(dir);
    const hits = [...res.failures, ...res.warnings].filter((f) => f.rule === 'commitment-cta');
    assert.deepEqual(hits.map((f) => f.message), []);
  });
}
