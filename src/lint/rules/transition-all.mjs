import { eachDecl, resolveVars, firstToken, finding } from '../context.mjs';

export default {
  id: 'transition-all',
  severity: 'fail',
  describe: 'transition: all instead of the properties that change',
  run(ctx) {
    const out = [];
    eachDecl(ctx, /^(transition|transition-property)$/, (decl, unit, line) => {
      const value = resolveVars(ctx, decl.value);
      const all = decl.prop.toLowerCase() === 'transition'
        ? firstToken(value).toLowerCase() === 'all'
        : value.split(',').some((v) => v.trim().toLowerCase() === 'all');
      if (all) out.push(finding('transition-all', unit.file, line, `${decl.prop}: ${value} animates every property; list only the ones that change, such as opacity or transform`));
    });
    return out;
  },
};
