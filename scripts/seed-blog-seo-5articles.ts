import { config } from 'dotenv';
config({ path: '.env.local' });
config({ path: '.env' });

import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
const prisma = new PrismaClient({ adapter });

const NOW = new Date();

const posts = [
  // ─────────────────────────────────────────────────────────────
  // 1. Opening Hours
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Opening Hours 2026: Everything You Need to Know Before You Visit',
    slug: 'bahia-palace-opening-hours-2026',
    locale: 'en',
    category: 'practical',
    tags: 'bahia palace opening hours,bahia palace hours,palais bahia marrakech hours,when to visit bahia palace',
    excerpt: 'Bahia Palace opening hours 2026: daily schedule, holiday closures, best time to visit, and how to skip the queue. Plan your Marrakech trip right.',
    seoTitle: 'Bahia Palace Opening Hours 2026: Full Schedule & Best Times to Visit',
    seoDesc: 'Bahia Palace opening hours 2026: daily schedule, holiday closures, best time to visit, and how to skip the queue. Plan your Marrakech trip right.',
    content: `<h2>Current Opening Hours</h2>
<p>Bahia Palace is open every day of the week, but the hours shift depending on the season. Morocco doesn't observe a fixed summer/winter schedule with set dates, so hours can vary slightly — always verify closer to your visit.</p>
<table>
  <thead><tr><th>Day</th><th>Opening Hours (Standard)</th></tr></thead>
  <tbody>
    <tr><td>Monday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Tuesday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Wednesday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Thursday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Friday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Saturday</td><td>09:00 – 17:00</td></tr>
    <tr><td>Sunday</td><td>09:00 – 17:00</td></tr>
  </tbody>
</table>
<p><strong>Last entry</strong> is typically 30 minutes before closing. During peak summer months (June–August), hours may extend to 18:00. During Ramadan, the palace typically shifts to a reduced schedule — often 09:00 to 15:00 — and this can change year to year based on the Islamic calendar.</p>
<p><strong>2026 Note:</strong> Ramadan falls approximately March 1–30, 2026. If you're visiting during this window, expect adjusted hours and plan accordingly.</p>

<h2>Best Time to Visit</h2>
<h3>Early Morning: The Clear Winner</h3>
<p>Doors open at 9:00 AM, and the first 90 minutes are the calmest of the day. Tour groups typically don't arrive until 10:30–11:00, and the light inside the palace's open courtyards is softer and more photogenic in the morning. If you want the iconic zellij tilework and carved cedar ceilings to yourself — or at least without 40 other cameras in the frame — go early.</p>
<h3>Midday: Busiest Window</h3>
<p>Between 11:00 and 14:00 is when Bahia Palace is at its most crowded, especially during high season (March–May, September–November). Tour buses arrive, audio guide groups clog the doorways, and queue times at the ticket window can stretch to 30–45 minutes.</p>
<h3>Afternoon: A Decent Alternative</h3>
<p>After 14:30, crowds start to thin — many visitors leave for lunch. The light changes, some rooms get shadier, but the overall experience is more relaxed. If early morning isn't possible, late afternoon is your second-best option.</p>
<p><strong>Verdict:</strong> Arrive at opening (9:00 AM) or after 15:00. Avoid the 11:00–14:00 window if you can.</p>

<h2>How Long Does a Visit Take?</h2>
<p>Most visitors spend between <strong>1 hour and 1.5 hours</strong> inside Bahia Palace. The palace covers roughly 8,000 square meters across multiple courtyards, gardens, reception halls, and the former harem quarters — enough to keep you engaged without overwhelming you.</p>
<p>If you're a photographer or a history enthusiast who wants to linger in each room, budget <strong>2 hours</strong>. If you're traveling with children or combining it with other sites the same day (the Saadian Tombs are a 10-minute walk away), <strong>60–75 minutes</strong> is realistic.</p>
<p>What adds time: waiting in the ticket queue (can add 20–45 minutes), audio guides or guided tours, photographing details in the tiled courtyards. What shortens it: having a <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> pre-booked, visiting off-peak hours.</p>

<h2>Is Bahia Palace Open on Holidays?</h2>
<p>This is where many visitors get caught out. Morocco observes both national secular holidays and Islamic religious holidays. The palace's schedule on these days is not always consistent — some years it remains open with reduced hours, other years it closes entirely.</p>
<table>
  <thead><tr><th>Holiday</th><th>Approximate Date</th><th>Likely Status</th></tr></thead>
  <tbody>
    <tr><td>New Year's Day</td><td>January 1</td><td>Closed or reduced</td></tr>
    <tr><td>Throne Day</td><td>July 30</td><td>Often closed</td></tr>
    <tr><td>Eid al-Adha</td><td>~June 6–7, 2026</td><td>Closed 1–3 days</td></tr>
    <tr><td>Eid al-Fitr</td><td>~March 30, 2026</td><td>Closed 1–2 days</td></tr>
    <tr><td>Independence Day</td><td>November 18</td><td>Often closed</td></tr>
    <tr><td>Aid al-Mawlid</td><td>~September 4, 2026</td><td>Reduced hours</td></tr>
  </tbody>
</table>
<p>Islamic holidays follow the lunar calendar, so exact dates shift each year. If you're planning around any of these dates, check the official Moroccan Ministry of Culture listings closer to your trip — or contact your accommodation for local confirmation.</p>

<h2>Tips to Avoid Long Queues</h2>
<p>The single ticket window at Bahia Palace is a bottleneck. Even when the palace itself isn't that crowded, the queue to buy a ticket at the door can make your wait miserable — especially in summer heat.</p>
<ol>
  <li><strong>Book online in advance.</strong> A <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> means you walk past the queue entirely. In high season, this alone can save you 30–40 minutes standing in direct sun.</li>
  <li><strong>Arrive at 9:00 AM sharp.</strong> The queue is shortest right at opening. Arrive 5 minutes early and you'll be one of the first inside.</li>
  <li><strong>Avoid Fridays midday.</strong> Friday is the Muslim holy day, and while the palace stays open, the surrounding medina is busy with post-prayer foot traffic.</li>
  <li><strong>Come on weekday mornings.</strong> Weekends in Marrakech attract more domestic visitors — the difference in queue length on a Tuesday vs. a Saturday is noticeable.</li>
  <li><strong>Stay aware of group tours.</strong> If you see a large group checking in ahead of you, wait 10 minutes for them to disperse inside before entering.</li>
</ol>

<h2>Book Your Visit Before You Go</h2>
<p>The best way to enjoy Bahia Palace is with zero stress at the door. Skip the queue, walk straight in, and start exploring the moment you arrive. <a href="/en/tickets/skip-the-line">Get your skip-the-line ticket now</a> — availability is limited, especially during peak season.</p>

<h2>Frequently Asked Questions</h2>
<h3>What time does Bahia Palace open?</h3>
<p>Bahia Palace opens at 09:00 AM every day of the week. During peak summer months, closing time may extend to 18:00. During Ramadan (approximately March 1–30, 2026), hours are typically reduced to 09:00–15:00.</p>
<h3>Is Bahia Palace open on Fridays?</h3>
<p>Yes, Bahia Palace is open on Fridays with the standard schedule (09:00–17:00). The surrounding medina can be busier than usual around midday due to Friday prayers, but there is no special closure for Friday at the palace itself.</p>
<h3>Can I visit Bahia Palace without a ticket booked in advance?</h3>
<p>Yes, you can buy a ticket at the door for 70 MAD. However, during peak season the queue can take 30–45 minutes. Booking a <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> online eliminates this wait entirely and is strongly recommended from March through November.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Entrance Fee
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Entrance Fee 2026: Ticket Prices, Discounts & How to Save Money',
    slug: 'bahia-palace-entrance-fee-2026',
    locale: 'en',
    category: 'practical',
    tags: 'bahia palace entrance fee,bahia palace ticket price,how much does bahia palace cost,palais bahia prix',
    excerpt: 'Bahia Palace entrance fee 2026: official price is 100 MAD, but queues are long. Learn about discounts, skip-the-line options, and how to save money.',
    seoTitle: 'Bahia Palace Entrance Fee 2026: Ticket Prices, Discounts & Tips',
    seoDesc: 'Bahia Palace entrance fee 2026: official price is 100 MAD, but queues are long. Learn about discounts, skip-the-line options, and how to save money.',
    content: `<p>The official ticket price to enter Bahia Palace is 100 MAD — roughly $10 USD or £7.50. By international standards, that's a bargain for one of the most beautifully preserved Islamic palaces in the world. But the number on the ticket isn't the real cost. The real cost is the 30–45 minutes spent standing in line at the single ticket booth, in the heat, watching your sightseeing window shrink.</p>

<h2>Official Entrance Fee</h2>
<p>As of 2026, the standard entrance fee set by Morocco's Ministry of Culture is:</p>
<table>
  <thead><tr><th>Category</th><th>Price</th></tr></thead>
  <tbody>
    <tr><td>Adults (foreign visitors)</td><td>100 MAD (~$10 / £7.50 / €9)</td></tr>
    <tr><td>Moroccan nationals</td><td>10 MAD</td></tr>
    <tr><td>Children under 7</td><td>Free</td></tr>
  </tbody>
</table>
<p>Payment at the door is <strong>cash only</strong>. There are no card machines at the ticket window. The nearest ATMs are a short walk away near Rue Riad Zitoun el Kedim. Come prepared with dirhams.</p>

<h2>Are There Discounts?</h2>
<h3>Students</h3>
<p>There is no universally applied student discount for foreign visitors. Moroccan students with a valid national student card may access a reduced rate, but international student cards (ISIC and similar) are not reliably honored at the door. Don't count on a discount if you're visiting from abroad.</p>
<h3>Children</h3>
<p>Children under 7 enter free. Children between 7 and 12 are charged the full adult rate of 100 MAD. At that price, a family of four adults plus two young children is looking at roughly 400 MAD — still inexpensive by any measure.</p>
<h3>Locals vs. Foreign Visitors</h3>
<p>Morocco operates a dual pricing system at many state-run cultural sites. Bahia Palace is no exception: Moroccan nationals pay 10 MAD versus 100 MAD for foreign visitors. This is standard practice across the country.</p>
<h3>Group Discounts</h3>
<p>There is no formal group discount at the standard ticket window for foreign visitors. Organized tour groups negotiate rates separately through licensed tour operators. If you're traveling independently, expect to pay 100 MAD per adult regardless of group size.</p>

<h2>Skip-the-Line Ticket: Is It Worth It?</h2>
<p>Here's the honest answer: <strong>yes, especially between March and November.</strong></p>
<p>During Marrakech's peak travel season, the queue at Bahia Palace's single ticket window can stretch to 30–45 minutes. A <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> lets you bypass that queue entirely. You show your confirmation at a dedicated entrance and walk straight in.</p>
<p><strong>When it's absolutely worth it:</strong> March through May (spring high season), September through October (autumn high season), any public holiday or long weekend, or if you're on a tight schedule with other sites planned the same day.</p>
<p><strong>When it's less critical:</strong> Weekday mornings in January or February, or if you're arriving right at 9:00 AM before tour groups arrive.</p>
<p>The price difference between a door ticket and a skip-the-line option is modest. The time you save is real — and in a city as rewarding as Marrakech, an extra 40 minutes means another landmark, another souk, or a longer lunch.</p>

<h2>What's Included in the Ticket?</h2>
<p>Whether you buy at the door or online, your ticket covers full access to the palace's main courtyards, reception halls, gardens, and the former harem quarters — self-guided exploration at your own pace.</p>
<p><strong>Not included:</strong> audio guide (available for hire separately at the entrance), guided tour with a licensed local guide (prices vary), or photography permit (standard photography is free and allowed without flash — no extra fee required).</p>

<h2>How to Buy Tickets Online</h2>
<ol>
  <li>Visit the <a href="/en/tickets/skip-the-line">ticket booking page</a> on this site</li>
  <li>Select your date and number of visitors</li>
  <li>Complete payment by card (Visa, Mastercard, and major international cards accepted)</li>
  <li>Receive your confirmation by email — print it or save it to your phone</li>
  <li>On the day, go directly to the skip-the-line entrance and present your confirmation</li>
</ol>
<p>Booking even 24 hours in advance is enough outside of peak season. During spring and autumn, booking 3–5 days ahead is advisable as time slots can fill up.</p>

<h2>Don't Let the Queue Ruin Your Morning</h2>
<p>Bahia Palace is genuinely stunning — carved cedar ceilings, mosaic courtyards, and a sense of history that hits you the moment you step through the gate. <a href="/en/tickets/skip-the-line">Secure your skip-the-line ticket here</a> and walk straight in on the day. Availability is limited — especially in high season.</p>

<h2>Frequently Asked Questions</h2>
<h3>How much does it cost to enter Bahia Palace?</h3>
<p>The standard entrance fee is 100 MAD for foreign visitors (approximately $10 USD / £7.50 / €9 as of 2026). Moroccan nationals pay 10 MAD. Children under 7 enter free. Payment at the door is cash only.</p>
<h3>Can I get a discount at Bahia Palace with a student card?</h3>
<p>International student cards such as the ISIC are not reliably accepted at Bahia Palace's ticket window. Moroccan nationals with a valid national student card may receive a reduced rate, but foreign visitors should expect to pay the full adult price of 100 MAD.</p>
<h3>Is it cheaper to buy tickets at the door or online?</h3>
<p>The base ticket price is the same. Online <a href="/en/tickets/skip-the-line">skip-the-line tickets</a> may include a small booking fee, but they save you 30–45 minutes of queuing — well worth it in peak season. Online booking also guarantees entry during your chosen time window.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Dress Code
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Dress Code: What to Wear (and What to Avoid)',
    slug: 'bahia-palace-dress-code',
    locale: 'en',
    category: 'tips',
    tags: 'bahia palace dress code,what to wear bahia palace,bahia palace rules,visiting bahia palace tips',
    excerpt: 'Bahia Palace dress code 2026: what to wear, what to avoid, and what happens if you show up underdressed. Plan your outfit before you go.',
    seoTitle: 'Bahia Palace Dress Code 2026: What to Wear (and What to Avoid)',
    seoDesc: 'Bahia Palace dress code 2026: what to wear, what to avoid, and what happens if you show up underdressed. Plan your outfit before you go.',
    content: `<p>Each year, visitors arrive at the gates of Bahia Palace dressed for a beach day — shorts, tank tops, spaghetti straps — and are turned away or handed a robe before they can enter. It's an awkward moment that's entirely avoidable with five minutes of preparation. Morocco is a Muslim-majority country, and Bahia Palace is a historic royal monument. Modest dress is expected, and while enforcement varies, it's never worth the risk of being refused at the door after walking 20 minutes through the medina to get there.</p>

<h2>Is There a Strict Dress Code?</h2>
<p>Bahia Palace does not publish a formal written dress code the way some mosques do. However, the cultural expectation is clear: <strong>shoulders and knees should be covered for all visitors</strong>. In practice, enforcement is inconsistent — on quieter days, visitors in shorts occasionally get through. But on busy days, if a guard is checking, you may be stopped, asked to cover up, or directed to rent a wrap at the entrance.</p>
<p>The safest approach is to simply dress appropriately from the start. You'll be more comfortable inside anyway — loose, light fabrics are far more practical than tight, revealing clothing in the Marrakech heat.</p>

<h2>What Women Should Wear</h2>
<ul>
  <li>Lightweight trousers, linen pants, or a maxi skirt (knee-length or longer)</li>
  <li>A top with sleeves — at minimum, cap sleeves. Short sleeves are generally fine; sleeveless tops are not.</li>
  <li>A loose-fitting dress that covers the shoulders and falls past the knee</li>
  <li>A light cardigan, kimono, or wrap that can cover bare shoulders</li>
</ul>
<p>A common and practical choice: wide-leg linen trousers + a short-sleeve top + a light scarf in your bag. The scarf doubles as a cover-up if needed and costs nothing to carry. Choose linen and cotton — they breathe well and keep you cool even when covering up.</p>

<h2>What Men Should Wear</h2>
<p>Men face fewer restrictions in practice, but the same general rule applies: no bare shoulders, and shorts should fall at or below the knee.</p>
<ul>
  <li>Chinos, lightweight trousers, or longer shorts (knee-length or below)</li>
  <li>A t-shirt, polo, or short-sleeve shirt</li>
  <li>Light sneakers or sandals with good grip</li>
</ul>
<p>If you're already in Marrakech and dressed casually, a lightweight shirt thrown over a tank top is enough.</p>

<h2>What NOT to Wear</h2>
<p>These items may get you turned away or result in an uncomfortable conversation at the entrance:</p>
<ul>
  <li><strong>Sleeveless tops and vest tops</strong> — for any gender</li>
  <li><strong>Short shorts or mini-skirts</strong> — anything that falls significantly above the knee</li>
  <li><strong>Low-cut or sheer tops</strong> — even if they technically have sleeves</li>
  <li><strong>Swimwear of any kind</strong></li>
  <li><strong>Crop tops</strong> — they expose the midriff</li>
  <li><strong>Flip-flops with no grip</strong> — the palace floors are smooth stone and tile; slippery footwear is a practical hazard</li>
</ul>

<h2>What If You Forget?</h2>
<p>If you arrive underdressed, you have two options:</p>
<p><strong>Option 1: Scarves and wraps at the entrance.</strong> Vendors outside Bahia Palace (and sometimes staff at the entrance) offer lightweight wraps or sarongs to borrow or purchase. The price is typically 10–30 MAD for a purchase or a small tip for a borrowed item.</p>
<p><strong>Option 2: A nearby shop.</strong> The streets immediately surrounding Bahia Palace are lined with small shops selling scarves, light cotton trousers, and djellabas. A basic cotton wrap costs very little and you'll use it at other sites in Marrakech too. Don't rely on either of these as your plan — come dressed appropriately.</p>

<h2>Other Visitor Rules</h2>
<p><strong>Photography:</strong> Allowed throughout the palace. No flash photography — this is enforced to protect the painted woodwork and pigments. Drone use is not permitted.</p>
<p><strong>Shoes:</strong> You do not need to remove your shoes — Bahia Palace is not a mosque. Comfortable, closed-toe shoes or sandals with good grip are recommended.</p>
<p><strong>Touching the tilework and woodwork:</strong> Don't. The zellij mosaics and carved stucco are centuries old and fragile.</p>
<p><strong>Food and drink:</strong> Eating inside the palace is not permitted. You can bring a water bottle — staying hydrated in Marrakech is important.</p>

<h2>Plan a Stress-Free Visit</h2>
<p>Dress right, arrive early, and skip the queue. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket</a> before you arrive and walk straight through the entrance — no waiting, no scrambling for cash, no uncertainty.</p>

<h2>Frequently Asked Questions</h2>
<h3>Do I need to cover my head at Bahia Palace?</h3>
<p>No. Bahia Palace is a historic royal palace and museum, not an active mosque. Head coverings are not required for any visitors, regardless of gender. Covering your shoulders and legs is the key expectation.</p>
<h3>Can I wear shorts to Bahia Palace?</h3>
<p>Men can wear knee-length or longer shorts without issue in most cases. Women in shorts that fall above the knee may be asked to cover up. The safest approach for anyone is to wear trousers or a skirt that reaches the knee or below. If in doubt, carry a scarf or wrap that can be tied around the waist.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. 10 Tips Before Visiting
  // ─────────────────────────────────────────────────────────────
  {
    title: '10 Things to Know Before Visiting Bahia Palace Marrakech',
    slug: 'bahia-palace-tips-before-visiting',
    locale: 'en',
    category: 'tips',
    tags: 'visiting bahia palace,bahia palace tips,bahia palace visitor guide,what to expect bahia palace',
    excerpt: '10 essential things to know before visiting Bahia Palace Marrakech: timing, tickets, what to see, scams to avoid, and nearby sites.',
    seoTitle: '10 Things to Know Before Visiting Bahia Palace Marrakech (2026)',
    seoDesc: '10 essential things to know before visiting Bahia Palace Marrakech: timing, tickets, what to see, scams to avoid, and nearby sites.',
    content: `<p>Bahia Palace is one of the most visited monuments in Morocco — and one of the most misunderstood. Most tourists know it as "the palace in Marrakech," but very few arrive knowing what they're actually looking at, what to prioritize, or how to avoid the most common trip-ruining mistakes. These ten things will make your visit genuinely better.</p>

<h2>1. Book Your Tickets in Advance</h2>
<p>This is the single most impactful thing you can do before you visit. Bahia Palace has one ticket window. During peak season, queues can take 30 to 45 minutes. A <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> lets you bypass the queue entirely. The price difference is minimal; the difference in experience is significant. Book at least 24–48 hours in advance outside peak season. During high season or around public holidays, book 3–5 days ahead.</p>

<h2>2. Go in the Early Morning</h2>
<p>Bahia Palace opens at 9:00 AM. If you can be there at opening, do it. The first 90 minutes are the quietest of the day — no tour groups, better light for photography, cooler temperatures, and room to walk at your own pace. Going early isn't just advice for photographers. Being able to move through a historic palace without being nudged along by a crowd is a fundamentally different experience.</p>

<h2>3. Wear Comfortable, Sensible Shoes</h2>
<p>Bahia Palace covers approximately 8,000 square meters. You will walk on polished zellige tile floors (beautiful; also slippery), uneven stone passages between sections, and raised thresholds between rooms. Heels are a bad idea. Flip-flops with no grip are a liability. Wear flat, closed-toe shoes or sandals with a proper sole. You do not need to remove your shoes — Bahia Palace is not a mosque.</p>

<h2>4. Bring Water (and Cash)</h2>
<p><strong>Water:</strong> Even in spring and autumn, temperatures climb to 25–30°C by midday. There's no café or water station once you're in. Bring a bottle.</p>
<p><strong>Cash:</strong> The ticket window is cash only — no card readers. The official price is 70 MAD per adult. Even if you've pre-booked online, you'll want cash for the medina shops, street food, and tips. The nearest ATMs are on or near Rue Riad Zitoun el Kedim.</p>

<h2>5. Read Up (or Get a Guide) Before You Go</h2>
<p>Bahia Palace is stunning to look at. But if you don't know what you're looking at, you'll leave thinking "nice tiles" without understanding the story behind the rooms. The palace was built by Si Moussa, grand vizier of Sultan Hassan I, and later expanded by his son Ba Ahmed. Ba Ahmed built the palace as a monument to his own power — the name "Bahia" means "brilliant" in Arabic. The harem quarters alone housed 24 wives and hundreds of concubines. An audio guide is available for hire at the entrance. Reading a good summary online the night before your visit takes 10 minutes and transforms what you see inside.</p>

<h2>6. Don't Miss the Grand Riad and Harem Courtyard</h2>
<p>If you find yourself rushing, slow down in two places:</p>
<p><strong>The Grand Riad:</strong> The largest open courtyard in the palace, framed by a painted wooden gallery and surrounded by orange trees. It's the spatial heart of the building and one of the most photogenic spots in Marrakech.</p>
<p><strong>The Harem Courtyard and Chambers:</strong> The private quarters built for Ba Ahmed's wives and concubines. The rooms here are smaller, more intimate, and detailed in ways the grand reception halls aren't. Many visitors move quickly through the outer rooms and miss the depth of what's further inside.</p>

<h2>7. Photography Is Allowed — But No Flash</h2>
<p>You can photograph freely inside Bahia Palace. There is no photography fee and no restricted area for personal cameras. The one firm rule: <strong>no flash</strong>. The painted wooden ceilings, carved stucco, and pigmented tilework are old and light-sensitive. Flash is prohibited to protect them, and this is enforced.</p>
<p>The best light for courtyard shots is in the first two hours after opening (9:00–11:00 AM). Interior rooms are dimly lit — use your phone's night mode or increase ISO on a camera rather than using flash.</p>

<h2>8. Watch Out for Tourist Scams Outside</h2>
<p>Inside the palace walls, you're fine. Outside is different — not because Marrakech is dangerous, but because major tourist sites attract people looking to earn money from visitors.</p>
<ul>
  <li><strong>"Unofficial guides"</strong> who claim guiding is mandatory or that the palace is closed — it isn't. Politely decline.</li>
  <li><strong>Men who walk alongside you</strong> offering to "show you the way" — typically a setup for a tip demand.</li>
  <li><strong>Henna artists</strong> who offer free application, then insist on an aggressive price once it's on your arm.</li>
  <li><strong>Shopkeepers</strong> who claim the site has "moved" or is "closed today" — it hasn't. It isn't.</li>
</ul>
<p>Download an offline Google Maps map of Marrakech before your trip, walk with purpose, and politely decline unsolicited offers.</p>

<h2>9. Combine Your Visit with Nearby Sites</h2>
<p>Bahia Palace sits in the southern medina, and two of Marrakech's other major historical sites are within a short walk.</p>
<p><strong>Saadian Tombs</strong> (~10 minutes south): The royal mausoleum of the Saadian dynasty, featuring intricately decorated chambers. Closed for centuries and only rediscovered in 1917.</p>
<p><strong>El Badi Palace</strong> (~15 minutes west): The dramatic ruins of a 16th-century palace complex — vast roofless halls and stork-nested towers. A very different experience from Bahia, worth an hour.</p>
<p>A good half-day: Start at Bahia Palace at 9:00 AM, spend 1.5 hours, walk to the Saadian Tombs, then end at El Badi Palace before lunch. All three within 4–5 hours total.</p>

<h2>10. Allow 1.5 to 2 Hours — Not More, Not Less</h2>
<p>Visitors who rush through in 30–40 minutes typically only see the first two or three courtyards. The private apartments, harem quarters, and gardens reward slower exploration. But unlike a museum with 50 rooms, Bahia Palace has a natural flow and a clear exit — you won't need 3 hours. The sweet spot is <strong>90 minutes</strong>: enough to see every section thoughtfully without rushing, with time to sit in the Grand Riad and actually absorb where you are.</p>

<h2>Skip the Queue and Start Exploring</h2>
<p>The palace is ready for you. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket now</a> and walk straight in on the day. Limited availability — especially in spring and autumn.</p>

<h2>Frequently Asked Questions</h2>
<h3>Is Bahia Palace worth visiting?</h3>
<p>Yes, without reservation. It's one of the best-preserved examples of Moroccan-Andalusian architecture in the country, with 8,000 square meters of painted ceilings, mosaic courtyards, and carved stucco work. For architecture and history enthusiasts it's a highlight of any Morocco trip. Even for casual visitors, an hour and a half inside is time very well spent.</p>
<h3>Is Bahia Palace suitable for children?</h3>
<p>Yes. There's a lot to look at, space to walk, and the open courtyard gardens are engaging for younger visitors. Children under 7 enter free. The main practical consideration is the walking distance through the medina — bring a stroller if needed, and note that some doorways have raised thresholds.</p>
<h3>Can I take photos inside Bahia Palace?</h3>
<p>Yes, personal photography is free and unrestricted throughout the palace. Flash photography is prohibited to protect the painted surfaces and woodwork. Tripods may be questioned by staff in busy areas. Video recording for personal use is generally fine.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. How to Get There
  // ─────────────────────────────────────────────────────────────
  {
    title: 'How to Get to Bahia Palace from Jemaa el-Fna (Walking, Taxi & More)',
    slug: 'how-to-get-to-bahia-palace-marrakech',
    locale: 'en',
    category: 'practical',
    tags: 'how to get to bahia palace,bahia palace location,bahia palace directions,bahia palace marrakech medina',
    excerpt: "How to get to Bahia Palace from Jemaa el-Fna: walking route, taxi tips, Google Maps advice, and nearby attractions. Full directions for first-timers.",
    seoTitle: 'How to Get to Bahia Palace from Jemaa el-Fna (Walking, Taxi & More)',
    seoDesc: 'How to get to Bahia Palace from Jemaa el-Fna: walking route, taxi tips, Google Maps advice for the medina, and what\'s nearby. Directions for first-timers.',
    content: `<p>Bahia Palace is in the southern medina of Marrakech — which sounds simple until you're actually inside the medina, surrounded by a labyrinth of unlabeled alleyways, wrong turns, and very confident locals pointing you in different directions. First-timers often find it harder to reach than expected. The directions aren't complicated, but the medina doesn't behave like a normal city grid. This guide gives you a clear, step-by-step route from the main square at Jemaa el-Fna, plus alternatives for those who don't want to walk.</p>

<h2>Bahia Palace Address &amp; Location</h2>
<p>Bahia Palace sits in the Mellah district of Marrakech's old medina, southeast of the central square.</p>
<p><strong>Address:</strong> Rue Riad Zitoun el Jedid, Marrakech 40000, Morocco</p>
<p><strong>GPS Coordinates:</strong> 31.6226° N, 7.9827° W</p>
<p>The palace is not visible from any main road. Its entrance is on a street that runs between two larger medina arteries. First-time visitors often walk past it — the entrance is elegant but understated, marked by heavy wooden doors rather than a large signposted gateway.</p>

<h2>Walking from Jemaa el-Fna (~15 Minutes)</h2>
<p>Walking is the best way to reach Bahia Palace from Jemaa el-Fna. The route takes you through the living, working medina — past spice sellers, leather goods, and tea shops — and is part of the experience of being in Marrakech. The distance is roughly 1.2 kilometers.</p>
<ol>
  <li><strong>Start at Jemaa el-Fna</strong> with the Koutoubia Mosque behind you (to the west). Face east, toward the medina.</li>
  <li><strong>Enter the medina</strong> via the street called <strong>Rue Riad Zitoun el Kedim</strong> — look for signs; this street heads directly south from the eastern edge of the square.</li>
  <li><strong>Walk south along Rue Riad Zitoun el Kedim.</strong> This is a wide-ish covered street by medina standards. Keep going south — about 10 minutes of walking. You'll pass souvenir shops, small cafes, and craftsmen's workshops.</li>
  <li><strong>Stay on the main corridor</strong> heading south as it transitions to Rue Riad Zitoun el Jedid.</li>
  <li><strong>Watch for the palace sign.</strong> Bahia Palace will appear on your <strong>left side</strong>, marked by a sign in Arabic and French and the large wooden entrance doors. If you reach the Mellah market you've gone slightly too far — double back north about 100 meters.</li>
</ol>
<p><strong>Total walking time:</strong> 12–18 minutes depending on pace and crowds. Download the Google Maps offline map for Marrakech before you leave your accommodation — having GPS while offline is far more reliable than asking for directions in a busy street.</p>

<h2>Taking a Taxi or Caleche</h2>
<h3>Petit Taxi (Small Red Taxi)</h3>
<p>Marrakech's petit taxis run on meters — or should. In practice, many drivers negotiate a fixed fare with tourists. <strong>Reasonable fare from Jemaa el-Fna to Bahia Palace: 15–25 MAD by meter.</strong> Fixed fare negotiations will typically start at 50–80 MAD from a tourist starting point — negotiate down, and agree on the price before you get in.</p>
<p>Petit taxis cannot enter the deepest lanes of the medina. They'll drop you at the nearest accessible point, a 2–3 minute walk from the entrance. Tell the driver "Palais Bahia" — it's well known.</p>
<h3>Caleche (Horse-Drawn Carriage)</h3>
<p>Caleches operate from ranks near Jemaa el-Fna. <strong>Fare to Bahia Palace: 60–100 MAD one way (negotiate before boarding).</strong> The ride is pleasant and slow — a caleche through the medina edge is an experience, not just transport. Caleches cannot navigate the narrow medina lanes, so they'll drop you close but not at the door.</p>
<h3>Ride Apps</h3>
<p>Both <strong>Careem</strong> and <strong>inDrive</strong> operate in Marrakech and are more reliable for price transparency than street-hailing taxis. If you have working mobile data, booking through an app shows you the fare upfront. This is especially useful for the return journey when you're tired and less inclined to negotiate.</p>

<h2>Using Google Maps in the Medina</h2>
<p>Google Maps works in the Marrakech medina better than many people expect. The key is using it correctly:</p>
<ul>
  <li><strong>Before you leave your accommodation:</strong> Download the offline map of Marrakech. Save Bahia Palace as a saved place so you can navigate without searching.</li>
  <li><strong>Set your route to walking</strong> — driving directions in the medina are often useless since most lanes are pedestrian-only.</li>
  <li><strong>Zoom in when you're within 200 meters</strong> of the destination — some lanes aren't perfectly labeled and a small discrepancy can send you to the wrong alley.</li>
  <li>If the app says you've arrived but you can't see the entrance, look for the large wooden doors on your left — you may be standing nearly at them.</li>
</ul>

<h2>Parking Nearby (If Driving)</h2>
<p>Driving into the medina is not practical — the lanes are too narrow and mostly pedestrian-only. Park outside the medina walls and walk or take a short taxi to the palace.</p>
<ul>
  <li><strong>Parking El Badi:</strong> A large surface car park near El Badi Palace on Place des Ferblantiers, roughly 600 meters west of Bahia Palace. Free or very low cost.</li>
  <li><strong>Parking Mellah:</strong> A smaller car park just south of the Mellah market area, very close to the palace entrance.</li>
</ul>
<p>From either car park, walking to the palace entrance takes 5–10 minutes. Car parks in Marrakech's medina area are typically informal — a guardian will collect a small fee (5–10 MAD) when you leave. This is normal and expected.</p>

<h2>What's Near Bahia Palace?</h2>
<p><strong>Saadian Tombs (~10 minutes south):</strong> The royal mausoleum of the Saadian dynasty, sealed for centuries and rediscovered in 1917. Small, remarkably detailed, and worth 45 minutes. Follow the signs south from Bahia Palace through the Mellah.</p>
<p><strong>El Badi Palace (~15 minutes west):</strong> The dramatic ruins of a 16th-century palace complex — vast roofless halls and stork-topped towers. Head west toward Place des Ferblantiers.</p>
<p><strong>Mellah (Jewish Quarter):</strong> Immediately adjacent to Bahia Palace. The covered market streets here are less touristy than the main souks and worth a wander — taller buildings, wrought-iron balconies, and a distinct character.</p>

<h2>Already Know How to Get There? Skip the Queue Too.</h2>
<p>Getting there is one thing. Standing in line for 40 minutes once you arrive is another. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket in advance</a> and you'll walk from the street straight into the palace — no cash scramble, no queue, no waiting in the sun.</p>

<h2>Frequently Asked Questions</h2>
<h3>How far is Bahia Palace from Jemaa el-Fna?</h3>
<p>Bahia Palace is approximately 1.2 kilometers from Jemaa el-Fna. On foot through the medina, the walk takes 12–18 minutes. By petit taxi, it's a 5–10 minute ride costing 15–25 MAD by meter.</p>
<h3>Can I walk to Bahia Palace from the medina?</h3>
<p>Yes, and walking is the recommended way to get there. The route along Rue Riad Zitoun el Kedim and Rue Riad Zitoun el Jedid is straightforward and takes you through genuine medina neighborhoods. Download Google Maps offline before your trip for navigation confidence.</p>
<h3>Is there a bus to Bahia Palace?</h3>
<p>Marrakech's city buses don't run routes into the heart of the medina. From Jemaa el-Fna, walking or taking a petit taxi is faster and more practical than using a bus. Ride-hailing apps (Careem, inDrive) are a good alternative if you prefer upfront pricing.</p>`,
  },
];

async function main() {
  console.log('Seeding 5 SEO blog articles...\n');

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug_locale: { slug: post.slug, locale: post.locale } },
      update: {
        title:       post.title,
        excerpt:     post.excerpt,
        content:     post.content,
        category:    post.category,
        tags:        post.tags,
        seoTitle:    post.seoTitle,
        seoDesc:     post.seoDesc,
        published:   true,
        publishedAt: NOW,
      },
      create: {
        title:       post.title,
        slug:        post.slug,
        locale:      post.locale,
        excerpt:     post.excerpt,
        content:     post.content,
        category:    post.category,
        tags:        post.tags,
        seoTitle:    post.seoTitle,
        seoDesc:     post.seoDesc,
        author:      'Bahia Palace Team',
        published:   true,
        publishedAt: NOW,
      },
    });
    console.log(`✓  ${post.title}`);
  }

  console.log('\nDone — 5 articles created and published. View them at /en/blog.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
