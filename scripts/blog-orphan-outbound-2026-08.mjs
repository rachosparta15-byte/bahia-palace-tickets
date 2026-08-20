/**
 * The other half of an orphan: a post nothing leaves from.
 *
 * blog-link-orphans gave these three articles inbound links. Two of them still
 * had nowhere to send a reader — no route to the ticket page, no route to the
 * article that answers the question they raise next. A page that receives
 * attention and passes none on is a dead end for the reader and a dead end for
 * everything downstream of it.
 *
 * Placed inside sentences that were already about the destination, same as the
 * inbound pass.
 *
 * Run with --apply to write.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const EDITS = [
  {
    slug: 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026',
    label: 'how-long -> entrance fee',
    findRe: /(<h2>How Much Does Bahia Palace Cost in 2026\?<\/h2>)/,
    replace: '$1',
    after: true,
    insert: '\n<p>The full tariff, including who gets in free, is on the <a href="/en/entrance-fee">entrance fee page</a>.</p>',
  },
  {
    slug: 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026',
    label: 'how-long -> opening hours',
    findRe: /(<h2>What Are the Opening Hours\?<\/h2>)/,
    replace: '$1',
    after: true,
    insert: '\n<p>Seasonal times, Ramadan and holiday closures are kept up to date on the <a href="/en/opening-hours">opening hours page</a>.</p>',
  },
  {
    slug: 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026',
    label: 'how-long -> saadian one-day guide',
    findRe: /(<h2>Can You Visit Bahia Palace and Saadian Tombs on the Same Day\?<\/h2>)/,
    replace: '$1',
    after: true,
    insert: '\n<p>The <a href="/en/blog/bahia-palace-and-saadian-tombs-one-day">half-day plan for both sites</a> has the walking route and the order that works best.</p>',
  },
  {
    slug: 'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
    label: 'voices -> history',
    findRe: /(<\/p>)\s*$/,
    replace: '$1\n<p>For the story behind the building itself, and the man who ordered it: <a href="/en/blog/bahia-palace-history">the history of Bahia Palace</a>.</p>',
  },
  {
    slug: 'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
    label: 'mousawama -> tickets',
    findRe: /(<h2>From the Souks to Bahia Palace<\/h2>)/,
    replace: '$1',
    after: true,
    insert: '\n<p>One price you never have to negotiate is the palace itself: entry is 100 MAD at the gate, or <a href="/en/tickets">booked in your name before you arrive</a>.</p>',
  },
];

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
let done = 0, missed = 0;

for (const e of EDITS) {
  const r = await c.execute({ sql: "SELECT id, content FROM BlogPost WHERE locale='en' AND slug=?", args: [e.slug] });
  if (!r.rows[0]) { console.log(`MISSING  ${e.slug}`); missed++; continue; }
  const content = r.rows[0].content ?? '';
  const target = ((e.insert ?? e.replace).match(/href="([^"]+)"/) ?? [])[1];
  if (target && content.includes(`href="${target}"`)) { console.log(`already  ${e.label}`); continue; }
  if (!e.findRe.test(content)) { console.log(`NO MATCH ${e.label}`); missed++; continue; }

  const next = e.after
    ? content.replace(e.findRe, (m) => m + e.insert)
    : content.replace(e.findRe, e.replace);
  if (next === content) { console.log(`NO CHANGE ${e.label}`); missed++; continue; }

  const at = next.indexOf(`href="${target}"`);
  console.log(`\n${e.label}`);
  console.log('  ' + next.slice(Math.max(0, at - 150), at + 170).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  done++;
  if (apply) {
    await c.execute({ sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', args: [next, r.rows[0].id] });
  }
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${done} link(s), ${missed} not matched`);
await c.close();
