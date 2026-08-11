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
 * These two are not footer decoration — they are half of what the €13.99 buys.
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

function buildBookingHtml(p: BookingEmailParams): string {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family:sans-serif;background:#FAF3E7;padding:40px 20px">
      <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
        <div style="background:#C4452D;padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px">Bahia Palace Tickets</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0">Your booking is confirmed!</p>
        </div>
        <div style="padding:32px">
          <p>Hi <strong>${p.customerName}</strong>,</p>
          <p>Your booking for <strong>${p.ticketType}</strong> is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:8px;color:#666">Reference</td><td style="padding:8px;font-weight:bold">${p.reference}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Visit Date</td><td style="padding:8px">${p.visitDate}</td></tr>
            <tr><td style="padding:8px;color:#666">Adults</td><td style="padding:8px">${p.adults}</td></tr>
            ${p.children > 0 ? `<tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Children</td><td style="padding:8px">${p.children}</td></tr>` : ''}
            <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:bold;color:#C4452D">${p.totalAmount} ${p.currency}</td></tr>
          </table>
          <p style="color:#666;font-size:14px">Show this email at the entrance or use your QR code.</p>
          ${buildAudioGuideBlock(p.audioGuideUrls)}
          ${buildSupportBlock(p.whatsapp ?? null)}
          ${buildNetworkBlock()}
        </div>
        <div style="background:#3D2817;padding:20px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:13px">© ${new Date().getFullYear()} Bahia Palace Tickets • Marrakech, Morocco</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
