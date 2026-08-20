/**
 * Dead links, redirect hops, and titles Google cuts in half.
 *
 * Found by crawling the 33 live English posts rather than reading the source:
 * every internal target was requested, every external link was requested with
 * a browser user-agent (UNESCO and Britannica 403 a bare script and are fine),
 * and every title and description was measured on the rendered page.
 *
 * Run with --apply to write. Without it, prints the diff and touches nothing.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

/** content edits: exact string in, exact string out. */
const CONTENT = [
  /*
   * Two internal links pointed at slugs that 308 elsewhere. Both resolve, so
   * nothing looked broken — the reader still lands somewhere sensible. But a
   * hop is a hop: the crawler spends a request to be told to go again, and the
   * destination is a URL this site's own sitemap deliberately omits.
   */
  {
    slug: 'bahia-palace-dress-code',
    label: '308 hop → photography guide',
    find: '/en/blog/best-colors-to-wear-for-a-photoshoot-at-bahia-palace-marrakech',
    replace: '/en/blog/bahia-palace-photography-guide',
  },
  {
    slug: 'bahia-palace-harem-women',
    label: '308 hop → history',
    find: '/en/blog/bahia-palace-who-built-it',
    replace: '/en/blog/bahia-palace-history',
  },
  /*
   * A citation with no slash between host and path. It has never resolved, and
   * it sits in the paragraph that tells the reader what a riad costs — the one
   * place on that page where a source matters.
   */
  {
    slug: 'where-to-stay-near-bahia-palace',
    label: 'malformed URL (missing /)',
    find: 'https://www.merzougaway.comhotel-prices-marrakech-2025-guide',
    replace: 'https://www.merzougaway.com/hotel-prices-marrakech-2025-guide',
  },
];

/** title / description edits, keyed by slug. null leaves a field alone. */
const META = [
  /*
   * Over 60 characters is cut mid-phrase in the result, and every one of these
   * lost the half that identifies the page.
   */
  {
    slug: 'bahia-palace-opening-hours-2026',
    title: 'Bahia Palace Opening Hours 2026: Schedule & Ramadan', // was 66
    desc: null,
  },
  {
    slug: 'marrakech-2-day-itinerary',
    title: 'Marrakech in 2 Days: The Perfect Itinerary', // was 61
    desc: null,
  },
  {
    slug: 'bahia-palace-and-saadian-tombs-one-day',
    title: 'Bahia Palace & Saadian Tombs in One Day', // was 61
    desc: null,
  },
  {
    slug: 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026',
    title: 'How Long Do You Need at Bahia Palace?', // was 65
    desc: null,
  },
  {
    slug: 'the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech',
    title: 'How to Haggle in Marrakech: Darija Phrases & Prices', // was 73
    desc: 'The art of mousawama, the Moroccan souk bargain. Real Darija phrases, a step-by-step negotiation, price benchmarks, and the rules nobody explains.', // was 163
  },
  {
    slug: 'the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace',
    title: 'The Voices of Bahia: What Great Travellers Wrote', // was 76
    desc: 'What writers, painters and film-makers made of Bahia Palace — the rooms they singled out, and the one detail almost every account of the place mentions.', // was 192
  },
  /*
   * Over 160 characters is cut too, and these lost their last clause — which
   * in each case was the reason to click.
   */
  {
    slug: '10-hidden-details-bahia-palace',
    title: null,
    desc: 'Bahia Palace draws 500,000 visitors a year and most walk past these ten: zellige left deliberately imperfect, hidden inscriptions, hand-painted cedar.', // was 174
  },
  {
    slug: 'bahia-palace-history',
    title: null,
    desc: 'Bahia Palace was built 1894–1900 by Ba Ahmed ibn Moussa, a slave\'s son turned Grand Vizier. The man, the craftsmen, and the looting after his death.', // was 169
  },
  {
    slug: 'bahia-palace-with-kids',
    title: null,
    desc: 'Children under 7 enter Bahia Palace free. Family guide 2026: ticket prices, what kids actually like, age-by-age tips, and the best months to go.', // was 161
  },
];

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
let done = 0, skipped = 0;

console.log('== content ==');
for (const e of CONTENT) {
  const r = await c.execute({ sql: 'SELECT id, content FROM BlogPost WHERE locale=? AND slug=?', args: ['en', e.slug] });
  if (!r.rows[0]) { console.log(`MISSING  ${e.slug}`); skipped++; continue; }
  const content = r.rows[0].content ?? '';
  if (content.includes(e.replace) && !content.includes(e.find)) { console.log(`already  ${e.slug} — ${e.label}`); skipped++; continue; }
  const n = content.split(e.find).length - 1;
  if (n === 0) { console.log(`NO MATCH ${e.slug} — ${e.label}`); skipped++; continue; }
  console.log(`\n${e.slug} · ${e.label}  (${n}×)`);
  console.log(`  - ${e.find}`);
  console.log(`  + ${e.replace}`);
  done++;
  if (apply) {
    await c.execute({
      sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      args: [content.split(e.find).join(e.replace), r.rows[0].id],
    });
  }
}

console.log('\n== title / description ==');
for (const e of META) {
  const r = await c.execute({ sql: 'SELECT id, title, seoTitle, seoDesc, excerpt FROM BlogPost WHERE locale=? AND slug=?', args: ['en', e.slug] });
  if (!r.rows[0]) { console.log(`MISSING  ${e.slug}`); skipped++; continue; }
  const row = r.rows[0];
  const sets = [], args = [];
  if (e.title != null && e.title !== row.seoTitle) {
    // seoTitle, never title: `title` is the H1 on the page and the text of
    // every card linking to it. A 60-character limit belongs to the search
    // result, not to the heading somebody reads once they have arrived.
    if (e.title.length > 60) throw new Error(`${e.slug}: title ${e.title.length}`);
    console.log(`\n${e.slug}\n  T ${(row.seoTitle ?? row.title ?? '').length} -> ${e.title.length}  ${e.title}`);
    sets.push('seoTitle=?'); args.push(e.title);
  }
  if (e.desc != null && e.desc !== row.seoDesc) {
    if (e.desc.length > 160 || e.desc.length < 110) throw new Error(`${e.slug}: desc ${e.desc.length}`);
    console.log(`  D ${(row.seoDesc ?? row.excerpt ?? '').length} -> ${e.desc.length}`);
    sets.push('seoDesc=?'); args.push(e.desc);
  }
  if (!sets.length) { console.log(`already  ${e.slug}`); skipped++; continue; }
  done++;
  if (apply) {
    args.push(row.id);
    await c.execute({ sql: `UPDATE BlogPost SET ${sets.join(', ')}, updatedAt=CURRENT_TIMESTAMP WHERE id=?`, args });
  }
}

console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${done} change(s), ${skipped} skipped`);
await c.close();
