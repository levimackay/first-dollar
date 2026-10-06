// Renders the README's images from the eval pages and results, so every picture and number
// in the README can be rebuilt from what the agents produced. Run: npm run readme:media
import { readFile, writeFile, mkdir, readdir, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { serve } from '../src/check/serve.mjs';
import { resolveBrowser, launch } from '../src/check/browser.mjs';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'media', 'readme');
const runs = path.join(root, 'evals', 'runs');
const results = JSON.parse(await readFile(path.join(root, 'evals', 'results.json'), 'utf8'));
const run = (c, a) => results.runs.find((r) => r.case === c && r.arm === a);

const HERO_CASE = 'high-ticket-loi';
const GALLERY = ['b2b-pilot', 'consumer-preorder', 'high-ticket-loi', 'low-ticket-app', 'local-service', 'one-liner'];
const MOTION = ['mechanism-sequence', 'split-line-reveal', 'pinned-mask-reveal', 'stroke-draw', 'spring-settle', 'ring-fill'];

const browser = resolveBrowser();
if (!browser) throw new Error('needs playwright-core and Chrome (see the checker setup)');
const chrome = await launch(browser);
await mkdir(out, { recursive: true });

// Draws a labeled box over each region the page should be judged by; only the screenshot changes.
function markPage(kind) {
  const boxes = [];
  const add = (r, label, tone, below) => r.width && r.bottom > 0 && r.top < innerHeight && boxes.push({ r, label, tone, below });
  if (kind === 'tells') {
    for (const el of document.body.querySelectorAll('*')) {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
      if (!/mono/i.test(getComputedStyle(el).fontFamily)) continue;
      // Running text (a sentence) set in mono is prose; a short line, often uppercased by CSS, is a label.
      const words = el.textContent.trim().split(/\s+/).length;
      add(el.getBoundingClientRect(), words >= 8 ? 'mono prose' : 'mono label', 'fail');
    }
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walk.nextNode()); ) {
      for (let i = n.textContent.indexOf('—'); i >= 0; i = n.textContent.indexOf('—', i + 1)) {
        const range = document.createRange();
        range.setStart(n, i);
        range.setEnd(n, i + 1);
        add(range.getBoundingClientRect(), 'em dash', 'fail', true);
      }
    }
  } else {
    const ask = document.querySelector('[data-commitment]');
    if (ask) add(ask.getBoundingClientRect(), 'the ask', 'ask', true);
  }
  const layer = document.createElement('div');
  layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:2147483647';
  for (const { r, label, tone, below } of boxes) {
    const c = tone === 'fail' ? '#d1242f' : '#1a7f37';
    const b = document.createElement('div');
    b.style.cssText = `position:absolute;left:${r.left + scrollX - 4}px;top:${r.top + scrollY - 4}px;width:${r.width + 8}px;height:${r.height + 8}px;border:3px solid ${c};border-radius:4px`;
    const tag = document.createElement('span');
    tag.textContent = label;
    tag.style.cssText = `position:absolute;left:-3px;${below ? 'top:calc(100% + 3px)' : 'top:-24px'};background:${c};color:#fff;font:600 13px/1 -apple-system,system-ui,sans-serif;padding:4px 6px;border-radius:3px;white-space:nowrap`;
    b.append(tag);
    layer.append(b);
  }
  document.body.append(layer);
}

