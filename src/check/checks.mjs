// Each check: (page, width) -> { id, ok, detail }. Call watch(page) before page.goto.
import { deltaE, toOklch } from '../lint/color.mjs';

// The page's overall ground against the reference's, both from full-page 1440 screenshots
// (first screen when a reference has no full capture). Takes top palette entries ({ hex, rgb, coverage }).
// Grounds are the top two clusters with at least 20% coverage; the closest pairing must be within 0.02,
// so two near-equal grounds split differently still match.
const GROUND = 0.02;
const grounds = (list) => list.filter((c, i) => i < 2 && (i === 0 || c.coverage >= 20));

export function referenceDrift(ref, page) {
  const [rg, pg] = [grounds(ref), grounds(page)];
  const pairs = [[pg[0], rg[0]], [pg[0], rg[1]], [pg[1], rg[0]]].filter(([p, r]) => p && r);
  const d = Math.min(...pairs.map(([p, r]) => deltaE(r.rgb, p.rgb)));
  const [r0, p0] = [ref[0], page[0]];
  const [lr, lp] = [toOklch(r0.rgb).l, toOklch(p0.rgb).l];
  const flipped = (lr < 0.35 && lp > 0.7) || (lp < 0.35 && lr > 0.7);
  const tinted = toOklch(r0.rgb).c < 0.008 && toOklch(p0.rgb).c > 0.012;
  const bad = d > GROUND || flipped || tinted;
  const why = flipped
    ? `lightness ${lr.toFixed(3)} vs ${lp.toFixed(3)}`
    : tinted
      ? 'tinted ground against a neutral reference'
      : `deltaE ${d.toFixed(3)} > ${GROUND}`;
  return {
    id: 'reference-drift',
    ok: !bad,
    detail: `page ${p0.hex} vs reference ${r0.hex}: ${bad ? why : `deltaE ${d.toFixed(3)}`}`,
  };
}

export function watch(page) {
  const s = (page.__fd = { errors: [], failed: [] });
  page.on('console', (m) => m.type() === 'error' && s.errors.push(m.text()));
  page.on('pageerror', (e) => s.errors.push(String(e.message || e)));
  const media = (r) => ['image', 'font'].includes(r.resourceType());
  page.on('requestfailed', (r) => media(r) && s.failed.push(r.url()));
  page.on('response', (r) => media(r.request()) && r.status() >= 400 && s.failed.push(r.url()));
}

const res = (id, bad, okDetail = '') => ({ id, ok: bad.length === 0, detail: bad.length ? bad.join('; ') : okDetail });

export async function overflow(page, width) {
  const w = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
  return { id: 'overflow', ok: !(w[0] > w[1] + 1), detail: `scrollWidth ${w[0]} vs viewport ${w[1]}` };
}

export async function consoleCheck(page) {
  return res('console', page.__fd.errors.slice(0, 5));
}

export async function brokenMedia(page) {
  const imgs = await page.evaluate(() =>
    [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src),
  );
  return res('broken-media', [...new Set([...imgs, ...page.__fd.failed])].slice(0, 5));
}

// The label can be hidden while its hatched figure remains visible. Measure the slot,
// not the label, and keep coordinates relative to the top-of-page viewport.
function collectPhotoSlots() {
  const slots = [];
  const seen = new Set();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node; (node = walker.nextNode()); ) {
    const match = /\[PLACEHOLDER:[^\]]+\]/i.exec(node.textContent);
    if (!match) continue;
    const label = node.parentElement;
    if (label.closest('script, style, noscript, template')) continue;
    const slot = label.closest('figure, [data-photo-slot], .photo-slot, .ph') || label;
    if (seen.has(slot)) continue;
    seen.add(slot);
    const bounds = slot.getBoundingClientRect();
    const box = { left: bounds.left, right: bounds.right, top: bounds.top, bottom: bounds.bottom };
    let opacity = 1;
    let visible = true;
    for (let a = slot; a; a = a.parentElement) {
      const style = getComputedStyle(a);
      opacity *= Number(style.opacity);
      if (style.display === 'none' || style.visibility !== 'visible') visible = false;
      if (a === slot) continue;
      const clip = a.getBoundingClientRect();
      if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowX)) {
        box.left = Math.max(box.left, clip.left);
        box.right = Math.min(box.right, clip.right);
      }
      if (['hidden', 'clip', 'scroll', 'auto'].includes(style.overflowY)) {
        box.top = Math.max(box.top, clip.top);
        box.bottom = Math.min(box.bottom, clip.bottom);
      }
    }
    if (!visible || opacity < 0.1 || box.right - box.left <= 1 || box.bottom - box.top <= 1) continue;
    slots.push({ label: match[0].slice(0, 80), ...box, width: box.right - box.left, height: box.bottom - box.top,
      viewportWidth: innerWidth, viewportHeight: innerHeight });
  }
  return slots;
}

export async function photoSlotAboveFold(page) {
  const slots = await page.evaluate(collectPhotoSlots);
  const bad = slots
    .filter((s) => s.bottom > 0 && s.top < s.viewportHeight && s.right > 0 && s.left < s.viewportWidth)
    .slice(0, 5)
    .map((s) => `visible photo slot "${s.label}" in first viewport`);
  return res('photo-slot-above-fold', bad);
}

