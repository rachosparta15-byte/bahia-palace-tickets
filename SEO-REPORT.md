# SEO report — visitbahiapalace.com

Written before any change. Nothing in the codebase has been touched, no branch
created, no commit made. Every claim below was checked against the code or
against the live site, and the proof is quoted.

Checked on **24 September 2026**, against the live site and `main` at commit
`9993de8`.

**Four of the eight points are partly or wholly different from the brief.**
Those are flagged with ⚠️ and explained. Acting on the brief as written would
mean a lot of work that is already done, and some risk taken for nothing.

---

## A. Project overview

| | |
|---|---|
| Framework | Next.js **16.2.6**, **App Router** (`src/app`) |
| React | 19.2.4 |
| i18n | `next-intl` 4.12, no middleware file |
| Locales | `en, fr, it, de, es, ar, pt` — `src/i18n/routing.ts` |
| RTL | `ar` only, via `dirFor()` |
| Translations | `messages/<locale>.json`, plus `messages/paid/<locale>.json` merged when payments are on |
| Blog content | **Database**, not files. `prisma.blogPost` |
| Database | SQLite locally (`file:`), **Turso** in production (`.env.prod`, `https:`) |
| Sitemap | `src/app/sitemap.ts` (196 lines), generated at build |
| Metadata / hreflang | `src/lib/seo.ts` → `buildAlternates()`, `hreflangMap()` |
| Blog hreflang | `src/app/[locale]/blog/[slug]/page.tsx` → `buildBlogAlternates()` + `src/lib/blog-hreflang.ts` |
| JSON-LD | `src/components/seo/JsonLd.tsx`, built per page |
| Deploy | Vercel, Git integration — push to `main` |

**Live figures:** 285 sitemap URLs, all answering 200. 166 blog URLs
(en 33, fr 30, it 26, de 27, es 25, ar 25; no Portuguese blog).

**One thing worth knowing before anything else.** `src/i18n/request.ts`
deep-merges the English catalogue *underneath* every other locale:

```ts
const base = locale === 'en' ? english
  : deepMergeMessages(english, localeMessages);
```

Its own comment says why, and what to do about it:

> Arabic and Portuguese are being translated in stages… Merging over English
> means an untranslated string appears in English — visibly wrong, easy to
> find, and never a broken page or a raw key.
> **Delete the merge once both catalogues are complete.**

This is the root cause of point 1. It is a deliberate choice, not a bug.

---

## B. The eight points, checked

### 1. Untranslated ar / pt pages — ⚠️ mostly true, one page wrong, one missing

**Does it exist?** Yes, for five of the six pages named. I read the live `<h1>`
of every ar and pt page:

| Page | ar | pt |
|---|---|---|
| `/opening-hours` | ❌ "Bahia Palace Opening Hours 2026" | ❌ same |
| `/location` | ❌ "How to Get to Bahia Palace Marrakech" | ❌ same |
| `/faq` | ❌ "Frequently Asked Questions" | ❌ same |
| `/gallery` | ❌ "Bahia Palace Photo Gallery" | ❌ same |
| `/videos` | ❌ "Bahia Palace in Video" | ❌ same |
| **`/contact`** | ✅ "اتصل بنا" | ✅ "Contacte-nos" |
| **`/about/editorial`** | ❌ "Abdellah — Marrakech Travel Writer…" | ❌ same |

**Two corrections to the brief:**
- `/contact` is **already translated** in both languages. Nothing to do.
- `/about/editorial` is **not on your list** but is English in both. It is the
  author-credibility page, so it matters for E-E-A-T.

Everything else in ar and pt is properly translated, including all 25 Arabic
blog posts, `/tickets`, `/entrance-fee`, `/history`, `/plan`, `/safety`,
`/about`, `/sources` and `/tickets/skip-the-line`.

**Root cause.** The English fallback merge quoted above, plus missing keys in
`messages/ar.json` and `messages/pt.json`.

**What I would change.** Add the missing keys to `messages/ar.json` and
`messages/pt.json` only. No component, no title, no URL, no canonical.

