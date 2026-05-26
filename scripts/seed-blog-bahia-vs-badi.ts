import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./dev.db',
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const prisma = new PrismaClient({ adapter });

const post = {
  title: 'Bahia Palace vs El Badi Palace: Which One Should You Visit?',
  slug: 'bahia-palace-vs-badi-palace-marrakech',
  locale: 'en',
  category: 'comparisons',
  tags: 'bahia palace vs badi palace,el badi palace,marrakech palaces,which palace to visit marrakech,bahia palace or badi palace',
  excerpt: 'Bahia Palace and El Badi Palace are both iconic Marrakech landmarks — but they are completely different experiences. This guide compares history, architecture, photography, atmosphere, and ticket prices to help you decide.',
  seoTitle: 'Bahia Palace vs El Badi Palace 2026 | Which One to Visit in Marrakech?',
  seoDesc: 'Compare Bahia Palace vs El Badi Palace: history, architecture, ticket prices, photography, and visitor experience. Find out which Marrakech palace suits your itinerary — or visit both in one day.',
  coverImage: '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',
  author: 'Bahia Palace Team',
  published: true,
  publishedAt: new Date('2026-05-26'),
  content: `<p>When travelers search for <strong>Bahia Palace vs El Badi Palace</strong>, they want a clear answer: which of Marrakech's two most iconic royal palaces deserves a spot on their itinerary? The short answer is both — but they offer radically different experiences. This guide breaks down every key difference so you can plan your visit with confidence.</p>

<div style="overflow-x:auto;margin:2rem 0;">
  <table style="width:100%;border-collapse:collapse;font-size:0.9rem;">
    <thead>
      <tr style="background:#3D2817;color:#fff;">
        <th style="padding:10px 14px;text-align:left;">Feature</th>
        <th style="padding:10px 14px;text-align:left;">Bahia Palace</th>
        <th style="padding:10px 14px;text-align:left;">El Badi Palace</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background:#FAF3E7;">
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Construction</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">19th Century (1859–1900)</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">16th Century (Saadian dynasty)</td>
      </tr>
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Style</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Traditional Moroccan luxury</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Historic Saadian ruins</td>
      </tr>
      <tr style="background:#FAF3E7;">
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Main Attraction</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Decorated interiors and gardens</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Massive courtyards and panoramic views</td>
      </tr>
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Best For</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Photography and architecture</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">History and open-air exploration</td>
      </tr>
      <tr style="background:#FAF3E7;">
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Atmosphere</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Elegant and peaceful</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">Dramatic and historical</td>
      </tr>
      <tr>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;font-weight:600;">Visit Duration</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">1–2 hours</td>
        <td style="padding:9px 14px;border-bottom:1px solid #E8D5B7;">1–1.5 hours</td>
      </tr>
      <tr style="background:#FAF3E7;">
        <td style="padding:9px 14px;font-weight:600;">Location</td>
        <td style="padding:9px 14px;">Marrakech Medina</td>
        <td style="padding:9px 14px;">Near the Kasbah area</td>
      </tr>
    </tbody>
  </table>
</div>

<h2>History of Bahia Palace</h2>
<p>Bahia Palace was built during the late 19th century by two Grand Viziers — <strong>Si Moussa</strong>, who began the original structure around 1859, and his son <strong>Ba Ahmed (Bou Ahmed)</strong>, who dramatically expanded it between 1894 and 1900. The word <em>Bahia</em> means <em>brilliance</em> or <em>beauty</em> in Arabic — an apt name for a palace that employed over 2,000 artisans to craft its zellige mosaics, carved cedar ceilings, and stucco plasterwork.</p>
<p>When Ba Ahmed died in 1900, Sultan Moulay Abd al-Aziz immediately ordered the palace looted and its inhabitants expelled overnight. The palace later served as the official residence of the French Resident-General during the Protectorate era. Since Moroccan independence in 1956, it has been a protected heritage site and one of the country's most visited monuments.</p>

<figure style="margin:2rem 0;">
  <img src="/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg" alt="Bahia Palace octagonal carved cedar wood ceiling — 19th century Moroccan craftsmanship" style="width:100%;border-radius:12px;display:block;" />
  <figcaption style="text-align:center;font-size:0.8rem;color:#8B6344;margin-top:8px;">Bahia Palace's hand-painted octagonal cedar ceiling — one of the finest examples of 19th-century Moroccan craftsmanship</figcaption>
</figure>

<h2>History of El Badi Palace</h2>
<p>El Badi Palace was built in the 16th century by <strong>Sultan Ahmad al-Mansur</strong> of the Saadian dynasty, following his victory over the Portuguese at the Battle of the Three Kings in 1578. At the height of its glory, the palace contained over 300 rooms decorated with gold, Italian marble, onyx, and crystal. Contemporary historians described it as one of the most magnificent palaces in the Islamic world.</p>
<p>Its decline came swiftly. When the Alaouite Sultan Moulay Ismail came to power in the late 17th century, he ordered El Badi Palace stripped of its materials to build his new imperial capital in Meknès. What remains today are the vast mud walls, sunken gardens, and the ghost of a palace that once rivaled the greatest courts in the world.</p>

<h2>Architecture and Design: A Tale of Two Palaces</h2>
<p>The architectural contrast between Bahia Palace and El Badi Palace could not be more striking.</p>
<p><strong>Bahia Palace</strong> is a sensory experience. Every room, corridor, and courtyard is covered in decoration — hand-cut zellige tile mosaics climbing the walls, delicate stucco arabesques framing every arch, and intricately painted cedar wood ceilings overhead. The interiors feel intimate and layered, rewarding slow exploration.</p>

<figure style="margin:2rem 0;">
  <img src="/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg" alt="Bahia Palace zellige tiles and Arabic calligraphy stucco walls" style="width:100%;border-radius:12px;display:block;" />
  <figcaption style="text-align:center;font-size:0.8rem;color:#8B6344;margin-top:8px;">Bahia Palace interior: hand-cut zellige mosaics alongside carved stucco and Arabic calligraphy</figcaption>
</figure>

<p><strong>El Badi Palace</strong>, by contrast, is defined by scale and absence. Its massive pisé (rammed earth) walls enclose a 135-metre courtyard that once held an enormous pool. Today, the emptiness itself is the attraction — storks nest on the ruined towers, orange trees grow in sunken gardens, and the vast space invites you to imagine the vanished grandeur of the Saadian Empire. There is also a basement where the original minbar (pulpit) from the Koutoubia Mosque is preserved.</p>

<h2>Which Palace Is Better for Photography?</h2>
<p>Both palaces offer extraordinary photography opportunities, but in very different ways.</p>
<p><strong>Bahia Palace</strong> is a favorite for architectural and portrait photography. The soft light filtering through carved wooden screens (<em>mashrabiya</em>), the vibrant colors of the zellige tilework, and the reflection pools in the courtyards create shots that photograph beautifully at any time of day. Morning light (9–10 AM) is particularly golden and the crowd is thinnest.</p>

<figure style="margin:2rem 0;">
  <img src="/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg" alt="Bahia Palace inner courtyard with central fountain surrounded by stucco columns" style="width:100%;border-radius:12px;display:block;" />
  <figcaption style="text-align:center;font-size:0.8rem;color:#8B6344;margin-top:8px;">Bahia Palace inner courtyard — one of the most photographed spaces in Marrakech</figcaption>
</figure>

<p><strong>El Badi Palace</strong> offers dramatic wide-angle shots of ruined towers against the Marrakech sky. Climbing to the rooftop terraces gives you panoramic views of the medina with the Atlas Mountains as a backdrop — a completely different style of travel photography.</p>

<h2>Visitor Experience</h2>
<p>Visitors consistently describe <strong>Bahia Palace</strong> as calm, detailed, and visually rich. The palace unfolds as a series of interconnected rooms and courtyards, each more decorated than the last. The pace is slow and contemplative — most visitors spend 60 to 90 minutes moving through the rooms.</p>
<p><strong>El Badi Palace</strong> feels more open and archaeological. The atmosphere is less ornate but more monumental. The site hosts the annual Marrakech Popular Arts Festival in its courtyard and attracts both tourists and locals who enjoy its quieter, almost meditative emptiness.</p>

<h2>Can You Visit Both Palaces in One Day?</h2>
<p>Absolutely — and most visitors who come to the southern medina do exactly this. Both palaces are located within Marrakech's historic medina and are approximately 800 metres apart (about 10 minutes on foot). A practical one-day itinerary:</p>
<ul>
  <li><strong>9:00 AM</strong> — Arrive at Bahia Palace for opening time (fewest crowds, best light)</li>
  <li><strong>10:30 AM</strong> — Walk south through the Mellah to El Badi Palace</li>
  <li><strong>11:00 AM</strong> — Explore El Badi Palace and the rooftop terraces</li>
  <li><strong>12:30 PM</strong> — Lunch nearby at a Kasbah restaurant before the heat of the afternoon</li>
</ul>
<p>The Saadian Tombs are also 5 minutes from El Badi, making this corner of the medina the richest half-day in Marrakech for history lovers.</p>

<h2>Ticket Prices Comparison</h2>
<p><strong>Bahia Palace:</strong> 100 MAD (~$10 USD) for foreign adult visitors. Children under 7 free. Moroccan nationals pay 30 MAD. Online skip-the-line tickets avoid the queue entirely.</p>
<p><strong>El Badi Palace:</strong> 70 MAD (~$7 USD) for foreign adult visitors. Moroccan nationals pay 10 MAD.</p>
<p>If you plan to visit both on the same day, budget approximately 170 MAD (~$17) per person for entry to both sites — excellent value for the combined historical experience.</p>

<h2>Which Palace Should You Visit?</h2>
<p>There is no wrong answer — the two palaces complement each other beautifully:</p>
<ul>
  <li>Choose <strong>Bahia Palace</strong> if you love Moroccan interior design, detailed craftsmanship, intimate spaces, and photography with color and texture.</li>
  <li>Choose <strong>El Badi Palace</strong> if you prefer open-air ruins, panoramic city views, and dramatic historical atmosphere.</li>
  <li>Visit <strong>both</strong> if you want the full story of Marrakech's royal past — from the Saadian dynasty's 16th-century empire to the opulent private world of a 19th-century Grand Vizier.</li>
</ul>
<p>For most visitors to Marrakech with a full day available, combining Bahia Palace in the morning with El Badi Palace in the late morning gives a complete, deeply satisfying immersion in the city's royal heritage.</p>`,
};

async function main() {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug: post.slug, locale: post.locale } },
    update: { ...post },
    create: { ...post },
  });
  console.log(`✓ Created: "${post.title}"`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
