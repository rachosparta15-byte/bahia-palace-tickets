#!/usr/bin/env node
/**
 * Launch-readiness gate.
 *
 * The company details in the legal documents are placeholders until the LLC
 * exists -- `[MARRAKECH LOCAL LLC]`, `[EIN]`, `[REGISTERED AGENT NAME AND
 * ADDRESS]` and the rest. marrakechlocal refuses to build while any of them
 * survive; the four branded sites had no such check, so they would deploy the
 * square brackets straight onto their Terms of Sale and nothing would say so.
 *
 * Two modes on purpose:
 *
 *   default            print what is unfilled, exit 0. The sites are live now
 *                      and must keep deploying; a hard failure today would
 *                      just get the check deleted.
 *
 *   REQUIRE_LAUNCH_READY=1   exit 1 on any placeholder. Turn this on in the
 *                      deploy environment the day the company is registered
 *                      and the details are filled in upstream. From then on a
 *                      stale sync cannot reach production silently.
 *
 * Run `npm run check:launch` at any time to see the current state.
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const STRICT = process.env.REQUIRE_LAUNCH_READY === '1';

/** Directories worth scanning. Anything generated or vendored is skipped. */
const SCAN = ['src', 'public'];
const SKIP = new Set(['node_modules', '.git', 'dist', '.astro', '.next', '.deploy', '.wrangler']);
const EXT = new Set(['.json', '.ts', '.tsx', '.astro', '.md', '.mdx', '.html']);

/**
 * A bracketed run of capitals is the placeholder shape used throughout the
 * legal source. Requiring two or more characters keeps ordinary prose such as
 * "[A]" or a lone initial out of the results.
 */
const PLACEHOLDER = /\[[A-Z][A-Z0-9 ._/&-]{2,}\]/g;

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) await walk(full, out);
    else if (EXT.has(path.extname(e.name))) out.push(full);
  }
  return out;
}

const files = [];
for (const d of SCAN) {
  try {
    if ((await stat(path.join(ROOT, d))).isDirectory()) await walk(path.join(ROOT, d), files);
  } catch {
    /* directory absent on this site */
  }
}

const hits = new Map(); // placeholder -> Set of files
for (const f of files) {
  const text = await readFile(f, 'utf8');
  for (const m of text.matchAll(PLACEHOLDER)) {
    if (!hits.has(m[0])) hits.set(m[0], new Set());
    hits.get(m[0]).add(path.relative(ROOT, f));
  }
}

if (hits.size === 0) {
  console.log('launch check: no unfilled placeholders.');
  process.exit(0);
}

const total = [...hits.values()].reduce((n, s) => n + s.size, 0);
const line = '='.repeat(66);
console.log(`\n${line}`);
console.log(
  STRICT
    ? 'LAUNCH CHECK FAILED — unfilled company details would ship'
    : 'LAUNCH CHECK — unfilled company details (not blocking yet)'
);
console.log(line);
for (const [ph, set] of [...hits].sort((a, b) => b[1].size - a[1].size)) {
  console.log(`  ${ph.padEnd(38)} ${set.size} file(s)`);
  for (const f of [...set].slice(0, 2)) console.log(`      ${f}`);
  if (set.size > 2) console.log(`      ... +${set.size - 2} more`);
}
console.log(line);
console.log(`${hits.size} placeholder(s) across ${total} file reference(s).`);

if (STRICT) {
  console.log('Fill them upstream in marrakechlocal, re-run the legal sync, rebuild.');
  console.log(`${line}\n`);
  process.exit(1);
}
console.log('Set REQUIRE_LAUNCH_READY=1 in the deploy environment to make this fatal.');
console.log(`${line}\n`);