export async function photoSlotPlacement(page) {
  const slots = await page.evaluate(collectPhotoSlots);
  const bad = [];
  for (const s of slots) {
    const fullBleed = s.left <= 8 && s.right >= s.viewportWidth - 8;
    const nearFullWidth = s.viewportWidth >= 1024 && s.width >= s.viewportWidth * 0.9;
    if (fullBleed || nearFullWidth) bad.push(`"${s.label}" is ${fullBleed ? 'full bleed' : 'nearly full width'} (${Math.round(s.width)}px of ${s.viewportWidth}px)`);
    if (s.height > s.viewportHeight / 3 + 1) bad.push(`"${s.label}" is ${Math.round(s.height)}px tall, over one third of the ${s.viewportHeight}px viewport`);
  }
  return res('photo-slot-placement', bad.slice(0, 5));
}

export const hiddenAfterReveal = (page) => revealed(page, 'hidden-after-reveal');

// Needs a page opened with reducedMotion: 'reduce' emulated before it loaded.
export async function reducedMotion(page) {
  await page.waitForTimeout(500);
  return revealed(page, 'reduced-motion');
}

// Wait for fonts and every finite running animation (infinite ones, like marquees, are ignored).
// Polls every 100ms, gives up after 8s so a stuck page cannot hang the run.
// Returns true when it gave up with a finite animation still running.
export async function settle(page) {
  return page.evaluate(async () => {
    await document.fonts.ready;
    const end = Date.now() + 8000;
    const busy = () =>
      document.getAnimations().some((a) => a.playState === 'running' && a.effect?.getComputedTiming().iterations !== Infinity);
    while (busy() && Date.now() < end) await new Promise((r) => setTimeout(r, 100));
    return busy();
  });
}

// URL mode: lazy images and reveals only load when scrolled into view, so scroll the whole
// page first (600px every 150ms, at most 20000px or 15s). Hold at the bottom for delayed
// observer callbacks, then return to the top and let images and animations settle.
export async function primeLazy(page) {
  await page.evaluate(async () => {
    const end = Date.now() + 15000;
    for (let y = 0; y < Math.min(document.documentElement.scrollHeight, 20000) && Date.now() < end; y += 600) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 150));
    }
    await new Promise((r) => setTimeout(r, 1500));
    scrollTo(0, 0);
  });
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
  await page.evaluate(async () => {
    const all = Promise.all([...document.images].map((i) => (i.complete ? 0 : i.decode().catch(() => {}))));
    await Promise.race([all, new Promise((r) => setTimeout(r, 8000))]);
  });
  await settle(page);
}

async function revealed(page, id) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y <= h; y += 500) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    scrollTo(0, h);
  });
  await page.waitForTimeout(600);
  const timedOut = await settle(page);
  const bad = await page.evaluate(() => {
    const out = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own || el.closest('[aria-hidden="true"]') || !el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      let opacity = 1;
      for (let e = el; e; e = e.parentElement) opacity *= +getComputedStyle(e).opacity;
      // A line mask: an ancestor that clips vertically while the text sits wholly above or below it.
      // Sideways clipping (a ticker strip) is left alone.
      const r = el.getBoundingClientRect();
      let masked = false;
      for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
        if (!['hidden', 'clip'].includes(getComputedStyle(a).overflowY)) continue;
        const b = a.getBoundingClientRect();
        if (r.bottom <= b.top + 1 || r.top >= b.bottom - 1) { masked = true; break; }
      }
      if (opacity < 0.1 || cs.visibility === 'hidden' || masked) {
        out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"${masked ? ' clipped by an ancestor' : ''}`);
      }
    }
    return out.slice(0, 5);
  });
  await page.evaluate(() => scrollTo(0, 0));
  if (bad.length && timedOut) bad.push('animations still running after 8s');
  return res(id, bad);
}

export async function commitmentAboveFold(page) {
  const top = await page.evaluate(() => {
    const el = document.querySelector('[data-commitment]');
    return el ? el.getBoundingClientRect().top : null;
  });
  if (top === null) return { id: 'commitment-above-fold', ok: false, detail: 'no [data-commitment] element' };
  return { id: 'commitment-above-fold', ok: top < 844, detail: `top ${Math.round(top)}px of 844` };
}

export async function contrast(page) {
  const bad = await page.evaluate(() => {
    const c = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
    c.canvas.width = c.canvas.height = 1;
    // Any CSS color -> [r,g,b,a], via a 1px canvas.
    const rgba = (css) => {
      c.clearRect(0, 0, 1, 1);
      c.fillStyle = '#000';
      c.fillStyle = css;
      c.fillRect(0, 0, 1, 1);
      return [...c.getImageData(0, 0, 1, 1).data];
    };
    const lum = ([r, g, b]) =>
      [r, g, b].map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0);
    const out = [];
    // Known limit: background-image (gradients, photos) is ignored; only background-color is walked.
    for (const el of document.querySelectorAll('h1, p, [data-commitment]')) {
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
      if (ratio < need) out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 24)}" ${ratio.toFixed(2)} < ${need}`);
    }
    return out.slice(0, 5);
  });
  return res('contrast', bad);
}

export async function twoLineButton(page) {
  const bad = await page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll('[data-commitment], nav a')) {
      if (!el.getClientRects().length) continue;
      // Count the line boxes the label's text occupies; box height says nothing about wrapping.
      const range = document.createRange();
      range.selectNodeContents(el);
      const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0).sort((x, y) => x.top - y.top);
      let lines = 0;
      let bottom = -Infinity;
      for (const r of rects) {
        if (r.top >= bottom - 2) lines += 1;
        bottom = Math.max(bottom, r.bottom);
      }
      if (lines >= 2) out.push(`"${el.textContent.trim().slice(0, 24)}" wraps`);
    }
    return out.slice(0, 5);
  });
  return res('two-line-button', bad);
}
