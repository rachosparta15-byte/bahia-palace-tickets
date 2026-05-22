import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyAdminToken, ADMIN_COOKIE } from '@/lib/auth';

async function requireAdmin() {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  return token ? await verifyAdminToken(token) : null;
}

const DEFAULTS = [
  {
    slug: 'skip-the-line',
    nameEn: 'Skip-the-Line Entry', nameFr: 'Entrée Coupe-File', nameIt: 'Ingresso Salta Fila', nameDe: 'Skip-the-Line Eintrittskarte', nameEs: 'Entrada Sin Colas',
    descEn: 'Skip the ticket queue and walk straight in.', descFr: 'Passez la file et entrez directement.', descIt: 'Salta la coda ed entra direttamente.', descDe: 'Überspringen Sie die Warteschlange.', descEs: 'Sáltate la cola y entra directamente.',
    priceAdult: 10, priceChild: 0, durationMins: 90, available: true,
    images: JSON.stringify(['https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=600&q=75']),
  },
  {
    slug: 'guided-tour',
    nameEn: 'Expert Guided Tour', nameFr: 'Visite Guidée par un Expert', nameIt: 'Tour Guidato con Esperto', nameDe: 'Expertengeführte Tour', nameEs: 'Tour Guiado por un Experto',
    descEn: 'Discover the palace secrets with a certified guide.', descFr: 'Découvrez les secrets avec un guide certifié.', descIt: 'Scopri i segreti con una guida certificata.', descDe: 'Entdecken Sie die Geheimnisse mit einem Führer.', descEs: 'Descubre los secretos con un guía certificado.',
    priceAdult: 10, priceChild: 0, durationMins: 120, available: false,
    images: JSON.stringify(['https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=75']),
  },
  {
    slug: 'private-tour',
    nameEn: 'Private Tour', nameFr: 'Visite Privée', nameIt: 'Tour Privato', nameDe: 'Privatführung', nameEs: 'Tour Privado',
    descEn: 'Exclusive palace experience just for you.', descFr: 'Expérience exclusive rien que pour vous.', descIt: "Esperienza esclusiva solo per te.", descDe: 'Exklusives Erlebnis nur für Sie.', descEs: 'Experiencia exclusiva solo para ti.',
    priceAdult: 10, priceChild: 0, durationMins: 150, available: false,
    images: JSON.stringify(['https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=600&q=75']),
  },
  {
    slug: 'combo-saadian-tombs',
    nameEn: 'Combo: Bahia + Saadian Tombs', nameFr: 'Combo: Bahia + Tombeaux Saadiens', nameIt: 'Combo: Bahia + Tombe Saadiane', nameDe: 'Kombi: Bahia + Saadier-Gräber', nameEs: 'Combo: Bahia + Tumbas Saadíes',
    descEn: 'Two iconic Marrakech monuments in one day.', descFr: 'Deux monuments iconiques en une journée.', descIt: 'Due monumenti iconici in un giorno.', descDe: 'Zwei Sehenswürdigkeiten an einem Tag.', descEs: 'Dos monumentos icónicos en un día.',
    priceAdult: 10, priceChild: 0, durationMins: 210, available: false,
    images: JSON.stringify(['https://images.unsplash.com/photo-1574236170878-9e5e04e1e3b0?w=600&q=75']),
  },
];

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Auto-seed if table is empty
  const count = await prisma.ticketType.count();
  if (count === 0) {
    for (const d of DEFAULTS) {
      await prisma.ticketType.upsert({ where: { slug: d.slug }, update: {}, create: d });
    }
  }
  const tickets = await prisma.ticketType.findMany({ orderBy: { createdAt: 'asc' } });
  return NextResponse.json(tickets);
}

export async function POST(req: Request) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json() as { seed?: boolean };
  if (body.seed) {
    for (const d of DEFAULTS) {
      await prisma.ticketType.upsert({ where: { slug: d.slug }, update: d, create: d });
    }
    return NextResponse.json({ ok: true, seeded: DEFAULTS.length });
  }
  return NextResponse.json({ error: 'Use PATCH /[slug] to update a ticket' }, { status: 400 });
}
