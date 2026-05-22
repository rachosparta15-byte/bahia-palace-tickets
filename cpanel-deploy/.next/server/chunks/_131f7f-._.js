module.exports=[23212,e=>{"use strict";let t=process.env.EMAIL_FROM??"tickets@bahia-palace.com";async function o(o){var a;let{Resend:r}=await e.A(36043),n=new r(process.env.RESEND_API_KEY);await n.emails.send({from:`Bahia Palace Tickets <${t}>`,to:o.to,subject:`Booking Confirmed — ${o.reference} | Bahia Palace`,html:(a=o,`
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
          <p>Hi <strong>${a.customerName}</strong>,</p>
          <p>Your booking for <strong>${a.ticketType}</strong> is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:8px;color:#666">Reference</td><td style="padding:8px;font-weight:bold">${a.reference}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Visit Date</td><td style="padding:8px">${a.visitDate}</td></tr>
            <tr><td style="padding:8px;color:#666">Adults</td><td style="padding:8px">${a.adults}</td></tr>
            ${a.children>0?`<tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Children</td><td style="padding:8px">${a.children}</td></tr>`:""}
            <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:bold;color:#C4452D">${a.totalAmount} ${a.currency}</td></tr>
          </table>
          <p style="color:#666;font-size:14px">Show this email at the entrance or use your QR code.</p>
        </div>
        <div style="background:#3D2817;padding:20px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:13px">\xa9 ${new Date().getFullYear()} Bahia Palace Tickets • Marrakech, Morocco</p>
        </div>
      </div>
    </body>
    </html>
  `)})}async function a(o){let{Resend:a}=await e.A(36043),r=new a(process.env.RESEND_API_KEY);await r.emails.send({from:`Bahia Palace Tickets <${t}>`,to:o.to,subject:`Refund Processed — ${o.reference}`,html:`<p>Hi ${o.customerName},</p><p>Your refund of ${o.amount} ${o.currency} for booking <strong>${o.reference}</strong> has been processed.</p>`})}async function r(o){let{Resend:a}=await e.A(36043),r=new a(process.env.RESEND_API_KEY);await r.emails.send({from:`Bahia Palace Tickets <${t}>`,to:process.env.SUPPORT_EMAIL??"support@visitbahiapalace.com",subject:`Contact Form: ${o.subject}`,html:`<p><strong>From:</strong> ${o.name} &lt;${o.from}&gt;</p><p><strong>Message:</strong></p><p>${o.message}</p>`})}e.s(["sendBookingConfirmation",0,o,"sendContactNotification",0,r,"sendRefundConfirmation",0,a])},36043,e=>{e.v(t=>Promise.all(["server/chunks/node_modules_0rdscaq._.js"].map(t=>e.l(t))).then(()=>t(46245)))}];

//# sourceMappingURL=_131f7f-._.js.map