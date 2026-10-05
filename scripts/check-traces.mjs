import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const PATTERNS = [/co-authored-by/i, /generated (with|by) (claude|chatgpt|gpt|copilot|an? ai)/i, /ponytail:/i, /\u{1F916}/u];
const ALLOW = ['test/fixtures/lint/ai-attribution/', 'src/lint/rules/ai-attribution.mjs', 'scripts/check-traces.mjs'];
const git = (...a) => execFileSync('git', a, { encoding: 'utf8', maxBuffer: 1 << 28 });
const hits = [];

function scan(label, text) {
  text.split('\n').forEach((line, i) => {
    if (PATTERNS.some((p) => p.test(line))) hits.push(`${label}:${i + 1}: ${line.trim().slice(0, 120)}`);
  });
}

for (const f of git('ls-files', '-z').split('\0').filter(Boolean)) {
  if (ALLOW.some((a) => f === a || f.startsWith(a))) continue;
  let buf;
  try {
    buf = readFileSync(f);
  } catch {
    continue;
  }
  if (buf.includes(0)) continue;
  scan(f, buf.toString('utf8'));
}
scan('commit-messages', git('log', '--format=%B'));

if (hits.length) {
  console.error(hits.join('\n'));
  console.error(`traces: ${hits.length} hit(s)`);
  process.exit(1);
}
console.log('traces: clean');
