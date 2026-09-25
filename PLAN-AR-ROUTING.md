# /ar language routing — plan

Branch `ar-language-routing`, off `main` at `b8a73c4`. Nothing has been
changed yet. This is STEP 0.

**Two things need your decision before any code.** They are in *Risks* at the
bottom, and the second one may change the shape of the whole feature.

---

## Your question first: what does `/` do today?

Measured live, just now:

| Accept-Language | Status | Location | Cookie set |
|---|---|---|---|
| `fr-FR` | **302** | `/fr` | `NEXT_LOCALE=fr`, 2 years |
| `ar-MA` | **302** | `/ar` | `NEXT_LOCALE=ar` |
| `it-IT` | **302** | `/it` | `NEXT_LOCALE=it` |
| `pt-BR` | **302** | `/pt` | `NEXT_LOCALE=pt` |
| `ja-JP` | **302** | `/en` | `NEXT_LOCALE=en` |
| **Googlebot UA** | **301** | `/en` | — |

So yes: `/` already detects Accept-Language and answers **302** to the matching
locale, setting a two-year cookie. Bots get a **301 to `/en`** instead — the
code checks the user agent against a bot list before anything else.

This lives in `src/proxy.ts` (Next 16's name for middleware), section 2. It is
not touched by this plan.

**What this means for your idea of pointing the Maps button at `/`:** it would
already work. A French visitor clicking it lands on `/fr`, an Arabic one on
`/ar`, and Googlebot on `/en`. The mechanism you want exists; the problem is
only that the button points at `/ar` instead.

---

## What is where

| | |
|---|---|
| Middleware | `src/proxy.ts` — www redirect, root locale detection, 410s, admin |
| Routing | `src/i18n/routing.ts` — 7 locales, `localeDetection: true`, `localeCookie: true` |
| Root layout | `src/app/layout.tsx` — `<html lang dir>`, `<head>` with AdSense, org JSON-LD in `<body>` |
| Locale layout | `src/app/[locale]/layout.tsx` — Header, Footer, CookieBanner, Analytics |
| Home page | `src/app/[locale]/page.tsx` — Hero, PracticalBar, TicketOptions, NearbyMonuments, FaqSection… |
| Language switcher | `src/components/layout/Header.tsx` → `switchLocale()` |
| Hours | `src/config/booking-window.ts` — `MONUMENT_TZ = 'Africa/Casablanca'`, `CLOSING_HOUR = 17` |
| AdSense | `src/config/adsense.ts` — `ADSENSE_SLOTS` |

### One thing that will make step 5 bigger than it looks

Viator URLs are **written out in full at every call site**, not built by a
helper:

```
src/app/[locale]/entrance-fee/page.tsx   campaign=visitbahiapalace-entrancefee-skipline
src/app/[locale]/page.tsx                campaign=visitbahiapalace-seo
src/components/homepage/TicketCards.tsx  campaign=visitbahiapalace-ticketcards
src/components/homepage/TicketOptions.tsx  four more
```

Adding a runtime campaign (`ar-redirect`, `maps-panel`) means either editing
every one of those strings, or introducing a small helper they all call. I
propose the helper — one function, one place, and the campaign can then vary
per visitor without touching the markup again. It is a refactor of existing
strings, and the resulting URLs for normal visitors will be byte-identical to
today's. I will prove that in the test table.

---

## Step 1 — the redirect script

**Where:** `src/app/layout.tsx`, inside the existing `<head>`, as a plain
`<script dangerouslySetInnerHTML>` — not `next/script`, which defers. Inline,
synchronous, in `<head>`, so it runs before the first paint and there is no
flash.

**Guarded so it only exists on `/ar`:** the root layout knows the locale
(`await getLocale()`), so the script tag is rendered only when `locale === 'ar'`.
Every other page's HTML is byte-identical to today's.

The script, in order, and it exits at the first failure:

1. `location.pathname` starts with `/ar` and has no `lang=ar` in the query
2. `sessionStorage` is readable and `langRedirectDone` is unset — wrapped in
   try/catch, and **a throw means do not redirect**
3. the user agent matches none of the bot patterns
4. `document.referrer`'s hostname is a Google one
5. `navigator.languages` contains no `ar`, and its first entry that matches
   our six other locales wins (`pt-BR` and `pt-PT` → `pt`)

Then: set the flag, and `location.replace()` to the same path with the locale
swapped, keeping query and hash.

**On `src=ar-redirect`:** I will **not** add it to the URL. The canonical on
every page is built by `buildAlternates()` from the path alone, so a query
parameter would not change the canonical tag — but it would create a second
crawlable URL if anyone links or shares it, and it is not needed: the
destination can read `document.referrer` to know it came from `/ar`. If you
want the parameter for analytics, say so and I will add it and re-verify the
canonical on the destination.

**Bot list:** the explicit names you gave, plus the generic
`bot|crawl|spider|preview|lighthouse|headless|pagespeed`. Note that this also
excludes Lighthouse and PageSpeed, so a performance run on `/ar` measures the
Arabic page, not a redirect.

## Step 2 — the banner

Client component on the `/ar` home page. Shows when the redirect did not fire
and `navigator.languages` matches one of our locales without matching Arabic.
Dismissal in `localStorage`, try/catch.

**Rendered client-side only**, so the server HTML of `/ar` gains nothing but
the inline script — which is what keeps the byte-for-byte diff clean.

On the destination pages, a small "عرض الصفحة بالعربية" link pointing to
`/ar?lang=ar`, shown only when `document.referrer` is our own `/ar`.

## Steps 3 and 4 — "visiting today" and "also nearby"

Both are ordinary components on all seven home pages, translated in all seven
locales, RTL-correct.

- Open/closed computed client-side from `MONUMENT_TZ` and `CLOSING_HOUR` in
  `src/config/booking-window.ts`. **Two facts are missing from that file** and
  are TODO for you: the **opening** hour and the **last entry** time. It
  carries only the closing hour today, and I will not guess the others.
- `NearbyMonuments` already exists and will be extended rather than replaced.
- Any Viator product not already in the codebase stays TODO. No invented
  price, rating or review count.
- The H1 stays exactly where it is in the markup; if the block must appear
  above it on mobile, that is `order` in CSS.

## Step 5 — tracking

A `viatorUrl(product, campaign)` helper. Default `home`; `ar-redirect` when
the visitor arrived through the step-1 redirect; `maps-panel` when
`utm_source=google_maps`. Since the campaign then depends on the visitor, the
links become client-rendered on the pages that use it — which is why the test
table includes "normal visitor's URL is unchanged".

## Step 6 — testing

Playwright against a local production build, using the Chromium already on
this machine at
`C:/Users/Sara-Malak/AppData/Local/ms-playwright/chromium-1228`. All fifteen
cases, plus the byte-diff of `/ar`, `/fr`, `/en`, `/it` server HTML, plus
build, lint, typecheck and HTML sizes before and after.

⚠️ One environment problem to flag now: `npm run dev` on this machine cannot
render any page — `next/font` fails to reach Google Fonts through Turbopack
and every route 500s on the layout. `next build` works. So the tests will run
against `next build && next start`, not the dev server. If `start` hits the
same font problem I will say so rather than working around it, because a test
suite that cannot render the page proves nothing.

---

## Risks — the two decisions

### 1. This is a referrer-conditional redirect, and that is the shape Google's cloaking systems look for

The HTML is identical for everyone, so this is not cloaking in the strict
sense. But the behaviour — *visitors arriving from Google get sent somewhere
else; everyone else does not* — is the signature pattern of a doorway, and it
is evaluated by systems that do not read intent.

Google's own guidance on locale-adaptive pages asks sites **not** to
auto-redirect on perceived language, precisely because it stops users and
crawlers reaching the other versions.

The page at stake does 249k impressions and ranks #1–2 for Arabic. That is a
lot to put behind a pattern-match.

**The alternative:** step 2 alone. The banner gets a French visitor to the
French page in one tap, costs nothing in SEO risk, and cannot be mistaken for
anything. It converts less than a redirect. It also cannot lose the page.

**My recommendation: ship step 2 first, alone, and measure it.** If the banner
turns out to convert badly, the redirect is still available and you will have
a baseline to compare it against. Shipping both at once means never knowing
which did what — and if `/ar` moves in the rankings, not knowing why.

I will build whichever you choose. I want the choice to be yours and informed.

### 2. The simpler fix may be the one you already suggested

`/` already does exactly what you want, including sending bots to `/en`. If
Google will accept a change of the Maps "Website" link from `/ar` to `/`, that
solves the whole problem with **no code, no script and no risk**, and it is
reversible.

It is worth attempting before shipping either of the above:
- Google Business Profile, if the listing is claimable — the website field is
  editable there.
- Otherwise "Suggest an edit" on the knowledge panel.

Even if it works it will be slow, so step 2 is still worth having. But it is
strictly better than anything in this document and costs nothing to try.

---

## What I need from you

1. **Redirect, banner, or banner first?** (my recommendation: banner first)
2. Add `src=ar-redirect` to the URL, or read the referrer instead? (my
   recommendation: referrer, no parameter)
3. Opening hour and last-entry time for step 3 — not in the codebase.
4. Have you tried changing the Maps link yet?

Waiting for **"OK, go"**.
