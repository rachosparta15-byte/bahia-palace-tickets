// PHASE B: Real Resend email provider.
// npm install resend
// Set EMAIL_PROVIDER=resend and RESEND_API_KEY in .env.

import type { BookingEmailParams, RefundEmailParams, ContactEmailParams, TicketDeliveryEmailParams } from './mock';

const FROM = process.env.EMAIL_FROM ?? 'tickets@visitbahiapalace.com';

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
    subject: `Refund Processed — ${params.reference}`,
    html: `<p>Hi ${esc(params.customerName)},</p><p>Your refund of ${esc(String(params.amount))} ${esc(params.currency)} for booking <strong>${esc(params.reference)}</strong> has been processed.</p>`,
  });
}

export async function sendTicketDelivery(params: TicketDeliveryEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: params.to,
    subject: `Your Bahia Palace ticket — ${params.reference}`,
    html:
      `<p>Hi ${esc(params.customerName)},</p>` +
      `<p>Your official Bahia Palace entry ticket for booking <strong>${esc(params.reference)}</strong> is ready.</p>` +
      (params.qrCode ? `<p>Ticket code: <strong>${esc(params.qrCode)}</strong></p>` : '') +
      (params.bookingUrl ? `<p><a href="${esc(params.bookingUrl)}">View your ticket</a></p>` : '') +
      `<p>Show it at the entrance. Enjoy your visit!</p>`,
  });
}

export async function sendContactNotification(params: ContactEmailParams): Promise<void> {
  // @ts-ignore — installed in Phase B: npm install resend
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: `Bahia Palace Tickets <${FROM}>`,
    to: process.env.SUPPORT_EMAIL ?? 'support@visitbahiapalace.com',
    subject: `Contact Form: ${params.subject}`,
    html: `<p><strong>From:</strong> ${esc(params.name)} &lt;${esc(params.from)}&gt;</p><p><strong>Message:</strong></p><p>${esc(params.message)}</p>`,
  });
}

/**
 * The audio-guide access block. Empty string when there is no link, so a
 * non-pack order (or an unconfigured GUIDE_TOKEN_SECRET) simply omits it
 * rather than promising something that will not open.
 *
 * THE ADVICE HERE IS THE PRODUCT WORKING. Two lines carry real weight:
 *
 *   "Open it the morning of your visit" — the guide downloads ~47MB on first
 *   open and then plays with no signal inside the palace. Opening it two
 *   weeks early on hotel wifi still works, but iOS evicts idle storage after
 *   about a week, so early activation is the one that tends to be gone by
 *   the time it is needed.
 *
 *   "Add to Home Screen" — installed PWAs are exempt from that eviction. It
 *   is the single most effective thing a customer can do to keep the guide.
 */
function buildAudioGuideBlock(url: string | null | undefined): string {
  if (!url) return '';
  const safe = esc(url);
  return `
    <div style="margin:28px 0 0;padding:20px;background:#FAF3E7;border-radius:10px;border:1px solid #E8D5B7">
      <p style="margin:0 0 6px;font-weight:bold;color:#3D2817;font-size:15px">🎧 Your audio guide</p>
      <p style="margin:0 0 14px;color:#666;font-size:14px;line-height:1.5">
        17 stops, 5 languages, two narrators. This link is yours — it unlocks the guide on your phone.
      </p>
      <p style="margin:0 0 16px">
        <a href="${safe}" style="display:inline-block;background:#C4452D;color:#fff;text-decoration:none;font-weight:bold;font-size:14px;padding:12px 22px;border-radius:8px">Open my audio guide</a>
      </p>
      <p style="margin:0 0 8px;color:#666;font-size:13px;line-height:1.6">
        <strong>Open it the morning of your visit</strong>, on wifi. It downloads once (about 47&nbsp;MB),
        then works with no signal at all inside the palace.
      </p>
      <p style="margin:0;color:#666;font-size:13px;line-height:1.6">
        When it asks, choose <strong>Add to Home Screen</strong> — that stops your phone clearing the
        downloaded audio. Keep this email: you can re-open the link if you ever need to set it up again.
      </p>
    </div>
  `;
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
          ${buildAudioGuideBlock(p.audioGuideUrl)}
        </div>
        <div style="background:#3D2817;padding:20px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:13px">© ${new Date().getFullYear()} Bahia Palace Tickets • Marrakech, Morocco</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
