import test from 'node:test';
import assert from 'node:assert/strict';
import { parseColor, toOklch, deltaE, hueDeltaE } from '../src/lint/color.mjs';

test('indigo lands in the blue-violet hue range', () => {
  const { h } = toOklch(parseColor('#6366f1'));
  assert.ok(h > 270 && h < 285, `hue was ${h}`);
});

test('space syntax with a percent alpha parses', () => {
  assert.equal(parseColor('rgb(0 0 0 / 50%)').a, 0.5);
});

test('colours that are not a fixed value return null', () => {
  for (const v of ['transparent', 'currentColor', 'inherit', 'nonsense', '']) assert.equal(parseColor(v), null, v);
});

test('hex forms, hsl, oklch and names', () => {
  assert.deepEqual(parseColor('#fff'), { r: 255, g: 255, b: 255, a: 1 });
  assert.equal(parseColor('#ff000080').a.toFixed(2), '0.50');
  assert.deepEqual(parseColor('rgba(10, 20, 30, 0.25)'), { r: 10, g: 20, b: 30, a: 0.25 });
  assert.deepEqual(parseColor('hsl(120 100% 25%)'), { r: 0, g: 128, b: 0, a: 1 });
  const o = parseColor('oklch(100% 0 0)');
  assert.ok(o.r >= 254 && o.g >= 254 && o.b >= 254);
  assert.deepEqual(parseColor('white'), { r: 255, g: 255, b: 255, a: 1 });
  assert.deepEqual(parseColor('black'), { r: 0, g: 0, b: 0, a: 1 });
});

test('deltaE is zero for equal colours and about one for black vs white', () => {
  assert.equal(deltaE(parseColor('#123456'), parseColor('#123456')), 0);
  const d = deltaE(parseColor('black'), parseColor('white'));
  assert.ok(d > 0.99 && d < 1.01, `delta was ${d}`);
});

test('normalized OKLab distance treats a pale yellow tint as the banner hue, not a neutral', () => {
  assert.ok(hueDeltaE(parseColor('#fbcc0a'), parseColor('#fff1a8')) < 0.04);
  assert.equal(hueDeltaE(parseColor('#fafafa'), parseColor('#fbcc0a')), null);
});
