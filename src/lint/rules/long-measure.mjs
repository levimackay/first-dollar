import { eachDecl, resolveVars, finding } from '../context.mjs';

const LIMIT = 75;

export default {
  id: 'long-measure',
  severity: 'warn',
  describe: 'a text column wider than 75 characters',
  run(ctx) {
    const out = [];
    eachDecl(ctx, /^max-width$/, (decl, unit, line) => {
      const m = /^(\d*\.?\d+)ch$/i.exec(resolveVars(ctx, decl.value).trim());
      if (m && parseFloat(m[1]) > LIMIT) {
        out.push(finding('long-measure', unit.file, line, `max-width: ${m[1]}ch lets lines run past ${LIMIT} characters; keep text columns between 45 and 75ch`));
      }
    });
    return out;
  },
};
