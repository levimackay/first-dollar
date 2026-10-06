import { finding } from '../context.mjs';

// Built from fragments so the strings the rule bans never appear whole in the
// source it lints.
const TOOL = ['cla', 'ude', '|', 'anthro', 'pic'].join('');
const SOURCE = [
  'gener', 'ated (with|by) (', TOOL, '|ai)',
  '|co-', 'authored-by: ', 'cla', 'ude',
  '|', 'cla', 'ude', ' code',
  '|anthro', 'pic',
].join('');

export const ATTRIBUTION = new RegExp(SOURCE, 'i');

export default {
  id: 'ai-attribution',
  severity: 'fail',
  describe: 'tool attribution left in the deliverable',
  run(ctx) {
    const out = [];
    for (const file of ctx.files) {
      file.lines.forEach((line, i) => {
        const m = ATTRIBUTION.exec(line);
        if (m) out.push(finding('ai-attribution', file, i + 1, `attribution left in the file: "${m[0]}"`));
      });
    }
    return out;
  },
};
