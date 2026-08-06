/**
 * Fix UTF-8 mojibake in DB.
 *
 * Root cause: UTF-8 bytes decoded as Windows-1252 before storage.
 * Each broken sequence is constructed from exact byte values so there is
 * no ambiguity from file encoding or terminal charset.
 *
 * Windows-1252 byte→codepoint mapping (0x80–0x9F subset used here):
 *  0x80 → U+20AC (€)   0x91 → U+2018 (')   0x92 → U+2019 (')
 *  0x93 → U+201C (")   0x94 → U+201D (")   0x95 → U+2022 (•)
 *  0x96 → U+2013 (–)   0x97 → U+2014 (—)   0x98 → U+02DC (˜)
 *  0x99 → U+2122 (™)   0x9C → U+0153 (œ)
 */
import { createClient } from '@libsql/client';

// Build the broken string for a given UTF-8 character by simulating the
// Windows-1252 mis-decoding of its bytes.
// CP1252 overrides for 0x80–0x9F (the non-Latin-1 range):
const CP1252 = {
  0x80: 0x20AC, 0x81: 0x0081, 0x82: 0x201A, 0x83: 0x0192,
  0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021,
  0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039,
  0x8C: 0x0152, 0x8E: 0x017D,
  0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D,
  0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014,
  0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A,
  0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178,
};

function bytesToW1252String(bytes) {
  return bytes.map(b => {
    if (b >= 0x80 && b <= 0x9F) return String.fromCodePoint(CP1252[b] ?? b);
    return String.fromCodePoint(b); // Latin-1 range maps 1:1
  }).join('');
}

function utf8CharToMojibake(char) {
  const bytes = [...Buffer.from(char, 'utf8')];
  return bytesToW1252String(bytes);
}

// Characters to fix:
const CHARS_TO_FIX = [
  '—', // em dash —
  '–', // en dash –
  '’', // right single quote '
  '‘', // left single quote '
  '“', // left double quote "
  '”', // right double quote "
  '…', // ellipsis …
  '•', // bullet •
  '™', // trade mark ™
  ' ', // non-breaking space (when double-encoded as Â + 0xA0)
];

const FIXES = CHARS_TO_FIX.map(ch => [utf8CharToMojibake(ch), ch]);

// Diagnostic output so we know exactly what we're searching for
console.log('Mojibake patterns being fixed:');
for (const [bad, good] of FIXES) {
  const badHex = [...bad].map(c => c.codePointAt(0).toString(16).padStart(4,'0')).join(' ');
  console.log(`  U+${good.codePointAt(0).toString(16).padStart(4,'0')} ${good}  ←  ${bad}  (${badHex})`);
}
console.log('');

function fixMojibake(str) {
  if (!str) return str;
  let out = str;
  for (const [bad, good] of FIXES) {
    if (out.includes(bad)) out = out.replaceAll(bad, good);
  }
  return out;
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const FIELDS = ['content', 'title', 'seoTitle', 'seoDesc'];

const all = await client.execute({
  sql: 'SELECT slug, locale, content, title, seoTitle, seoDesc FROM BlogPost',
  args: [],
});

let totalFixed = 0;

for (const row of all.rows) {
  const updates = {};
  for (const field of FIELDS) {
    const original = row[field] ?? '';
    const fixed = fixMojibake(original);
    if (fixed !== original) updates[field] = fixed;
  }
  if (Object.keys(updates).length > 0) {
    const sets = Object.keys(updates).map(k => `${k} = ?`).join(', ');
    const vals = [...Object.values(updates), new Date().toISOString(), row.slug, row.locale];
    await client.execute({
      sql: `UPDATE BlogPost SET ${sets}, updatedAt = ? WHERE slug = ? AND locale = ?`,
      args: vals,
    });
    console.log(`✅  Fixed ${row.locale}/${row.slug}: [${Object.keys(updates).join(', ')}]`);
    totalFixed++;
  }
}

// Verify: the specific instance from user's screenshot
const check = await client.execute({
  sql: "SELECT content FROM BlogPost WHERE slug='bahia-palace-history' AND locale='en'",
  args: [],
});
const sample = check.rows[0]?.content ?? '';
const idx = sample.indexOf('Ba Ahmed');
if (idx >= 0) {
  console.log('\nVerification — Ba Ahmed context:');
  console.log(JSON.stringify(sample.slice(idx, idx + 80)));
}

console.log(`\nDone — ${totalFixed} rows fixed.`);
await client.close();
