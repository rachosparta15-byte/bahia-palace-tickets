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
  /**
   * Audio-guide link WITH its access token (`?k=…`), for Visitor Pack orders.
   *
   * This email is the customer's durable copy of that token. iOS can evict the
   * guide's stored activation after ~7 days of non-use, so someone who buys two
   * weeks ahead and lands in Marrakech may need this link a second time —
   * redemption is re-runnable precisely so that works.
   *
   * Null when the product is not the pack, or GUIDE_TOKEN_SECRET is unset.
   */
  audioGuideUrl?: string | null;
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
  if (params.audioGuideUrl) console.log('  Guide:     ', params.audioGuideUrl);
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

export interface TicketDeliveryEmailParams {
  to: string;
  customerName: string;
  reference: string;
  /** The official ticket code, when delivery is a code rather than a file. */
  qrCode?: string;
  /** Absolute URL to the booking page where the ticket can be viewed. */
  bookingUrl?: string;
}

export async function sendTicketDelivery(params: TicketDeliveryEmailParams): Promise<void> {
  console.log('\n========================================');
  console.log('[EMAIL WOULD BE SENT] Official Ticket Delivery');
  console.log('  To:         ', params.to);
  console.log('  Reference:  ', params.reference);
  if (params.qrCode)     console.log('  Ticket code:', params.qrCode);
  if (params.bookingUrl) console.log('  Link:       ', params.bookingUrl);
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
