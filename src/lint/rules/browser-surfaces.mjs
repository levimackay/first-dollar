import { eachRule, htmlFiles, finding } from '../context.mjs';

export default {
  id: 'browser-surfaces',
  severity: 'warn',
  describe: 'no ::selection or :focus-visible styling',
  run(ctx) {
    const first = htmlFiles(ctx)[0];
    if (!first) return [];
    let selection = false;
    let focus = false;
    eachRule(ctx, (rule) => {
      if (/::?selection\b/i.test(rule.selector)) selection = true;
      if (/:focus-visible\b/i.test(rule.selector)) focus = true;
    });
    const out = [];
    if (!selection) out.push(finding('browser-surfaces', first, 1, 'no ::selection rule; the browser default highlight ignores the palette, so set a selection colour'));
    if (!focus) out.push(finding('browser-surfaces', first, 1, 'no :focus-visible rule; keyboard users get the browser default ring, so style a focus state that fits the design'));
    return out;
  },
};
