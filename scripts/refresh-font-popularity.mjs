// Rewrites src/lint/data/font-popularity.json from the Google Fonts metadata feed.
// Run: node scripts/refresh-font-popularity.mjs   (the lint bundle carries the result)
import { writeFile } from 'node:fs/promises';

const SOURCE = 'fonts.google.com/metadata/fonts';

// Faces that read as "AI-made" however popular the feed says they are. Hand-kept.
const TREND = [
  'Satoshi', 'General Sans', 'Clash Display', 'Clash Grotesk', 'Cabinet Grotesk', 'Switzer', 'Gloock',
  'Martian Mono', 'Darker Grotesque', 'Georgia', 'Iowan Old Style', 'Palatino', 'Palatino Linotype',
  'Avenir', 'Avenir Next', 'Helvetica', 'Times New Roman', 'Verdana', 'Trebuchet MS',
];

const res = await fetch(`https://${SOURCE}`);
if (!res.ok) throw new Error(`${SOURCE} answered ${res.status}`);
const body = (await res.text()).replace(/^\)\]\}'\n/, '');
const list = JSON.parse(body).familyMetadataList;
if (!Array.isArray(list) || list.length < 1000) throw new Error('unexpected metadata shape');

const families = {};
for (const f of list.sort((a, b) => a.family.localeCompare(b.family))) {
  families[f.family] = [f.popularity, String(f.category).toLowerCase()];
}
const out = { snapshot: new Date().toISOString().slice(0, 10), source: SOURCE, families, trend: TREND };
await writeFile(new URL('../src/lint/data/font-popularity.json', import.meta.url), JSON.stringify(out) + '\n');
console.log(`font-popularity: ${list.length} families, snapshot ${out.snapshot}`);
