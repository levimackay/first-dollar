import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { realpathSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { lint } from './runner.mjs';

export const USAGE = [
  'usage: first-dollar-lint <dir> [--design <DESIGN.md>] [--reference-text <file>] [--history <file>] [--json] [--allow-no-html]',
  '',
  '  dir               directory of built HTML and CSS to lint',
  '  --design          design file to check the build against, default <dir>/DESIGN.md when present',
  '  --reference-text  a file of plain lines; copy that matches them is flagged as lifted',
  '  --history         a JSONL file of earlier builds ({date, display, text}); turns on font-history',
  '  --json            print the result as JSON instead of one line per finding',
  '  --allow-no-html   for a tree that is not a site',
  '',
  'Exits 0 when clean, 1 on any failure or a directory holding no HTML, 2 on a usage error.',
].join('\n');

function display(file) {
  const rel = path.relative(process.cwd(), file);
  return rel && !rel.startsWith('..') ? rel : file;
}

function parseArgs(argv) {
  const opts = { dir: null, history: null, design: null, referenceText: null, json: false, allowNoHtml: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--allow-no-html') opts.allowNoHtml = true;
    else if (a === '--design' || a === '--reference-text' || a === '--history') {
      const v = argv[++i];
      if (v === undefined || v.startsWith('--')) throw new Error(`${a} needs a value`);
      if (a === '--design') opts.design = v;
      else if (a === '--history') opts.history = v;
      else opts.referenceText = v;
    }
    else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else if (opts.dir === null) opts.dir = a;
    else throw new Error(`unexpected argument ${a}`);
  }
  return opts;
}

export async function main(argv) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    console.error(err.message);
    console.error(USAGE);
    return 2;
  }
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }
  const dir = opts.dir || '.';
  for (const [what, p] of [['directory', dir], ['--design file', opts.design], ['--reference-text file', opts.referenceText]]) {
    if (p && !(await stat(p).then(() => true, () => false))) {
      console.error(`${what} not found: ${p}`);
      console.error(USAGE);
      return 2;
    }
  }
  let referenceTexts = [];
  if (opts.referenceText) {
    referenceTexts = (await readFile(opts.referenceText, 'utf8')).split('\n').map((l) => l.trim()).filter(Boolean);
  }
  let designPath = opts.design ? path.resolve(opts.design) : null;
  if (!designPath) {
    const candidate = path.join(path.resolve(dir), 'DESIGN.md');
    designPath = await stat(candidate).then((s) => (s.isFile() ? candidate : null), () => null);
  }
  const result = await lint(dir, { designPath, referenceTexts, historyPath: opts.history });
  if (result.htmlCount === 0 && !opts.allowNoHtml) {
    console.error(`no html files under ${dir}`);
    console.error('pass --allow-no-html only for a tree that is not a site');
    return 1;
  }
  if (opts.json) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    for (const f of [...result.failures, ...result.warnings]) {
      console.log(`${f.severity === 'fail' ? 'FAIL' : 'WARN'} ${display(f.file)}:${f.line} [${f.rule}] ${f.message}`);
    }
    console.log(`lint: ${result.failures.length} failures, ${result.warnings.length} warnings`);
  }
  return result.ok ? 0 : 1;
}

// Compare real paths so a symlinked install (how skills are installed) still counts as main.
const isMain = (() => {
  try {
    return realpathSync(fileURLToPath(import.meta.url)) === realpathSync(process.argv[1]);
  } catch {
    return false;
  }
})();

if (isMain) {
  process.exitCode = await main(process.argv.slice(2));
}
