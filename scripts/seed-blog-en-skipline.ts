import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const content = `
<p class="intro">Planning to visit <strong>Bahia Palace in Marrakech</strong>? Buying your tickets in advance is the smartest move you can make. Long queues at the entrance can steal 30–45 minutes of your precious vacation time — here's how to skip them entirely.</p>

<h2>Bahia Palace Ticket Prices 2026</h2>

<p>The standard entrance fee to Bahia Palace is <strong>100 MAD</strong> (approximately €9 / $10) for foreign adults. Children under 7 enter free. For visitors who want a richer experience, guided tours and skip-the-line options are available starting from <strong>€12</strong>.</p>

<h2>Why Buy Skip-the-Line Tickets?</h2>

<p>Bahia Palace is one of the <strong>most visited monuments in Morocco</strong>, attracting over 500,000 visitors per year. During peak season (March–May and September–November), queues at the entrance can reach 45 minutes or more. With a pre-booked skip-the-line ticket, you walk straight in — no waiting, no stress.</p>

<h2>What's Included in Each Ticket Type</h2>

<h3>Standard Skip-the-Line Entry</h3>
<p>Pre-validated entrance ticket that lets you bypass the queue at the main gate. Valid for the date you choose. Includes access to all open areas of the palace including the grand riad, the small riad, the reception courtyard, and the private apartments.</p>

<h3>Expert Guided Tour</h3>
<p>Everything in the skip-the-line ticket plus a certified local guide who brings the palace's history to life. Learn about Ba Ahmed's rise to power, the 150 rooms built for his four wives, and the hidden stories behind every carved ceiling. Duration: approximately 2 hours.</p>

<h3>Private Tour</h3>
<p>An exclusive private experience for couples, families, or small groups. Your dedicated guide adapts the tour entirely to your interests and pace. Perfect for photography lovers and history enthusiasts.</p>

<h2>Opening Hours</h2>

<p>Bahia Palace is open <strong>every day of the week</strong>, including public holidays.</p>
<ul>
  <li><strong>Monday – Sunday:</strong> 09:00 – 17:00</li>
  <li>Last admission: 16:30</li>
  <li>Closed during Friday prayer (12:00–14:00 on Fridays)</li>
</ul>

<h2>Best Time to Visit</h2>

<p>The palace is least crowded during the <strong>first hour after opening (9:00–10:30)</strong> and in the late afternoon (15:30–16:30). Midday, especially on weekends, sees the heaviest foot traffic. Visiting on a Tuesday or Wednesday tends to be quieter than weekends.</p>

<h2>How to Get to Bahia Palace</h2>

<p>Bahia Palace is located in the heart of the Marrakech medina, a short walk from Djemaa El Fna square. The address is <strong>Rue Riad Zitoun el Jdid, Marrakech</strong>. From Djemaa El Fna, it's a 15-minute walk through the souks, or a 5-minute taxi ride.</p>

<h2>Insider Tips</h2>

<ul>
  <li><strong>Dress modestly</strong> — shoulders and knees should be covered out of respect for local customs.</li>
  <li><strong>Bring a camera</strong> — the palace's carved cedar ceilings and mosaic tilework are among the most photogenic in all of Morocco.</li>
  <li><strong>Combine your visit</strong> with the Badi Palace and Saadian Tombs nearby for a full day of Marrakech history.</li>
  <li><strong>Book in advance</strong> — especially if visiting during Ramadan or school holidays when crowds are at their peak.</li>
</ul>

<h2>Frequently Asked Questions</h2>

<h3>Can I buy tickets at the door?</h3>
<p>Yes, but you risk waiting in line for up to 45 minutes during busy periods. Pre-booking guarantees your entry time and skips the queue entirely.</p>

<h3>Is Bahia Palace worth visiting?</h3>
<p>Absolutely. It is considered one of the finest examples of Moroccan architecture and craftsmanship from the 19th century. The scale, the detail, and the atmosphere make it a highlight of any Marrakech itinerary.</p>

<h3>Are guided tours available in French?</h3>
<p>Yes, our guided tours are available in English, French, Spanish, Italian, and German.</p>

<h3>Is the palace accessible for visitors with mobility issues?</h3>
<p>Most of the main courtyard areas are accessible, though some sections involve uneven stone pathways. The palace does not have elevators or ramps in all areas.</p>
`;

async function main() {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug: 'skip-the-line-bahia-palace-marrakech-tickets-2026', locale: 'en' } },
    update: {
      title: 'Skip the Line at Bahia Palace — Marrakech Tickets 2026',
      excerpt: 'Everything you need to know about Bahia Palace tickets in 2026 — prices, skip-the-line options, opening hours, and insider tips to make the most of your visit.',
      content,
      coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80',
      category: 'visit-tips',
      seoTitle: 'Skip the Line at Bahia Palace — Marrakech Tickets 2026',
      seoDesc: 'Buy skip-the-line tickets for Bahia Palace Marrakech. Prices, opening hours, guided tours & insider tips for 2026. No queue, instant confirmation.',
      published: true,
      publishedAt: new Date(),
      author: 'Bahia Palace Team',
    },
    create: {
      slug: 'skip-the-line-bahia-palace-marrakech-tickets-2026',
      locale: 'en',
      title: 'Skip the Line at Bahia Palace — Marrakech Tickets 2026',
      excerpt: 'Everything you need to know about Bahia Palace tickets in 2026 — prices, skip-the-line options, opening hours, and insider tips to make the most of your visit.',
      content,
      coverImage: 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80',
      category: 'visit-tips',
      seoTitle: 'Skip the Line at Bahia Palace — Marrakech Tickets 2026',
      seoDesc: 'Buy skip-the-line tickets for Bahia Palace Marrakech. Prices, opening hours, guided tours & insider tips for 2026. No queue, instant confirmation.',
      published: true,
      publishedAt: new Date(),
      author: 'Bahia Palace Team',
    },
  });

  console.log('✓ Blog post EN created: skip-the-line-bahia-palace-marrakech-tickets-2026');
  await prisma.$disconnect();
}

main().catch(console.error);
