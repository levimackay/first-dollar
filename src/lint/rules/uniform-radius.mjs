import { cssUnits, unitLine, resolveVars, parsePx, finding } from '../context.mjs';

const MIN_RULES = 4;
const SHARE_LIMIT = 0.8;

// 0.5rem and 8px are the same corner, so compare lengths rather than the strings
// they happened to be written as. A token that is not a length is left alone.
function normalizeRadius(value) {
  return value
    .split(/\s+/)
    .map((token) => {
      const px = parsePx(token);
      return px === null ? token : `${px}px`;
    })
    .join(' ');
}

export default {
  id: 'uniform-radius',
  severity: 'fail',
  describe: 'the same corner radius on everything',
  run(ctx) {
    const declared = [];
    for (const unit of cssUnits(ctx)) {
      unit.root.walkRules((rule) => {
        let value = null;
        let node = null;
        rule.walkDecls(/^border-radius$/i, (decl) => {
          value = normalizeRadius(resolveVars(ctx, decl.value).trim().toLowerCase().replace(/\s+/g, ' '));
          node = decl;
        });
        if (value !== null) declared.push({ unit, value, line: unitLine(unit, node) });
      });
    }
    if (declared.length < MIN_RULES) return [];
    const counts = new Map();
    for (const d of declared) counts.set(d.value, (counts.get(d.value) || 0) + 1);
    let top = null;
    for (const [value, count] of counts) if (!top || count > top.count) top = { value, count };
    const share = top.count / declared.length;
    if (share <= SHARE_LIMIT) return [];
    const first = declared.find((d) => d.value === top.value);
    return [
      finding(
        'uniform-radius',
        first.unit.file,
        first.line,
        `border-radius: ${top.value} on ${top.count} of ${declared.length} rules (${Math.round(share * 100)}%); vary the radius or drop it`
      ),
    ];
  },
};
