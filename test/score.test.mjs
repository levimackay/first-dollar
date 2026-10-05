import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyAsk, extractUnconfirmed, hueBucket, meanPairwiseDeltaE, hrefIsReal } from '../evals/score.mjs';

test('classifyAsk', () => {
  assert.equal(classifyAsk('Pre-order for $49'), 'money');
  assert.equal(classifyAsk('Start a 90-day pilot'), 'money');
  assert.equal(classifyAsk('Join the waitlist'), 'free');
  assert.equal(classifyAsk('Reserve your spot'), 'money');
  assert.equal(classifyAsk('Ask about the 90-day pilot'), 'contact');
  assert.equal(classifyAsk('Email us'), 'contact');
  assert.equal(classifyAsk('Book a call'), 'contact');
  assert.equal(classifyAsk(null), 'none');
});

test('hrefIsReal', () => {
  assert.equal(hrefIsReal('https://pay.example.org/x'), true);
  assert.equal(hrefIsReal('https://example.com/x'), false);
  assert.equal(hrefIsReal('#pilot'), false);
  assert.equal(hrefIsReal('mailto:a@b.co'), false);
});

test('extractUnconfirmed ignores numbers present in the case text', () => {
  const kase = 'Ask: a 90-day paid pilot for $1,500. 2 to 6 chairs.';
  assert.deepEqual(extractUnconfirmed('Pilot $1,500 for 90 days, 6 chairs. Save 37% and 1,500.', kase), ['37%']);
});

test('hueBucket', () => {
  assert.equal(hueBucket({ r: 128, g: 128, b: 128, a: 1 }), 'achromatic');
  assert.equal(hueBucket({ r: 255, g: 0, b: 0, a: 1 }), hueBucket({ r: 240, g: 20, b: 10, a: 1 }));
  assert.notEqual(hueBucket({ r: 255, g: 0, b: 0, a: 1 }), hueBucket({ r: 0, g: 0, b: 255, a: 1 }));
});

test('meanPairwiseDeltaE', () => {
  const w = { r: 255, g: 255, b: 255, a: 1 }, k = { r: 0, g: 0, b: 0, a: 1 };
  assert.ok(Math.abs(meanPairwiseDeltaE([w, k]) - 1) < 1e-6);
  assert.equal(meanPairwiseDeltaE([w, w, w]), 0);
  assert.equal(meanPairwiseDeltaE([w]), null);
});
