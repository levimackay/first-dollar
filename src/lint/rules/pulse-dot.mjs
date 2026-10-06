import { cssUnits, eachRule, resolveVars, parsePx, finding } from '../context.mjs';

const PULSE_NAME = /pulse|ping|blink|glow/i;
const LIMIT = 16;

export default {
  id: 'pulse-dot',
  severity: 'warn',
  describe: 'a small dot with a pulsing, pinging or blinking animation',
  run(ctx) {
    const names = new Set();
    for (const unit of cssUnits(ctx)) {
      unit.root.walkAtRules(/keyframes$/i, (at) => {
        if (PULSE_NAME.test(at.params)) names.add(at.params.trim());
      });
    }
    if (!names.size) return [];
    const out = [];
    eachRule(ctx, (rule, unit, line) => {
      let used = null;
      let width = null;
      let height = null;
      rule.each((d) => {
        if (d.type !== 'decl') return;
        const prop = d.prop.toLowerCase();
        const value = resolveVars(ctx, d.value);
        if (prop === 'animation' || prop === 'animation-name') {
          used = [...names].find((n) => new RegExp(`(^|[\\s,])${n}($|[\\s,])`).test(value)) || used;
        }
        if (prop === 'width') width = parsePx(value);
        if (prop === 'height') height = parsePx(value);
      });
      if (!used) return;
      const known = width !== null && height !== null;
      if (known && (width > LIMIT || height > LIMIT)) return;
      out.push(finding('pulse-dot', unit.file, line, `"${rule.selector}" runs "${used}" on ${known ? 'a small dot' : 'an element of unknown size'}; a pulsing dot is a stock "live" signal, so drop the animation or show real status text`));
    });
    return out;
  },
};
