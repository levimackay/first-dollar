// Google Fonts specimen pages render no sample text headless, so build our own page and screenshot it.
export const SAMPLE = 'Sphinx of black quartz, judge my vow. 0123456789 $1,500';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function specimenHtml(family, text = SAMPLE) {
  const href = `https://fonts.googleapis.com/css2?family=${family.trim().replace(/\s+/g, '+')}:wght@400;700;900&display=block`;
  const rows = [96, 48, 18]
    .flatMap((px) => [400, 700, 900].map((w) => `<div style="font:${w} ${px}px/1.2 '${family}';margin:0 0 8px">${esc(text)}</div>`))
    .join('\n');
  return `<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="${esc(href)}"><body style="margin:24px;background:#fff;color:#111">${rows}</body>`;
}

// Resolves true only when a real @font-face for the family loaded. document.fonts.check() alone is
// true for an unknown family (no faces to load), so it is paired with a look at the loaded faces.
export async function loaded(page, family) {
  return page.evaluate(async (fam) => {
    const within = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);
    await within(Promise.all([400, 700, 900].map((w) => document.fonts.load(`${w} 48px "${fam}"`).catch(() => []))), 10000);
    await within(document.fonts.ready, 5000);
    const face = [...document.fonts].some((f) => f.family.replace(/["']/g, '') === fam && f.status === 'loaded');
    return face && document.fonts.check(`700 48px "${fam}"`);
  }, family);
}
