import { eachDecl, resolveVars, parsePx, finding } from '../context.mjs';
import { parseColor, toOklch } from '../color.mjs';

const CHROMA = 0.08;
const BLUR = 16;

// Split on commas that are not inside parentheses.
function layers(value) {
  const out = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth += 1;
    else if (value[i] === ')') depth -= 1;
    else if (value[i] === ',' && depth === 0) { out.push(value.slice(start, i)); start = i + 1; }
  }
  out.push(value.slice(start));
  return out.map((s) => s.trim()).filter(Boolean);
}

export default {
  id: 'glow-shadow',
  severity: 'fail',
  describe: 'a coloured, centred, wide shadow that reads as a glow',
  run(ctx) {
    const out = [];
    eachDecl(ctx, /^(box|text)-shadow$/, (decl, unit, line) => {
      for (const layer of layers(resolveVars(ctx, decl.value))) {
        let color = '';
        const rest = layer.replace(/#[0-9a-f]{3,8}\b|[a-z-]+\([^)]*\)/gi, (m) => { color = m; return ' '; });
        const tokens = rest.split(/\s+/).filter((t) => t && t.toLowerCase() !== 'inset');
        const lengths = tokens.filter((t) => /^-?[\d.]/.test(t));
        if (!color) color = tokens.find((t) => /^[a-z]+$/i.test(t)) || '';
        const [x, y, blur] = lengths.map((l) => parsePx(l));
        if (x !== 0 || y !== 0 || blur === undefined || blur === null || blur < BLUR) continue;
        // Named colours other than black and white do not parse, so named grays are skipped.
        const rgb = parseColor(color);
        if (!rgb || toOklch(rgb).c <= CHROMA) continue;
        out.push(finding('glow-shadow', unit.file, line, `${decl.prop} with a ${blur}px coloured blur around the element reads as a glow; use a small neutral shadow or none`));
      }
    });
    return out;
  },
};
