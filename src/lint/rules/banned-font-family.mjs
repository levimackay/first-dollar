import { cssUnits, eachDecl, htmlFiles, elLine, unitLine, firstFamily, resolveVars, finding } from '../context.mjs';

export const BANNED = ['inter', 'geist', 'space grotesk', 'roboto', 'arial', 'system-ui', 'ui-sans-serif', 'ui-serif', '-apple-system', 'segoe ui', 'helvetica neue'];
export const LINK_BANNED = ['inter', 'geist', 'space grotesk', 'roboto'];

// A Google Fonts URL, however it reached the page. `family=Space+Grotesk` and the
// older pipe separated `family=A|Space+Grotesk` both name the face.
function googleFontsBanned(url) {
  if (!/fonts\.googleapis\.com/i.test(url)) return null;
  let decoded;
  try {
    decoded = decodeURIComponent(url);
  } catch {
    decoded = url;
  }
  decoded = decoded.toLowerCase().replace(/\+/g, ' ');
  for (const name of LINK_BANNED) {
    if (new RegExp(`family=${name}\\b|family=[^&]*\\|${name}\\b`, 'i').test(decoded)) return name;
  }
  return null;
}

export default {
  id: 'banned-font-family',
  severity: 'fail',
  describe: 'default typefaces are the loudest tell that nobody chose the type',
  run(ctx) {
    const out = [];
    eachDecl(ctx, /^font-family$/, (decl, unit, line) => {
      const first = firstFamily(resolveVars(ctx, decl.value));
      if (BANNED.includes(first)) {
        out.push(finding('banned-font-family', unit.file, line, `font-family leads with "${first}"; choose a typeface instead of defaulting to one`));
      }
    });
    for (const file of htmlFiles(ctx)) {
      file.$('link[href]').each((_, el) => {
        const name = googleFontsBanned(el.attribs.href || '');
        if (name) out.push(finding('banned-font-family', file, elLine(file, el), `Google Fonts link loads "${name}"`));
      });
    }
    // A stylesheet can pull the same face in without a link tag.
    for (const unit of cssUnits(ctx)) {
      unit.root.walkAtRules(/^import$/i, (rule) => {
        const name = googleFontsBanned(String(rule.params || ''));
        if (name) out.push(finding('banned-font-family', unit.file, unitLine(unit, rule), `Google Fonts @import loads "${name}"`));
      });
    }
    return out;
  },
};
