import { cssUnits, eachDecl, resolveVars, unitLine, finding } from '../context.mjs';

const BOUNCY_NAME = /bounce|elastic|wobble|jello/i;

export default {
  id: 'bounce-easing',
  severity: 'warn',
  describe: 'overshooting cubic-bezier curves and bounce keyframes',
  run(ctx) {
    const out = [];
    eachDecl(ctx, null, (decl, unit, line) => {
      const value = resolveVars(ctx, decl.value);
      for (const m of value.matchAll(/cubic-bezier\(\s*([^)]*)\)/gi)) {
        const n = m[1].split(',').map((s) => parseFloat(s));
        if (n.length !== 4 || n.some(Number.isNaN)) continue;
        if (n[1] < -0.1 || n[1] > 1.1 || n[3] < -0.1 || n[3] > 1.1) {
          out.push(finding('bounce-easing', unit.file, line, `cubic-bezier(${n.join(', ')}) overshoots and springs back; use an ease-out curve that settles`));
        }
      }
    });
    for (const unit of cssUnits(ctx)) {
      unit.root.walkAtRules(/keyframes$/i, (at) => {
        if (BOUNCY_NAME.test(at.params)) {
          out.push(finding('bounce-easing', unit.file, unitLine(unit, at), `@keyframes ${at.params} is a bounce; use an ease-out curve that settles`));
        }
      });
    }
    return out;
  },
};
