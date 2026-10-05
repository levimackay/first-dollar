import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { lint } from './runner.mjs';

export const USAGE = [
  'usage: first-dollar-lint <dir> [--design <DESIGN.md>] [--reference-text <file>] [--json] [--allow-no-html]',
  '',
  '  dir               directory of built HTML and CSS to lint',
  '  --design          design file to check the build against, default <dir>/DESIGN.md when present',
  '  --reference-text  a file of plain lines; copy that matches them is flagged as lifted',
  '  --json            print the result as JSON instead of one line per finding',
  '  --allow-no-html   for a tree that is not a site',
  '',
  'Exits 1 on any failure, and on a directory holding no HTML at all.',
].join('\n');

function display(file) {
  const rel = path.relative(process.cwd(), file);
  return rel && !rel.startsWith('..') ? rel : file;
}

function parseArgs(argv) {
  const opts = { dir: null, design: null, referenceText: null, json: false, allowNoHtml: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-h' || a === '--help') opts.help = true;
    else if (a === '--json') opts.json = true;
    else if (a === '--allow-no-html') opts.allowNoHtml = true;
    else if (a === '--design') opts.design = argv[++i];
    else if (a === '--reference-text') opts.referenceText = argv[++i];
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
    return 1;
  }
  if (opts.help) {
    console.log(USAGE);
    return 0;
  }
  const dir = opts.dir || '.';
  let referenceTexts = [];
  if (opts.referenceText) {
    referenceTexts = (await readFile(opts.referenceText, 'utf8')).split('\n').map((l) => l.trim()).filter(Boolean);
  }
  let designPath = opts.design ? path.resolve(opts.design) : null;
  if (!designPath) {
    const candidate = path.join(path.resolve(dir), 'DESIGN.md');
    designPath = await stat(candidate).then((s) => (s.isFile() ? candidate : null), () => null);
  }
  const result = await lint(dir, { designPath, referenceTexts });
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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = await main(process.argv.slice(2));
}
