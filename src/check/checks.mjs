// Each check: (page, width) -> { id, ok, detail }. Call watch(page) before page.goto.

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

export async function hiddenAfterReveal(page) {
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
    const out = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own || el.closest('[aria-hidden="true"]') || !el.getClientRects().length) continue;
      const cs = getComputedStyle(el);
      let opacity = 1;
      for (let e = el; e; e = e.parentElement) opacity *= +getComputedStyle(e).opacity;
      if (opacity < 0.1 || cs.visibility === 'hidden') {
        out.push(`${el.tagName.toLowerCase()} "${el.textContent.trim().slice(0, 30)}"`);
      }
    }
    return out.slice(0, 5);
  });
  await page.evaluate(() => scrollTo(0, 0));
  return res('hidden-after-reveal', bad);
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
      const cs = getComputedStyle(el);
      const lh = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
      const inner = el.getBoundingClientRect().height - ['paddingTop', 'paddingBottom', 'borderTopWidth', 'borderBottomWidth'].reduce((a, k) => a + parseFloat(cs[k]), 0);
      if (inner > lh * 1.8) out.push(`"${el.textContent.trim().slice(0, 24)}" wraps`);
    }
    return out.slice(0, 5);
  });
  return res('two-line-button', bad);
}