async function shoot(dir, file, { marks, width = 1440, height = 900 } = {}) {
  const site = await serve(dir);
  const ctx = await chrome.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(site.url, { waitUntil: 'networkidle', timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(800);
  if (marks) await page.evaluate(markPage, marks);
  await page.screenshot({ path: file });
  await ctx.close();
  await site.close();
}

async function render(html, file, width, height) {
  const ctx = await chrome.newContext({ viewport: { width, height }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, omitBackground: true });
  await ctx.close();
}

const THEMES = {
  light: { ground: '#ffffff', ink: '#1f2328', muted: '#59636e', line: '#d1d9e0' },
  dark: { ground: '#0d1117', ink: '#f0f6fc', muted: '#9198a1', line: '#3d444d' },
};
const FONT = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Besley:wght@700;900&display=block">';
const base = (t) => `*{margin:0;box-sizing:border-box}body{background:${t.ground};color:${t.ink};font:400 17px/1.45 -apple-system,system-ui,sans-serif}
  .display{font-family:Besley,serif;font-weight:900;letter-spacing:-.02em}.muted{color:${t.muted}}code{font:500 12px ui-monospace,Menlo,monospace}`;
const uri = async (f) => `data:image/png;base64,${(await readFile(f)).toString('base64')}`;

// 1. The hero: the same idea built by a carefully prompted agent and by first-dollar.
const tmp = await mkdtemp(path.join(tmpdir(), 'fd-readme-'));
const left = path.join(tmp, 'prompted.png');
const right = path.join(tmp, 'first-dollar.png');
await shoot(path.join(runs, HERO_CASE, 'prompted'), left, { marks: 'tells' });
await shoot(path.join(runs, HERO_CASE, 'first-dollar'), right, { marks: 'ask' });
const P = run(HERO_CASE, 'prompted');
const F = run(HERO_CASE, 'first-dollar');
const askLine = (r) => (r.ask.type === 'money' ? `asks for it: “${r.ask.text}”` : 'no ask on the first screen');
for (const [name, t] of Object.entries(THEMES)) {
  const col = (who, how, img, n, ask) => `<figure>
      <p class="display who">${who}</p><p class="muted how">${how}</p>
      <img src="${img}"><p class="stat"><b class="display">${n}</b> lint failures, ${ask}</p></figure>`;
  await render(`<!doctype html><html><head>${FONT}<style>${base(t)}
    .row{display:grid;grid-template-columns:1fr 1fr;gap:36px;padding:6px 6px 2px}
    .who{font-size:38px;line-height:1}.how{margin:8px 0 14px;font-size:18px}
    img{display:block;width:100%;border:1px solid ${t.line};border-radius:6px}
    .stat{margin-top:12px;font-size:19px;line-height:1.3}.stat b{font-size:34px;margin-right:4px}</style></head><body><div class="row">
    ${col('A careful prompt', 'Given the reference and told not to look AI-made.', await uri(left), P.slop.fails, askLine(P))}
    ${col('first-dollar', 'The same idea and the same reference, run through the skill.', await uri(right), F.slop.fails, askLine(F))}
    </div></body></html>`, path.join(out, `hero-${name}.png`), 1200, 610);
}

// 2. How it works: the seven stages, with the one stop and the gates.
const STAGES = [
  ['Brief', 'Who buys, the ask and its price, the number that means stop.', 'BRIEF.md'],
  ['Copy', 'Every word, written before any design.', 'COPY.md'],
  ['Reference', 'A site you like, captured top to bottom.', 'reference/'],
  ['Design system', 'Fonts, colors and spacing sampled from it.', 'DESIGN.md'],
  ['Rough cut', 'The first screen only. Then it stops for your yes.', 'index.html'],
  ['Build', 'The full page, the motion and a fresh-eyes critic.', 'index.html'],
  ['Ship kit', 'Share card, the list of what you still owe, deploy on request.', 'PLACEHOLDERS.md'],
];
for (const [name, t] of Object.entries(THEMES)) {
  await render(`<!doctype html><html><head>${FONT}<style>${base(t)}
    .row{display:grid;grid-template-columns:repeat(7,1fr);gap:0;padding:10px 6px}
    .st{padding:0 14px 0 0;border-top:3px solid ${t.ink}}.st.stop{border-top-color:#d1242f}
    .n{font-size:42px;line-height:1.1;margin-top:10px}.name{font-family:Besley,serif;font-weight:700;font-size:18px;line-height:1.2;margin:2px 0 6px;white-space:nowrap}
    .what{font-size:14px;line-height:1.35;min-height:96px}.gate{grid-column:5 / span 2;margin-top:16px;padding-top:8px;border-top:1px solid ${t.line};font-size:14px}
    .stopnote{color:#d1242f;font-weight:600}</style></head><body><div class="row">
    ${STAGES.map(([n, w, f], i) => `<div class="st${i === 4 ? ' stop' : ''}"><p class="display n">${i + 1}</p><p class="name">${n}</p><p class="what muted">${w}</p><code>${f}</code></div>`).join('')}
    <p class="gate">The lint and the browser check gate stages 5 and 6. A failed check is fixed or reported, never skipped.</p>
    </div></body></html>`, path.join(out, `stages-${name}.png`), 1100, 330);
}

// 3. The gallery: first-dollar pages only (no third-party screenshots in this repo).
for (const c of GALLERY) await shoot(path.join(runs, c, 'first-dollar'), path.join(out, `page-${c}.png`));

// 4. Motion: the recipe recordings as looping GIFs, cropped to where the motion happens.
// Frames where most of the picture changes are scrolls and are left out of the box.
function motionBox(src) {
  // The finished state's content: pixels unlike the page ground in the last frame.
  const [W, H] = [360, 225];
  const raw = execFileSync('ffmpeg', ['-loglevel', 'error', '-sseof', '-0.4', '-i', src, '-frames:v', '1', '-vf', `scale=${W}:${H},format=gray`, '-f', 'rawvideo', '-'], { maxBuffer: 1 << 24 });
  const counts = new Array(256).fill(0);
  for (const v of raw) counts[v]++;
  const ground = counts.indexOf(Math.max(...counts));
  const xs = [], ys = [];
  for (let i = 0; i < W * H; i++) if (Math.abs(raw[i] - ground) > 14) xs.push(i % W), ys.push(Math.floor(i / W));
  if (xs.length < 50) return null;
  const cut = (a) => { a.sort((p, q) => p - q); return [a[Math.floor(a.length * 0.02)], a[Math.floor(a.length * 0.98)]]; };
  const [[x0, x1], [y0, y1]] = [cut(xs), cut(ys)];
  // Pad, then grow to 16:10 and at least 45% of the width, inside the frame.
  let w = Math.max((x1 - x0) * 1.15, W * 0.45), h = Math.max((y1 - y0) * 1.15, w / 1.6);
  w = Math.max(w, h * 1.6);
  [w, h] = [Math.min(w, W), Math.min(h, H)];
  const cx = Math.min(Math.max((x0 + x1) / 2, w / 2), W - w / 2), cy = Math.min(Math.max((y0 + y1) / 2, h / 2), H - h / 2);
  const k = 1440 / W;
  return [w, h, cx - w / 2, cy - h / 2].map((v) => Math.round((v * k) / 2) * 2);
}
for (const m of MOTION) {
  const src = path.join(root, 'media', 'motion', `${m}.webm`);
  if (!existsSync(src)) continue;
  const box = motionBox(src);
  const crop = box ? `crop=${box.join(':')},` : '';
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf',
    `${crop}fps=12,scale=600:-2:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle`,
    '-loop', '0', path.join(out, `motion-${m}.gif`)]);
  console.log(m, box ? `crop ${box.join(':')}` : 'no crop');
}

await chrome.close();

// 5. The eval table in README.md, between its markers, from results.json.
const arms = ['plain', 'prompted', 'first-dollar'];
const per = (a) => results.runs.filter((r) => r.arm === a);
const row = (label, f) => `| ${label} | ${arms.map(f).join(' | ')} |`;
const table = [
  `| | ${arms.join(' | ')} |`,
  '|---|---|---|---|',
  row('Lint failures, all six pages', (a) => results.arms[a].totals.slopFails),
  row('Main button asks for money', (a) => `${results.arms[a].totals.moneyAsks} of ${results.arms[a].pages}`),
  row('Pages failing a browser check', (a) => `${per(a).filter((r) => r.rendered.failed.length).length} of ${results.arms[a].pages}`),
  row('Different headline fonts across the six', (a) => results.arms[a].uniqueDisplayFamilies),
].join('\n');
const readme = path.join(root, 'README.md');
const md = await readFile(readme, 'utf8');
await writeFile(readme, md.replace(/(<!-- evals:start -->\n)[^]*?(\n<!-- evals:end -->)/, `$1${table}$2`));
console.log('wrote', (await readdir(out)).join(', '));
