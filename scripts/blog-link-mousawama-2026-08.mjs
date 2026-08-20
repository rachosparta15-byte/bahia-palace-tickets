/**
 * The last dead end.
 *
 * The mousawama guide gained inbound links and a route to the ticket page, but
 * still pointed at no other article — so a reader who finished it had nowhere
 * to go except back. Its own subject supplies the link: haggling and the souk
 * approaches people are warned about are the same walk, and the safety guide
 * is where the second half of that is written down.
 *
 * Run with --apply to write.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const FIND = /(Walking away from a price without a counteroffer is what registers as dismissive\.)/;
const REPLACE = '$1 That is a different thing from the approaches worth refusing outright, which the '
  + '<a href="/en/blog/marrakech-safety-guide">Marrakech safety guide</a> sets out one by one.';

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const r = await c.execute({
  sql: "SELECT id, content FROM BlogPost WHERE locale='en' AND slug='the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech'",
  args: [],
});
const content = r.rows[0].content;
if (content.includes('/en/blog/marrakech-safety-guide')) {
  console.log('already linked');
} else if (!FIND.test(content)) {
  console.log('NO MATCH');
} else {
  const next = content.replace(FIND, REPLACE);
  const at = next.indexOf('/en/blog/marrakech-safety-guide');
  console.log(next.slice(Math.max(0, at - 220), at + 160).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  if (apply) {
    await c.execute({ sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', args: [next, r.rows[0].id] });
    console.log('\nAPPLIED');
  } else {
    console.log('\nDRY RUN');
  }
}
await c.close();
