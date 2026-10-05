import { resolveBrowser, launch } from '../src/check/browser.mjs';

export const found = resolveBrowser();

// Draws a PNG from html through a real page screenshot.
export async function makePng(html, file, size = { width: 400, height: 300 }) {
  const browser = await launch(found);
  const page = await browser.newPage({ viewport: size });
  await page.setContent(`<body style="margin:0">${html}</body>`);
  await page.screenshot({ path: file });
  await browser.close();
}
