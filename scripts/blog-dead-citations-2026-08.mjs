/**
 * The ministry citation that stopped resolving.
 *
 * minculture.gov.ma is the authority this blog leans on for every fact it does
 * not own: the entrance fee, the opening hours, who manages the palace, that
 * commercial photography needs a permit. It appears in 29 rows across 21
 * articles and five languages — and it does not resolve. Not a 404: no
 * response at all.
 *
 * A citation that goes nowhere is worse than none. It is the exact link a
 * careful reader clicks to check a price we quote, and the exact link a
 * reviewer follows to decide whether this site knows what it is talking about.
 *
 * The ministry itself did not disappear; it was folded into the Ministère de
 * la Jeunesse, de la Culture et de la Communication, which serves at
 * mjcc.gov.ma and whose own pages carry the culture and heritage brief. The
 * claims in the articles are unchanged and still correct — only the address
 * of the body that backs them has moved.
 *
 * The visible anchor moves with the href. Leaving "minculture.gov.ma" as the
 * link text while it points at mjcc.gov.ma would be its own small dishonesty,
 * and the reader who reads link text before clicking is the reader who cares.
 *
 * Every locale, not just English: a French reader following a dead French
 * citation is no better served.
 *
 * Run with --apply to write. Without it, prints what it would do.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const SWAPS = [
  // href first, then the visible text — order matters, because the second
  // pattern would otherwise also match the inside of the first.
  ['https://www.minculture.gov.ma', 'https://www.mjcc.gov.ma'],
  ['>minculture.gov.ma<', '>mjcc.gov.ma<'],
];

/*
 * Lonely Planet's Dar Si Said page is a hard 404, and there is no replacement
 * URL — the attraction pages for Marrakesh were retired, not moved. The whole
 * <li> goes: a sources list is a list of things a reader can check, and an
 * entry that cannot be checked is not a source. Wikipedia and the ministry
 * remain on the same list.
 */
const DROP = {
  slug: 'bahia-palace-vs-dar-si-said',
  label: 'Lonely Planet source (404, no replacement)',
  pattern: /<li>\s*Lonely Planet\.[\s\S]{0,300}?lonelyplanet\.com<\/a>\s*<\/li>\s*/g,
};

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: "SELECT id, slug, locale, content FROM BlogPost WHERE content LIKE '%minculture%' OR content LIKE '%lonelyplanet%'",
  args: [],
});

let touched = 0, hrefs = 0, anchors = 0, dropped = 0;
for (const row of rows) {
  let content = row.content ?? '';
  const before = content;

  for (const [from, to] of SWAPS) {
    const n = content.split(from).length - 1;
    if (!n) continue;
    if (from.startsWith('http')) hrefs += n; else anchors += n;
    content = content.split(from).join(to);
  }

  if (row.slug === DROP.slug) {
    const n = (content.match(DROP.pattern) ?? []).length;
    if (n) { content = content.replace(DROP.pattern, ''); dropped += n; }
  }

  if (content === before) continue;
  touched += 1;
  console.log(`  ${row.slug} [${row.locale}]`);
  if (apply) {
    await c.execute({
      sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      args: [content, row.id],
    });
  }
}

console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${touched} row(s) — ${hrefs} href(s), ${anchors} anchor text(s), ${dropped} dead source(s) removed`);

// Nothing must still point at the old host.
if (apply) {
  const left = await c.execute({ sql: "SELECT count(*) n FROM BlogPost WHERE content LIKE '%minculture%' OR content LIKE '%lonelyplanet%'", args: [] });
  console.log(`rows still mentioning a dead citation: ${left.rows[0].n}`);
}
await c.close();
