import rules from './rules/index.mjs';
import { buildContext, htmlFiles } from './context.mjs';

const SEVERITIES = new Set(['fail', 'warn']);
const PARSE_ERROR = { id: 'parse-error', severity: 'warn', describe: 'a stylesheet did not parse' };

export function loadRules() {
  for (const r of rules) {
    if (!r?.id || typeof r.run !== 'function' || !SEVERITIES.has(r.severity)) {
      throw new Error(`lint rule ${r?.id ?? '?'}: must export { id, severity, describe, run }`);
    }
  }
  return rules;
}

export function normalizeFinding(rule, raw) {
  const severity = raw.severity || rule.severity;
  if (!SEVERITIES.has(severity)) throw new Error(`lint rule ${rule.id}: bad severity "${severity}"`);
  if (!raw.file) throw new Error(`lint rule ${rule.id}: finding without a file`);
  if (raw.rule !== rule.id) throw new Error(`lint rule ${rule.id}: finding declares rule "${raw.rule}"`);
  const line = Math.max(1, Math.round(Number(raw.line) || 1));
  return { rule: rule.id, severity, file: raw.file, line, message: String(raw.message || rule.describe) };
}

export async function lint(dir, opts = {}) {
  const ctx = await buildContext(dir, opts);
  const failures = [];
  const warnings = [];
  for (const raw of ctx.parseErrors) warnings.push(normalizeFinding(PARSE_ERROR, raw));
  for (const rule of loadRules()) {
    let produced;
    try {
      produced = (await rule.run(ctx)) || [];
    } catch (err) {
      throw new Error(`lint rule ${rule.id} threw: ${err.message}`);
    }
    for (const raw of produced) {
      const f = normalizeFinding(rule, raw);
      (f.severity === 'fail' ? failures : warnings).push(f);
    }
  }
  const order = (a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1);
  failures.sort(order);
  warnings.sort(order);
  return { ok: failures.length === 0, failures, warnings, htmlCount: htmlFiles(ctx).length };
}
