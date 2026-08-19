// PHASE B: Real Resend email provider.
// npm install resend
// Set EMAIL_PROVIDER=resend and RESEND_API_KEY in .env.

import type {
  BookingEmailParams,
  RefundEmailParams,
  ContactEmailParams,
  TicketDeliveryEmailParams,
  AdminBookingAlertParams,
} from './mock';
import { crossSellSites } from '@/config/network-sites';

const FROM = process.env.EMAIL_FROM ?? 'tickets@visitbahiapalace.com';

/**
 * Where replies go.
 *
 * FROM is on visitbahiapalace.com, which is set up to SEND (Resend verified its
 * SPF and DKIM) but has no MX records, so it cannot RECEIVE. A customer hitting
 * reply on their booking confirmation was getting a bounce — from the one
 * message every customer gets, at the moment they most want to ask something.
 */
const REPLY_TO = process.env.SUPPORT_EMAIL ?? 'support@marrakechlocal.com';
const SUPPORT = REPLY_TO;

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function sendBookingConfirmation(params: BookingEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject: `Booking Confirmed — ${params.reference} | Bahia Palace`,
    html: buildBookingHtml(params),
  });
}

export async function sendRefundConfirmation(params: RefundEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject: `Refund Processed — ${params.reference}`,
    html: `<p>Hi ${esc(params.customerName)},</p><p>Your refund of ${esc(String(params.amount))} ${esc(params.currency)} for booking <strong>${esc(params.reference)}</strong> has been processed.</p>`,
  });
}

/**
 * The ticket. This is the email a customer opens standing at the palace gate,
 * on a phone, possibly in the sun, with a queue behind them.
 *
 * It used to be five lines of unstyled text while the order confirmation was
 * fully designed — the least important message dressed better than the most
 * important one. Everything here follows from where it gets read: the code is
 * the largest thing on the screen, in a monospace face so 8 and B cannot be
 * confused, and the practical instructions come before the pleasantries.
 *
 * It also carries the audio guide links, because the published delivery policy
 * promises exactly one delivery containing everything.
 */
export async function sendTicketDelivery(params: TicketDeliveryEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: params.to,
    replyTo: REPLY_TO,
    subject: `Your Bahia Palace entry ticket — ${params.reference}`,
    html: buildTicketHtml(params),
    // The ticket itself, not a link to it — see the field comment in mock.ts.
    ...(params.attachment
      ? { attachments: [{ filename: params.attachment.filename, content: params.attachment.content }] }
      : {}),
  });
}