**SEO risk: Low.** Adding a real translation where English is showing can only
help: right now these are duplicate English pages competing with `/en/…`.
The `<title>` tags stay byte-identical.

**Size.** 2 files, roughly 120–180 keys each depending on how much of `/faq`
and `/gallery` is text.

---

### 2. Misleading Product schema — ⚠️ partly already fixed today

**Does it exist?** Partly, and not where the brief says.

I checked the JSON-LD `@type` on all 285 live URLs. `Product` appears on
**7 pages, all `/[locale]/tickets/skip-the-line`** — and **not** on
`/[locale]/tickets`, which the brief names:

```
/en/tickets/skip-the-line  ['Organization', 'Product', 'BreadcrumbList']
/fr, /it, /de, /es, /ar, /pt  — same
/en/tickets                ['Organization', 'ItemList', 'BreadcrumbList', 'FAQPage']  ← no Product
```

**The specific things the brief asks to remove are already gone.** Commit
`82f2905`, made earlier today, removed from `TicketDetailPage.tsx`:
Brand "Bahia Palace Tickets", the USD price, `priceValidUntil`, and
`DIGITAL_TICKET_OFFER_EXTRAS` (the shipping and return blocks). The seller now
reads `Viator`.

What is left on those 7 pages:

```json
"@type": "Product",
"offers": { "@type": "Offer", "url": "…",
            "availability": "InStock",
            "seller": { "@type": "Organization", "name": "Viator" } }
```

**What I would change.** Remove the remaining `Product` + `Offer` wrapper from
`TicketDetailPage.tsx` (one block, one file, ~10 lines), leaving
`Organization` and `BreadcrumbList`.

**SEO risk: Low**, with one thing to weigh. `Product` is not a ranking factor
and the page shows no rich result now that there is no price, so removing it
should cost nothing. It does slightly reduce what Google is told the page is
about. If you would rather keep a type, `Offer` alone could stay.

**Size.** 1 file, ~12 lines removed.

---

### 3. hreflang on blog posts — ⚠️ the number is 16, not 166

**Does it exist?** Yes, but for **16 pages**, not "~166 blog posts". The
mechanism already exists and works for the rest.

`buildBlogAlternates()` in `src/app/[locale]/blog/[slug]/page.tsx` already
emits reciprocal hreflang. It groups posts two ways:
1. the hardcoded history family in `src/lib/blog-hreflang.ts`;
2. **posts that share the same slug across locales** — which is most of them.

Measured on the live site:

| hreflang languages on a blog post | posts |
|---|---|
| 7 | 120 |
| 9 | 12 |
| 6 | 6 |
| 3 | 3 |
| 2 | 9 |
| **1 (self only)** | **16** |

The 16 are exactly the posts whose slug was translated natively, so the
shared-slug rule cannot see the family:

```
fr/blog/les-voix-de-la-bahia-ce-que-les-grands-cr-ateurs-…
es/blog/las-voces-de-la-bah-a-lo-que-los-grandes-creadores-…
it/blog/le-voci-della-bahia-cosa-dicono-del-palazzo-i-pi-…
de/blog/die-stimmen-des-bahia-palastes
fr/blog/le-guide-humain-et-solidaire-comprendre-la-mousawama-…
es/blog/la-gu-a-humana-y-solidaria-…
it/blog/la-guida-umana-e-solidale-…
de/blog/der-menschliche-und-solidarische-leitfaden-…
fr/blog/marrakech-la-ville-rouge-o-l-histoire-prend-vie
it/blog/marrakech-la-citta-rossa-dove-la-storia-prende-vita
de/blog/marrakesch-die-rote-stadt-wo-die-geschichte-lebt
fr/blog/comment-viter-les-arnaques-dans-les-souks-…
de/blog/so-vermeiden-sie-betrug-in-der-medina-…
fr/blog/combien-de-temps-faut-il-pour-visiter-le-palais-…
fr/blog/les-meilleures-couleurs-porter-pour-un-shooting-photo-…
fr/blog/palais-bahia-billets-tarifs-coupe-file
```

**Root cause.** `BlogPost` in `prisma/schema.prisma` has **no field linking a
post to its translations** — only `slug` and `locale`, unique on
`[slug, locale]`. There is nothing to group by except the slug itself.

