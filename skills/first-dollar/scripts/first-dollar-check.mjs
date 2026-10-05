// src/check/cli.mjs
import { mkdirSync, writeFileSync, existsSync as existsSync2 } from "node:fs";
import { resolve as resolve2, join as join3 } from "node:path";

// src/check/browser.mjs
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { delimiter, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
var NOT_VERIFIED_NO_BROWSER = "not verified: no browser. Install once with: npm i --prefix ~/.cache/first-dollar playwright-core";
var cacheDir = () => process.env.FIRST_DOLLAR_CACHE || join(homedir(), ".cache", "first-dollar");
function loadPlaywright() {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const base2 of [process.cwd(), here, cacheDir()]) {
    const req = createRequire(join(base2, "noop.js"));
    for (const name of ["playwright-core", "playwright"]) {
      try {
        return req(name);
      } catch {
      }
    }
  }
  return null;
}
function findChrome() {
  if (process.env.FIRST_DOLLAR_CHROME) {
    return existsSync(process.env.FIRST_DOLLAR_CHROME) ? process.env.FIRST_DOLLAR_CHROME : null;
  }
  const fixed = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  ];
  for (const p of fixed) if (existsSync(p)) return p;
  const exts = process.platform === "win32" ? [".exe", ""] : [""];
  for (const bin of ["google-chrome", "google-chrome-stable", "chromium"]) {
    for (const dir of (process.env.PATH || "").split(delimiter)) {
      for (const ext of exts) if (dir && existsSync(join(dir, bin + ext))) return join(dir, bin + ext);
    }
  }
  return null;
}
function resolveBrowser() {
  const pw = loadPlaywright();
  if (!pw) return null;
  let exe = findChrome();
  if (!exe && !process.env.FIRST_DOLLAR_CHROME) {
    try {
      const own = pw.chromium.executablePath();
      if (own && existsSync(own)) exe = own;
    } catch {
    }
  }
  return exe ? { chromium: pw.chromium, exe } : null;
}
async function launch({ chromium, exe }) {
  return chromium.launch({ executablePath: exe, headless: true });
}

// src/check/serve.mjs
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, join as join2, extname, sep } from "node:path";
var TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2"
};
function serve(dir) {
  const root = resolve(dir);
  const server2 = createServer(async (req, res2) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      const file = resolve(join2(root, p));
      if (file !== root && !file.startsWith(root + sep)) throw new Error("outside root");
      const body = await readFile(file);
      res2.writeHead(200, { "content-type": TYPES[extname(file).toLowerCase()] || "application/octet-stream" });
      res2.end(body);
    } catch {
      res2.writeHead(req.url === "/favicon.ico" ? 204 : 404).end();
    }
  });
  return new Promise(
    (ok) => server2.listen(
      0,
      "127.0.0.1",
      () => ok({ url: `http://127.0.0.1:${server2.address().port}/`, close: () => new Promise((d) => server2.close(d)) })
    )
  );
}

