import prisma from '@/lib/db';
import { TicketCards } from './TicketCards';

export type TicketOverride = {
  price: number;
  imageUrl: string;
  live: boolean;
};

export async function TicketSection() {
  let overrides: Record<string, TicketOverride> = {};
  try {
    const rows = await prisma.ticketType.findMany();
    for (const row of rows) {
      const imgs: string[] = (() => { try { return JSON.parse(row.images ?? '[]'); } catch { return []; } })();
      overrides[row.slug] = {
        price:    row.priceAdult,
        imageUrl: imgs[0] ?? '',
        live:     row.available,
      };
    }
  } catch {
    // table empty or not seeded — fall through to hardcoded defaults in TicketCards
  }
  return <TicketCards overrides={overrides} />;
}
