// Scores eval runs. Same method for every arm. Usage: node evals/score.mjs [--runs <dir>]
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, writeFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseColor, deltaE, toOklch } from '../src/lint/color.mjs';
import { resolveBrowser, launch } from '../src/check/browser.mjs';

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ARMS = ['plain', 'prompted', 'first-dollar'];
const SKIP_RULES = new Set(['commitment-cta', 'design-tokens', 'reference-copy']);

const MONEY = /[$£€]\s?\d|pre-?order|deposit|reserve|letter of intent|\bLOI\b|pilot|pre-?pay|buy|book/i;
const CONTACT = /ask about|talk to|contact|email us|get in touch|questions|schedule a call|book a call/i;
const CONVENTION_CHECKS = new Set(['commitment-above-fold']);
const FREE = /waitlist|wait list|early access|notify|sign up|get started|free trial|join|subscribe|learn more|contact|email|demo/i;

export function classifyAsk(text) {
  if (!text) return 'none';
  if (CONTACT.test(text)) return 'contact';
  if (MONEY.test(text)) return 'money';
  return FREE.test(text) ? 'free' : 'other';
}

export const hrefIsReal = (h) => /^https?:\/\//i.test(h || '') && !/example\.com/i.test(h);

const normNum = (t) => t.toLowerCase().replace(/\s+/g, '').replace(/^\$/, '').replace(/[.,]+$/, '');
const numTokens = (s) => (String(s).match(/\$?\d[\d,.]*\s?(%|x|k|m)?/gi) || []).map(normNum);

// Tokens on the page that never appear in the case file. A list for a human to confirm.
export function extractUnconfirmed(pageText, caseText) {
  const known = new Set(numTokens(caseText));
  return [...new Set(numTokens(pageText))].filter((t) => !known.has(t));
}

// OKLCH hue rounded to 30 degrees; low chroma is one shared achromatic bucket.
export function hueBucket(rgb) {
  const { c, h } = toOklch(rgb);
  return c < 0.04 ? 'achromatic' : (Math.round(h / 30) * 30) % 360;
}

export function meanPairwiseDeltaE(colors) {
  let sum = 0, n = 0;
  for (let i = 0; i < colors.length; i++) for (let j = i + 1; j < colors.length; j++) { sum += deltaE(colors[i], colors[j]); n++; }
  return n ? sum / n : null;
}

function runNode(script, args) {
  const r = spawnSync('node', [join(REPO, 'skills/first-dollar/scripts', script), ...args], { encoding: 'utf8', maxBuffer: 64e6 });
  try { return JSON.parse(r.stdout); } catch { return null; }
}

// Runs in the page. Returns raw facts; classification stays in Node.
function pageProbe() {
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const rgb = (s) => { cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = s; cx.fillRect(0, 0, 1, 1); const d = cx.getImageData(0, 0, 1, 1).data; return d[3] ? `rgb(${d[0]}, ${d[1]}, ${d[2]})` : null; };
  const clear = (s) => { const m = /rgba?\(([^)]*)\)/.exec(s); return !m ? s === 'transparent' : (m[1].split(/[,\s/]+/)[3] ?? '1') === '0'; };
  const bgOf = (el) => { const s = getComputedStyle(el).backgroundColor; return clear(s) ? null : rgb(s); };
  const page = bgOf(document.body) || bgOf(document.documentElement) || 'rgb(255, 255, 255)';

  let h = document.querySelector('h1');
  if (!h) {
    let best = 0;
    for (const el of document.body.querySelectorAll('*')) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs > best) { best = fs; h = el; }
    }
  }
  const family = h ? getComputedStyle(h).fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '') : '';

  const cands = [];
  [...document.querySelectorAll('a, button')].forEach((el, order) => {
    const text = (el.innerText || '').replace(/\s+/g, ' ').trim();
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (!text || r.width * r.height <= 0 || cs.visibility === 'hidden' || cs.display === 'none') return;
    if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return;
    const bg = bgOf(el);
    const border = parseFloat(cs.borderTopWidth) > 0 && !clear(cs.borderTopColor) && cs.borderTopStyle !== 'none';
    if (el.closest('nav') && !bg && !border) return;
    cands.push({ text, href: el.tagName === 'A' ? el.getAttribute('href') || '' : '', area: r.width * r.height, order, color: bg || (border ? rgb(cs.borderTopColor) : rgb(cs.color)) });
  });
  cands.sort((a, b) => b.area - a.area || a.order - b.order);
  return { background: page, family, ask: cands[0] || null, text: document.body.innerText };
}

async function scoreRun(dir, kase, caseText, browser) {
  const row = { case: kase, arm: dir.arm };
  if (!existsSync(join(dir.path, 'index.html'))) return { ...row, status: 'missing' };
  const lint = runNode('first-dollar-lint.mjs', [dir.path, '--json']);
  const findings = lint ? [...lint.failures, ...lint.warnings].filter((f) => !SKIP_RULES.has(f.rule)) : [];
  const fails = findings.filter((f) => f.severity === 'fail');
  const byRule = {};
  for (const f of fails) byRule[f.rule] = (byRule[f.rule] || 0) + 1;
  row.slop = { fails: fails.length, warns: findings.length - fails.length, byRule };

  const chk = runNode('first-dollar-check.mjs', [dir.path, '--out', join(dir.path, '.first-dollar/check'), '--json']);
  const failedIds = chk?.verified ? [...new Set(chk.checks.filter((c) => !c.ok).map((c) => c.id))] : [];
  row.rendered = { verified: !!chk?.verified, failed: failedIds.filter((id) => !CONVENTION_CHECKS.has(id)) };
  row.convention = { failed: failedIds.filter((id) => CONVENTION_CHECKS.has(id)) };

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await page.goto(pathToFileURL(join(dir.path, 'index.html')).href, { waitUntil: 'load' });
    await page.waitForTimeout(500);
    const p = await page.evaluate(pageProbe);
    const a = p.ask;
    row.ask = { type: a ? classifyAsk(a.text) : 'none', text: a?.text ?? null, href: a?.href ?? null, hrefReal: a ? hrefIsReal(a.href) : false };
    row.unconfirmedNumbers = extractUnconfirmed(p.text, caseText);
    row.look = { background: p.background, displayFamily: p.family, ctaColor: a?.color ?? null };
    row.status = 'scored';
  } catch (e) {
    row.status = 'error: ' + e.message.split('\n')[0];
  } finally { await page.close(); }
  return row;
}

