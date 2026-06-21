/**
 * Reads blog-articles/{en,fr,de,it,es}/*.{html,md} and upserts them
 * into prisma.blogPost as published articles.
 *
 * Safe to re-run — uses upsert. Existing records are updated, not duplicated.
 *
 * Usage:
 *   npx tsx scripts/seed-blog-articles.ts
 */
// Load .env.local first (Turso creds), then .env as fallback — mirrors Next.js behaviour.
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });
import fs from 'node:fs';
import path from 'node:path';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url     = process.env.DATABASE_URL ?? 'file:./dev.db';
const adapter = new PrismaLibSql({ url, ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}) });
const prisma  = new PrismaClient({ adapter });

const BLOG_DIR    = path.join(process.cwd(), 'blog-articles');
const LOCALES     = ['en', 'fr', 'de', 'it', 'es'] as const;
const PUBLISHED_AT = new Date('2026-01-15T00:00:00.000Z');

// ─── Parsers ──────────────────────────────────────────────────────────────────

/** Parse YAML-like frontmatter from .md files (fr / de / it / es). */
function parseMd(raw: string): { fm: Record<string, string>; body: string } | null {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return null;
  const fm: Record<string, string> = {};
  for (const line of m[1].split('\n')) {
    const ci = line.indexOf(':');
    if (ci < 1) continue;
    // Use first colon only — values like "Palais Bahia : guide" contain colons too.
    fm[line.slice(0, ci).trim()] = line.slice(ci + 1).trim();
  }
  return { fm, body: m[2].trim() };
}

/** Parse custom header from .html files (en only). */
function parseHtml(raw: string): { title: string; fm: Record<string, string>; body: string } | null {
  const SEP = '---CONTENT---';
  const si  = raw.indexOf(SEP);
  if (si === -1) return null;
  const header = raw.slice(0, si);
  const body   = raw.slice(si + SEP.length).trim();
  const lines  = header.split('\n');
  const title  = lines[0].replace(/^#+\s*/, '').trim();
  const fm: Record<string, string> = {};
  for (const line of lines.slice(1)) {
    const ci = line.indexOf(':');
    if (ci < 1) continue;
    const key = line.slice(0, ci).trim();
    const val = line.slice(ci + 1).trim();
    if (key && val) fm[key] = val;
  }
  return { title, fm, body };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  let processed = 0;
  let skipped   = 0;

  for (const locale of LOCALES) {
    const dir = path.join(BLOG_DIR, locale);
    if (!fs.existsSync(dir)) {
      console.log(`⚠  Missing folder: blog-articles/${locale}/ — skipping`);
      continue;
    }

    const ext   = locale === 'en' ? '.html' : '.md';
    const files = fs.readdirSync(dir).filter(f => f.endsWith(ext)).sort();
    console.log(`\n[${locale}] — ${files.length} file(s)`);

    for (const file of files) {
      const slug = file.replace(/\.(html|md)$/, '');
      const raw  = fs.readFileSync(path.join(dir, file), 'utf-8');

      let title:      string;
      let seoTitle:   string | null;
      let seoDesc:    string | null;
      let excerpt:    string | null;
      let coverImage: string | null;
      let category:   string;
      let tags:       string | null;
      let author:     string | null;
      let body:       string;

      if (locale === 'en') {
        const p = parseHtml(raw);
        if (!p) { console.log(`  ⚠  ${file} — parse error, skipped`); skipped++; continue; }
        title      = p.title;
        seoTitle   = p.fm.seoTitle   ?? null;
        seoDesc    = p.fm.seoDesc    ?? null;
        excerpt    = p.fm.excerpt    ?? null;
        coverImage = p.fm.coverImage ?? null;
        category   = p.fm.category  || 'practical';
        tags       = p.fm.tags      ?? null;
        author     = p.fm.author    ?? null;
        body       = p.body;
      } else {
        const p = parseMd(raw);
        if (!p) { console.log(`  ⚠  ${file} — parse error, skipped`); skipped++; continue; }
        title      = p.fm.meta_title       || slug;
        seoTitle   = p.fm.meta_title       ?? null;
        seoDesc    = p.fm.meta_description ?? null;
        excerpt    = p.fm.excerpt          ?? null;
        coverImage = p.fm.coverImage       ?? null;
        category   = p.fm.category        || 'practical';
        tags       = p.fm.tags            ?? null;
        author     = p.fm.author          ?? null;
        body       = p.body;
      }

      await prisma.blogPost.upsert({
        where: { slug_locale: { slug, locale } },
        update: {
          title, excerpt, content: body, coverImage, category, tags,
          seoTitle, seoDesc, published: true, publishedAt: PUBLISHED_AT,
          ...(author !== null ? { author } : {}),
        },
        create: {
          title, slug, locale, excerpt, content: body, coverImage, category, tags,
          seoTitle, seoDesc, author: author ?? 'Bahia Palace Team',
          published: true, publishedAt: PUBLISHED_AT,
        },
      });

      console.log(`  ✓  [${locale}] ${slug}`);
      processed++;
    }
  }

  console.log(`\n✅  Done — ${processed} upserted, ${skipped} skipped.`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
