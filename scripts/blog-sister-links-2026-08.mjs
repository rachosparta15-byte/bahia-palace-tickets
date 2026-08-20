/**
 * Cross-network links: the blog talks about the Saadian Tombs and El Badi
 * Palace in thirty-three articles and links to neither ticket page.
 *
 * The worst of it is not the missing link, it is one sentence in the
 * highest-traffic post (970 impressions): "There is no official advance
 * booking system for the Saadian Tombs" — true of the Ministry, and read by
 * the visitor as "do not bother booking", on a page we own, about a monument
 * we sell. It is rewritten to say both things: the Ministry has no system,
 * and the ticket can still be bought on your behalf.
 *
 * Run with --apply to write. Without it, prints the diff and touches nothing.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const SAADIAN = 'https://www.saadian-tombs.com/tickets/';
const BADI = 'https://badi-palace.com/en/tickets/';

/*
 * No euro price in any of this copy. The Saadian ticket page currently reads
 * €11.99 while El Badi reads €12.99, and a number written into an article is a
 * number that goes stale the day either one moves. The gate price in dirhams
 * is the Ministry's and does not drift.
 */
const EDITS = [
  {
    slug: 'bahia-palace-and-saadian-tombs-one-day',
    label: 'FAQ: "do I need to book the Saadian Tombs?"',
    find: `<p>There is no official advance booking system for the Saadian Tombs: tickets are purchased at the entrance (100 MAD cash, foreign adult). The queue is usually shorter than Bahia Palace's and moves faster, as the site is smaller. Arriving before 10:00 AM keeps the wait minimal.`,
    replace: `<p>The Ministry of Culture runs no booking system of its own for the Saadian Tombs, so at the window it is 100 MAD in cash for a foreign adult. You can still have the ticket bought for you in advance: <a href="${SAADIAN}">saadian-tombs.com</a> buys it in your name and sends it before you travel, which is the only way to reach that entrance without dirhams in your pocket. If you do queue, it is usually shorter than Bahia Palace's and moves faster, as the site is smaller. Arriving before 10:00 AM keeps the wait minimal.`,
  },
  {
    slug: 'bahia-palace-and-saadian-tombs-one-day',
    label: 'the "cash only at the door" paragraph',
    find: `you can pay by card for that — but have cash ready for the Saadian Tombs ticket window.`,
    replace: `you can pay by card for that, and a <a href="${SAADIAN}">Saadian Tombs ticket</a> can be arranged the same way. If you would rather buy at the window, have dirhams ready.`,
  },
  {
    slug: 'bahia-palace-and-saadian-tombs-one-day',
    label: 'the "add El Badi" section',
    find: `<p>Total ticket cost for all three: 300 MAD per foreign adult (roughly €27).`,
    replace: `<p><a href="${BADI}">El Badi Palace tickets</a> can be booked ahead in the same way, so all three can be in your name before you land. Total ticket cost for all three: 300 MAD per foreign adult at the gate (roughly €27).`,
  },
  {
    slug: 'bahia-palace-vs-badi-palace-marrakech',
    label: 'after the one-day guide link',
    find: `<a href="/en/blog/bahia-palace-and-saadian-tombs-one-day">one-day southern medina guide</a> covers the most efficient way to see both palaces and the Saadian Tombs.`,
    replace: `<a href="/en/blog/bahia-palace-and-saadian-tombs-one-day">one-day southern medina guide</a> covers the most efficient way to see both palaces and the Saadian Tombs. Entry to the ruins is 100 MAD at the gate, and <a href="${BADI}">El Badi Palace tickets</a> can be bought ahead and sent to you before you arrive.`,
  },
  {
    slug: 'things-to-do-near-bahia-palace',
    label: 'the opening paragraph',
    find: `two more major paid sites (the Saadian Tombs and El Badi Palace)`,
    replace: `two more major paid sites (the <a href="${SAADIAN}">Saadian Tombs</a> and <a href="${BADI}">El Badi Palace</a>, 100 MAD each)`,
  },
  {
    slug: 'marrakech-1-day-itinerary',
    label: 'the district paragraph',
    find: `it should include Bahia Palace, the Saadian Tombs, a Kasbah lunch and Jemaa el-Fna at sunset.`,
    replace: `it should include Bahia Palace, the <a href="${SAADIAN}">Saadian Tombs</a>, a Kasbah lunch and Jemaa el-Fna at sunset.`,
  },
  {
    slug: 'marrakech-2-day-itinerary',
    label: 'the budget line',
    find: `Bahia Palace (100 MAD) + Saadian Tombs (100 MAD)`,
    replace: `Bahia Palace (100 MAD) + <a href="${SAADIAN}">Saadian Tombs</a> (100 MAD)`,
  },
  {
    slug: 'bahia-palace-dress-code',
    label: 'the "dress once for the whole day" paragraph',
    find: `The souks, the Saadian Tombs, El Badi Palace, and the Ben Youssef Madrasa all expect the same standards as Bahia Palace.`,
    replace: `The souks, the <a href="${SAADIAN}">Saadian Tombs</a>, <a href="${BADI}">El Badi Palace</a>, and the Ben Youssef Madrasa all expect the same standards as Bahia Palace.`,
  },
];

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

let ok = 0, missing = 0, already = 0;
for (const e of EDITS) {
  const r = await c.execute({ sql: 'SELECT id, content FROM BlogPost WHERE locale=? AND slug=?', args: ['en', e.slug] });
  if (!r.rows[0]) { console.log(`MISSING POST  ${e.slug}`); missing++; continue; }
  const content = r.rows[0].content ?? '';
  if (content.includes(e.replace)) { console.log(`already done  ${e.slug} — ${e.label}`); already++; continue; }
  const n = content.split(e.find).length - 1;
  if (n !== 1) { console.log(`NO MATCH (${n})  ${e.slug} — ${e.label}`); missing++; continue; }
  console.log(`\n--- ${e.slug}  ·  ${e.label}`);
  console.log(`  - ${e.find}`);
  console.log(`  + ${e.replace}`);
  ok++;
  if (apply) {
    await c.execute({
      sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      args: [content.split(e.find).join(e.replace), r.rows[0].id],
    });
  }
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${ok} edit(s), ${already} already in place, ${missing} not matched`);
await c.close();
