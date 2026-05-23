const PLACEHOLDER = '212600000000';

/**
 * Returns the WhatsApp number from the environment, or null if it is
 * missing / still set to the placeholder value.
 * Components should render nothing when this returns null.
 */
export function getWhatsAppNumber(): string | null {
  const n = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '').replace(/^\+/, '');
  if (!n || n === PLACEHOLDER) return null;
  return n;
}

export function buildWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
