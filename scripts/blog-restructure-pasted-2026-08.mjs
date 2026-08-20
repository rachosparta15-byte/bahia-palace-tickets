/**
 * Two posts that were pasted out of a word processor.
 *
 * They carry TimesNewRomanPS-BoldMT, 131 inline font-family declarations and
 * hand-set pixel sizes, and between them not one heading element. Every
 * section title is a paragraph wearing bold and a bigger font, which means:
 *
 *   - the article has no outline, so nothing that builds a table of contents,
 *     summarises the page, or answers "list the sections" for a screen reader
 *     has anything to work with;
 *   - the FAQ at the end is invisible to extractFaqSchema, which reads h3s —
 *     which is the real reason these posts carry no FAQ markup;
 *   - the pasted font overrides the site's own, so two posts in thirty-three
 *     are set in Times New Roman.
 *
 * The title is also pasted in as the first 24px line, so the page renders it
 * twice: once as the template's h1 and again as body text directly beneath.
 *
 * The mapping is taken from the sizes actually present, not guessed:
 *   24px bold, whole paragraph  -> h2   (the first one is the duplicate title)
 *   21px bold, whole paragraph  -> h3   (or h2 for the FAQ heading itself)
 *   20px bold after the FAQ     -> h3   (the questions, so schema can see them)
 *   20px bold elsewhere         -> left as <strong> inside its paragraph
 *
 * Text is never altered. Only the element around it changes.
 *
 * Run with --apply to write. Without it, prints the outline it would produce.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const SLUG = 'how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026';

/**
 * A paragraph whose entire content is one bold run.
 *
 * The heading text is [^<]*, not a lazy any-character run. With [\s\S]*? the
 * match crossed paragraph boundaries: given a mixed paragraph — bold label
 * followed by ordinary text, "<strong>Badi Palace:</strong> 60-90 minutes" —
 * the engine let the lazy group swallow the rest of that paragraph, the </p>,
 * and the opening of the next one, until it found a </strong></span></p> that
 * fitted. Two real headings were silently eaten that way, and applying it
 * would have deleted the paragraph before each of them too.
 *
 * A heading in these posts contains no inner markup, so forbidding < is both
 * true to the content and the thing that keeps the match inside one paragraph.
 */
const HEADING_P = /<p>((?:<span[^>]*>)*)<strong>([^<]*)<\/strong>((?:<\/span>)*)<\/p>/g;

const strip = (s) => s.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
const sizeOf = (s) => Number((s.match(/font-size:\s*(\d+)px/) ?? [, 0])[1]);

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const r = await c.execute({ sql: "SELECT id, content FROM BlogPost WHERE locale='en' AND slug=?", args: [SLUG] });
if (!r.rows[0]) { console.error('post not found'); process.exit(1); }
let content = r.rows[0].content;

let seenTitle = false, inFaq = false;
const outline = [];

content = content.replace(HEADING_P, (whole, open, inner, close) => {
  const text = strip(inner);
  const size = sizeOf(open) || sizeOf(whole);
  if (!text) return whole;

  // The pasted copy of the title, directly under the template's own h1.
  if (!seenTitle && size >= 24) { seenTitle = true; outline.push(`  (removed duplicate title) ${text}`); return ''; }

  if (/^Frequently Asked Questions$/i.test(text)) {
    inFaq = true;
    outline.push(`h2  ${text}`);
    return `<h2>${text}</h2>`;
  }
  if (size >= 24) { inFaq = false; outline.push(`h2  ${text}`); return `<h2>${text}</h2>`; }
  if (size >= 21) { outline.push(`  h3  ${text}`); return `<h3>${text}</h3>`; }
  if (inFaq && text.endsWith('?')) { outline.push(`  h3  ${text}`); return `<h3>${text}</h3>`; }
  return whole; // ordinary bold inside body copy
});

/*
 * A call to action that was never wired up. It has been sitting on a live page
 * as literal square brackets — the shape of a placeholder somebody meant to
 * come back to.
 */
const PLACEHOLDER = /\[\s*Check Bahia Palace Tickets\s*(?:→|&rarr;|-&gt;)?\s*\]/g;
const cta = (content.match(PLACEHOLDER) ?? []).length;
content = content.replace(PLACEHOLDER, '<a href="/en/tickets">Check Bahia Palace tickets &rarr;</a>');

// The pasted typography. Sizes and families both go; the site has its own.
const fams = (content.match(/font-family:[^;"]*;?\s*/g) ?? []).length;
const sizes = (content.match(/font-size:\s*\d+px;?\s*/g) ?? []).length;
content = content
  .replace(/font-family:[^;"]*;?\s*/g, '')
  .replace(/font-size:\s*\d+px;?\s*/g, '')
  .replace(/\s*style="\s*"/g, '')
  .replace(/<span>([\s\S]*?)<\/span>/g, '$1');

console.log(outline.join('\n'));
console.log(`\nremoved: ${fams} font-family, ${sizes} font-size, ${cta} unwired CTA placeholder(s)`);
console.log(`headings created: ${outline.filter((l) => !l.includes('removed')).length}`);

if (apply) {
  await c.execute({ sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', args: [content, r.rows[0].id] });
  console.log('\nAPPLIED');
} else {
  console.log('\nDRY RUN — nothing written');
}
await c.close();
