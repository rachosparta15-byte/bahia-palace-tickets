/**
 * Auto-translate all English blog posts to fr, it, de, es
 * Uses Google Translate unofficial API (free, no key needed)
 */
import { createClient } from '@libsql/client';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';

// ── Load .env.local ──────────────────────────────────────────────────────────
const envContent = readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');
}

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

const LOCALES = ['fr', 'it', 'de', 'es'];

// ── Google Translate (unofficial, free) ─────────────────────────────────────
async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text;
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data[0].map(c => c[0]).join('');
}

// Translate with rate-limit friendly splitting (max 4500 chars/call)
async function translateLong(text, targetLang) {
  if (!text) return text;
  if (text.length <= 4500) return await translateText(text, targetLang);

  // Split HTML at block-level tags
  const chunks = [];
  let current = '';
  for (const line of text.split('\n')) {
    if (current.length + line.length + 1 > 4500) {
      if (current.trim()) chunks.push(current);
      current = line;
    } else {
      current += (current ? '\n' : '') + line;
    }
  }
  if (current.trim()) chunks.push(current);

  const results = [];
  for (const chunk of chunks) {
    results.push(await translateText(chunk, targetLang));
    await sleep(300);
  }
  return results.join('\n');
}

// Translate HTML preserving all tags (only translates text nodes)
async function translateHTML(html, targetLang) {
  const parts = html.split(/(<[^>]+>)/);
  const textParts = [];
  const indices = [];

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!part.startsWith('<') && part.trim()) {
      textParts.push(part);
      indices.push(i);
    }
  }

  // Batch text nodes into one request where possible
  const SEPARATOR = ' ||| ';
  let batch = '';
  let batchIndices = [];

  const applyBatch = async () => {
    if (!batch) return;
    const translated = await translateLong(batch, targetLang);
    const pieces = translated.split(SEPARATOR);
    for (let j = 0; j < batchIndices.length; j++) {
      parts[batchIndices[j]] = pieces[j] ?? parts[batchIndices[j]];
    }
    batch = '';
    batchIndices = [];
    await sleep(200);
  };

  for (let k = 0; k < textParts.length; k++) {
    const candidate = batch ? batch + SEPARATOR + textParts[k] : textParts[k];
    if (candidate.length > 4000) {
      await applyBatch();
      batch = textParts[k];
      batchIndices = [indices[k]];
    } else {
      batch = candidate;
      batchIndices.push(indices[k]);
    }
  }
  await applyBatch();

  return parts.join('');
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function run() {
  // Get all English posts
  const result = await client.execute(
    "SELECT * FROM BlogPost WHERE locale = 'en' AND published = 1"
  );
  const posts = result.rows;
  console.log(`Found ${posts.length} English post(s) to translate.\n`);

  for (const post of posts) {
    console.log(`\n📝 Translating: "${post.title}"`);

    for (const lang of LOCALES) {
      // Check if translation already exists
      const exists = await client.execute({
        sql: "SELECT id FROM BlogPost WHERE slug = ? AND locale = ?",
        args: [post.slug, lang],
      });
      if (exists.rows.length > 0) {
        console.log(`  [${lang}] Already exists, skipping.`);
        continue;
      }

      console.log(`  [${lang}] Translating...`);
      try {
        const [title, excerpt, content, seoTitle, seoDesc] = await Promise.all([
          translateLong(post.title,    lang),
          translateLong(post.excerpt,  lang),
          translateHTML(post.content,  lang),
          translateLong(post.seoTitle ?? post.title,   lang),
          translateLong(post.seoDesc  ?? post.excerpt, lang),
        ]);

        const id = randomUUID().replace(/-/g, '').substring(0, 25);
        await client.execute({
          sql: `INSERT INTO BlogPost
                  (id, title, slug, locale, category, excerpt, content, coverImage,
                   seoTitle, seoDesc, author, published, publishedAt, createdAt, updatedAt, tags, ogImage)
                VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,NULL,NULL)`,
          args: [
            id, title, post.slug, lang, post.category, excerpt, content,
            post.coverImage, seoTitle, seoDesc, post.author,
            post.publishedAt, post.createdAt, post.updatedAt,
          ],
        });
        console.log(`  [${lang}] Done ✓`);
        await sleep(500);
      } catch (err) {
        console.error(`  [${lang}] ERROR:`, err.message);
      }
    }
  }

  // Summary
  const total = await client.execute("SELECT locale, COUNT(*) as n FROM BlogPost GROUP BY locale");
  console.log('\n── Final count ──');
  for (const row of total.rows) console.log(`  ${row.locale}: ${row.n} article(s)`);

  client.close();
}

run().catch(e => { console.error('FATAL:', e.message); client.close(); });
