// Dominant colors of an image. The pixels are counted inside a page (a canvas is the
// one decoder the checker already has), then near-identical buckets are merged here.
import { readFileSync } from 'node:fs';
import { deltaE } from '../lint/color.mjs';

const MERGE = 0.03;

const hex = ({ r, g, b }) => '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');

// 5 bits per channel buckets, each carrying the true mean of its pixels.
async function buckets(page, pngPath) {
  const src = `data:image/png;base64,${readFileSync(pngPath).toString('base64')}`;
  return page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await img.decode();
    const scale = Math.min(1, 240 / img.width);
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(img.width * scale));
    c.height = Math.max(1, Math.round(img.height * scale));
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, c.width, c.height);
    const d = ctx.getImageData(0, 0, c.width, c.height).data;
    const map = new Map();
    for (let i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 128) continue;
      const k = ((d[i] >> 3) << 10) | ((d[i + 1] >> 3) << 5) | (d[i + 2] >> 3);
      const b = map.get(k) || { r: 0, g: 0, b: 0, n: 0 };
      b.r += d[i];
      b.g += d[i + 1];
      b.b += d[i + 2];
      b.n += 1;
      map.set(k, b);
    }
    return [...map.values()];
  }, src);
}

// Greedy merge: the biggest bucket seeds a color, smaller ones within deltaE 0.03 join it.
export function merge(list) {
  const total = list.reduce((s, b) => s + b.n, 0) || 1;
  const sorted = list
    .map((b) => ({ r: Math.round(b.r / b.n), g: Math.round(b.g / b.n), b: Math.round(b.b / b.n), n: b.n }))
    .sort((x, y) => y.n - x.n);
  const clusters = [];
  for (const b of sorted) {
    const home = clusters.find((c) => deltaE(c, b) < MERGE);
    if (home) home.n += b.n;
    else clusters.push({ ...b });
  }
  return clusters
    .sort((x, y) => y.n - x.n)
    .map((c) => ({ hex: hex(c), coverage: Math.round((c.n / total) * 1000) / 10, rgb: { r: c.r, g: c.g, b: c.b } }));
}

export async function palette(browser, pngPath, count = 6) {
  const page = await browser.newPage();
  try {
    return merge(await buckets(page, pngPath)).slice(0, count);
  } finally {
    await page.close();
  }
}
