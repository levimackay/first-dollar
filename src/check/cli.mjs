import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { resolveBrowser, launch, NOT_VERIFIED_NO_BROWSER } from './browser.mjs';
import { serve } from './serve.mjs';
import * as C from './checks.mjs';
import { palette } from './palette.mjs';

const WIDTHS = [320, 390, 768, 1440, 1920];
const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const outFlag = args.indexOf('--out');
const target = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');

// Anything that is not a check result (bad args, bad URL, unwritable dir, server failure) is "not verified".
let browser;
// Close the browser first (best effort, never longer than 3s) so no Chromium outlives the run.
const fail = async (e) => {
  await Promise.race([Promise.resolve(browser?.close()).catch(() => {}), new Promise((r) => setTimeout(r, 3000))]);
  stop(`not verified: ${String(e?.message ?? e).split('\n')[0]}`, 3);
};
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);

function stop(msg, code) {
  console.log(msg);
  process.exit(code);
}

const paletteAt = args.indexOf('--palette');
if (paletteAt >= 0) {
  const image = args[paletteAt + 1];
  if (!image || image.startsWith('--')) stop('not verified: usage: first-dollar-check --palette <image.png> [--json]', 3);
  if (!existsSync(image)) stop(`not verified: ${image} not found`, 3);
  const found = resolveBrowser();
  if (!found) stop(NOT_VERIFIED_NO_BROWSER, 3);
  browser = await launch(found);
  const colors = (await palette(browser, image)).map(({ hex, coverage }) => ({ hex, coverage }));
  await browser.close();
  if (flag('--json')) stop(JSON.stringify({ colors }, null, 2), 0);
  stop(colors.map((c) => `${c.hex}  ${c.coverage.toFixed(1)}%`).join('\n'), 0);
}

if (!target) stop('not verified: usage: first-dollar-check <dir|url> [--out <dir>] [--og] [--shots-only] [--json]', 3);

const isUrl = /^https?:\/\//i.test(target);
const shotsOnly = isUrl || flag('--shots-only');
const out = resolve(
  outFlag >= 0 ? args[outFlag + 1] : isUrl ? join('.first-dollar', 'reference', new URL(target).host) : join(target, '.first-dollar', 'check'),
);

if (!isUrl && !existsSync(join(target, 'index.html'))) stop(`not verified: ${target}/index.html not found`, 3);

const found = resolveBrowser();
if (!found) stop(NOT_VERIFIED_NO_BROWSER, 3);

try {
  browser = await launch(found);
} catch (e) {
  stop(`not verified: browser failed to launch (${String(e.message).split('\n')[0]})`, 3);
}

mkdirSync(out, { recursive: true });
const server = isUrl ? null : await serve(target);
const base = isUrl ? target : server.url;
const results = [];
let loaded = false;

async function open(width, height, url) {
  const page = await browser.newPage({ viewport: { width, height } });
  C.watch(page);
  const response = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  if (!response || response.status() >= 400) throw new Error(`${url} answered ${response ? response.status() : 'nothing'}`);
  await page.waitForTimeout(300);
  loaded = true;
  return page;
}

try {
  const widths = shotsOnly ? [1440, 390] : WIDTHS;
  for (const w of widths) {
    const page = await open(w, w === 390 ? 844 : 900, base);
    if (!shotsOnly) {
      const list = [C.overflow];
      if (w === 390 || w === 1440) list.push(C.consoleCheck, C.brokenMedia, C.contrast, C.twoLineButton);
      if (w === 390) list.push(C.commitmentAboveFold);
      list.push(C.hiddenAfterReveal); // scrolls, so it runs last
      const wanted = w === 390 || w === 1440 ? list : [C.overflow];
      for (const fn of wanted) results.push({ ...(await fn(page, w)), width: w });
    }
    if (w === 390 || w === 1440) {
      await page.screenshot({ path: join(out, `${w}.png`) });
      await page.screenshot({ path: join(out, `full-${w}.png`), fullPage: true });
    }
    await page.close();
  }
  if (flag('--og') && !isUrl) {
    const ogPath = existsSync(join(target, '.first-dollar', 'og.html')) ? '.first-dollar/og.html' : 'og.html';
    const page = await open(1200, 630, base + ogPath);
    await page.screenshot({ path: join(out, 'og.png') });
    await page.close();
  }
} catch (e) {
  await browser.close();
  await server?.close();
  stop(`not verified: page failed to load (${String(e.message).split('\n')[0]})`, 3);
}
await browser.close();
await server?.close();

if (!loaded) stop('not verified: page never loaded', 3);

const report = { verified: true, checks: results };
writeFileSync(join(out, 'check.json'), JSON.stringify(report, null, 2));
if (flag('--json')) console.log(JSON.stringify(report, null, 2));
else {
  for (const c of results) console.log(`${c.ok ? 'ok  ' : 'FAIL'} ${c.id} @${c.width}${c.detail ? ' ' + c.detail : ''}`);
  console.log(`screenshots: ${out}`);
}
process.exit(results.every((c) => c.ok) ? 0 : 1);
