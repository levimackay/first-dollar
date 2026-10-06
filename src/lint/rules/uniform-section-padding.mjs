import { cssUnits, unitLine, selectorParts, parsePx, firstToken, resolveVars, coefficientOfVariation, finding } from '../context.mjs';

const MIN_RULES = 4;
const COV_LIMIT = 0.15;
const SECTIONISH = /(^|[\s,>+~])section\b|\[data-section/i;

export default {
  id: 'uniform-section-padding',
  severity: 'fail',
  describe: 'identical vertical padding on every section',
  run(ctx) {
    const values = [];
    for (const unit of cssUnits(ctx)) {
      unit.root.walkRules((rule) => {
        if (!selectorParts(rule).some((s) => SECTIONISH.test(s))) return;
        let px = null;
        let node = null;
        // The `padding` shorthand counts too: in every one of its 1 to 4 value
        // forms the first value is the top padding.
        rule.walkDecls(/^(padding|padding-block|padding-block-start|padding-top)$/i, (decl) => {
          const n = parsePx(firstToken(resolveVars(ctx, decl.value)));
          if (n === null) return;
          // A `padding: 0` reset is not a rhythm decision, and counting it as a 0px
          // sample widens the spread enough to hide a page whose sections are identical.
          if (n === 0) return;
          px = n;
          node = decl;
        });
        if (px !== null) values.push({ unit, px, line: unitLine(unit, node), selector: rule.selector });
      });
    }
    if (values.length < MIN_RULES) return [];
    const cov = coefficientOfVariation(values.map((v) => v.px));
    if (cov >= COV_LIMIT) return [];
    const first = values[0];
    const list = values.map((v) => `${v.px}px`).join(', ');
    return [
      finding(
        'uniform-section-padding',
        first.unit.file,
        first.line,
        `${values.length} section paddings barely differ (${list}); alternate density instead`
      ),
    ];
  },
};
