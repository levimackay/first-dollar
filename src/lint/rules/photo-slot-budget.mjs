import path from 'node:path';
import { htmlFiles, elLine, finding } from '../context.mjs';
import { photoSlotRegions } from '../photo-slot.mjs';

const LEGAL = /^(?:privacy|terms|legal|cookies|cookie-policy|refund-policy)\.html?$/i;

export default {
  id: 'photo-slot-budget',
  severity: 'fail',
  describe: 'more than two photo slots on one landing page',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      if (LEGAL.test(path.basename(file.path))) continue;
      const slots = photoSlotRegions(file.$);
      if (slots.length > 2) {
        out.push(finding('photo-slot-budget', file, elLine(file, slots[2]), `${slots.length} photo slots on this page (hidden ones count); keep at most two inline slots and give the other regions the reference's own non-photo device (design-rules.md, Filling image regions)`));
      }
    }
    return out;
  },
};