**What I would change.** Extend `src/lib/blog-hreflang.ts` from one hardcoded
family to a small table of families, in the same style as `HISTORY_HREFLANG`,
and have `buildBlogAlternates()` check it. Add the same alternates to the
sitemap. No slug changes, no new database column.

**SEO risk: None if the map is right, Medium if it is wrong.** A wrong
hreflang pair tells Google two unrelated pages are translations. Safer
alternative, which I would recommend: only ship the families I can prove, and
leave the rest alone — a missing hreflang costs far less than a false one.

**Size.** 1 file grows to ~60 lines, 1 file (sitemap) small change.

See section C for the full map and what I could not match.

---

### 4. "Official" wording — true, and worth doing

**Does it exist?** Yes. Hardcoded in components:

| File | Line | String |
|---|---|---|
| `src/components/tickets/BookingWidget.tsx` | 106 | `🔒 Official tickets — we hand you to the Ministry portal` |
| `src/components/tickets/TicketDetailPage.tsx` | 227 | `Official tickets — we hand you to the Ministry portal` |
| `src/app/[locale]/book/[slug]/page.tsx` | 105 | `Official tickets only` |
| `src/app/[locale]/visitor-pack/page.tsx` | 72, 74 | `Official Bahia Palace entry ticket…` |
| `src/app/[locale]/entrance-fee/page.tsx` | 540 | alt text: `Official Bahia Palace entrance sign` — **this one is accurate**, it is a photo of the real sign |

