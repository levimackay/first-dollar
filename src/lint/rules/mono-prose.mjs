// Running text set in monospace. A typewriter face is for code, figures and short
// labels; a paragraph of it is the "technical" costume agents put on every page.
// Static: it reads the declarations that reach an element and trusts nothing it
// cannot match, so an element it cannot resolve is left alone.
import data from '../data/font-popularity.json' with { type: 'json' };
import { htmlFiles, elLine, firstFamily, finding } from '../context.mjs';
import { inheritedValue } from '../style-lookup.mjs';

const PROSE_TAGS = new Set(['p', 'small', 'figcaption', 'li', 'dd', 'blockquote']);
const EITHER_TAGS = new Set(['span', 'div']);
const EXEMPT = new Set(['code', 'pre', 'kbd', 'samp', 'table']);
const MIN_WORDS = 6;
const NAME_LOOKS_MONO = /mono|code|courier|consolas|menlo|monaco/i;
const monoFamilies = new Set(
  Object.entries(data.families).filter(([, v]) => v[1] === 'monospace').map(([name]) => name.toLowerCase()),
);

function isMonoStack(stack) {
  const first = firstFamily(stack);
  return first === 'monospace' || monoFamilies.has(first) || NAME_LOOKS_MONO.test(first);
}

function exempt(el) {
  for (let node = el; node && node.type === 'tag'; node = node.parent) {
    if (EXEMPT.has(node.tagName) || node.attribs?.['data-mono'] !== undefined) return true;
  }
  return false;
}

function ownText(el) {
  return (el.children || []).filter((c) => c.type === 'text').map((c) => c.data).join(' ');
}

function fullText(el) {
  const visit = (node) =>
    (node.children || []).map((c) => (c.type === 'text' ? c.data : c.type === 'tag' && !['script', 'style'].includes(c.tagName) ? visit(c) : '')).join(' ');
  return visit(el);
}

const words = (text) => text.trim().split(/\s+/).filter(Boolean).length;

function label(el) {
  const cls = String(el.attribs?.class || '').split(/\s+/).filter(Boolean);
  return `<${el.tagName}${cls.length ? '.' + cls.join('.') : ''}>`;
}

export default {
  id: 'mono-prose',
  severity: 'fail',
  describe: 'paragraphs and captions set in a monospace face',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      for (const el of file.$('*').toArray()) {
        const prose = PROSE_TAGS.has(el.tagName);
        if (!prose && !EITHER_TAGS.has(el.tagName)) continue;
        if (words(prose ? fullText(el) : ownText(el)) <= MIN_WORDS) continue;
        if (exempt(el)) continue;
        const stack = inheritedValue(ctx, el, ['font-family']);
        if (!stack || !isMonoStack(stack)) continue;
        const face = stack.split(',')[0].trim().replace(/^["']|["']$/g, '');
        out.push(
          finding('mono-prose', file, elLine(file, el), `${label(el)} is running text set in monospace ("${face}"); set prose in a text face and keep mono for code, figures and short labels (add data-mono only if the reference sets its prose in mono)`),
        );
      }
    }
    return out;
  },
};
