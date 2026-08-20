/**
 * The leftovers of a font strip that stopped one character too early.
 *
 * blog-restructure-pasted removed the pasted typography with
 *   /font-family:[^;"]*;?/
 * which reads "up to the first semicolon". The pasted value was
 *   font-family: &quot;Times New Roman&quot;;
 * and &quot; ends in a semicolon of its own, so the match stopped inside the
 * entity and left 78 attributes reading style="Times New Roman&quot;; " —
 * a style attribute with no property in it, which is not CSS, just debris.
 *
 * This removes any style attribute left with no `property: value` pair, and
 * the spans that then have no attributes at all.
 *
 * Run with --apply to write.
 */
import { createClient } from '@libsql/client';
import fs from 'node:fs';

for (const line of fs.readFileSync('.env.prod', 'utf8').split(/\r?\n/)) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].replace(/^"|"$/g, '');
}

const apply = process.argv.includes('--apply');
const c = createClient({ url: process.env.DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });

const { rows } = await c.execute({
  sql: "SELECT id, slug, locale, content FROM BlogPost WHERE content LIKE '%style=\"%'",
  args: [],
});

let touched = 0, attrs = 0, spans = 0;
for (const row of rows) {
  const before = row.content ?? '';

  // A declaration needs a colon. Anything without one is not a rule.
  let next = before.replace(/\s*style="([^"]*)"/g, (whole, value) =>
    /[a-z-]+\s*:/i.test(value) ? whole : '');
  const removedAttrs = (before.match(/style="/g) ?? []).length - (next.match(/style="/g) ?? []).length;

  // Spans that carried nothing but that attribute are now empty wrappers.
  const beforeSpans = (next.match(/<span>/g) ?? []).length;
  next = next.replace(/<span>([\s\S]*?)<\/span>/g, '$1');
  const removedSpans = beforeSpans - (next.match(/<span>/g) ?? []).length;

  if (next === before) continue;
  touched += 1; attrs += removedAttrs; spans += removedSpans;
  console.log(`  ${row.slug} [${row.locale}]  -${removedAttrs} style attr, -${removedSpans} empty span`);
  if (apply) {
    await c.execute({ sql: 'UPDATE BlogPost SET content=?, updatedAt=CURRENT_TIMESTAMP WHERE id=?', args: [next, row.id] });
  }
}
console.log(`\n${apply ? 'APPLIED' : 'DRY RUN'}: ${touched} row(s), ${attrs} dead style attribute(s), ${spans} bare span(s)`);
await c.close();
