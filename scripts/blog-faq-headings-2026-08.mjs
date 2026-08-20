/**
 * FAQ sections that were paragraphs pretending to be questions.
 *
 * Two shapes exist in this blog. Most posts write a question as a heading:
 *
 *   <h3>How far is Dar Si Said from Bahia Palace?</h3>
 *   <p>A few minutes on foot...</p>
 *
 * Ten rows instead bold the question inside the answer's own paragraph:
 *
 *   <p><strong>Is Bahia Palace wheelchair accessible?</strong> Partially...</p>
 *
 * The second is not a heading. It is absent from the document outline, from
 * anything that builds a table of contents, and from what a screen reader
 * offers when somebody asks it to list the sections. The text is identical and
 * the structure is missing.
 *
 * Converting them also makes the schema honest. FAQPage markup must describe
 * questions a visitor can see, and building it from headings that exist on the
 * page is how that stays true — rather than a JSON block asserting a Q&A the
 * page does not show.
 *
 * WHAT THIS IS NOT: a way to win an FAQ rich result. Google restricted those
 * to well-known government and health sites in August 2023, and a travel site
 * will not get one however correct its markup. What visible, well-formed Q&A
 * still does is answer long-tail queries and give answer engines something
 * unambiguous to quote.
 *
 * Run with --apply to write. Without it, prints every question it found.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

/**
 * The FAQ heading, in the five languages this blog publishes.
 *
 * h2 or h3, because the translations disagree with the English. The English
 * safety guide opens its FAQ with an <h2>; the French, German, Italian and
 * Spanish versions of the same article use an <h3> — so the section sits a
 * level too deep, as though it belonged to whatever came before it. Where the
 * heading is found at h3 it is promoted, and the questions under it become the
 * h3s. That is the shape every other post on this blog already has.
 */
const FAQ_HEADING = /<(h2|h3)[^>]*>\s*(?:[^<]*?(?:Frequently|Questions?|Preguntas|Fragen|Domande|FAQ|fr[ée]quentes|H[äa]ufig)[^<]*?)\s*<\/\1>/i;

/** <p><strong>Question?</strong> Answer</p> — the shape being replaced. */
const BOLD_QA = /<p>\s*<strong>([^<]*\?)\s*<\/strong>\s*([\s\S]*?)<\/p>/g;

/** Plain text for the schema: the answer as a reader hears it, not as markup. */
function plain(htmlText) {
  return htmlText
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d))
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: "SELECT id, slug, locale, content FROM BlogPost WHERE published=1 AND content LIKE '%<strong>%?</strong>%'",
  args: [],
});

let converted = 0, schemas = 0, skipped = 0;
for (const row of rows) {
  const content = row.content ?? '';

  // Only inside the FAQ section. A bold question earlier in the article is
  // usually a rhetorical one in body copy, and turning that into an <h3>
  // would insert a heading in the middle of a paragraph's argument.
  const h = content.match(FAQ_HEADING);
  if (!h) { console.log(`  no FAQ heading   ${row.slug} [${row.locale}]`); skipped++; continue; }
  const headingAt = content.indexOf(h[0]);
  // Promote an h3 FAQ heading to h2 before anything else, so the questions
  // beneath it can be h3 without sitting at the same level as their section.
  const heading = h[1].toLowerCase() === 'h3'
    ? h[0].replace(/^<h3([^>]*)>/i, '<h2$1>').replace(/<\/h3>$/i, '</h2>')
    : h[0];
  const start = headingAt + h[0].length;
  const scriptAt = content.indexOf('<script type="application/ld+json">');
  const end = scriptAt > start ? scriptAt : content.length;

  const section = content.slice(start, end);
  const pairs = [...section.matchAll(BOLD_QA)];
  if (!pairs.length) { console.log(`  no bold Q&A      ${row.slug} [${row.locale}]`); skipped++; continue; }

  const rewritten = section.replace(BOLD_QA, (_, q, a) => `<h3>${q.trim()}</h3>\n<p>${a.trim()}</p>`);
  let next = content.slice(0, headingAt) + heading + rewritten + content.slice(end);

  console.log(`\n${row.slug} [${row.locale}] — ${pairs.length} question(s)`);
  for (const [, q] of pairs) console.log(`    ${q.trim()}`);
  converted++;

  // Schema only where there is none. A post that already declares FAQPage has
  // its own list, and appending a second one would leave two competing
  // descriptions of the same page.
  if (!content.includes('"FAQPage"')) {
    const ld = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map(([, q, a]) => ({
        '@type': 'Question',
        name: plain(q),
        acceptedAnswer: { '@type': 'Answer', text: plain(a) },
      })),
    };
    next = next.trimEnd() + '\n\n<script type="application/ld+json">\n' + JSON.stringify(ld, null, 2) + '\n</script>';
    schemas++;
    console.log(`    + FAQPage schema (${ld.mainEntity.length} entries)`);
  } else {
    console.log('    (already declares FAQPage — headings only)');
  }

  if (apply) {
    await c.execute({
      sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?',
      args: [next, row.id],
    });
  }
}

console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${converted} row(s) converted, ${schemas} schema(s) added, ${skipped} skipped`);
await c.close();
