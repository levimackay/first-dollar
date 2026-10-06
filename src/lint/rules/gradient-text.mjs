import { eachRule, resolveVars, finding } from '../context.mjs';

export default {
  id: 'gradient-text',
  severity: 'fail',
  describe: 'text filled with a gradient through background-clip',
  run(ctx) {
    const out = [];
    eachRule(ctx, (rule, unit, line) => {
      let clip = null;
      let gradient = false;
      rule.each((d) => {
        if (d.type !== 'decl') return;
        const prop = d.prop.toLowerCase();
        if ((prop === 'background-clip' || prop === '-webkit-background-clip') && /\btext\b/i.test(d.value)) clip = d;
        if ((prop === 'background' || prop === 'background-image') && /gradient\(/i.test(resolveVars(ctx, d.value))) gradient = true;
      });
      if (clip && gradient) {
        out.push(finding('gradient-text', unit.file, line, `"${rule.selector}" fills text with a gradient; use one solid colour and let size and weight carry the emphasis`));
      }
    });
    return out;
  },
};
