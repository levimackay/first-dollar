// One definition of a photo slot, shared by the lint (static HTML) and the check (the live page).
// A slot is an element with a slot class, a hatched fill, or a [PLACEHOLDER: ...] label,
// wherever it sits: hiding a slot never removes it from the page's count.
export const SLOT_SELECTOR = '.ph, .photo-slot, .photo-placeholder, [data-photo-slot]';
export const HATCH_SELECTOR = '.ph-hatch, [fill*="hatch"]';
export const MARKER_SOURCE = '\\[PLACEHOLDER:\\s*[^\\]]+\\]';
// Markup that never renders, so a marker inside it is not a slot.
export const INERT_SELECTOR = 'head, title, script, style, template, noscript';
// A label climbs toward its hatched region, but never past one of these.
export const SECTIONING_SELECTOR = 'section, article, main, header, footer, aside, nav, body, html';
export const SLOT_ARGS = { slot: SLOT_SELECTOR, hatch: HATCH_SELECTOR, marker: MARKER_SOURCE, sectioning: SECTIONING_SELECTOR };

const MARKER = new RegExp(MARKER_SOURCE, 'i');

/**
 * Every photo slot on a cheerio-loaded page, in document order. The checker's
 * collectPhotoSlots (src/check/checks.mjs) applies the same steps to the live DOM.
 */
export function photoSlotRegions($) {
  const inert = (el) => $(el).closest(INERT_SELECTOR).length > 0;
  const regions = [];
  const add = (el) => {
    if (el && !regions.includes(el)) regions.push(el);
  };
  const contains = (outer, inner) => {
    for (let n = inner; n; n = n.parent) if (n === outer) return true;
    return false;
  };

  $(SLOT_SELECTOR).each((_, el) => {
    if (!inert(el) && !$(el).parent().closest(SLOT_SELECTOR).length) add(el);
  });

  // A hatch belongs to its slot or figure; otherwise to the svg that draws it, or, when that
  // svg is the slot pattern laid over a box (.ph-hatch), to that box.
  $(HATCH_SELECTOR).each((_, el) => {
    if (inert(el)) return;
    const owner = $(el).closest(SLOT_SELECTOR)[0] || $(el).closest('figure')[0];
    if (owner) return add(owner);
    const svg = $(el).parents('svg').last()[0] || el;
    add($(svg).is('.ph-hatch') && svg.parent?.type === 'tag' ? svg.parent : svg);
  });

  const labels = [];
  const visit = (node) => {
    for (const child of node.children || []) {
      if (child.type === 'text' && MARKER.test(child.data) && !labels.includes(node)) labels.push(node);
      else if (child.type === 'tag' && !$(child).is(INERT_SELECTOR)) visit(child);
    }
  };
  for (const body of $('body').toArray()) visit(body);
  const markerCount = (el) => labels.filter((l) => contains(el, l)).length;

  for (const label of labels) {
    const slot = $(label).closest(SLOT_SELECTOR)[0];
    if (slot) {
      add(slot);
      continue;
    }
    let found = null;
    for (let a = label; a && a.type === 'tag'; a = a.parent) {
      if (regions.includes(a)) {
        found = a;
        break;
      }
      if ($(a).is(SECTIONING_SELECTOR)) break;
      const inside = regions.filter((r) => r !== a && contains(a, r));
      if (inside.length && markerCount(a) === 1) {
        for (const r of inside) regions.splice(regions.indexOf(r), 1);
        found = a;
        break;
      }
    }
    add(found || $(label).closest('figure')[0] || label);
  }
  const at = (el) => el.sourceCodeLocation?.startOffset ?? el.startIndex ?? 0;
  return regions.sort((a, b) => at(a) - at(b));
}
