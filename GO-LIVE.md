# GO-LIVE CHECKLIST — do not flip PAYMENTS_ENABLED=true until ALL are done

Context: the current live copy is written for the FREE model. The moment
payments are enabled, several claims on the site become false. The feature
flag switches the product — it does NOT switch the copy.

## Copy that becomes false the second payments go live
- [ ] Remove "no booking fees" — all pages, all 5 locales
- [ ] Remove "Official tickets only"
- [ ] Remove "Free to use"
- [ ] Remove "Walk straight in, no waiting"
- [ ] Remove "Same as gate price" / "we add nothing on top"

## Pricing
- [ ] PRICE config = single source of truth (13.99 EUR)
- [ ] Fee breakdown card, labelled as a SERVICE not as entry price:
        Skip-the-Line Booking — €13.99
        Includes official 100 MAD entry + €4.79 booking service
- [ ] JSON-LD Offer = 13.99 EUR (not 10, not 100 MAD)
- [ ] visitorPackBreakdown safeguard still active and enforced
- [ ] Gate price (100 MAD) stays visible in body price tables

## Legal
- [ ] Terms + refund policy: zero {TOKEN} placeholders
      (⚠️ the WIP branch superseded the earlier cleanup — re-verify)
- [ ] Footer independence disclaimer intact, all 5 locales
- [ ] Company details present and correct

## Funnel
- [ ] Checkout language matches source-site language (EN→EN, DE→DE, etc.)
- [ ] Deep-link to product page with date/qty prefilled, not homepage
- [ ] Handoff pre-framed on source site ("Booking via our partner")
- [ ] GA4 cross-domain linker configured

## Final
- [ ] End-to-end test purchase in 2 languages
- [ ] Verify QR delivery email in both languages
- [ ] Verify free-cancellation flow actually works

## SEO / structured data (post-launch)
- [ ] Add first-party review system (post-purchase email → rating) to
      enable a legitimate aggregateRating on ticket pages. This resolves
      the GSC "review/aggregateRating missing" warning honestly, only
      once payments are live and real reviews exist.