// src/check/checks.mjs
function watch(page) {
  const s = page.__fd = { errors: [], failed: [] };
  page.on("console", (m) => m.type() === "error" && s.errors.push(m.text()));
  page.on("pageerror", (e) => s.errors.push(String(e.message || e)));
  const media = (r) => ["image", "font"].includes(r.resourceType());
  page.on("requestfailed", (r) => media(r) && s.failed.push(r.url()));
  page.on("response", (r) => media(r.request()) && r.status() >= 400 && s.failed.push(r.url()));
}
var res = (id, bad, okDetail = "") => ({ id, ok: bad.length === 0, detail: bad.length ? bad.join("; ") : okDetail });
async function overflow(page, width) {
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  return { id: "overflow", ok: !(w[0] > w[1] + 1), detail: `scrollWidth ${w[0]} vs viewport ${w[1]}` };
}
async function consoleCheck(page) {
  return res("console", page.__fd.errors.slice(0, 5));
}
async function brokenMedia(page) {
  const imgs = await page.evaluate(
    () => [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src)
  );
  return res("broken-media", [.../* @__PURE__ */ new Set([...imgs, ...page.__fd.failed])].slice(0, 5));
}
async function hiddenAfterReveal(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    scrollTo(0, h);
  });
  await page.waitForTimeout(600);
  const bad = await page.evaluate(() => {
    const out2 = [];
    for (const el of document.body.querySelectorAll("*")) {
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE"].includes(el.tagName)) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own || el.closest('[aria-hidden="true"]') || !el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      let opacity = 1;
      for (let e = el; e; e = e.parentElement) opacity *= +getComputedStyle(e).opacity;
      if (opacity < 0.1 || cs.visibility === "hidden") {
        out2.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`);
      }
    }
    return out2.slice(0, 5);
  });
  await page.evaluate(() => scrollTo(0, 0));
  return res("hidden-after-reveal", bad);
}
async function commitmentAboveFold(page) {
  const top = await page.evaluate(() => {
    const el = document.querySelector("[data-commitment]");
    return el ? el.getBoundingClientRect().top : null;
  });
  if (top === null) return { id: "commitment-above-fold", ok: false, detail: "no [data-commitment] element" };
  return { id: "commitment-above-fold", ok: top < 844, detail: `top ${Math.round(top)}px of 844` };
}
async function contrast(page) {
  const bad = await page.evaluate(() => {
    const c = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    c.canvas.width = c.canvas.height = 1;
    const rgba = (css) => {
      c.clearRect(0, 0, 1, 1);
      c.fillStyle = "#000";
      c.fillStyle = css;
      c.fillRect(0, 0, 1, 1);
      return [...c.getImageData(0, 0, 1, 1).data];
    };
    const lum = ([r, g, b]) => [r, g, b].map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const out2 = [];
    for (const el of document.querySelectorAll("h1, p, [data-commitment]")) {
      if (!el.textContent.trim() || !el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      let bg = [255, 255, 255];
      for (let e = el; e; e = e.parentElement) {
        const b = rgba(getComputedStyle(e).backgroundColor);
        if (b[3] > 0) {
          bg = b.slice(0, 3);
          break;
        }
      }
      const fg = rgba(cs.color).slice(0, 3);
      const [hi, lo] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      const ratio = (hi + 0.05) / (lo + 0.05);
      const need = parseFloat(cs.fontSize) < 24 ? 4.5 : 3;
      if (ratio < need) out2.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 24)}" ${ratio.toFixed(2)} < ${need}`);
    }
    return out2.slice(0, 5);
  });
  return res("contrast", bad);
}
async function twoLineButton(page) {
  const bad = await page.evaluate(() => {
    const out2 = [];
    for (const el of document.querySelectorAll("[data-commitment], nav a")) {
      if (!el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      const lh = cs.lineHeight === "normal" ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
      const inner = el.getBoundingClientRect().height - ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"].reduce((a, k) => a + parseFloat(cs[k]), 0);
      if (inner > lh * 1.8) out2.push(`"${el.textContent.trim().slice(0, 24)}" wraps`);
    }
    return out2.slice(0, 5);
  });
  return res("two-line-button", bad);
}

// src/check/cli.mjs
var WIDTHS = [320, 390, 768, 1440, 1920];
var args = process.argv.slice(2);
var flag = (n) => args.includes(n);
var outFlag = args.indexOf("--out");
var target = args.find((a, i) => !a.startsWith("--") && args[i - 1] !== "--out");
var fail = (e) => stop(`not verified: ${String(e?.message ?? e).split("\n")[0]}`, 3);
process.on("uncaughtException", fail);
process.on("unhandledRejection", fail);
function stop(msg, code) {
  console.log(msg);
  process.exit(code);
}
if (!target) stop("not verified: usage: first-dollar-check <dir|url> [--out <dir>] [--og] [--shots-only] [--json]", 3);
var isUrl = /^https?:\/\//i.test(target);
var shotsOnly = isUrl || flag("--shots-only");
var out = resolve2(
  outFlag >= 0 ? args[outFlag + 1] : isUrl ? join3(".first-dollar", "reference", new URL(target).host) : join3(target, ".first-dollar", "check")
);
if (!isUrl && !existsSync2(join3(target, "index.html"))) stop(`not verified: ${target}/index.html not found`, 3);
var found = resolveBrowser();
if (!found) stop(NOT_VERIFIED_NO_BROWSER, 3);
var browser;
try {
  browser = await launch(found);
} catch (e) {
  stop(`not verified: browser failed to launch (${String(e.message).split("\n")[0]})`, 3);
}
mkdirSync(out, { recursive: true });
var server = isUrl ? null : await serve(target);
var base = isUrl ? target : server.url;
var results = [];
var loaded = false;
async function open(width, height, url) {
  const page = await browser.newPage({ viewport: { width, height } });
  watch(page);
  const response = await page.goto(url, { waitUntil: "load", timeout: 3e4 });
  if (!response || response.status() >= 400) throw new Error(`${url} answered ${response ? response.status() : "nothing"}`);
  await page.waitForTimeout(300);
  loaded = true;
  return page;
}
try {
  const widths = shotsOnly ? [1440, 390] : WIDTHS;
  for (const w of widths) {
    const page = await open(w, w === 390 ? 844 : 900, base);
    if (!shotsOnly) {
      const list = [overflow];
      if (w === 390 || w === 1440) list.push(consoleCheck, brokenMedia, contrast, twoLineButton);
      if (w === 390) list.push(commitmentAboveFold);
      list.push(hiddenAfterReveal);
      const wanted = w === 390 || w === 1440 ? list : [overflow];
      for (const fn of wanted) results.push({ ...await fn(page, w), width: w });
    }
    if (w === 390 || w === 1440) {
      await page.screenshot({ path: join3(out, `${w}.png`) });
      await page.screenshot({ path: join3(out, `full-${w}.png`), fullPage: true });
    }
    await page.close();
  }
  if (flag("--og") && !isUrl) {
    const ogPath = existsSync2(join3(target, ".first-dollar", "og.html")) ? ".first-dollar/og.html" : "og.html";
    const page = await open(1200, 630, base + ogPath);
    await page.screenshot({ path: join3(out, "og.png") });
    await page.close();
  }
} catch (e) {
  await browser.close();
  await server?.close();
  stop(`not verified: page failed to load (${String(e.message).split("\n")[0]})`, 3);
}
await browser.close();
await server?.close();
if (!loaded) stop("not verified: page never loaded", 3);
var report = { verified: true, checks: results };
writeFileSync(join3(out, "check.json"), JSON.stringify(report, null, 2));
if (flag("--json")) console.log(JSON.stringify(report, null, 2));
else {
  for (const c of results) console.log(`${c.ok ? "ok  " : "FAIL"} ${c.id} @${c.width}${c.detail ? " " + c.detail : ""}`);
  console.log(`screenshots: ${out}`);
}
process.exit(results.every((c) => c.ok) ? 0 : 1);
