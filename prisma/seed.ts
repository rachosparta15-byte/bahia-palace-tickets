import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';
import bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database...');

  // ── Admin user ──────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('ChangeMe123!', 12);
  await prisma.adminUser.upsert({
    where:  { email: 'admin@bahia-tickets.com' },
    update: {},
    create: {
      email:        'admin@bahia-tickets.com',
      passwordHash: adminPassword,
      name:         'Site Admin',
      role:         'admin',
    },
  });
  console.log('Admin user created: admin@bahia-tickets.com / ChangeMe123!');

  // ── Ticket types ───────────────────────────────────────────
  const tickets = [
    {
      slug:         'skip-the-line',
      nameEn: 'Skip-the-Line Entry',  nameFr: 'Entrée Coupe-File',     nameIt: 'Ingresso Salta Fila',    nameDe: 'Skip-the-Line Eintrittskarte', nameEs: 'Entrada Sin Colas',
      descEn: 'Priority access to Bahia Palace with a pre-validated ticket. No queue needed.',
      descFr: 'Accès prioritaire au Palais Bahia avec billet pré-validé. Pas de file d\'attente.',
      descIt: 'Accesso prioritario al Palazzo Bahia con biglietto pre-validato.',
      descDe: 'Prioritätszugang zum Bahia Palast mit vorvalidiertem Ticket.',
      descEs: 'Acceso prioritario al Palacio Bahia con entrada prevalidada.',
      priceAdult:   12,
      priceChild:   0,
      durationMins: 90,
    },
    {
      slug:         'guided-tour',
      nameEn: 'Expert Guided Tour',   nameFr: 'Visite Guidée Expert',  nameIt: 'Tour Guidato Esperto',   nameDe: 'Expertengeführte Tour',       nameEs: 'Tour Guiado Experto',
      descEn: 'Discover the palace with a certified local guide. History, art, and hidden stories.',
      descFr: 'Découvrez le palais avec un guide local certifié. Histoire, art et anecdotes.',
      descIt: 'Scopri il palazzo con una guida locale certificata.',
      descDe: 'Entdecken Sie den Palast mit einem zertifizierten lokalen Führer.',
      descEs: 'Descubre el palacio con un guía local certificado.',
      priceAdult:   28,
      priceChild:   14,
      durationMins: 120,
    },
    {
      slug:         'private-tour',
      nameEn: 'Private Tour',         nameFr: 'Visite Privée',         nameIt: 'Tour Privato',           nameDe: 'Privatführung',               nameEs: 'Tour Privado',
      descEn: 'Exclusive private experience with a dedicated guide. Perfect for families and groups.',
      descFr: 'Expérience privée exclusive avec un guide dédié.',
      descIt: 'Esperienza privata esclusiva con guida dedicata.',
      descDe: 'Exklusives privates Erlebnis mit einem dedizierten Führer.',
      descEs: 'Experiencia privada exclusiva con guía dedicado.',
      priceAdult:   75,
      priceChild:   0,
      durationMins: 150,
    },
    {
      slug:         'combo-saadian-tombs',
      nameEn: 'Combo: Bahia + Saadian Tombs', nameFr: 'Combo : Bahia + Tombeaux Saadiens',
      nameIt: 'Combo: Bahia + Tombe Saadiane', nameDe: 'Kombi: Bahia + Saadier-Gräber', nameEs: 'Combo: Bahia + Tumbas Saadíes',
      descEn: 'Two iconic Marrakech monuments in one day. Best value for history lovers.',
      descFr: 'Deux monuments iconiques de Marrakech en une journée.',
      descIt: 'Due monumenti iconici di Marrakech in un giorno.',
      descDe: 'Zwei ikonische Marrakescher Sehenswürdigkeiten an einem Tag.',
      descEs: 'Dos monumentos icónicos de Marrakech en un día.',
      priceAdult:   18,
      priceChild:   8,
      durationMins: 210,
    },
  ];

  for (const ticket of tickets) {
    await prisma.ticketType.upsert({
      where:  { slug: ticket.slug },
      update: ticket,
      create: ticket,
    });
  }
  console.log('Ticket types seeded');

  // ── Sample FAQs (English) ──────────────────────────────────
  const faqs = [
    { question: 'How do I receive my ticket?', answer: 'You receive your ticket by email immediately after booking. It includes a QR code to show on your phone.', category: 'tickets', locale: 'en', scope: 'homepage', order: 0 },
    { question: 'Can I cancel my booking?', answer: 'Yes, free cancellation up to 24 hours before your visit. Email us or use your booking link.', category: 'booking', locale: 'en', scope: 'homepage', order: 1 },
    { question: 'What are the opening hours?', answer: 'Open daily 9:00 AM–5:00 PM (last entry 4:30 PM). Hours may vary during Ramadan.', category: 'palace', locale: 'en', scope: 'homepage', order: 2 },
    { question: 'Is there a dress code?', answer: 'No strict code, but modest attire is appreciated. Covering shoulders and knees is recommended.', category: 'palace', locale: 'en', scope: 'homepage', order: 3 },
    { question: 'Is photography allowed?', answer: 'Yes, for personal use throughout the palace. Professional equipment needs special permission.', category: 'palace', locale: 'en', scope: 'homepage', order: 4 },
    { question: 'How does skip-the-line work?', answer: 'Your ticket is pre-validated. Go to the priority entrance and show your QR code — no queue.', category: 'tickets', locale: 'en', scope: 'homepage', order: 5 },
  ];

  for (const faq of faqs) {
    await prisma.faq.create({ data: faq });
  }
  console.log('FAQ items seeded');

  // ── Sample reviews ─────────────────────────────────────────
  const reviews = [
    { authorName: 'Sophie Laurent', country: 'France', rating: 5, body: 'Absolutely magical. The skip-the-line ticket was worth every cent — no queue, just walked straight in.', locale: 'en', order: 0 },
    { authorName: 'Thomas Weber',   country: 'Germany', rating: 5, body: 'We booked the private tour and were amazed. Our guide knew every story behind every tile.', locale: 'en', order: 1 },
    { authorName: 'Emma Johnson',   country: 'UK',      rating: 5, body: 'The guided tour was phenomenal. Brought the history to life in a way a solo visit cannot.', locale: 'en', order: 2 },
  ];

  for (const review of reviews) {
    await prisma.review.create({ data: review });
  }
  console.log('Reviews seeded');

  // ── Sample bookings (for dashboard demo) ──────────────────
  const sampleBookings = [
    { reference: 'BHA-DEMO01', ticketType: 'skip-the-line', visitDate: new Date('2026-05-25'), adults: 2, children: 0, totalAmount: 24, currency: 'EUR', customerName: 'Alice Martin', customerEmail: 'alice@example.com', customerCountry: 'FR', locale: 'fr', status: 'paid' },
    { reference: 'BHA-DEMO02', ticketType: 'guided-tour',   visitDate: new Date('2026-05-26'), adults: 3, children: 1, totalAmount: 98, currency: 'EUR', customerName: 'John Smith',  customerEmail: 'john@example.com',  customerCountry: 'GB', locale: 'en', status: 'paid' },
    { reference: 'BHA-DEMO03', ticketType: 'private-tour',  visitDate: new Date('2026-05-28'), adults: 2, children: 0, totalAmount: 75, currency: 'EUR', customerName: 'Luca Rossi',  customerEmail: 'luca@example.com',  customerCountry: 'IT', locale: 'it', status: 'paid' },
    { reference: 'BHA-DEMO04', ticketType: 'combo-saadian-tombs', visitDate: new Date('2026-05-30'), adults: 4, children: 2, totalAmount: 88, currency: 'EUR', customerName: 'María López', customerEmail: 'maria@example.com', customerCountry: 'ES', locale: 'es', status: 'pending' },
  ];

  for (const booking of sampleBookings) {
    await prisma.booking.upsert({
      where:  { reference: booking.reference },
      update: {},
      create: booking,
    });
  }
  console.log('Sample bookings seeded');

  console.log('\nSeed complete!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
