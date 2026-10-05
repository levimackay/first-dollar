import { htmlFiles, elLine, finding } from '../context.mjs';

const STOCK_CLASS = /\b(bg|from|via|to|text|border|ring)-(indigo|violet|purple|fuchsia)-\d{3}\b/;

export default {
  id: 'tailwind-defaults',
  severity: 'fail',
  describe: 'the Tailwind CDN left on its default fonts and indigo or violet palette',
  run(ctx) {
    const out = [];
    for (const file of htmlFiles(ctx)) {
      let loader = null;
      let configured = false;
      file.$('script').each((_, el) => {
        const src = String(el.attribs?.src || '');
        if (/cdn\.tailwindcss\.com|@tailwindcss\/browser/i.test(src)) loader ||= el;
        const body = file.$(el).html() || '';
        if (/tailwind\.config/.test(body) && /fontFamily/.test(body)) configured = true;
      });
      // Tailwind v4 in the browser defines fonts as --font-* theme variables.
      file.$('style[type="text/tailwindcss"]').each((_, el) => {
        if (/--font-[\w-]+\s*:/.test(file.$(el).html() || '')) configured = true;
      });
      if (!loader) continue;
      if (!configured) {
        out.push(finding('tailwind-defaults', file, elLine(file, loader), 'Tailwind CDN with no tailwind.config setting fontFamily; the page ships Tailwind default fonts, so define the typefaces'));
      }
      let stock = null;
      let clipped = null;
      file.$('[class]').each((_, el) => {
        const cls = String(el.attribs.class);
        if (!stock && STOCK_CLASS.test(cls)) stock = { el, name: cls.match(STOCK_CLASS)[0] };
        if (!clipped && /(^|\s)bg-clip-text(\s|$)/.test(cls) && /(^|\s)text-transparent(\s|$)/.test(cls)) clipped = el;
      });
      if (stock) {
        out.push(finding('tailwind-defaults', file, elLine(file, stock.el), `class ${stock.name} is Tailwind's stock indigo or violet; define a palette from the subject in tailwind.config`));
      }
      if (clipped) {
        out.push(finding('tailwind-defaults', file, elLine(file, clipped), 'bg-clip-text with text-transparent is gradient text; use one solid colour'));
      }
    }
    return out;
  },
};
