import path from 'node:path';
import { htmlFiles, elLine, finding } from '../context.mjs';
import { declaredValue } from '../style-lookup.mjs';

const MARKER = /\[PLACEHOLDER:\s*[^\]]+\]/gi;
const LEGAL = /^(?:privacy|terms|legal|cookies|cookie-policy|refund-policy)\.html?$/i;
const NONVISUAL = new Set(['head', 'script', 'style', 'template', 'noscript', 'svg', 'title']);
const SLOT_CLASS = /(?:^|\s)(?:ph|photo-slot|photo-placeholder)(?:\s|$)/i;

function hidden(ctx, el) {
  for (let node = el; node && node.type === 'tag'; node = node.parent) {
    if (NONVISUAL.has(node.tagName)) return true;
    if (node.attribs?.hidden !== undefined || node.attribs?.['aria-hidden'] === 'true') return true;
    if (/display\s*:\s*none|visibility\s*:\s*hidden/i.test(node.attribs?.style || '')) return true;
    if (declaredValue(ctx, node, ['display']) === 'none' || declaredValue(ctx, node, ['visibility']) === 'hidden') return true;
  }
  return false;
}

function visibleSlotAncestor(ctx, el) {
  for (let node = el; node && node.type === 'tag'; node = node.parent) {
    if (node.tagName === 'figure' || SLOT_CLASS.test(node.attribs?.class || '')) return !hidden(ctx, node);
  }
  return false;
}

export default {
  id: 'photo-slot-budget',
  severity: 'fail',
  describe: 'more than two visible photo slots on one landing page',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      if (LEGAL.test(path.basename(file.path))) continue;
      const slots = [];
      const visit = (node) => {
        if (node.type === 'text' && (!hidden(ctx, node.parent) || visibleSlotAncestor(ctx, node.parent))) {
          for (const _ of node.data.matchAll(MARKER)) slots.push(node.parent);
        } else if (node.type === 'tag' && !NONVISUAL.has(node.tagName)) {
          for (const child of node.children || []) visit(child);
        }
      };
      for (const body of file.$('body').toArray()) visit(body);
      if (slots.length > 2) {
        out.push(finding('photo-slot-budget', file, elLine(file, slots[2]), `${slots.length} photo slots on this page; keep at most two and use drawings or type for the remaining regions`));
      }
    }
    return out;
  },
};
