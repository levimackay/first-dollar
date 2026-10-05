import { eachDecl, normalizeStack, finding } from '../context.mjs';

export default {
  id: 'single-sans-family',
  severity: 'warn',
  describe: 'one family doing all the work',
  run(ctx) {
    const stacks = new Map();
    eachDecl(ctx, /^font-family$/, (decl, unit, line) => {
      // Inside @font-face the descriptor names the face being loaded, not a stack the
      // page uses. Counting it makes every self hosted font look like a second voice.
      const parent = decl.parent;
      if (parent?.type === 'atrule' && parent.name.toLowerCase() === 'font-face') return;
      const key = normalizeStack(decl.value);
      if (!key || /^(inherit|initial|unset|revert)$/.test(key)) return;
      if (!stacks.has(key)) stacks.set(key, { unit, line });
    });
    if (stacks.size !== 1) return [];
    const [key, at] = [...stacks.entries()][0];
    return [finding('single-sans-family', at.unit.file, at.line, `"${key}" is the only stack on the site; give display, body and metadata distinct voices`)];
  },
};
