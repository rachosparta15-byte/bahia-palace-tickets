# Webhook testing — real Stripe test-card run on localhost

How to exercise the **real** Stripe payment path end-to-end on your machine,
using Stripe **test** keys and a test card. No real money moves.

> **Production stays OFF.** Everything below is local-only. Do **not** set
> `PAYMENTS_ENABLED=true` in your committed `.env`, in Vercel, or anywhere the
> deployed site reads. Use `.env.local` (git-ignored) or inline env for the one
> terminal you test in, and revert when done.

---

## Why the Stripe CLI is needed

Stripe delivers `checkout.session.completed` by POSTing to a public URL. Your
laptop isn't public, so the CLI opens a tunnel and **forwards** live test events
to `http://localhost:3000/api/webhooks/stripe`. Without it, a local payment
completes at Stripe but your app never hears about it (the `/booking/[id]` page
is only a fallback, not the reliable trigger).

---

## Step 0 — Install the Stripe CLI

```bash
# Option A: npm (simplest, cross-platform)
npm i -g stripe

# Option B: download the binary
#   https://docs.stripe.com/stripe-cli  → Windows .exe, or scoop/homebrew
stripe --version        # confirm it runs
stripe login            # opens the browser; authorise TEST mode
```

## Step 1 — Start the webhook forwarder

Leave this running in its **own terminal** for the whole test:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

It prints a line like:

```
> Ready! Your webhook signing secret is whsec_1a2b3c...   (^C to quit)
```

**Copy that `whsec_…`.** It is the signing secret for THIS CLI session and is
**different** from the endpoint secret in the Stripe dashboard. The app must use
this one while you test, or every event will fail signature verification.

## Step 2 — Configure the app for a local test run

Set these for the test only. Easiest on Windows: edit **`.env.local`** (it is
git-ignored — never edit `.env` for this), then revert afterwards:

```dotenv
PAYMENT_PROVIDER=stripe            # was: mock
PAYMENTS_ENABLED=true              # LOCAL ONLY — was: false
STRIPE_SECRET_KEY=sk_test_...      # your TEST secret key (already set)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # your TEST publishable key (already set)
STRIPE_WEBHOOK_SECRET=whsec_...    # paste the value from `stripe listen` in Step 1
NEXT_PUBLIC_SITE_URL=http://localhost:3000        # SEE THE GOTCHA BELOW
# EMAIL_PROVIDER=mock              # leave as mock to see emails in the console,
                                   # or set =resend + RESEND_API_KEY to send for real
```

Then start the app in a **third terminal**:

```bash
npm run dev
```

### ⚠️ The `NEXT_PUBLIC_SITE_URL` gotcha

`success_url` / `cancel_url` (in `src/lib/payments/stripe.ts`) and the
ticket-delivery email link are built from `NEXT_PUBLIC_SITE_URL`. If it resolves
to the **production** value (`https://www.visitbahiapalace.com`), then after you
pay with a test card Stripe will redirect you to the **live** site — where the
booking id doesn't exist — instead of back to your localhost confirmation page,
and the emailed ticket link will point at production too.

During a local test it **must** be `http://localhost:3000`. If a value is baked
in from `.env`, override it in `.env.local` and restart `npm run dev` (Next
inlines `NEXT_PUBLIC_*` at startup, so a restart is required for it to take).

## Step 3 — Pay with a test card

1. Open `http://localhost:3000/en/visitor-pack`.
2. Fill the checkout form, tick the Terms box, submit → you're redirected to
   `checkout.stripe.com`.
3. Pay with Stripe's success test card:

   ```
   Card:  4242 4242 4242 4242
   Expiry: any future date (e.g. 12/34)
   CVC:    any 3 digits
   ZIP:    any 5 digits
   ```

   Other useful test cards: `4000 0000 0000 9995` (declined),
   `4000 0025 0000 3155` (requires 3-D Secure).

---

## What to verify, step by step

| # | Action | Where to look | Expected |
|---|--------|---------------|----------|
| 1 | Submit checkout form | app terminal | `[MOCK PAYMENT]`? No — with `PAYMENT_PROVIDER=stripe` you should NOT see mock logs; a real `cs_test_…` session is created |
| 2 | Redirected to Stripe, pay 4242 | Stripe page | Shows "Bahia Palace — Complete Visitor Pack" + the price breakdown in the line-item description |
| 3 | Payment completes | **`stripe listen` terminal** | `checkout.session.completed  --> POST /api/webhooks/stripe [200]` |
| 4 | Webhook processed | app terminal | `[webhook] checkout.session.completed for booking … : confirmed` |
| 5 | Booking confirmed | return page / DB | Page shows "Payment confirmed"; booking `status = confirmed` |
| 6 | Order email | app terminal (mock) or inbox (resend) | `[EMAIL WOULD BE SENT] Booking Confirmation` → customer email |
| 7 | Attach the official QR | `/admin/bookings/<id>` → attach code/file | Booking → `qr_sent`; refund window closes |
| 8 | Ticket email | app terminal / inbox | `[EMAIL WOULD BE SENT] Official Ticket Delivery` with the code + link |
| 9 | Cancel a *different* paid booking (no QR yet) | admin → Cancel | UI: "cancelled and €X refunded automatically (refund re_…)" |
| 10 | Refund landed | **Stripe dashboard → Payments** (test mode) | The payment shows **Refunded**; booking `refundId` / `refundedAt` set |
| 11 | Cancel again (retry) | admin | Blocked — no second refund (idempotent) |

### Idempotency check (optional)
Re-send a past event to confirm a duplicate does nothing harmful:

```bash
stripe events resend <evt_id>          # id shown in the `stripe listen` output
# app terminal should log: "already handled (idempotent no-op)"
```

---

## When you're done

1. `Ctrl+C` the `stripe listen` and `npm run dev` terminals.
2. **Revert `.env.local`**: `PAYMENT_PROVIDER=mock`, `PAYMENTS_ENABLED=false`,
   and restore the local `STRIPE_WEBHOOK_SECRET` / `NEXT_PUBLIC_SITE_URL` values.
3. Confirm nothing that flips production on was committed:
   ```bash
   git status            # .env.local should NOT appear (it's git-ignored)
   git grep -n "PAYMENTS_ENABLED" -- .env    # committed .env must still be =false / unset
   ```

## For production (later, when you actually go live)

- Register the endpoint in **Stripe dashboard → Developers → Webhooks**:
  `https://www.visitbahiapalace.com/api/webhooks/stripe`, event
  `checkout.session.completed`. Copy **that** endpoint's signing secret into the
  production `STRIPE_WEBHOOK_SECRET` (not the CLI one).
- Set production `NEXT_PUBLIC_SITE_URL=https://www.visitbahiapalace.com`.
- Swap `sk_test_`/`pk_test_` for live keys and set `PAYMENTS_ENABLED=true` only
  when the GO-LIVE checklist is complete.