function buildTicketHtml(p: TicketDeliveryEmailParams): string {
  // One code per line. A party of three gets three, and running them together
  // on one line is how somebody shows the same code twice at the gate.
  const codes = (p.qrCode ?? '')
    .split(/[,•\n]/)
    .map((c) => c.trim())
    .filter(Boolean);

  const codeBlock = codes.length
    ? codes
        .map(
          (c) => `
      <div style="margin:0 0 10px;padding:16px;background:#FFF;border:2px dashed #C4452D;border-radius:10px;text-align:center">
        <p style="margin:0;font-family:'Courier New',monospace;font-size:21px;font-weight:bold;letter-spacing:.06em;color:#3D2817">${esc(c)}</p>
      </div>`
        )
        .join('')
    : '';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="font-family:sans-serif;background:#FAF3E7;padding:32px 16px;margin:0">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">

        <div style="background:#C4452D;padding:30px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:23px">Your ticket is ready</h1>
          <p style="color:rgba(255,255,255,0.88);margin:8px 0 0;font-size:14px">Bahia Palace · Marrakech</p>
        </div>

        <div style="padding:30px">
          <p style="margin:0 0 6px">Hi <strong>${esc(p.customerName)}</strong>,</p>
          <p style="margin:0 0 22px;color:#666;font-size:14px;line-height:1.55">
            Here is your official Ministry of Culture entry ticket for booking
            <strong>${esc(p.reference)}</strong>${p.visitDate ? `, for ${esc(p.visitDate)}` : ''}.
          </p>

          <p style="margin:0 0 10px;font-weight:bold;color:#3D2817;font-size:15px">
            🎟️ ${codes.length > 1 ? `Your ${codes.length} entry codes` : 'Your entry code'}
          </p>
          ${codeBlock}

          <div style="margin:20px 0 0;padding:18px;background:#FAF3E7;border-radius:10px">
            <p style="margin:0 0 8px;font-weight:bold;color:#3D2817;font-size:14px">At the entrance</p>
            <p style="margin:0 0 6px;color:#666;font-size:14px;line-height:1.55">
              Show this screen at the gate — no need to print anything, and no need to visit the
              ticket office.
            </p>
            <p style="margin:0;color:#666;font-size:14px;line-height:1.55">
              ${codes.length > 1 ? 'One code admits one visitor, so keep them all on one phone or share one each. ' : ''}The
              codes are open-dated: if your plans change you can use them on another day.
            </p>
          </div>

          ${buildAudioGuideBlock(p.audioGuideUrls)}
          ${buildSupportBlock(p.whatsapp ?? null)}

          ${
            p.bookingUrl
              ? `<p style="margin:22px 0 0;text-align:center">
                   <a href="${esc(p.bookingUrl)}" style="color:#C4452D;font-size:13px">View this booking online</a>
                 </p>`
              : ''
          }
        </div>

        <div style="background:#3D2817;padding:20px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:13px">© ${new Date().getFullYear()} Bahia Palace Tickets • Marrakech, Morocco</p>
          <p style="color:#C9B48F;margin:8px 0 0;font-size:12px;line-height:1.6">
            <!-- An explicit anchor with an explicit colour: Gmail auto-links a bare
                 domain and paints it its default blue, which on this brown turned the
                 one disclaimer we are required to show into an unreadable smudge.
                 11px at 70% opacity was not helping either. -->
            <a href="https://visitbahiapalace.com" style="color:#E8D5B7;text-decoration:none">visitbahiapalace.com</a>
            is an independent booking service, operated by MarrakechLocal&nbsp;LLC.<br/>
            We are not affiliated with the Moroccan Ministry of Culture.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Tells the owner a ticket has been sold and must now be bought by hand.
 *
 * This is an operations alert, not a customer email: no branding, no
 * reassurance, everything above the fold. The subject line carries the
 * deadline, because on a phone the subject is often all that gets read —
 * "ACTION: BHA-686PJN — visit in 2 days" says what to do without opening it.
 *
 * Sent last in confirmBookingPaid and wrapped in its own try/catch there: a
 * booking is paid and confirmed whether or not this alert goes out.
 */
export async function sendAdminBookingAlert(params: AdminBookingAlertParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  const guests = params.adults + params.children;
  // Under two days is the window closing: at that point the ticket has to be
  // sourced today, so the subject says so instead of counting.
  const urgency =
    params.daysUntilVisit <= 1 ? 'TODAY' : `in ${params.daysUntilVisit} days`;

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'tickets@visitbahiapalace.com',
    to: params.to,
    subject: `ACTION: ${params.reference} — visit ${urgency} (${guests} guest${guests === 1 ? '' : 's'})`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="font-family:sans-serif;background:#fff;padding:24px">
        <div style="max-width:560px;margin:0 auto">
          <p style="margin:0 0 4px;font-size:12px;font-weight:bold;color:#C4452D;letter-spacing:1px">
            BUY THE OFFICIAL TICKET, THEN SEND IT
          </p>
          <h1 style="margin:0 0 16px;font-size:22px;color:#111">${esc(params.reference)}</h1>

          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:7px 0;color:#666;width:130px">Visit date</td>
                <td style="padding:7px 0;font-weight:bold">${esc(params.visitDate)} — ${urgency}</td></tr>
            <tr><td style="padding:7px 0;color:#666">Guests</td>
                <td style="padding:7px 0">${params.adults} adult(s)${params.children ? `, ${params.children} child(ren)` : ''}</td></tr>
            <tr><td style="padding:7px 0;color:#666">Paid</td>
                <td style="padding:7px 0;font-weight:bold">${params.totalAmount} ${esc(params.currency)}</td></tr>
            <tr><td style="padding:7px 0;color:#666">Customer</td>
                <td style="padding:7px 0">${esc(params.customerName)}<br/><a href="mailto:${esc(params.customerEmail)}">${esc(params.customerEmail)}</a></td></tr>
          </table>

          <p style="margin:22px 0 0">
            <a href="${esc(params.adminUrl)}"
               style="display:inline-block;background:#C4452D;color:#fff;text-decoration:none;padding:12px 22px;border-radius:8px;font-weight:bold;font-size:14px">
              Open booking and send the ticket
            </a>
          </p>

          <p style="margin:20px 0 0;color:#666;font-size:13px;line-height:1.55">
            The customer has an order confirmation and their booking reference.
            They do <strong>not</strong> have an entry ticket or the audio-guide
            link yet — both go out together when you send the QR from the admin.
          </p>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendContactNotification(params: ContactEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: process.env.SUPPORT_EMAIL ?? SUPPORT,
    subject: `Contact Form: ${params.subject}`,
    html: `<p><strong>From:</strong> ${esc(params.name)} &lt;${esc(params.from)}&gt;</p><p><strong>Message:</strong></p><p>${esc(params.message)}</p>`,
  });
}

