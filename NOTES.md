# affiliate-copy-fix

## Branch
`affiliate-copy-fix`

## Commits (in order)

| Commit | Summary |
|---|---|
| `26e3974` | Phase 1: rewrite affiliate-mode copy to match reality (base messages only) |
| `cc4aba3` | Seal the two remaining Phase 1 leaks (whyUs.title, trustViatorPartner) |
| `535e30e` | Phase 1.6: fix the false fulfilment claim in BookingWidget's price note |
| `45613a1` | Fix whyOnline's cancellation clause, seal its paid/ leak first |
| `13019b0` | Phase 2: link "Message us on WhatsApp" via the existing lib/whatsapp helpers |
| `c4998f2` | Phase 3: per-card campaign tracking on TicketOptions Viator links |

Note: `cc4aba3` sits between `26e3974` and `535e30e` in branch history. It's a
direct continuation of the Phase 1 leak sweep (same session, same reasoning),
not a separate phase — listed here so the commit sequence above matches
`git log` exactly.

## Why

In affiliate mode the site's copy described a self-fulfilled concierge
service — "we buy the ticket, we send the code" — while, with payments off,
all four TicketOptions cards actually link out to Viator (see
`TicketCards.tsx` / `TicketOptions.tsx` VIATOR_LINKS and the matching
schema.org seller at `page.tsx:181`). Copy across `whyUs`, `skipTheLine`
(includes, `whyOnline`, `trustViatorPartner`), and the `BookingWidget` price
note was rewritten to describe what actually happens: Viator sells and
fulfills, we compare options and point you there. `paid/` (concierge) mode
was left untouched in wording — its self-fulfilled copy is accurate for that
mode's real product and was out of scope.

## The deepMergeMessages gotcha

A key **absent** from `messages/paid/<locale>.json` does not disappear in
paid mode — `mergeMessages.ts` falls through to the base value for any key
the override doesn't mention. Editing base copy alone silently changes paid
mode too, unless you add an explicit override (the old string, so paid mode
is unaffected) or `null` (to suppress the line entirely).

Every `paid/` override this branch added, and why:

- **`tickets.skipTheLine.whyUs.items[3].title`** (`26e3974`) — added,
  holding the pre-change base wording verbatim, so paid mode's heading for
  that item stays unchanged after base was rewritten.
- **`tickets.skipTheLine.whatsappNote: null`** (`26e3974`) — this is a new
  key, only meaningful in affiliate mode (points users to Viator support);
  set to `null` so it renders nothing in paid mode rather than inheriting
  affiliate wording.
- **`whyUs.trustViatorPartner`** (`cc4aba3`) — leak found on a post-Phase-1
  sweep: no override existed at all, so paid mode was silently inheriting
  the new "Viator partner" trust badge. Restored the exact pre-`26e3974`
  string (from `bb45ae6`) verbatim.
- **`whyUs.title`** (`cc4aba3`) — same leak, same fix: restored the
  pre-`26e3974` heading string verbatim so paid mode's section title didn't
  silently change.
- **`tickets.skipTheLine.whyOnline`** (`45613a1`) — no override existed;
  restored the pre-change string verbatim before editing base, so the
  cancellation-clause fix in base didn't leak into paid mode.

Net effect confirmed after each leak sweep: paid mode reads exactly as it
did before this branch, dormant and untouched; affiliate/base mode carries
the new copy.

## Known open items (not done, for later)

- `longDesc` on the skip-the-line page ("your QR code is already valid") is
  ambiguous about who issues the ticket — not addressed by this branch.
- `BookingWidget.tsx`'s price-note paragraph is hardcoded English; it shows
  untranslated in all 7 locales.
- `paid/` (concierge) mode copy has **not** been reviewed on this branch —
  it's dormant, launch is ~4 months out, and needs its own pass before then.
- `PAYMENTS_HALTED = true` is hardcoded in `src/lib/payments/guard.ts:54`
  since 2026-08-22 (PayPal account deactivated) — this is *why* the site is
  currently affiliate-only; flip this (and re-review paid/ copy) when
  payments come back.
- `HOME_META` (`src/app/[locale]/page.tsx:58-87`, homepage title/meta
  description, all 7 locales, Phase 4) is **not** `paymentsEnabled`-aware —
  deliberately, per instruction: it's a plain object with one fixed string
  per locale, unlike the JSON-LD `offers` block lower in the same file
  which does branch on the flag. It needs its own review alongside the
  rest of `paid/` before launch, since the current copy ("100 MAD",
  Viator-queue framing) describes the affiliate product only.

## Required env var

`NEXT_PUBLIC_WHATSAPP_NUMBER` — inlined at build time (Next.js `NEXT_PUBLIC_*`
convention). Must be set **before** running `npm run build`, not after —
setting it post-build has no effect since the value is baked into the
client bundle.
