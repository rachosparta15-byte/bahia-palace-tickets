/**
 * Three posts nothing linked to.
 *
 * They were reachable only from the blog index, which is the difference
 * between being published and being part of the site. Nothing said what they
 * were about, nothing passed them any authority, and a reader deep in a
 * related article had no way to arrive.
 *
 * Each link below is placed in a sentence that was already about the thing
 * being linked to — not appended as a "see also" block. A related-posts strip
 * is ignored; a link inside the sentence a reader is mid-way through is not.
 *
 * The anchor text says what is on the other side. "Read more" tells a reader
 * nothing and tells a crawler less.
 *
 * Run with --apply to write. Without it, prints the diff.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const HOW_LONG = '/en/blog/how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026';
const MOUSAWAMA = '/en/blog/the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech';
const VOICES = '/en/blog/the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace';

const EDITS = [
  // ---- inbound: how long do you need ----
  {
    slug: 'bahia-palace-tips-before-visiting',
    label: 'how-long <- tips',
    // Its own section already asks the question; the article that answers it
    // in full belongs in the same sentence.
    findRe: /(Visitors who rush through in 30 to 40 minutes)/,
    replace: `Most people should plan 60 to 90 minutes — the <a href="${HOW_LONG}">full breakdown of how long you need at Bahia Palace</a> works through what each part of the visit costs you in time. $1`,
  },
  {
    slug: 'is-bahia-palace-worth-visiting',
    label: 'how-long <- worth visiting',
    // The verdict already prices the visit in minutes. This is where somebody
    // decides whether 90 minutes is a figure they can plan around.
    findRe: /(At 100 MAD and 90 minutes, Bahia Palace represents excellent value)/,
    replace: `$1 — and <a href="${HOW_LONG}">how those 90 minutes actually break down</a> is worth reading before you fix the rest of your morning`,
  },
  // ---- inbound: mousawama ----
  {
    slug: 'marrakech-safety-guide',
    label: 'mousawama <- safety guide',
    findRe: /(Bargaining in the souks is expected and part of the culture\.)/,
    replace: `$1 It has its own etiquette, set out in this <a href="${MOUSAWAMA}">guide to mousawama, haggling in the Marrakech souks</a>.`,
  },
  {
    slug: 'things-to-do-near-bahia-palace',
    label: 'mousawama <- things to do',
    findRe: /(than the tourist-facing souks near Jemaa el-Fna\.)/,
    replace: `$1 Prices there are still negotiable, and <a href="${MOUSAWAMA}">haggling has an etiquette of its own</a>.`,
  },
  // ---- inbound: voices ----
  {
    slug: 'bahia-palace-history',
    label: 'voices <- history',
    findRe: /(<h2>Bahia Palace Today<\/h2>)/,
    replace: `<p>The palace has been written about for more than a century — see <a href="${VOICES}">what travellers and writers recorded about Bahia</a> in their own words.</p>
$1`,
  },
];

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
let done = 0, missed = 0;

for (const e of EDITS) {
  if (e.noop) continue;
  const r = await c.execute({ sql: "SELECT id, content FROM BlogPost WHERE locale='en' AND slug=?", args: [e.slug] });
  if (!r.rows[0]) { console.log(`MISSING  ${e.slug}`); missed++; continue; }
  const content = r.rows[0].content ?? '';

  // Never add a second link to the same destination.
  const target = (e.replace.match(/href="([^"]+)"/) ?? [])[1];
  if (target && content.includes(`href="${target}"`)) { console.log(`already  ${e.label}`); continue; }

  let next;
  if (e.findRe) {
    if (!e.findRe.test(content)) { console.log(`NO MATCH ${e.label}`); missed++; continue; }
    next = content.replace(e.findRe, e.replace);
  } else {
    const n = content.split(e.find).length - 1;
    if (n === 0) { console.log(`NO MATCH ${e.label}`); missed++; continue; }
    next = e.once
      ? content.replace(e.find, e.replace)
      : content.split(e.find).join(e.replace);
  }
  if (next === content) { console.log(`NO CHANGE ${e.label}`); missed++; continue; }

  // Show the sentence as it will read.
  const at = next.indexOf(`href="${target}"`);
  console.log(`\n${e.label}`);
  console.log('  ' + next.slice(Math.max(0, at - 170), at + 190).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  done++;
  if (apply) {
    await c.execute({ sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', args: [next, r.rows[0].id] });
  }
}

console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${done} link(s), ${missed} not matched`);
await c.close();
