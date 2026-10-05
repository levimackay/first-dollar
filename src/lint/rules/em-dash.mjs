import { htmlFiles, textNodes, copyAttrs, finding } from '../context.mjs';

const EM = '\u2014';
const EN = '\u2013';

export default {
  id: 'em-dash',
  severity: 'fail',
  describe: 'em dashes in copy (en dashes are a warning)',
  run(ctx) {
    const out = [];
    const check = (file, line, text, where) => {
      if (text.includes(EM)) {
        out.push(finding('em-dash', file, line, `em dash in ${where}; rewrite the sentence`, 'fail'));
      } else if (text.includes(EN)) {
        out.push(finding('em-dash', file, line, `en dash in ${where}; check it is a range and not a dash habit`, 'warn'));
      }
    };
    for (const file of htmlFiles(ctx)) {
      for (const t of textNodes(file)) check(file, t.line, t.text, 'copy');
      for (const a of copyAttrs(file)) check(file, a.line, a.value, `${a.name} attribute`);
    }
    return out;
  },
};
