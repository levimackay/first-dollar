import { eachRule, resolveVars, parsePx, finding } from '../context.mjs';

// True when any length in a background-size value is at or under the limit.
function sizeUnder(value, limit) {
  const lengths = (value.match(/-?\d*\.?\d+(?:px|rem)\b/gi) || []).map(parsePx);
  return lengths.length > 0 && lengths.some((n) => n !== null && n <= limit);
}

export default {
  id: 'grid-background',
  severity: 'warn',
  describe: 'a graph-paper line grid or dot grid behind the page',
  run(ctx) {
    const out = [];
    eachRule(ctx, (rule, unit, line) => {
      let image = '';
      let size = '';
      rule.each((d) => {
        if (d.type !== 'decl') return;
        const prop = d.prop.toLowerCase();
        const value = resolveVars(ctx, d.value);
        if (prop === 'background-image' || prop === 'background') {
          image += ` ${value}`;
          // `background: <layers> / <size>` carries the size after a slash.
          const slash = value.match(/\/\s*([^,]*)/);
          if (slash) size += ` ${slash[1]}`;
        }
        if (prop === 'background-size') size += ` ${value}`;
      });
      const repeating = /repeating-linear-gradient\(/i.test(image);
      const lines = (image.match(/(?<!repeating-)linear-gradient\(/gi) || []).length >= 2 && sizeUnder(size, 64);
      const dots = /radial-gradient\(/i.test(image) && sizeUnder(size, 32);
      if (repeating || lines || dots) {
        out.push(finding('grid-background', unit.file, line, `"${rule.selector}" tiles a ${dots ? 'dot' : 'line'} grid as a background; use a flat colour or a real photograph`));
      }
    });
    return out;
  },
};
