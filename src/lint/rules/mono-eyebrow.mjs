// The uppercase micro-label stacked above every section heading. One of them is a
// device; three of them is a template, and the page stops being able to say which
// section matters. The rule counts the pattern rather than the label, so a single
// orientation rail or a table's column meta is left alone.
//
// A label qualifies two ways. The first is the named tell: a monospace stack, set
// uppercase, small or widely tracked. The second is the same shape wearing a
// different face, which is how the pattern actually turns up once a page has picked
// a condensed sans or a tracked serif for its meta: the label is set in a family
// the heading is not, uppercase, and small or widely tracked. Both paths still need
// the label to be short, childless, and reading directly into the heading, so body
// copy and standfirsts are never mistaken for it.
import { htmlFiles, elLine, elementChildren, parsePx, firstFamily, finding } from '../context.mjs';
import { declaredValue } from '../style-lookup.mjs';

const LABEL_MAX = 40;
const SIZE_MAX = 14;
const TRACKING_MIN = 0.08;
const HEADINGS = new Set(['h1', 'h2', 'h3']);
// Three is where a device becomes a house style.
const THRESHOLD = 3;

// font-family, text-transform, font-size and letter-spacing all inherit, so a label
// that gets its mono from a wrapper is the same label. The nearest declaration wins.
function inherited(ctx, el, props) {
  for (let node = el; node && node.type === 'tag'; node = node.parent) {
    const value = declaredValue(ctx, node, props);
    if (value !== null) return value;
  }
  return null;
}

function isMono(ctx, el) {
  const stack = inherited(ctx, el, ['font-family']);
  if (!stack) return false;
  return firstFamily(stack).includes('mono');
}

function isUpper(ctx, el, text) {
  const declared = inherited(ctx, el, ['text-transform']);
  if (declared && /uppercase/i.test(declared)) return true;
  const letters = text.replace(/[^a-z]/gi, '');
  return letters.length >= 2 && text === text.toUpperCase();
}

// >= 0.08em. A px tracking is only judged when a font-size in px is there to
// divide by, because 2px is wide at 11px and tight at 48px.
function isTracked(ctx, el) {
  const raw = inherited(ctx, el, ['letter-spacing']);
  if (!raw) return false;
  const em = /^(-?\d*\.?\d+)\s*em$/i.exec(raw.trim());
  if (em) return parseFloat(em[1]) >= TRACKING_MIN;
  const px = /^(-?\d*\.?\d+)\s*px$/i.exec(raw.trim());
  if (!px) return false;
  const size = parsePx(inherited(ctx, el, ['font-size']) || '');
  if (!size) return false;
  return parseFloat(px[1]) / size >= TRACKING_MIN;
}

function isSmall(ctx, el) {
  const size = parsePx(inherited(ctx, el, ['font-size']) || '');
  return size !== null && size < SIZE_MAX;
}

// The label wears a face the heading does not. A page that sets its meta in the
// heading's own family is running one voice, not stacking a second one on top.
function contrasts(ctx, el, heading) {
  const label = firstFamily(inherited(ctx, el, ['font-family']) || '');
  const title = firstFamily(inherited(ctx, heading, ['font-family']) || '');
  return Boolean(label) && Boolean(title) && label !== title;
}

function isEyebrow(ctx, file, el, heading) {
  if (!el || el.type !== 'tag') return false;
  if (HEADINGS.has(el.tagName)) return false;
  if (elementChildren(el).length > 0) return false;
  const text = file.$(el).text().trim();
  if (!text || text.length >= LABEL_MAX || !/[a-z]/i.test(text)) return false;
  if (!isMono(ctx, el) && !contrasts(ctx, el, heading)) return false;
  if (!isUpper(ctx, el, text)) return false;
  return isSmall(ctx, el) || isTracked(ctx, el);
}

// The label that leads a heading: the element right before it, or the one that opens
// the block the heading sits in.
function labelFor(file, heading) {
  const siblings = elementChildren(heading.parent || {});
  const at = siblings.indexOf(heading);
  if (at < 0) return null;
  if (at > 0) return siblings[at - 1];
  return null;
}

function openerFor(file, heading) {
  const parent = heading.parent;
  if (!parent || parent.type !== 'tag') return null;
  const siblings = elementChildren(parent);
  const at = siblings.indexOf(heading);
  if (at <= 0) return null;
  return siblings[0];
}

// A heading wrapped in its own block still reads as led by the label that sits
// immediately above the block. Only when the heading opens that block, so nothing
// stands between the two on the page.
function wrapperFor(file, heading) {
  const parent = heading.parent;
  if (!parent || parent.type !== 'tag' || parent.tagName === 'body') return null;
  if (elementChildren(parent)[0] !== heading) return null;
  const outer = parent.parent;
  if (!outer || outer.type !== 'tag') return null;
  const siblings = elementChildren(outer);
  const at = siblings.indexOf(parent);
  return at > 0 ? siblings[at - 1] : null;
}

export default {
  id: 'mono-eyebrow',
  severity: 'fail',
  describe: 'an uppercase mono micro-label above every section heading',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      const hits = [];
      for (const heading of file.$('h1, h2, h3').toArray()) {
        const candidates = [labelFor(file, heading), openerFor(file, heading), wrapperFor(file, heading)];
        const label = candidates.find((c) => c && isEyebrow(ctx, file, c, heading));
        if (label) hits.push({ label, heading });
      }
      if (hits.length < THRESHOLD) continue;
      for (const hit of hits) {
        out.push(
          finding(
            'mono-eyebrow',
            file,
            elLine(file, hit.label),
            `${hits.length} headings each led by an uppercase mono micro-label; keep at most ${THRESHOLD - 1} and let the rest of the page find another way to orient the reader`
          )
        );
      }
    }
    return out;
  },
};