/**
 * The audio-guide access block. Empty string when there are no links, so a
 * non-pack order simply omits it rather than promising something that will not
 * open.
 *
 * ONE BUTTON PER PERSON. Each link locks itself to the first phone that opens
 * it, so which link goes to whom matters, and this email is the only place that
 * can say so. Two people tapping the same one means the second is refused and
 * has to be told why — a support conversation that costs far more than the
 * extra sentence here.
 *
 * THE ADVICE IS THE PRODUCT WORKING. Two lines carry real weight:
 *
 *   "Open it the morning of your visit" — the guide downloads ~47MB on first
 *   open and then plays with no signal inside the palace. Opening it two weeks
 *   early on hotel wifi still works, but iOS evicts idle storage after about a
 *   week, so early activation is the one that tends to be gone by the time it
 *   is needed.
 *
 *   "Add to Home Screen" — installed PWAs are exempt from that eviction. It is
 *   the single most effective thing a customer can do to keep the guide, and
 *   now also the thing that keeps their device recognised.
 */
function buildAudioGuideBlock(urls: readonly string[] | null | undefined): string {
  if (!urls || urls.length === 0) return '';

  const many = urls.length > 1;

  /*
   * One row per person, every row identical.
   *
   * These were inline-block buttons in separate paragraphs, so each sized
   * itself to its own label — "Open guide 1 of 4" is wider than "Open guide 4
   * of 4" is wider than nothing — and four things that plainly belong together
   * came out ragged and adrift, looking like four accidents rather than four
   * seats. A table with fixed widths is the only layout email clients honour
   * consistently, and equal rows are what make the set read as a set.
   */
  const buttons = urls
    .map(
      (url, i) => `
      <tr>
        <td style="padding:0 0 8px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#FFFFFF;border:1px solid #E8D5B7;border-radius:8px">
            <tr>
              <td style="padding:11px 14px;font-size:14px;color:#3D2817">${
                many ? `Guest ${i + 1}` : 'Your guide'
              }</td>
              <td align="right" style="padding:8px 10px 8px 0">
                <a href="${esc(url)}" style="display:inline-block;background:#C4452D;color:#fff;text-decoration:none;font-weight:bold;font-size:13px;padding:9px 18px;border-radius:6px;white-space:nowrap">Open guide</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join('');

  return `
    <div style="margin:28px 0 0;padding:20px;background:#FAF3E7;border-radius:10px;border:1px solid #E8D5B7">
      <p style="margin:0 0 6px;font-weight:bold;color:#3D2817;font-size:16px">Your audio guide</p>
      <p style="margin:0 0 16px;color:#6B5B47;font-size:14px;line-height:1.55">
        17 stops, 5 languages, two narrators.${
          many
            ? ` One link each — <strong style="color:#3D2817">give every person their own</strong>. A link belongs to the first phone that opens it, so two people cannot share one.`
            : ' This link is yours — it unlocks the guide on your phone.'
        }
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">${buttons}</table>
      <p style="margin:16px 0 0;color:#6B5B47;font-size:13px;line-height:1.65">
        <strong style="color:#3D2817">Open it the morning of your visit</strong>, on wifi. It downloads once
        (about 47&nbsp;MB), then works with no signal at all inside the palace. When it asks, choose
        <strong style="color:#3D2817">Add to Home Screen</strong> — that stops your phone clearing the
        audio. Keep this email: the same link re-opens on the same phone at any time.
      </p>
    </div>
  `;
}

/**
 * Support and cancellation, in the email rather than only on the website.
 *
 * These two are not footer decoration — they are half of what the €11.99 buys.
 * The customer has just paid for a service whose visible parts are a ticket and
 * an audio guide; the human on WhatsApp and the free cancellation are the parts
 * that only exist if we say so, at the moment they are wondering what they got.
 *
 * It also heads off the two support messages that would otherwise arrive: "how
 * do I reach you" and "can I still cancel". Both are answered here, in the one
 * message every customer opens.
 */
function buildSupportBlock(whatsapp: string | null): string {
  const digits = (whatsapp ?? '').replace(/\D/g, '');
  /*
   * The stored value is digits only — wa.me wants it that way and the config
   * strips the plus. Printing that raw gives "212607223008", which reads like a
   * reference number rather than something you can call. Grouped and prefixed,
   * it reads as a phone number, which is the whole point of putting it here.
   */
  const shown = digits.length >= 11
    ? `+${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6)}`
    : `+${digits}`;
  const wa = digits
    ? `<p style="margin:0 0 10px;color:#3D2817;font-size:14px">
         WhatsApp <a href="https://wa.me/${digits}" style="color:#C4452D;font-weight:bold;text-decoration:none">${esc(shown)}</a>
         &nbsp;·&nbsp; 09:00–21:00 (GMT+1), 7 days a week
       </p>`
    : '';

  return `
    <div style="margin:24px 0 0;padding:20px;background:#FFF;border-radius:10px;border:1px solid #E8D5B7">
      <p style="margin:0 0 10px;font-weight:bold;color:#3D2817;font-size:15px">💬 A person, not a form</p>
      ${wa}
      <p style="margin:0 0 16px;color:#666;font-size:14px;line-height:1.5">
        Or reply to this email — it reaches the same team.
      </p>
      <p style="margin:0 0 6px;font-weight:bold;color:#3D2817;font-size:15px">↩️ Free cancellation</p>
      <p style="margin:0;color:#666;font-size:14px;line-height:1.55">
        Cancel any time <strong>before we send your entry ticket</strong> and we refund you in full —
        no fee, no questions. Once the ticket is sent it is bought and in your hands, so it cannot be
        refunded. Just message us.
      </p>
    </div>
  `;
}

/**
 * The other monuments in the network, for the order-confirmation email.
 *
 * WHERE THIS APPEARS: in the confirmation sent when payment goes through, and
 * nowhere else. Deliberately NOT in the ticket-delivery email — that one gets
 * opened at the gate with a queue behind you, and the only thing that may sit
 * near the QR code is the QR code.
 *
 * WHY IT CHECKS `ticketsOpen`: three of these sites are live as visitor guides
 * but cannot take payment yet. "Book now" on a site that answers "Booking opens
 * soon" is a broken promise made by an email the customer just paid for, so a
 * closed site is offered as a guide and shows no price at all.
 *
 * Tables and inline styles, not flexbox or grid: Outlook renders neither, and
 * an email that collapses into one column is still readable, whereas one that
 * overlaps is not. Stacks naturally on a phone because each site is its own row.
 */
function buildNetworkBlock(): string {
  const sites = crossSellSites();
  if (sites.length === 0) return '';

  const rows = sites
    .map((s) => {
      const action =
        s.ticketsOpen && s.priceEUR !== null
          ? `Book from &euro;${s.priceEUR.toFixed(2)}`
          : 'Visitor guide';
      return `
        <tr>
          <td style="padding:12px 0;border-top:1px solid #EFE4D2">
            <a href="${esc(s.url)}" style="color:#C4452D;font-weight:bold;font-size:14px;text-decoration:none">${esc(s.name)}</a>
            <span style="color:#999;font-size:12px"> &middot; ${esc(s.location)}</span>
            <p style="margin:4px 0 0;color:#666;font-size:13px;line-height:1.5">${esc(s.blurb)}</p>
            <p style="margin:6px 0 0;color:#A8781F;font-size:12px;font-weight:bold">${action}</p>
          </td>
        </tr>`;
    })
    .join('');

  return `
    <div style="margin:24px 0 0;padding:18px;background:#FAF3E7;border-radius:10px">
      <p style="margin:0 0 4px;font-weight:bold;color:#3D2817;font-size:14px">While you are in Morocco</p>
      <p style="margin:0;color:#666;font-size:13px;line-height:1.55">
        Three more monuments we run visitor sites for. Tickets are not on sale on
        these yet &mdash; they are guides to opening hours, getting there and what to see.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:8px">
        ${rows}
      </table>
    </div>`;
}

/**
 * A visit date a person can read: "Thursday 13 August 2026".
 *
 * The raw YYYY-MM-DD went straight into the email, and 2026-08-13 is a
 * database value, not a date anybody checks against their own plans. The
 * weekday earns its place here: travellers remember "we land Wednesday", not
 * the number, and the visit date is the one field where being wrong costs a
 * non-refundable ticket.
 *
 * Always en-GB, matching the rest of these emails, which are English-only by
 * the owner's decision. Falls back to the raw string rather than throwing —
 * an email that fails to send over a date format helps nobody.
 */
/**
 * The product's name as it was sold, not its database slug.
 *
 * "Your booking for visitor-pack is confirmed" told the customer nothing and
 * read like a leaked internal identifier in the one email that has to look
 * trustworthy. Unknown slugs are title-cased rather than passed through raw,
 * so a product added later degrades to "Guided Tour" and never to
 * "guided-tour".
 *
 * Exported so the GA4 purchase event names the product exactly as the receipt
 * does. Two spellings of one product cannot be reconciled against each other
 * later, and this is the name the customer will quote.
 */
export function productName(slug: string): string {
  const known: Record<string, string> = {
    'visitor-pack': 'Complete Visitor Pack',
  };
  return (
    known[slug] ??
    slug
      .split(/[-_]/)
      .filter(Boolean)
      .map((w) => w[0].toUpperCase() + w.slice(1))
      .join(' ')
  );
}

function humanDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  const d = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * The order confirmation.
 *
 * DELIBERATELY SHORT. An earlier version explained the fulfilment process in
 * two numbered steps, repeated the cancellation policy in full, and listed
 * three other monuments with a paragraph each. Every piece was true, and the
 * whole thing read like a brochure — the one fact the customer opens it for,
 * "when does my ticket arrive?", was four scrolls down.
 *
 * So: you paid, here is what you bought, your ticket and guide arrive on this
 * date, thank you. Everything else has a page of its own.
 *
 * It still must not claim to be a ticket. An earlier version said "Show this
 * email at the entrance or use your QR code" while containing neither, which
 * could have sent someone to the palace to be turned away at the gate.
 */
function buildBookingHtml(p: BookingEmailParams): string {
  /*
   * When the ticket arrives, said as a day rather than as "24 hours before" —
   * the customer should not have to do arithmetic on a date they are already
   * unsure about.
   *
   * Subtracting a day unconditionally was fine while nothing could be booked
   * inside a two-day window. Same-day booking is open now, so a visit today
   * produced "your ticket arrives on Saturday, 15 August" — yesterday — in the
   * confirmation of a customer who is going this afternoon.
   *
   * Three cases, and the near ones are not dates at all:
   *   visiting today     → today, as soon as we have it
   *   visiting tomorrow  → today
   *   later              → the day before, by name
   */
  const deliveryLine = (() => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(p.visitDate);
    if (!m) return 'the day before your visit';

    // Both sides in Marrakech's calendar day: the palace's timezone is what
    // "today" means here, not the server's and not the customer's.
    const today = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Casablanca',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());

    const visit = new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3])));
    const daysAway = Math.round(
      (visit.getTime() - new Date(`${today}T00:00:00Z`).getTime()) / 86_400_000,
    );

    if (daysAway <= 0) return 'today, as soon as we have it';
    if (daysAway === 1) return 'today';

    visit.setUTCDate(visit.getUTCDate() - 1);
    return `on ${humanDate(visit.toISOString().slice(0, 10))}`;
  })();

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:sans-serif;background:#FAF3E7;padding:40px 20px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#C4452D;padding:26px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:21px">Bahia Palace Tickets</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Booking confirmed</p>
        </div>

        <div style="padding:28px">
          <p style="margin:0 0 20px;color:#444;line-height:1.6">
            Hi <strong>${esc(p.customerName)}</strong>, thank you — your payment is in
            and your visit is booked.
          </p>

          <table style="width:100%;border-collapse:collapse;margin:0 0 22px;font-size:14px">
            <tr><td style="padding:8px;color:#666">Reference</td><td style="padding:8px;font-weight:bold">${esc(p.reference)}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Booking</td><td style="padding:8px">${esc(productName(p.ticketType))}</td></tr>
            <tr><td style="padding:8px;color:#666">Visit date</td><td style="padding:8px;font-weight:bold">${esc(humanDate(p.visitDate))}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Visitors</td><td style="padding:8px">${p.adults} adult${p.adults === 1 ? '' : 's'}${p.children > 0 ? `, ${p.children} child${p.children === 1 ? '' : 'ren'}` : ''}</td></tr>
            <tr><td style="padding:8px;color:#666">Paid</td><td style="padding:8px;font-weight:bold;color:#C4452D">${p.totalAmount} ${esc(p.currency)}</td></tr>
          </table>

          <div style="padding:16px 18px;background:#FAF3E7;border-radius:9px">
            <p style="margin:0 0 6px;font-weight:bold;color:#3D2817;font-size:15px">
              Your ticket arrives ${esc(deliveryLine)}
            </p>
            <p style="margin:0;color:#666;font-size:14px;line-height:1.55">
              One email with your QR code and your audio guide link. That is the one you
              show at the entrance — this one is your receipt.
            </p>
          </div>

          ${buildSupportBlock(p.whatsapp ?? null)}
        </div>

        <div style="background:#3D2817;padding:16px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:12px">
            &copy; ${new Date().getFullYear()} Bahia Palace Tickets &bull; Marrakech, Morocco
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * The abandoned-checkout reminder.
 *
 * Sent to someone who filled in the form, reached PayPal and never paid. We
 * hold their name, their email, their visit date and their party size, so this
 * can be a specific message about their booking rather than an advert.
 *
 * WHAT IS DELIBERATELY NOT IN IT:
 *
 *   - Scarcity. We do not hold ticket stock, so "only 2 left" would be a lie
 *     and the kind that a EU consumer authority treats as an unfair practice.
 *     The only real urgency here is their own visit date, and it says that.
 *   - A discount. The price is the price, and a first-time buyer who learns
 *     that waiting produces a coupon has learned the wrong lesson.
 *   - Any suggestion that a payment failed or is owed. Nothing was charged;
 *     the first line says so, because "your booking is incomplete" reads to
 *     some people as a debt.
 *
 * One message per booking, and the footer carries an opt-out — these are EU
 * consumers, and an email they cannot stop is a complaint waiting to happen.
 */
export function buildAbandonedCheckoutHtml(p: {
  customerName: string;
  reference: string;
  visitDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  adultPrice: number;
  childPrice: number;
  resumeUrl: string;
  unsubscribeUrl: string;
  whatsapp?: string | null;
}): string {
  /*
   * Priced line by line, not as one total.
   *
   * The whole point of this email is that someone hesitated over a number. A
   * bare "33.97 EUR" makes them re-derive where it came from; the two rates
   * shown separately answer it before they ask, and the child rate is the
   * cheaper half of the answer.
   */
  const lines = [
    `${p.adults} adult${p.adults === 1 ? '' : 's'} &times; &euro;${p.adultPrice.toFixed(2)}`,
    ...(p.children > 0
      ? [`${p.children} child${p.children === 1 ? '' : 'ren'} &times; &euro;${p.childPrice.toFixed(2)}`]
      : []),
  ].join('<br/>');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:sans-serif;background:#FAF3E7;padding:40px 20px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#C4452D;padding:26px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:21px">Bahia Palace Tickets</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Your booking is still open</p>
        </div>

        <div style="padding:28px">
          <p style="margin:0 0 18px;color:#444;line-height:1.6">
            Hi <strong>${esc(p.customerName)}</strong>, you started booking Bahia Palace for
            <strong>${esc(humanDate(p.visitDate))}</strong> and the payment was not completed.
            <strong>Nothing was charged.</strong> Your details are still here, so you can pick up
            where you left off.
          </p>

          <table style="width:100%;border-collapse:collapse;margin:0 0 22px;font-size:14px">
            <tr><td style="padding:8px;color:#666">Visit date</td><td style="padding:8px;font-weight:bold">${esc(humanDate(p.visitDate))}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Visitors</td><td style="padding:8px;line-height:1.7">${lines}</td></tr>
            <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:bold;color:#C4452D">&euro;${p.totalAmount.toFixed(2)}</td></tr>
          </table>

          <p style="margin:0 0 22px;text-align:center">
            <a href="${esc(p.resumeUrl)}" style="display:inline-block;background:#C4452D;color:#fff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 28px;border-radius:8px">
              Finish my booking
            </a>
          </p>

          <div style="padding:16px 18px;background:#FAF3E7;border-radius:9px">
            <p style="margin:0 0 12px;font-weight:bold;color:#3D2817;font-size:15px">Why book it here</p>

            <p style="margin:0 0 11px;color:#666;font-size:14px;line-height:1.55">
              <strong style="color:#3D2817">An audio guide, so you need no guide.</strong><br/>
              Room by room, in your own language, on your own phone. Download it before you go and
              it plays with no signal inside the palace — nobody to hire at the gate, nobody
              hurrying you along.
            </p>

            <p style="margin:0 0 11px;color:#666;font-size:14px;line-height:1.55">
              <strong style="color:#3D2817">Your ticket has no date on it.</strong><br/>
              Go on ${esc(humanDate(p.visitDate))}, or don't. The code carries no date and no name,
              so if your plans move — or that day comes and goes — it still admits you whenever you
              next come. You are not buying one morning; you are buying entry.
            </p>

            <p style="margin:0;color:#666;font-size:14px;line-height:1.55">
              <strong style="color:#3D2817">We stay on WhatsApp with you.</strong><br/>
              Not only about the palace, and not only on the day. Where to eat, how to cross the
              medina, what is worth your afternoon and what is not — ask us anything about
              Marrakech while you are here.
            </p>
          </div>

          ${buildSupportBlock(p.whatsapp ?? null)}
        </div>

        <div style="background:#3D2817;padding:16px;text-align:center">
          <p style="color:#E8D5B7;margin:0 0 6px;font-size:12px">
            &copy; ${new Date().getFullYear()} Bahia Palace Tickets &bull; Marrakech, Morocco
          </p>
          <p style="color:#B39B7C;margin:0;font-size:11px">
            You are receiving this once because you started a booking with us.
            <a href="${esc(p.unsubscribeUrl)}" style="color:#E8D5B7">Don't send me reminders</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * The cross-sell to a customer who has already bought.
 *
 * Not a broadcast. This goes to someone who paid us, so it can assume the one
 * thing an advert cannot: they already know how this works and it worked. That
 * is the whole asset, and it is why the message leads with their own booking
 * rather than with a monument.
 *
 * MARRAKECH ONLY. The Caves of Hercules are in Tangier, nine hours away — in
 * an email whose premise is "you are already here", a third card that is not
 * here weakens the two that are. `buildNetworkBlock` still lists everything;
 * this one is deliberately narrower.
 *
 * Anything not selling today is dropped rather than teased. A card the reader
 * cannot act on is a card that trains them to skim the next one.
 */
export function buildMonumentCrossSellHtml(p: {
  customerName: string;
  visitDate: string;
  unsubscribeUrl: string;
  whatsapp?: string | null;
}): string {
  const sites = crossSellSites().filter(
    (s) => s.ticketsOpen && s.priceEUR !== null && s.location.startsWith('Marrakech'),
  );

  const cards = sites
    .map(
      (s) => `
      <div style="margin:0 0 14px;padding:16px 18px;background:#FAF3E7;border-radius:10px">
        <p style="margin:0 0 2px">
          <a href="${esc(s.url)}" style="color:#C4452D;font-weight:bold;font-size:16px;text-decoration:none">${esc(s.name)}</a>
        </p>
        <p style="margin:0 0 8px;color:#999;font-size:12px">${esc(s.location)}</p>
        <p style="margin:0 0 12px;color:#666;font-size:14px;line-height:1.55">${esc(s.blurb)}</p>
        <a href="${esc(s.url)}" style="display:inline-block;background:#C4452D;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:10px 20px;border-radius:7px">
          Book from &euro;${s.priceEUR!.toFixed(2)}
        </a>
      </div>`,
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:sans-serif;background:#FAF3E7;padding:40px 20px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden">
        <div style="background:#C4452D;padding:26px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:21px">Bahia Palace Tickets</h1>
          <p style="color:rgba(255,255,255,0.9);margin:6px 0 0;font-size:14px">Two more, a short walk away</p>
        </div>

        <div style="padding:28px">
          <p style="margin:0 0 20px;color:#444;line-height:1.6">
            Hi <strong>${esc(p.customerName)}</strong>, your Bahia Palace ticket is booked for
            <strong>${esc(humanDate(p.visitDate))}</strong>. Bahia takes most people about an hour,
            and the two monuments below are within a ten-minute walk of it — so if you have an
            afternoon in the medina, this is how to spend the rest of it.
          </p>

          ${cards}

          <div style="margin:22px 0 0;padding:16px 18px;border:1px solid #EFE4D2;border-radius:10px">
            <p style="margin:0 0 10px;font-weight:bold;color:#3D2817;font-size:15px">Exactly like your Bahia booking</p>
            <p style="margin:0 0 9px;color:#666;font-size:14px;line-height:1.55">
              Same team, same way it works. Your own audio guide, room by room, downloaded before
              you go and playing with no signal inside.
            </p>
            <p style="margin:0 0 9px;color:#666;font-size:14px;line-height:1.55">
              The code carries no date and no name, so you decide the morning you use it — not now.
            </p>
            <p style="margin:0;color:#666;font-size:14px;line-height:1.55">
              Free cancellation until we send it, and the same WhatsApp number you already have.
            </p>
          </div>

          ${buildSupportBlock(p.whatsapp ?? null)}
        </div>

        <div style="background:#3D2817;padding:16px;text-align:center">
          <p style="color:#E8D5B7;margin:0 0 6px;font-size:12px">
            &copy; ${new Date().getFullYear()} Bahia Palace Tickets &bull; Marrakech, Morocco
          </p>
          <p style="color:#B39B7C;margin:0;font-size:11px">
            Sent because you booked with us.
            <a href="${esc(p.unsubscribeUrl)}" style="color:#E8D5B7">No more suggestions</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
