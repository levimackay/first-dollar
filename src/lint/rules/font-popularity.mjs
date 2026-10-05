// A typeface that is one of the 200 most used on Google Fonts, or one that has become
// the default of agent-built pages, reads as unchosen. The ranking is a snapshot taken
// by scripts/refresh-font-popularity.mjs and bundled into the lint.
import data from '../data/font-popularity.json' with { type: 'json' };
import { cssUnits, eachDecl, htmlFiles, elLine, unitLine, resolveVars, finding } from '../context.mjs';
import { BANNED, LINK_BANNED } from './banned-font-family.mjs';

const TOP = 200;
const GENERIC = new Set(['serif', 'sans-serif', 'monospace', 'cursive', 'fantasy', 'system-ui', 'math', 'emoji', 'fangsong', 'inherit', 'initial', 'unset', 'revert', 'revert-layer']);
const ranks = new Map(Object.entries(data.families).map(([name, v]) => [name.toLowerCase(), v[0]]));
const trend = new Set(data.trend.map((n) => n.toLowerCase()));
const total = Object.keys(data.families).length;
const NOTE = "use the reference's own face or a close match outside the top 200";

// Returns the message when the family should not lead a page, else null.
function judge(name) {
  const key = name.toLowerCase();
  if (!key || GENERIC.has(key) || key.startsWith('ui-') || BANNED.includes(key)) return null;
  const rank = ranks.get(key);
  if (rank !== undefined && rank <= TOP) return `"${name}" is #${rank} of ${total} Google Fonts by popularity (snapshot ${data.snapshot}); ${NOTE}`;
  if (trend.has(key)) return `"${name}" is a face agent-built pages default to (snapshot ${data.snapshot}); ${NOTE}`;
  return null;
}

// Every family a Google Fonts URL names: `family=A:wght@400&family=B` and `family=A|B`.
function urlFamilies(url) {
  if (!/fonts\.googleapis\.com/i.test(url)) return [];
  let text = url;
  try {
    text = decodeURIComponent(url);
  } catch {}
  const out = [];
  for (const m of text.matchAll(/family=([^&"')]+)/gi)) {
    for (const part of m[1].split('|')) out.push(part.split(':')[0].replace(/\+/g, ' ').trim());
  }
  return out;
}

export default {
  id: 'font-popularity',
  severity: 'fail',
  describe: 'a top-200 Google Font, or a face agent-built pages default to',
  run(ctx) {
    const out = [];
    const seen = new Set();
    const report = (file, line, raw) => {
      const family = raw.trim().replace(/^["']|["']$/g, '').trim();
      const msg = judge(family);
      const key = `${file.path}|${family.toLowerCase()}`;
      if (!msg || seen.has(key) || LINK_BANNED.includes(family.toLowerCase())) return;
      seen.add(key);
      out.push(finding('font-popularity', file, line, msg));
    };
    eachDecl(ctx, /^font-family$/, (decl, unit, line) => {
      report(unit.file, line, resolveVars(ctx, decl.value).split(',')[0] || '');
    });
    for (const file of htmlFiles(ctx)) {
      file.$('link[href]').each((_, el) => {
        for (const fam of urlFamilies(el.attribs.href || '')) report(file, elLine(file, el), fam);
      });
    }
    for (const unit of cssUnits(ctx)) {
      unit.root.walkAtRules(/^import$/i, (rule) => {
        for (const fam of urlFamilies(String(rule.params || ''))) report(unit.file, unitLine(unit, rule), fam);
      });
    }
    return out;
  },
};
