// Colour parsing and perceptual distance for the lint rules. sRGB in, OKLab/OKLCH out.

const NAMED = { white: [255, 255, 255], black: [0, 0, 0] };
const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

function alphaOf(token) {
  if (token === undefined) return 1;
  const n = token.endsWith('%') ? parseFloat(token) / 100 : parseFloat(token);
  return Number.isFinite(n) ? clamp(n, 0, 1) : null;
}

function hexColor(h) {
  if (![3, 4, 6, 8].includes(h.length) || /[^0-9a-f]/i.test(h)) return null;
  const full = h.length <= 4 ? [...h].map((c) => c + c).join('') : h;
  const [r, g, b, a] = [0, 2, 4, 6].map((i) => (full.length > i ? parseInt(full.slice(i, i + 2), 16) : null));
  return { r, g, b, a: a === null ? 1 : a / 255 };
}

function hslToRgb(h, s, l) {
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [f(0), f(8), f(4)].map((v) => Math.round(clamp(v, 0, 1) * 255));
}

const toLinear = (c) => { const v = c / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
const fromLinear = (v) => Math.round(clamp(v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055, 0, 1) * 255);

function toOklab({ r, g, b }) {
  const [lr, lg, lb] = [r, g, b].map(toLinear);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  };
}

function oklchToRgb(L, C, hDeg) {
  const a = C * Math.cos((hDeg * Math.PI) / 180);
  const b = C * Math.sin((hDeg * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map(fromLinear);
}

// Splits "fn(a b c / d)" or "fn(a, b, c, d)" into its tokens, or null if it is not that function.
function args(str, names) {
  const m = new RegExp(`^(${names})\\(([^)]*)\\)$`, 'i').exec(str);
  if (!m) return null;
  const parts = m[2].trim().split(/\s*[,/]\s*|\s+/).filter(Boolean);
  return parts.length === 3 || parts.length === 4 ? parts : null;
}

const channel = (t) => (t.endsWith('%') ? (parseFloat(t) / 100) * 255 : parseFloat(t));

export function parseColor(input) {
  const str = String(input ?? '').trim().toLowerCase();
  if (str.startsWith('#')) return hexColor(str.slice(1));
  if (NAMED[str]) return { r: NAMED[str][0], g: NAMED[str][1], b: NAMED[str][2], a: 1 };

  let p = args(str, 'rgba?');
  if (p) {
    const [r, g, b] = p.slice(0, 3).map((t) => Math.round(clamp(channel(t), 0, 255)));
    const a = alphaOf(p[3]);
    return [r, g, b, a].some(Number.isNaN) || a === null ? null : { r, g, b, a };
  }
  p = args(str, 'hsla?');
  if (p) {
    const h = ((parseFloat(p[0]) % 360) + 360) % 360;
    const [r, g, b] = hslToRgb(h, parseFloat(p[1]) / 100, parseFloat(p[2]) / 100);
    const a = alphaOf(p[3]);
    return [h, r, g, b].some(Number.isNaN) || a === null ? null : { r, g, b, a };
  }
  p = args(str, 'oklch');
  if (p) {
    const L = p[0].endsWith('%') ? parseFloat(p[0]) / 100 : parseFloat(p[0]);
    const [r, g, b] = oklchToRgb(L, parseFloat(p[1]), parseFloat(p[2]));
    const a = alphaOf(p[3]);
    return [L, r, g, b].some(Number.isNaN) || a === null ? null : { r, g, b, a };
  }
  return null;
}

export function toOklch(rgb) {
  const { L, a, b } = toOklab(rgb);
  const c = Math.hypot(a, b);
  return { l: L, c, h: (((Math.atan2(b, a) * 180) / Math.PI) + 360) % 360 };
}

// Euclidean distance in OKLab; black to white is 1.
export function deltaE(x, y) {
  const p = toOklab(x);
  const q = toOklab(y);
  return Math.hypot(p.L - q.L, p.a - q.a, p.b - q.b);
}
