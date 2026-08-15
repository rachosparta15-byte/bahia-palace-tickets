/**
 * Repoint the "book your ticket" links inside blog articles at the page that
 * can actually take money.
 *
 * WHY
 *
 * Crawling all 139 published articles found 130 in-prose links whose anchor
 * text asks the reader to buy — "Book your ticket here", "Réservez votre billet
 * ici", "Buchen Sie Ihre Bahia Palace Tickets online" — and every one of them
 * landed on a page with no checkout:
 *
 *     81  /<locale>/tickets/skip-the-line   no checkout form
 *     44  /<locale>/tickets                 no checkout form
 *      5  /<locale>/tickets/guided-tour     307s to skip-the-line, so the
 *                                           anchor promises a guided tour and
 *                                           the reader is shown a different
 *                                           product
 *
 * /visitor-pack is the only page on the site with a checkout. Someone who read
 * 1,500 words, decided, and clicked "Book your ticket here" was being asked to
 * click again.
 *
 * It costs rankings as well as orders. Editorial links are the strongest signal
 * a site controls, and 130 of the most commercial anchors on it were pointing
 * away from the page meant to rank for commercial queries. Search Console for
 * the 28 days to 2026-08-15: position 4.8 for "bahia palace photos", position
 * 10.0 for "bahia palace tickets".
 *
 * WHAT IT DOES NOT TOUCH
 *
 * 102 links whose anchors are informational — "what the ticket includes",
 * "ticket prices" — stay where they are. Those readers want the explainer, and
 * /tickets is the explainer. Only the verb-led anchors move.
 *
 * Subpaths other than the three above are left alone entirely.
 *
 * SAFETY
 *
 * Dry run unless --write is passed. With --write it prints every change as it
 * makes it and stores the previous content of each row in
 * scripts/.repoint-backup.json, so `--restore` puts it all back.
 *
 * NEEDS THE PRODUCTION DATABASE_URL. It is deliberately not in .env.local (see
 * src/lib/db/index.ts) — take it from the Vercel project settings and pass it
 * on the command line, do not paste it into a file:
 *
 *     DATABASE_URL="libsql://…" TURSO_AUTH_TOKEN="…" npx tsx scripts/repoint-buy-links.ts
 *     DATABASE_URL="libsql://…" TURSO_AUTH_TOKEN="…" npx tsx scripts/repoint-buy-links.ts --write
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import prisma from '../src/lib/db';

const WRITE = process.argv.includes('--write');
const RESTORE = process.argv.includes('--restore');
const BACKUP = path.join(process.cwd(), 'scripts', '.repoint-backup.json');

/** Anchors that mean "I want to buy now", in the five published languages. */
const BUY =
  /\b(book|buy|reserve|purchase|order|r[ée]serv|achet|comprar|reserva|prenot|acquist|buchen|kaufen|bestell)/i;

/** The three destinations that cannot take money. */
const DEAD_END = /^\/([a-z]{2})\/tickets(?:\/(?:skip-the-line|guided-tour))?\/?$/;

const BASE = 'https://www.visitbahiapalace.com';

async function restore() {
  if (!existsSync(BACKUP)) {
    console.error('  no backup file — nothing to restore');
    process.exit(1);
  }
  const rows: Array<{ id: string; content: string }> = JSON.parse(readFileSync(BACKUP, 'utf8'));
  for (const r of rows) {
    await prisma.blogPost.update({ where: { id: r.id }, data: { content: r.content } });
  }
  console.log(`  restored ${rows.length} articles`);
}

async function main() {
  if (RESTORE) return restore();

  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { id: true, slug: true, locale: true, content: true },
  });

  const backup: Array<{ id: string; content: string }> = [];
  let changed = 0;
  let touchedPosts = 0;
  let leftAlone = 0;

  for (const post of posts) {
    if (!post.content) continue;
    let n = 0;

    const next = post.content.replace(
      /<a\b([^>]*?)href="([^"]+)"([^>]*)>([\s\S]*?)<\/a>/gi,
      (whole, pre: string, href: string, post2: string, inner: string) => {
        const anchor = inner.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        if (!anchor) return whole;

        const p = href.replace(BASE, '').split('#')[0].split('?')[0];
        const m = p.match(DEAD_END);
        if (!m) return whole;

        if (!BUY.test(anchor)) {
          leftAlone++;
          return whole;
        }

        n++;
        console.log(`    ${post.locale}/${post.slug}`);
        console.log(`        "${anchor.slice(0, 60)}"`);
        console.log(`        ${href}  ->  /${m[1]}/visitor-pack#checkout`);
        return `<a${pre}href="/${m[1]}/visitor-pack#checkout"${post2}>${inner}</a>`;
      },
    );

    if (n === 0) continue;
    changed += n;
    touchedPosts++;
    backup.push({ id: post.id, content: post.content });

    if (WRITE) {
      await prisma.blogPost.update({ where: { id: post.id }, data: { content: next } });
    }
  }

  if (WRITE) {
    writeFileSync(BACKUP, JSON.stringify(backup, null, 2), 'utf8');
    console.log(`\n  WROTE ${changed} links across ${touchedPosts} articles`);
    console.log(`  previous content saved to ${BACKUP}`);
    console.log('  undo with: npx tsx scripts/repoint-buy-links.ts --restore');
  } else {
    console.log(`\n  DRY RUN — nothing written`);
    console.log(`  would change ${changed} links across ${touchedPosts} articles`);
    console.log(`  would leave ${leftAlone} informational links alone`);
    console.log('  run again with --write to apply');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
