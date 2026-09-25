# /ar language routing — what was built, what was measured, what to watch

Branch `ar-language-routing`. Nothing is deployed and nothing is pushed to
`main`.

## The problem

Google's knowledge panel for Bahia Palace points its "Website" button at
`https://www.visitbahiapalace.com/ar`. Over seven days that page takes 1,334
clicks, and the best-converting slice of them is filed under "Morocco" —
which is not Moroccans. It is foreign tourists already in Marrakech, searching
from a Moroccan IP: 3.7% CTR against France's 0.4%, position 4.0, and roughly
half of them buy.

They land on a page written in Arabic.

## The root fix, which is not in this branch

**Change the knowledge-panel / Google Maps "Website" link from `/ar` to `/`.**
The site already redirects `/` by `Accept-Language`, so every visitor lands in
their own language with no JavaScript involved and no risk to anything.

Everything in this branch treats the symptom. It is worth doing regardless —
the link may take weeks to change, and some visitors reach `/ar` by other
routes — but the link is the real answer.

Note also: hreflang on `/ar` is correct and reciprocal. Google is choosing
`/ar` for French queries *because the panel points there*, not because the
markup is wrong. Fixing the link is what stops that.

## What was built

| | |
|---|---|
| `src/lib/ar-language-redirect.ts` | The inline script. Sends a non-Arabic browser from `/ar` to its own language. |
| `src/components/layout/LanguageNotice.tsx` | The way back, and the offer for whoever is not moved. |
| `src/components/homepage/LiveVisitStatus.tsx` | The hero badge says whether the palace is open. |
| `src/components/analytics/ViatorArrival.tsx` | Tags outbound Viator clicks with how the visitor arrived. |
| `src/config/visiting-today.ts` | The opening hours, in one place, plus the clock store. |

### 1. The redirect

Runs inline in `<head>` on `/ar` only, before first paint. Two guards, and
either one is enough to stop it:

1. a user-agent list covering every declared crawler
2. the referrer must be Google or empty

Empty is allowed on purpose — the Maps app sends no referrer, and that is the
exact flow being rescued. The cost is that the UA list carries real weight,
which is why the first item on the post-deploy checklist is Google's own
renderer.

Anything unexpected — storage throwing, a referrer that will not parse, no
matching language, Arabic anywhere in `navigator.languages` — means **do not
redirect**. `?lang=ar` disables it outright, and it fires at most once per tab.

### 2. The way back

A redirect with no return is a trap. An Arabic speaker whose phone is set to
French is moved along with everybody else; a single line on the page they land
on offers the Arabic version back.

And where the redirect deliberately does nothing — a visitor who followed a
link from another site, a second visit, storage blocked — they are not moved,
but they are offered the choice in their own language.

Every URL comes from the page's own `hreflang` links, never from swapping
`/ar` for `/fr` in the path. No alternate declared, no offer.

### 3. The hero badge

The badge held the first line of the page and spent it on "a cool palace, no
queue" — true of every day at every hour. It now reads one of:

    Open · until 17:00
    Closing soon · last entry 16:30
    Last entry has passed
    Closed · opens 9:00

The clock is read in the browser, because the site is served from cache and a
server-rendered "Open now" would be whatever was true at build time. Its
server snapshot renders the old static string, so the HTML is unchanged and a
visitor without JavaScript sees exactly what they saw before.

### 4. The measurement

Every Viator link already carried a campaign naming *where* it was clicked.
None said where the visitor came from, which is the question this branch
exists to settle. Clicks now carry a suffix:

    visitbahiapalace-ticketcards             unchanged for everybody else
    visitbahiapalace-ticketcards-from-ar     landed on /ar first
    visitbahiapalace-ticketcards-from-maps   arrived tagged by Google Maps

The arrival is the first page of the session, recorded before the redirect
runs, so somebody who lands on `/ar`, is moved to `/fr` and books three pages
later is still counted as a knowledge-panel sale.

**Campaigns with nothing to add keep their exact spelling**, so the numbers
stay comparable with every month already reported.

## Two things fixed along the way

**The palace does not close on Friday afternoon.** Three
`OpeningHoursSpecification` entries told Google it shuts 12:00–14:00 on
Fridays, and `/opening-hours` showed visitors "9:00 AM – 12:00 PM, closes for
Friday prayer". Every other page said open daily 9–17. The Ministry of
Culture, which runs the palace, publishes `Horaires de visite: 9h-17h` with no
Friday exception (`e-services.minculture.gov.ma/en/tickets/palais-bahia`, read
2026-09-25). Google reads that schema for the hours beside a result, so
Friday-lunchtime searchers were told the place was closed, on a peak day.

**The cookie consent notice was in English on all seven languages.** A notice
the reader cannot read is not consent.

## What was verified

Against a local production build (`next build` + `next start`), in Chromium.

**Routing, 18/18.** Every case in the brief, plus three the brief did not ask
for. Each referrer case asserts the `Referer` header actually arrived — the
first run of this suite served the stub over HTTPS while the site ran on HTTP,
so Chromium stripped the referrer and six cases passed for the wrong reason.

| | |
|---|---|
| fr, it, en, de, es, pt from their own Google | sent to their language |
| Arabic browser, or Arabic anywhere in the list | stays on `/ar` |
| no referrer (the Maps app) | sent to their language |
| referrer from another site | stays on `/ar` |
| Googlebot mobile and desktop, with and without a Google referrer | **never redirected** |
| `?lang=ar` | stays |
| second visit in the same tab | stays |
| `sessionStorage` throwing, JavaScript disabled | stays, page intact |
| `/ar` at 390px | `dir=rtl`, no horizontal overflow |

**Language notice, 7/7**, including the four cases where the right answer is
silence. Googlebot on `/ar` initially **did** see an English offer and a link
to `/en` — it runs JavaScript, and only the redirect had a crawler check. The
check is now shared between them rather than copied.

**Arrival tagging, 5/5**, including that an ordinary visitor's campaign string
is unchanged character for character.

**SEO, 21 pages compared against the live site.** Titles, descriptions,
canonicals, hreflang, H1s, robots, `og:url`, `lang` and `dir`: identical
everywhere. The only differences are the Friday schema fix. The inline script
appears on `/ar` and on no other locale.

## After deploying

1. **Search Console → URL Inspection → `/ar` → Test live URL.** The rendered
   screenshot must show the **Arabic** page. This is Google's own renderer and
   it is the one test that matters. If it shows French, roll back.
2. Same test on `/fr` and `/en`: no language notice should appear.
3. Check the `/ar` page still returns 200 with its Arabic `<title>` in the
   live HTML.
4. Watch Viator for `-from-ar` and `-from-maps` campaigns. First numbers will
   be thin; give it two weeks.
5. **Expect `/ar` impressions to fall**, sharply, once the panel link changes.
   That is the point. `/ar` currently collects 249k impressions dominated by
   the query "maroc" — 38,257 impressions, **zero** clicks. Losing those is
   success, not a regression. Watch clicks and bookings, not impressions.

## Still open

- **Nearby monuments** (step 4 of the brief) — not built. It needs product
  data that does not exist in the repo, and inventing it is not an option.
- **The Viator API key still needs rotating.** It was pasted into a chat in an
  earlier session and has not been changed since.
- The knowledge-panel link itself, which is the root fix and is yours to
  change, not the code's.