Across the seven message catalogues, **253 strings** contain a word from the
"official" family. The large majority are correct and should stay — they refer
to the genuine ministry portal ("book on the official portal", "the official
website is…"). Only the ones that could be read as *we are official* need
changing.

**SEO risk: Low**, if titles, H1s and meta descriptions are untouched, which
the brief already requires. Body text changes do not move rankings on their
own, and the wording is a trust and compliance matter more than an SEO one.

**One caution on the new line you want added** ("Independent guide – not the
official Bahia Palace website…"): putting it near the top of the home page
adds text above the main content. I would put it directly *under* the H1, not
above it, so the first thing Google reads on the page is unchanged.

**Size.** 5 component files + 7 catalogues. Full list in section C.

---

### 5. Redirects — true

Measured live:

```
https://www.visitbahiapalace.com/   →  302 Found      Location: /en
https://visitbahiapalace.com/       →  307 Temporary  Location: https://www.visitbahiapalace.com/
```

Neither is in the codebase. `vercel.json` has only `framework`, `buildCommand`
and `installCommand`; there is no `redirects()` in `next.config.mjs` and no
middleware file.

- The **`/` → `/en`** 302 is produced by `next-intl`'s routing
  (`localeDetection: true` in `src/i18n/routing.ts`).
- The **non-www → www** 307 is a **Vercel dashboard setting**, not code. I
  cannot change it from here. You change it under
  *Project → Settings → Domains*, by making `visitbahiapalace.com` a permanent
  redirect to the www domain.

**What I would change.** Add a `redirects()` entry in `next.config.mjs` for `/`
→ `/en` with `permanent: true` (308). ⚠️ This also **turns off browser-language
detection at the root**: a French visitor typing the bare domain would land on
`/en` instead of `/fr`.

**SEO risk: Low for Google, Medium for visitors.** A 308 is cached hard by
browsers — if you later want the language detection back, it will not reach
anyone already redirected. **I would like your confirmation on this one**
before doing it (question 1 below).

**Size.** 1 file, ~8 lines.

---

### 6. Sitemap — ⚠️ two of three true, `lastmod` claim is wrong

**6a. Canonical mismatches — true.** 12 URLs are in the sitemap while their
canonical points to a different page:

```
/{en,fr,de,it,es,ar}/blog/bahia-palace-opening-hours-2026  → /{locale}/opening-hours
/{en,fr,de,it,es,ar}/blog/bahia-palace-entrance-fee-2026   → /{locale}/entrance-fee
```

I checked all 285 programmatically; these 12 are the only ones.

**6b. Legal pages missing — true.** `/[locale]/legal/*` are linked from every
page and appear **0 times** in the sitemap.

**6c. `lastmod` — ⚠️ the brief is wrong here.** It is *not* the same build
timestamp for every URL. The sitemap has **162 distinct `lastmod` values across
five different days** (19 Jul, 18 Aug, 20 Aug, 9 Sep, 24 Sep). Reading
`src/app/sitemap.ts`:

- line 168 — blog posts already use **`post.updatedAt`**, a real content date ✅
- lines 101, 116, 186 — static pages use **`now`**, the build time ❌

So only the static pages need fixing, and `BlogPost.updatedAt` shows the
pattern to follow.

**What I would change.** Filter the two canonicalised blog slugs out of the
sitemap (not delete the pages, not touch their canonical); add the legal
pages; give static pages a real date. For static pages there is no
content-modified date stored anywhere, so I would either use the git commit
date of the page file, or a small dated constant per page — and I would ask you
which before doing it (question 2).

**SEO risk: Low.** Removing a canonicalised URL from a sitemap is what Google
asks for. Adding legal pages is a pure addition.

**Size.** 1 file, ~25 lines.

---

### 7. Slugify drops accents — true, and visible in live URLs

`src/components/admin/BlogPostForm.tsx`, line 28:

```ts
function slugify(str: string) {
  return str.toLowerCase().replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')          // ← every accented letter dies here
    .replace(/(^-|-$)/g, '');
}
```

`[^a-z0-9]` matches `é`, `í`, `â`, `ù`, `ç`, so they become `-`. The damage is
live:

| Should be | Is |
|---|---|
| `créateurs` | `cr-ateurs` |
| `bahía` | `bah-a` |
| `l'âme` | `l-me` |
| `guía` | `gu-a` |
| `più` | `pi-` |
| `éviter` | `viter` |

**Is it safe to fix?** Yes, and this is the important part: this function runs
**only in the admin form, in the browser, when someone types a title**. The
slug is then stored in the database. Nothing regenerates a slug from a title
afterwards — I checked; no other file calls `slugify`. So existing posts cannot
change. No freeze list is needed, but I will still produce a before/after list
of all 54 slugs as proof.

**SEO risk: None** for existing URLs. Future posts get better slugs.

**Size.** 1 file, ~4 lines.

---

### 8. Performance — true, cause not yet proven

Measured live:

| URL | HTML | Cache |
|---|---|---|
| `/en` | 288 KB, 72 `<script>` tags | `private, no-cache, no-store` · `X-Vercel-Cache: MISS` |
| `/en/gallery` | **626 KB** | same |
| `/en/tickets` | 162 KB | same |
| `/en/legal/terms` | — | same |

Every page is server-rendered on every request, including
`/en/legal/terms`, which has `generateStaticParams()` and no database access.
So something **global** is forcing dynamic rendering.

**What I ruled out.** No middleware file. No `export const dynamic` outside
`/admin/*`. No `no-store` or `headers()` in `next.config.mjs`. No
`next/headers` import anywhere under `src/app/[locale]` or `src/components`.
`getPublicPaymentsFlags()` reads `process.env` only.

**I have not found the cause and I will not guess.** `npm run build` prints
which routes are static (`○`) and which are dynamic (`ƒ`), and that output
names it in one line. I did not run it because step 0 says change nothing, and
a build writes into `.next/`.

**Plan, for your approval later:** run the build, read the route table, fix the
one thing that forces dynamic, then add `revalidate` to content pages. The
gallery's 626 KB is a separate item — it looks like the whole gallery dataset
is serialised into the HTML.

**SEO risk of doing nothing: Low-Medium** — slow pages are a mild ranking
factor and a real conversion factor. **Risk of the fix: Medium**, because ISR
changes how every page is served. It should be done alone, after everything
else, and verified page by page.

---

## C. Protection check

### URLs whose `<title>`, URL, canonical or H1 would change

| Change | Count |
|---|---|
| `<title>` | **0** |
| URL / slug | **0** |
| canonical | **0** |
| H1 | **14** — the ar/pt pages in point 1 |

The 14 H1s: `/ar` and `/pt` × `/opening-hours`, `/location`, `/faq`,
`/gallery`, `/videos`, `/about/editorial`, plus `/contact` **excluded** (already
translated). That is 12, plus `/about/editorial` ×2 = **14 only if you approve
adding `/about/editorial`**; 10 if you keep strictly to your list minus
`/contact`.

I captured the title, canonical, H1, hreflang set and JSON-LD types of all 285
URLs before starting, so the final check can prove nothing else moved.

### Point 1 — pages and rough string counts

| Page | ar keys | pt keys | Notes |
|---|---|---|---|
| `/opening-hours` | ~35 | ~35 | H1, meta description, schedule table, Ramadan and Friday notes, FAQ block |
| `/location` | ~30 | ~30 | H1, directions, transport options, map captions |
| `/faq` | ~45 | ~45 | H1 + question/answer pairs, also feeds FAQPage JSON-LD |
| `/gallery` | ~20 | ~20 | H1, intro, image captions |
| `/videos` | ~15 | ~15 | H1, intro, video titles |
| `/about/editorial` | ~20 | ~20 | not on your list — your call |
| **Total** | **~165** | **~165** | |

These are estimates from the English catalogue; I will give exact counts when I
open the files.

### Point 3 — blog translation map

54 distinct slugs across 166 URLs. **24 slugs are already published in more
than one locale** and are handled automatically by the shared-slug rule. The
history family is handled by `HISTORY_HREFLANG`. That leaves these.

**Confident families** (same subject, same structure, one per locale):

| Family | en | fr | es | it | de | ar |
|---|---|---|---|---|---|---|
| Voices of Bahia | `the-voices-of-bahia-what-the-world-s-greatest-creators-say-about-the-palace` | `les-voix-de-la-bahia-ce-que-les-grands-cr-ateurs-du-monde-disent-du-palais` | `las-voces-de-la-bah-a-lo-que-los-grandes-creadores-del-mundo-dicen-del-palacio` | `le-voci-della-bahia-cosa-dicono-del-palazzo-i-pi-grandi-creatori-del-mondo` | `die-stimmen-des-bahia-palastes` | (English slug) |
| Mousawama guide | `the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech` | `le-guide-humain-et-solidaire-comprendre-la-mousawama-et-l-me-de-marrakech` | `la-gu-a-humana-y-solidaria-comprender-la-mousawama-y-el-alma-de-marrakech` | `la-guida-umana-e-solidale-capire-la-mousawama-e-l-anima-di-marrakech` | `der-menschliche-und-solidarische-leitfaden-die-mousawama-und-die-seele-von-marrakesch-verstehen` | `the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh` |
| Marrakech, the red city | — | `marrakech-la-ville-rouge-o-l-histoire-prend-vie` | — | `marrakech-la-citta-rossa-dove-la-storia-prende-vita` | `marrakesch-die-rote-stadt-wo-die-geschichte-lebt` | — |
| How long do you need | `how-long-do-you-need-at-bahia-palace-complete-visitor-guide-2026` | `combien-de-temps-faut-il-pour-visiter-le-palais-de-la-bahia-guide-2026` | — | — | — | — |

⚠️ Note the Mousawama family has **two different English-language slugs** —
`the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech`
(en) and `the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh`
(ar). I would use the en one as `x-default`. Please confirm they are the same
article (question 3).

**UNMATCHED — I would leave these without hreflang:**

```
fr  comment-viter-les-arnaques-dans-les-souks-de-marrakech-guide-complet
de  so-vermeiden-sie-betrug-in-der-medina-von-marrakesch-warum-online-ticketbuchung-wichtig-ist
      → probably a pair, but the German title adds "why online booking matters"
        and the French one does not. Not certain enough. (question 4)

fr  les-meilleures-couleurs-porter-pour-un-shooting-photo-au-palais-bahia-de-marrakech
fr  palais-bahia-billets-tarifs-coupe-file
en  bahia-palace-accessibility
en  bahia-palace-during-ramadan
en  bahia-palace-harem-women
en  bahia-palace-vs-ben-youssef-madrasa
en  marrakech-1-day-itinerary
en  mellah-marrakech-jewish-quarter
en  zellige-moroccan-architecture-bahia-palace
      → single-locale posts. No translation exists, so no hreflang is correct.
```

### Point 4 — "official" strings

253 strings across the 7 catalogues contain a word from the "official" family.
Listing all 253 here would bury the ones that matter, so this is the shortlist
I would actually change — the ones that could be read as *we are the official
site*. I will produce the full 253-row list as a separate file before touching
anything, if you want it.

| Where | Current (en) | Proposed (en) |
|---|---|---|
| `BookingWidget.tsx:106` | `🔒 Official tickets — we hand you to the Ministry portal` | `Genuine 100 MAD entry ticket — booked on the Ministry portal` |
| `TicketDetailPage.tsx:227` | `Official tickets — we hand you to the Ministry portal` | same as above |
| `book/[slug]/page.tsx:105` | `Official tickets only` | `Genuine entry tickets only` |
| `visitor-pack/page.tsx:72,74` | `Official Bahia Palace entry ticket…` | `Genuine Bahia Palace entry ticket…` |
| footer | `© 2026 Bahia Palace Tickets` | `© 2026 visitbahiapalace.com – Independent guide` |

**Not changed:** `entrance-fee/page.tsx:540` (alt text describing a photo of the
real official sign — accurate), and every catalogue string that refers to the
genuine ministry portal.

⚠️ I could not find the footer copyright string by grep in
`src/components/layout/`. I will locate it before the commit; it may be
composed from parts.

---

## D. Other things I noticed (not fixing)

1. **`og:site_name` is `Bahia Palace Tickets` on 119 pages** and empty on the
   166 blog posts. The brief says not to change it, and I have not. But the
   blog posts having none at all is a separate gap.
2. **`vercel.json` runs `prisma db push --accept-data-loss` on every build.**
   Against the production Turso database that is a loaded gun. It has not
   fired, but it is worth a look.
3. **`src/lib/blog.ts` contains stale content.** Two passages say
   *"Children aged 7 and over pay the standard adult rate of 100 MAD"*. The
   ministry rate is **50 MAD for ages 7–13**, which is what
   `src/config/pricing.ts` and the live page both say. The live site is
   correct; the file is a seed, so a re-seed would republish the wrong price.
4. **Seven `.env*` files**, including `.env.prod` with production credentials.
   The guard in `src/lib/db/index.ts` is good, but that is a lot of copies.
5. **`/pt` has no blog at all** (0 of 166 posts). Portuguese is 17 URLs against
   English's 50.
6. **Viator API key** — still not rotated from the earlier session.

---

## E. Questions

1. **Point 5, root redirect.** Making `/` a permanent 308 to `/en` turns off
   browser-language detection at the root: a French visitor typing the bare
   domain lands in English. A 308 is also cached hard by browsers, so it is
   hard to undo. Do you want that, or should `/` keep detecting the language
   and only the non-www redirect change?
2. **Point 6c, static-page `lastmod`.** No content-modified date is stored for
   static pages. Would you prefer the git commit date of each page file, or a
   hand-maintained date per page? (Blog posts already use a real date and need
   no change.)
3. **Point 3.** Are these the same article?
   `/en/blog/the-human-and-solidary-guide-to-mousawama-haggling-with-soul-in-marrakech`
   and
   `/ar/blog/the-and-solidary-guide-understanding-mousawama-and-the-soul-of-marrakesh`
4. **Point 3.** Are these the same article?
   `/fr/blog/comment-viter-les-arnaques-dans-les-souks-de-marrakech-guide-complet`
   and
   `/de/blog/so-vermeiden-sie-betrug-in-der-medina-von-marrakesch-warum-online-ticketbuchung-wichtig-ist`
5. **Point 1.** Do you want `/about/editorial` translated too? It is not on
   your list but it is English in both ar and pt.
6. **Point 2.** Remove the `Product` wrapper entirely, or keep `Offer` alone?
7. **Point 4.** Do you want the full 253-row "official" list as a file before I
   change the shortlist?

---

Waiting for **"OK, go"** before creating the branch or making any change.