function sameness(rows) {
  const ok = rows.filter((r) => r.look);
  const bgs = ok.map((r) => parseColor(r.look.background)).filter(Boolean);
  const hues = ok.map((r) => r.look.ctaColor && parseColor(r.look.ctaColor)).filter(Boolean).map(hueBucket);
  return {
    pages: ok.length,
    uniqueDisplayFamilies: new Set(ok.map((r) => r.look.displayFamily.toLowerCase())).size,
    meanBackgroundDeltaE: meanPairwiseDeltaE(bgs),
    uniqueCtaHueBuckets: new Set(hues).size,
    totals: {
      slopFails: ok.reduce((n, r) => n + r.slop.fails, 0),
      moneyAsks: ok.filter((r) => r.ask.type === 'money').length,
      contactAsks: ok.filter((r) => r.ask.type === 'contact').length,
      missing: rows.filter((r) => r.status === 'missing').length,
    },
  };
}

const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
function markdown(res) {
  const out = ['# first-dollar eval results', '', `Generated ${res.generatedAt}.`, ''];
  for (const arm of ARMS) {
    out.push(`## ${arm}`, '', '| Case | Slop fails | Rendered | Ask | Unconfirmed numbers |', '|---|---|---|---|---|');
    for (const r of res.runs.filter((x) => x.arm === arm)) {
      if (r.status === 'missing') { out.push(`| ${r.case} | missing | missing | missing | missing |`); continue; }
      if (!r.slop || !r.ask) { out.push(`| ${r.case} | ${esc(r.status)} | | | |`); continue; }
      const rend = r.rendered.verified ? (r.rendered.failed.length ? `${r.rendered.failed.length} failed (${r.rendered.failed.join(', ')})` : '0 failed') : 'not verified';
      out.push(`| ${r.case} | ${r.slop.fails} | ${rend} | ${r.ask.type}: "${esc(r.ask.text)}" | ${r.unconfirmedNumbers.length} |`);
    }
    out.push('');
  }
  out.push('## Summary', '', '| Arm | Pages scored | Slop fails (total) | Money asks | Contact asks | Unique display families | Mean background deltaE | Unique CTA hue buckets |', '|---|---|---|---|---|---|---|---|');
  for (const arm of ARMS) {
    const s = res.arms[arm];
    out.push(`| ${arm} | ${s.pages} | ${s.totals.slopFails} | ${s.totals.moneyAsks} of ${s.pages} | ${s.totals.contactAsks} | ${s.uniqueDisplayFamilies} of ${s.pages} | ${s.meanBackgroundDeltaE?.toFixed(3) ?? 'n/a'} | ${s.uniqueCtaHueBuckets} |`);
  }
  out.push('', '## Method', '',
    '1. Slop: the bundled lint on each run, minus the convention rules commitment-cta, design-tokens and reference-copy.',
    '2. Rendered: the bundled rendered checks at their own widths; every failed check id counts except commitment-above-fold, which keys off the data-commitment convention (like the three excluded lint rules) and is recorded separately as `convention` in results.json.',
    '3. Ask: at 1440x900, the largest visible button or link in the first viewport (nav links only if styled as buttons), classified money / contact / free / other / none by one text pattern for every arm (contact is checked before money).',
    '4. Unconfirmed numbers: number tokens in the visible text that are absent from the case file. A list for a human to confirm, not a count of inventions.',
    '5. Look: body background, first h1 font family and the ask button color, compared across each arm\'s pages.',
    '', 'Losing rows stay in the tables.', '');
  return out.join('\n');
}

async function main() {
  const i = process.argv.indexOf('--runs');
  const runsDir = resolve(i > 0 ? process.argv[i + 1] : join(REPO, 'evals/runs'));
  const evalsDir = dirname(runsDir);
  const b = resolveBrowser();
  if (!b) throw new Error('no browser found (see src/check/browser.mjs)');
  const browser = await launch(b);
  const rows = [];
  for (const kase of readdirSync(runsDir).filter((d) => statSync(join(runsDir, d)).isDirectory()).sort()) {
    const caseFile = join(evalsDir, 'cases', kase + '.md');
    const caseText = existsSync(caseFile) ? readFileSync(caseFile, 'utf8') : '';
    for (const arm of ARMS) {
      rows.push(await scoreRun({ arm, path: join(runsDir, kase, arm) }, kase, caseText, browser));
      console.error(kase, arm, rows.at(-1).status);
    }
  }
  await browser.close();
  const res = {
    generatedAt: new Date().toISOString(),
    method: 'Universal lint rules + rendered checks + one ask heuristic + unconfirmed-number list + look fingerprint, identical for every arm. See results.md.',
    runs: rows,
    arms: Object.fromEntries(ARMS.map((a) => [a, sameness(rows.filter((r) => r.arm === a))])),
  };
  writeFileSync(join(evalsDir, 'results.json'), JSON.stringify(res, null, 2) + '\n');
  writeFileSync(join(evalsDir, 'results.md'), markdown(res));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
