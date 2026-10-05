import { htmlFiles, elLine, finding } from '../context.mjs';

export default {
  id: 'user-scalable',
  severity: 'fail',
  describe: 'a viewport tag that blocks pinch zoom',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      file.$('meta[name=viewport]').each((_, el) => {
        const content = String(el.attribs?.content || '');
        if (/user-scalable\s*=\s*(no|0)\b/i.test(content) || /maximum-scale\s*=\s*1(\.0*)?\s*(,|;|$)/i.test(content)) {
          out.push(finding('user-scalable', file, elLine(file, el), `viewport "${content}" stops people zooming; remove user-scalable=no and maximum-scale=1`));
        }
      });
    }
    return out;
  },
};
