/**
 * FAQPage schema declared twice on the same page.
 *
 * The article template already builds FAQPage from the rendered content — see
 * extractFaqSchema in blog/[slug]/page.tsx. Some posts ALSO carry a
 * hand-written <script type="application/ld+json"> inside their content, so
 * those pages emit two FAQPage blocks describing the same questions.
 *
 * Two of anything in structured data is a page arguing with itself, and the
 * hand-written copies are the ones that rot: they are prose frozen at the
 * moment somebody pasted them, and every later edit to a question or an answer
 * leaves them behind. The generated one reads the page as it is now.
 *
 * So the inline copies go, everywhere they appear. This includes the eleven
 * added earlier today by blog-faq-headings — that script converted bold
 * pseudo-questions into real <h3> headings, which was the change worth making,
 * and then added a schema block the template was already going to produce.
 * The headings stay; the duplicate does not.
 *
 * Only FAQPage blocks are removed. Any other JSON-LD in content is left alone.
 *
 * Run with --apply to write. Without it, prints what it would remove.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const SCRIPT_BLOCK = /\s*<script\s+type="application\/ld\+json"\s*>([\s\S]*?)<\/script>/gi;

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: "SELECT id, slug, locale, content FROM BlogPost WHERE content LIKE '%application/ld+json%'",
  args: [],
});

let touched = 0, removed = 0, kept = 0;
for (const row of rows) {
  const content = row.content ?? '';
  let n = 0, other = 0;

  const next = content.replace(SCRIPT_BLOCK, (whole, body) => {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      // Unparseable JSON-LD is its own problem and not this script's to guess
      // at. Left exactly as found.
      other += 1;
      return whole;
    }
    const nodes = Array.isArray(parsed) ? parsed : [parsed];
    if (nodes.every((x) => x && x['@type'] === 'FAQPage')) { n += 1; return ''; }
    other += 1;
    return whole;
  });

  removed += n;
  kept += other;
  if (!n) continue;
  touched += 1;
  console.log(`  ${row.slug} [${row.locale}]  -${n} FAQPage${other ? `, kept ${other} other` : ''}`);
  if (apply) {
    await c.execute({
      sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      args: [next.trimEnd(), row.id],
    });
  }
}

console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${touched} row(s), ${removed} inline FAQPage removed, ${kept} other JSON-LD kept`);
await c.close();
