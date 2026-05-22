// PHASE A: Mock email provider — logs to console instead of sending.
// PHASE B: Set EMAIL_PROVIDER=resend and fill RESEND_API_KEY in .env.

export interface BookingEmailParams {
  to: string;
  customerName: string;
  reference: string;
  ticketType: string;
  visitDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  currency: string;
  locale: string;
}

export interface RefundEmailParams {
  to: string;
  customerName: string;
  reference: string;
  amount: number;
  currency: string;
}

export async function sendBookingConfirmation(params: BookingEmailParams): Promise<void> {
  console.log('\n========================================');
  console.log('[EMAIL WOULD BE SENT] Booking Confirmation');
  console.log('  To:        ', params.to);
  console.log('  Reference: ', params.reference);
  console.log('  Ticket:    ', params.ticketType);
  console.log('  Date:      ', params.visitDate);
  console.log('  Adults:    ', params.adults);
  console.log('  Children:  ', params.children);
  console.log('  Total:     ', `${params.totalAmount} ${params.currency}`);
  console.log('========================================\n');
}

export async function sendRefundConfirmation(params: RefundEmailParams): Promise<void> {
  console.log('\n========================================');
  console.log('[EMAIL WOULD BE SENT] Refund Confirmation');
  console.log('  To:        ', params.to);
  console.log('  Reference: ', params.reference);
  console.log('  Amount:    ', `${params.amount} ${params.currency}`);
  console.log('========================================\n');
}

export interface ContactEmailParams {
  from: string;
  name: string;
  subject: string;
  message: string;
}

export async function sendContactNotification(params: ContactEmailParams): Promise<void> {
  console.log('\n========================================');
  console.log('[EMAIL WOULD BE SENT] Contact Form');
  console.log('  From:    ', params.from);
  console.log('  Name:    ', params.name);
  console.log('  Subject: ', params.subject);
  console.log('  Message: ', params.message);
  console.log('========================================\n');
}
