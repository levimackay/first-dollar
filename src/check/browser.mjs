import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const NOT_VERIFIED_NO_BROWSER =
  'not verified: no browser. Install once with: npm i --prefix ~/.cache/first-dollar playwright-core@1.63.0';

const cacheDir = () => process.env.FIRST_DOLLAR_CACHE || join(homedir(), '.cache', 'first-dollar');

function loadPlaywright() {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const base of [process.cwd(), here, cacheDir()]) {
    const req = createRequire(join(base, 'noop.js'));
    for (const name of ['playwright-core', 'playwright']) {
      try {
        return req(name);
      } catch {}
    }
  }
  return null;
}

function findChrome() {
  // An explicit override is authoritative: if it points nowhere, we do not guess.
  if (process.env.FIRST_DOLLAR_CHROME) {
    return existsSync(process.env.FIRST_DOLLAR_CHROME) ? process.env.FIRST_DOLLAR_CHROME : null;
  }
  const fixed = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ];
  for (const p of fixed) if (existsSync(p)) return p;
  const exts = process.platform === 'win32' ? ['.exe', ''] : [''];
  for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium']) {
    for (const dir of (process.env.PATH || '').split(delimiter)) {
      for (const ext of exts) if (dir && existsSync(join(dir, bin + ext))) return join(dir, bin + ext);
    }
  }
  return null;
}

// Returns { chromium, exe } or null when Playwright or a browser is missing.
export function resolveBrowser() {
  const pw = loadPlaywright();
  if (!pw) return null;
  let exe = findChrome();
  if (!exe && !process.env.FIRST_DOLLAR_CHROME) {
    try {
      const own = pw.chromium.executablePath();
      if (own && existsSync(own)) exe = own;
    } catch {}
  }
  return exe ? { chromium: pw.chromium, exe } : null;
}

export async function launch({ chromium, exe }) {
  return chromium.launch({ executablePath: exe, headless: true });
}
