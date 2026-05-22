module.exports=[96348,a=>{"use strict";let b=process.env.EMAIL_FROM??"tickets@bahia-palace.com";async function c(c){var d;let{Resend:e}=await a.A(86473),f=new e(process.env.RESEND_API_KEY);await f.emails.send({from:`Bahia Palace Tickets <${b}>`,to:c.to,subject:`Booking Confirmed — ${c.reference} | Bahia Palace`,html:(d=c,`
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
          <p>Hi <strong>${d.customerName}</strong>,</p>
          <p>Your booking for <strong>${d.ticketType}</strong> is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:8px;color:#666">Reference</td><td style="padding:8px;font-weight:bold">${d.reference}</td></tr>
            <tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Visit Date</td><td style="padding:8px">${d.visitDate}</td></tr>
            <tr><td style="padding:8px;color:#666">Adults</td><td style="padding:8px">${d.adults}</td></tr>
            ${d.children>0?`<tr style="background:#FAF3E7"><td style="padding:8px;color:#666">Children</td><td style="padding:8px">${d.children}</td></tr>`:""}
            <tr><td style="padding:8px;color:#666">Total</td><td style="padding:8px;font-weight:bold;color:#C4452D">${d.totalAmount} ${d.currency}</td></tr>
          </table>
          <p style="color:#666;font-size:14px">Show this email at the entrance or use your QR code.</p>
        </div>
        <div style="background:#3D2817;padding:20px;text-align:center">
          <p style="color:#E8D5B7;margin:0;font-size:13px">\xa9 ${new Date().getFullYear()} Bahia Palace Tickets • Marrakech, Morocco</p>
        </div>
      </div>
    </body>
    </html>
  `)})}async function d(c){let{Resend:d}=await a.A(86473),e=new d(process.env.RESEND_API_KEY);await e.emails.send({from:`Bahia Palace Tickets <${b}>`,to:c.to,subject:`Refund Processed — ${c.reference}`,html:`<p>Hi ${c.customerName},</p><p>Your refund of ${c.amount} ${c.currency} for booking <strong>${c.reference}</strong> has been processed.</p>`})}async function e(c){let{Resend:d}=await a.A(86473),e=new d(process.env.RESEND_API_KEY);await e.emails.send({from:`Bahia Palace Tickets <${b}>`,to:process.env.SUPPORT_EMAIL??"support@visitbahiapalace.com",subject:`Contact Form: ${c.subject}`,html:`<p><strong>From:</strong> ${c.name} &lt;${c.from}&gt;</p><p><strong>Message:</strong></p><p>${c.message}</p>`})}a.s(["sendBookingConfirmation",0,c,"sendContactNotification",0,e,"sendRefundConfirmation",0,d])},86473,a=>{a.v(b=>Promise.all(["server/chunks/ssr/node_modules_0gbwc22._.js"].map(b=>a.l(b))).then(()=>b(45069)))}];

//# sourceMappingURL=_0k~0.ya._.js.map