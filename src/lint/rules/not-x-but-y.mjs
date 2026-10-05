import { htmlFiles, textNodes, copyAttrs, finding } from '../context.mjs';

const PATTERNS = [
  /\bnot (?:just|only|merely) (?:an? )?[\w\s-]{1,30}[,.;:]\s*(?:but|it'?s|it is)\b/i,
  /\bit(?:'s| is) not (?:about )?[\w\s-]{1,30}[,.]\s*it(?:'s| is)\b/i,
  /(?:^|(?<=[.!?]\s))Not an? [\w-]+\.\s*An? [\w-]+\./,
];
const PLACEHOLDER = /\[(?:NEED|PLACEHOLDER):[^\]]*\]/g;

export default {
  id: 'not-x-but-y',
  severity: 'fail',
  describe: 'the "not X, but Y" contrast frame that reads as template copy',
  run(ctx) {
    const out = [];
    const check = (file, line, text) => {
      const clean = text.replace(PLACEHOLDER, ' ');
      for (const re of PATTERNS) {
        const m = re.exec(clean);
        if (m) out.push(finding('not-x-but-y', file, line, `"not X, but Y" frame: "${m[0].trim()}"; state the claim directly`, 'fail'));
      }
    };
    for (const file of htmlFiles(ctx)) {
      for (const t of textNodes(file)) check(file, t.line, t.text);
      for (const a of copyAttrs(file)) check(file, a.line, a.value);
    }
    return out;
  },
};
