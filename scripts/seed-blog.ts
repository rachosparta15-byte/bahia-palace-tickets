import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const posts = [
  // ─────────────────────────────────────────────────────────────
  // 1. Complete Visitor Guide
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Marrakech: The Complete Visitor Guide 2026',
    slug: 'bahia-palace-marrakech-complete-visitor-guide-2026',
    locale: 'en',
    category: 'guides',
    tags: 'bahia palace,marrakech,visitor guide,tickets,opening hours',
    excerpt: 'Everything you need to know before visiting Bahia Palace in Marrakech — tickets, opening hours, dress code, tips to avoid crowds, and what to see inside.',
    seoTitle: 'Bahia Palace Marrakech Visitor Guide 2026 | Tickets, Hours & Tips',
    seoDesc: 'Complete guide to visiting Bahia Palace Marrakech in 2026. Learn about ticket prices, opening hours, what to wear, how to avoid crowds, and the best things to see inside.',
    content: `<h2>Why Bahia Palace Should Be on Every Marrakech Itinerary</h2>
<p>Bahia Palace is one of the most breathtaking monuments in all of Morocco. Built in the late 19th century, this sprawling palace complex covers over 8,000 square metres of intricate tilework, carved cedar ceilings, and lush gardens. Whether you're a first-time visitor or a seasoned traveller to Marrakech, the palace never fails to impress.</p>
<p>In this guide, you'll find everything you need to plan a smooth, enjoyable visit — including how to book tickets, the best times to arrive, and what to expect inside.</p>

<h2>Bahia Palace Opening Hours 2026</h2>
<p>Bahia Palace is open every day of the year, including public holidays. Opening hours vary slightly by season:</p>
<ul>
  <li><strong>October to March:</strong> 09:00 – 17:00</li>
  <li><strong>April to September:</strong> 09:00 – 18:00</li>
</ul>
<p>The palace closes briefly on Friday from 11:30 to 15:00 for midday prayers. If your visit falls on a Friday, plan to arrive before 11:00 or after 15:00.</p>

<h2>Bahia Palace Entrance Fee & Ticket Options</h2>
<p>The standard entrance fee for Bahia Palace is <strong>100 MAD</strong> (approximately €9 / $10) for foreign adults. Children under 7 enter free. Moroccan adults pay 30 MAD. However, buying your ticket at the door means queuing — sometimes for 30 to 45 minutes during peak season.</p>
<p>The smarter option is to book a skip-the-line ticket online before you arrive. This guarantees your entry at a fixed time and lets you walk straight past the queue. You can also combine your visit with a guided tour or a combo ticket for the Saadian Tombs.</p>

<h2>How to Get to Bahia Palace</h2>
<p>Bahia Palace is located in the heart of Marrakech's medina, near the Mellah (Jewish quarter). The address is <strong>Rue Riad Zitoun el Jdid</strong>. Here are the most common ways to get there:</p>
<ul>
  <li><strong>On foot from Jemaa el-Fna:</strong> About 15–20 minutes walk through the medina souks. Follow signs for "Palais Bahia" — they are well posted.</li>
  <li><strong>Petit Taxi:</strong> A 5-minute ride from Jemaa el-Fna. Agree on the price (20–30 MAD) before getting in or insist the meter is used.</li>
  <li><strong>Caleche (horse-drawn carriage):</strong> A scenic option from Jemaa el-Fna. Negotiate the price before boarding — 80–120 MAD for the round trip is fair.</li>
</ul>

<h2>What to See Inside Bahia Palace</h2>
<p>Bahia Palace was built by Si Moussa, a former slave who rose to become Grand Vizier of Morocco. His son Ba Ahmed later expanded the palace into the grand complex you see today. The name "Bahia" means "brilliance" in Arabic — and the palace more than lives up to it.</p>
<h3>The Grand Courtyard</h3>
<p>The centrepiece of the palace is the vast courtyard paved with colourful zellige tiles and shaded by orange trees. This is where the Grand Vizier held audiences. The scale and symmetry of the space is unlike anything else in Marrakech.</p>
<h3>The Apartments of Lalla Zinab</h3>
<p>These private rooms were decorated for the Grand Vizier's favourite wife. The painted wooden ceilings, stucco walls, and carved archways here represent the pinnacle of 19th-century Moroccan craftsmanship.</p>
<h3>The Small Riad and Garden</h3>
<p>Beyond the main courtyard, a series of intimate rooms opens onto a tranquil garden planted with jasmine, roses, and fruit trees. This quieter section of the palace is often less crowded and is ideal for photography.</p>
<h3>The Painted Ceilings</h3>
<p>Look up wherever you go — the hand-painted cedar ceilings are arguably the most spectacular element of Bahia Palace. Each panel was painted by master craftsmen called <em>maalems</em>, and no two are exactly alike.</p>

<h2>Best Time to Visit (Avoid the Crowds)</h2>
<p>Bahia Palace is busiest between 10:00 and 13:00, especially in summer and during school holidays. For a more relaxed experience, arrive when the doors open at 09:00 or come after 15:00 in the afternoon. Weekday mornings are significantly quieter than weekends.</p>

<h2>Dress Code and What to Wear</h2>
<p>Bahia Palace is a cultural site, so modest dress is expected. Shoulders and knees should be covered for both men and women. Scarves or a light shawl are helpful if your outfit needs adjusting. Comfortable shoes are essential — the floors are uneven in places and you'll be walking for at least an hour.</p>

<h2>How Long to Spend at Bahia Palace</h2>
<p>Allow at least <strong>60 to 90 minutes</strong> to see the palace comfortably. If you are interested in the history and architecture, you can easily spend two hours. A guided tour (available on-site or pre-booked) adds depth and context that enriches the experience.</p>

<h2>Ready to Book Your Visit?</h2>
<p>Skip the queue and book your Bahia Palace ticket online before you travel. Choose from a standard skip-the-line ticket, a guided tour, or a combo ticket pairing Bahia Palace with the Saadian Tombs — two of Marrakech's greatest monuments in one day.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. 3 Days in Marrakech
  // ─────────────────────────────────────────────────────────────
  {
    title: '3 Days in Marrakech: The Perfect Itinerary for 2026',
    slug: '3-days-in-marrakech-perfect-itinerary-2026',
    locale: 'en',
    category: 'itineraries',
    tags: 'marrakech itinerary,3 days marrakech,marrakech trip,bahia palace,what to do marrakech',
    excerpt: 'The best 3-day Marrakech itinerary for 2026 — covering the medina, Bahia Palace, Saadian Tombs, Majorelle Garden, day trips, food, and where to stay.',
    seoTitle: '3 Days in Marrakech: Perfect Itinerary 2026 | What to Do & See',
    seoDesc: 'Plan your perfect 3-day Marrakech trip with this detailed itinerary. Bahia Palace, Jardin Majorelle, Saadian Tombs, souks, food, and practical tips for 2026.',
    content: `<h2>How to Spend 3 Days in Marrakech: Overview</h2>
<p>Three days is the sweet spot for Marrakech — long enough to see the highlights without feeling rushed, short enough to stay energised by the city's relentless pace. This itinerary covers the medina's greatest monuments, the best food, a garden escape, and a day-trip option if you have the energy. Let's go.</p>

<h2>Day 1: The Heart of the Medina</h2>
<h3>Morning: Jemaa el-Fna & the Souks</h3>
<p>Start your first day in Marrakech at <strong>Jemaa el-Fna</strong>, the famous central square. In the morning it's calm — the snake charmers and storytellers only appear later in the day. Grab a freshly squeezed orange juice (3–5 MAD) from one of the stalls and ease yourself in.</p>
<p>From the square, head into the <strong>souks</strong>. The dyers' souk (Souk Sabbaghin), the spice souk, and the leather workers' quarter (near the tanneries) are the highlights. Give yourself 90 minutes to wander without a destination in mind.</p>
<h3>Afternoon: Bahia Palace & the Mellah</h3>
<p>After lunch at a rooftop café overlooking the medina, make your way to <strong>Bahia Palace</strong>. Book your ticket online in advance to skip the queue — it saves 30–45 minutes on busy days. Allow 60 to 90 minutes to explore the palace's grand courtyards, painted ceilings, and peaceful gardens.</p>
<p>Directly beside the palace, the <strong>Mellah</strong> (the old Jewish quarter) is worth 20 minutes of exploration — it has a distinctly different character from the rest of the medina.</p>
<h3>Evening: Jemaa el-Fna at Night</h3>
<p>Return to Jemaa el-Fna at sunset. The square transforms completely: storytellers, acrobats, and musicians fill every corner, and the food stalls open for dinner. It's chaotic, loud, and completely unforgettable.</p>

<h2>Day 2: Palaces, Ruins & Gardens</h2>
<h3>Morning: Saadian Tombs & El Badi Palace</h3>
<p>Begin with the <strong>Saadian Tombs</strong>, the royal necropolis of the Saadian dynasty, hidden and sealed for centuries until rediscovered in 1917. They open at 09:00 — arrive at the door to beat the tour groups. Entrance is 70 MAD.</p>
<p>A 10-minute walk away, the ruins of <strong>El Badi Palace</strong> offer a completely different experience: vast open grounds where storks nest on crumbling walls. Entry is 70 MAD and rarely crowded.</p>
<h3>Afternoon: Jardin Majorelle</h3>
<p><strong>Jardin Majorelle</strong> is one of the most photographed places in Morocco — a cobalt-blue villa surrounded by a botanical garden filled with cacti, bamboo, and lotus ponds. It was owned by Yves Saint Laurent and Pierre Bergé for decades. Entry is 150 MAD. Go in the early afternoon when tour groups have left.</p>
<h3>Evening: Dinner in Gueliz</h3>
<p>Gueliz is the modern French-built neighbourhood adjacent to the medina. It has Marrakech's best restaurants. For a special dinner, book a table at a traditional riad restaurant in the medina — many offer set menus with live music.</p>

<h2>Day 3: Escape the City or Go Deeper</h2>
<h3>Option A: Day Trip to the Atlas Mountains</h3>
<p>The <strong>Atlas Mountains</strong> are just 45 minutes from Marrakech by taxi. Hire a driver for the day (300–400 MAD) and visit the Ourika Valley for waterfalls, Berber villages, and fresh mountain air. A complete contrast to the medina.</p>
<h3>Option B: Ben Youssef Madrasa & the Tanneries</h3>
<p>If you haven't yet seen the <strong>Ben Youssef Madrasa</strong>, this is one of Morocco's finest examples of Islamic architecture — a 14th-century Quranic school with extraordinary carved stucco and zellige tilework. Combine it with a visit to the leather tanneries, which you view from rooftop terraces of the surrounding shops.</p>

<h2>Practical Tips for 3 Days in Marrakech</h2>
<ul>
  <li><strong>Book tickets online</strong> for Bahia Palace and other major monuments — queues in peak season are 30–45 minutes long.</li>
  <li><strong>Stay inside the medina</strong> for your first trip — riads are unique to Morocco and put you within walking distance of everything.</li>
  <li><strong>Drink bottled water only</strong> — tap water is not safe for tourists.</li>
  <li><strong>Negotiate everything</strong> in the souks — start at 30–40% of the first asking price.</li>
  <li><strong>Carry small change</strong> (coins) — many stalls cannot break large notes.</li>
</ul>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Is It Worth Visiting? Honest Review
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Is Bahia Palace Worth Visiting? An Honest Review (2026)',
    slug: 'is-bahia-palace-worth-visiting-honest-review-2026',
    locale: 'en',
    category: 'reviews',
    tags: 'bahia palace review,is bahia palace worth it,bahia palace marrakech,honest review',
    excerpt: 'Is Bahia Palace really worth the visit? We give you an honest, unfiltered review — the highlights, the disappointments, and whether it deserves a place on your Marrakech itinerary.',
    seoTitle: 'Is Bahia Palace Worth Visiting? Honest Review 2026',
    seoDesc: 'Honest review of Bahia Palace Marrakech 2026. Is it worth visiting? We cover what impresses, what disappoints, and how to get the most from your visit.',
    content: `<h2>The Short Answer: Yes — But With One Important Condition</h2>
<p>Bahia Palace is absolutely worth visiting. It ranks among the finest examples of 19th-century Moroccan architecture anywhere in the country, and no photograph — no matter how well composed — does justice to the scale of its courtyards or the intricacy of its painted ceilings. If you're spending any time in Marrakech, skipping it would be a genuine mistake.</p>
<p>The one condition: <strong>book your ticket in advance</strong>. Visitors who turn up without a ticket and find a 40-minute queue can leave frustrated before they've even stepped inside. With a skip-the-line ticket, the experience is seamlessly good.</p>

<h2>What Makes Bahia Palace Impressive</h2>
<h3>The Scale Is Genuinely Surprising</h3>
<p>Most visitors expect something modest. They walk in and stop. The grand courtyard alone — 1,500 square metres of zellige tilework, shaded by orange and lemon trees — is unlike anything they anticipated. The palace covers 8,000 square metres in total across dozens of rooms, corridors, and gardens.</p>
<h3>The Ceilings Are Exceptional</h3>
<p>The hand-painted cedar ceilings are the undisputed highlight of Bahia Palace. Every panel was created by a <em>maalem</em> (master craftsman), and no two are identical. The colours — deep blue, rich gold, warm terracotta — have barely faded in over a century. Looking up becomes a habit you'll repeat in every room.</p>
<h3>The Gardens Are a Genuine Retreat</h3>
<p>Beyond the formal courtyards, the gardens of Bahia Palace are planted with jasmine, roses, banana trees, and fruit trees. In the heat of a Marrakech afternoon, they offer real shade and a rare moment of calm. Photographers tend to linger here long after they've seen the rooms.</p>
<h3>The History Adds Depth</h3>
<p>Knowing the story behind the palace enriches the visit considerably. Bahia was built by Ba Ahmed ibn Moussa, a former slave who became the most powerful man in Morocco — the Grand Vizier under Sultan Abdelaziz. He employed 300 craftsmen from Fes and completed the palace in 1900. Eight years later, he died and Sultan Abdelaziz stripped the palace of its furnishings within hours. The rooms you walk through were once emptied overnight.</p>

<h2>What Could Be Better</h2>
<h3>Limited Interpretation Inside</h3>
<p>English signage inside the palace is sparse. Without context, some rooms feel like beautifully decorated empty shells. A guided tour — or at minimum a good audio guide — makes a significant difference. If you want to understand what you're seeing, book a guided option.</p>
<h3>Crowded Between 10:00 and 13:00</h3>
<p>Tour groups descend on Bahia Palace late morning and stay until early afternoon. If you arrive between 10:00 and 13:00 without a timed entry, expect large crowds in the grand courtyard and difficulty getting unobstructed photographs. Arriving at 09:00 when the doors open or after 15:00 makes the visit significantly more enjoyable.</p>
<h3>Some Rooms Are Closed for Restoration</h3>
<p>Bahia Palace is an ongoing restoration project. A section of the rooms may be closed on any given day without prior notice. This is the nature of a living heritage site and rarely affects the core experience, but it's worth knowing.</p>

<h2>How Does It Compare to Other Marrakech Monuments?</h2>
<p>Visitors often ask whether Bahia Palace or the Saadian Tombs is the better choice. They are very different experiences: the Tombs are intimate, deeply ornate, and historically significant; the Palace is expansive, architectural, and visually spectacular. If you have time, visit both — a combo ticket makes this easy and saves money. If you only have time for one, Bahia Palace offers more variety and a longer, richer experience.</p>

<h2>The Verdict</h2>
<p>Bahia Palace earns its place on every Marrakech itinerary. The architecture alone justifies the visit, and the gardens and historical context make it memorable long after you leave. Book online, arrive early or late in the day, and consider a guided tour if you want to understand what you're seeing. Do that, and you'll leave impressed.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. Best Time to Visit
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Best Time to Visit Bahia Palace in 2026 (Beat the Crowds)',
    slug: 'best-time-to-visit-bahia-palace-marrakech-2026',
    locale: 'en',
    category: 'tips',
    tags: 'best time bahia palace,when to visit bahia palace,bahia palace crowds,marrakech tips',
    excerpt: 'When should you visit Bahia Palace to avoid queues and crowds? We break down the best times of day, the best months, and the insider tips that most visitors miss.',
    seoTitle: 'Best Time to Visit Bahia Palace 2026 | Avoid Crowds & Queues',
    seoDesc: 'Find the best time to visit Bahia Palace Marrakech in 2026. Avoid peak crowds with our guide to opening hours, quiet periods, and the best months of the year.',
    content: `<h2>Why Timing Your Visit to Bahia Palace Matters</h2>
<p>Bahia Palace is one of the most visited monuments in Morocco. During peak season, tour groups arrive by the coach-load between late morning and early afternoon, turning the grand courtyard from a peaceful architectural wonder into a crowded scramble for photograph angles. The good news: a few simple timing decisions can completely change your experience.</p>

<h2>Best Time of Day to Visit</h2>
<h3>First Thing in the Morning: 09:00 – 10:30</h3>
<p>This is the single best window of the day. The palace opens at 09:00 and the first tour buses don't arrive until around 10:00. For 60 to 90 minutes you'll have the courtyards largely to yourself — ideal for photography and for absorbing the scale of the space in peace. This slot works year-round and is particularly valuable in summer.</p>
<h3>Late Afternoon: 15:30 – 18:00 (summer) / 15:00 – 17:00 (winter)</h3>
<p>Tour groups tend to leave by mid-afternoon. The light in the late afternoon also casts long shadows that make the tilework and carved plasterwork easier to appreciate and photograph. The palace closes at 18:00 in summer and 17:00 in winter, so arriving at 15:30 gives you ample time.</p>
<h3>Avoid: 10:00 – 14:00</h3>
<p>This is the busiest window every day of the year. Multiple tour groups overlap, the queues at the entrance are longest, and the grand courtyard becomes congested. If this is your only option, booking a skip-the-line ticket removes the queue problem — but the crowds inside will still be at their peak.</p>

<h2>Friday: A Special Case</h2>
<p>Bahia Palace closes on Fridays from 11:30 to 15:00 for midday prayers. If you're visiting on a Friday, plan your visit carefully: arrive before 11:00 to get a full morning visit, or come after 15:00 for the quieter afternoon. Many tourists don't realise this and arrive at noon to find the doors closed.</p>

<h2>Best Months to Visit Marrakech for Bahia Palace</h2>
<h3>October, November, March, April — The Sweet Spot</h3>
<p>These four months offer the best balance of mild temperatures (20–26°C), manageable crowds, and good light. Spring brings flowers to the palace gardens. Autumn keeps the summer crowds at bay while retaining warm evenings.</p>
<h3>December to February — Quiet and Cool</h3>
<p>Winter is the quietest season at Bahia Palace. Temperatures are cool (12–18°C during the day) but the sky is clear and blue, and the crowds are a fraction of what they are in summer. If you don't mind wrapping up, winter is excellent.</p>
<h3>July and August — Possible, But Demanding</h3>
<p>Summer in Marrakech means temperatures of 38–42°C. The palace itself offers shade in the gardens and covered rooms, but the walk to and from the medina can be exhausting. Crowds are also at their annual peak due to European summer holidays. If July or August is your only option, visit first thing at 09:00 and bring plenty of water.</p>

<h2>Practical Tips to Minimise Queuing</h2>
<ul>
  <li><strong>Book a skip-the-line ticket online</strong> — the walk-in queue can be 30–45 minutes on busy days. An advance booking lets you go directly to the entrance.</li>
  <li><strong>Book a timed entry</strong> — choosing a morning slot guarantees you arrive during the quietest period.</li>
  <li><strong>Visit on a weekday</strong> — weekends are noticeably busier than Monday to Thursday, particularly in peak season.</li>
  <li><strong>Combine with the Saadian Tombs</strong> — if you're visiting both, do the Tombs first (they open at the same time but have shorter queues), then walk 10 minutes to Bahia Palace.</li>
</ul>

<h2>Summary: When to Visit Bahia Palace</h2>
<p>The ideal visit: a weekday morning in October, November, March, or April, arriving at 09:00 with a skip-the-line ticket already booked. If that's not possible, any morning arrival before 10:00 or afternoon arrival after 15:30 is a solid second choice. The worst time is mid-morning on a summer weekend with no advance ticket — but even then, the palace is worth the wait.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Dress Code & What to Wear
  // ─────────────────────────────────────────────────────────────
  {
    title: 'What to Wear at Bahia Palace: Dress Code Guide for Tourists',
    slug: 'what-to-wear-bahia-palace-marrakech-dress-code',
    locale: 'en',
    category: 'tips',
    tags: 'bahia palace dress code,what to wear marrakech,marrakech dress code,visiting bahia palace clothes',
    excerpt: 'What is the dress code at Bahia Palace? What should women and men wear? This guide covers everything you need to know to dress appropriately and comfortably for your visit.',
    seoTitle: 'What to Wear at Bahia Palace: Dress Code Guide 2026',
    seoDesc: 'What to wear at Bahia Palace Marrakech — dress code rules for women and men, what to pack, and how to dress modestly without being uncomfortable in the heat.',
    content: `<h2>Does Bahia Palace Have a Strict Dress Code?</h2>
<p>Bahia Palace is a royal heritage site and cultural monument — not a mosque — so the dress code is less strict than you might expect. However, modest dress is strongly encouraged and widely observed. Visitors who arrive in very short shorts or a strapless top may feel uncomfortable and out of place. Dressing modestly is both respectful and practical.</p>

<h2>The Basic Rule: Cover Shoulders and Knees</h2>
<p>This is the core requirement for both men and women visiting Bahia Palace and other cultural sites in Marrakech's medina. If your shoulders and knees are covered, you are dressed appropriately. Everything else is a matter of comfort and personal taste.</p>

<h2>What Women Should Wear</h2>
<h3>Best Options</h3>
<ul>
  <li><strong>Maxi dress or maxi skirt</strong> — lightweight, breathable, modest, and elegant. A cotton or linen maxi dress is ideal for Marrakech's heat and works perfectly for the palace.</li>
  <li><strong>Wide-leg linen trousers</strong> — comfortable, cool, and appropriate. Pair with a loose linen or cotton top.</li>
  <li><strong>Midi dress or skirt</strong> — falls below the knee, comfortable in summer, and easily layered with a light jacket or scarf in cooler months.</li>
</ul>
<h3>Bring a Scarf or Shawl</h3>
<p>A lightweight scarf is the single most useful item for female visitors to Marrakech. You can use it as a shoulder cover if your top is sleeveless, as a head covering if you want to enter nearby mosques or feel more comfortable in the medina, and as a wrap in the evenings when temperatures drop. A fine cotton or silk scarf packs flat and weighs almost nothing.</p>
<h3>What to Avoid</h3>
<ul>
  <li>Strapless or very low-cut tops</li>
  <li>Very short shorts (above mid-thigh)</li>
  <li>Tight or sheer clothing</li>
</ul>

<h2>What Men Should Wear</h2>
<p>Men have an easier time with the dress code. Trousers or shorts that reach at least to the knee are perfectly acceptable. Lightweight chinos or linen trousers are ideal. T-shirts and collared shirts both work well. Avoid very short shorts — not because anyone will refuse you entry, but because you'll feel out of place in the medina.</p>

<h2>Footwear: Practical Matters</h2>
<p>Bahia Palace has uneven stone and tile floors. Comfortable walking shoes, sandals with a strap, or flat-soled trainers are ideal. High heels are a bad idea — the zellige tiles are beautiful but slippery, and the cobblestones outside are genuinely treacherous.</p>
<p>Note: you do not need to remove your shoes at Bahia Palace (unlike mosques). But clean, well-fitting footwear that you can walk in for an hour is important.</p>

<h2>Seasonal Considerations</h2>
<h3>Summer (June – September): 35–42°C</h3>
<p>Prioritise breathable natural fabrics: linen, cotton, and chambray. Avoid synthetic fabrics — they trap heat and become unpleasant quickly. A wide-brimmed hat is useful for the walk through the medina, and a small water bottle is essential.</p>
<h3>Spring & Autumn (March – May, October – November): 20–28°C</h3>
<p>Ideal weather for Marrakech. A light layer for the evening is useful, but daytime visits to the palace are comfortable in a single layer.</p>
<h3>Winter (December – February): 12–18°C</h3>
<p>Bring a light jacket or cardigan. Mornings can be genuinely chilly. Layering works well — the medina warms up considerably by midday.</p>

<h2>Where to Buy Clothes in Marrakech</h2>
<p>If you arrive underprepared, Marrakech's souks are excellent for modest, lightweight clothing. The Souk Smarine near Jemaa el-Fna sells djellabas, scarves, and kaftans — all appropriate for visiting the palace and all available at very low prices. Haggling is expected.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 6. Bahia Palace vs Saadian Tombs
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace vs Saadian Tombs: Which One Should You Visit?',
    slug: 'bahia-palace-vs-saadian-tombs-which-to-visit',
    locale: 'en',
    category: 'guides',
    tags: 'bahia palace vs saadian tombs,saadian tombs marrakech,marrakech monuments,marrakech tickets',
    excerpt: 'Comparing Bahia Palace and the Saadian Tombs — what each offers, how much they cost, how long they take, and whether you should visit one, both, or neither.',
    seoTitle: 'Bahia Palace vs Saadian Tombs Marrakech 2026: Which to Visit?',
    seoDesc: 'Bahia Palace or Saadian Tombs — which Marrakech monument is worth your time and money? Compare highlights, ticket prices, crowds, and visit duration to decide.',
    content: `<h2>Two of Marrakech's Greatest Monuments — How to Choose</h2>
<p>Bahia Palace and the Saadian Tombs are consistently ranked among the top attractions in Marrakech — and they are located just 10 minutes apart on foot. If you have a full day in the medina, you can comfortably visit both. But if you're pressed for time, which one deserves priority? This guide breaks down both honestly.</p>

<h2>Bahia Palace at a Glance</h2>
<ul>
  <li><strong>Type:</strong> 19th-century royal palace</li>
  <li><strong>Built:</strong> 1866–1900 by Grand Vizier Ba Ahmed</li>
  <li><strong>Size:</strong> 8,000 m² across courtyards, rooms, and gardens</li>
  <li><strong>Ticket price:</strong> 100 MAD (foreign adults) / skip-the-line available online</li>
  <li><strong>Visit duration:</strong> 60–90 minutes</li>
  <li><strong>Best for:</strong> Architecture, photography, gardens, general interest</li>
</ul>

<h2>Saadian Tombs at a Glance</h2>
<ul>
  <li><strong>Type:</strong> 16th-century royal mausoleum</li>
  <li><strong>Built:</strong> Late 16th century under Sultan Ahmad al-Mansur</li>
  <li><strong>Size:</strong> Compact — three rooms and a small garden</li>
  <li><strong>Ticket price:</strong> 70 MAD</li>
  <li><strong>Visit duration:</strong> 30–45 minutes</li>
  <li><strong>Best for:</strong> History, ornate Islamic architecture, carved plasterwork</li>
</ul>

<h2>Architecture: Ornate vs Expansive</h2>
<p>The Saadian Tombs contain some of the most intricate carved plasterwork and zellige tilework in Morocco — concentrated in a small space, which makes it feel intensely detailed. The main chamber (the Hall of Twelve Columns) is genuinely breathtaking. However, the site is small: you will see everything within 30–40 minutes.</p>
<p>Bahia Palace offers the opposite experience: vast, varied, and expansive. The grand courtyard alone covers 1,500 square metres. The palace contains dozens of rooms, multiple gardens, and a different architectural register — painted cedar ceilings rather than carved stucco. You need a full 60–90 minutes to see it properly.</p>

<h2>History: Which Story Is More Interesting?</h2>
<p>Both monuments have compelling histories. The Saadian Tombs are older (16th century) and were sealed by Sultan Moulay Ismail after he destroyed the Saadian dynasty's legacy — they were hidden and forgotten for three centuries until French archaeologists rediscovered them in 1917. That story adds a layer of intrigue that visitors find compelling.</p>
<p>Bahia Palace's story is more personal and arguably more dramatic: a former slave rising to become Grand Vizier, building the finest palace in Morocco, and dying to have it stripped bare by the Sultan within hours. The human element makes it memorable.</p>

<h2>Photography</h2>
<p>Both sites are exceptional for photography. The Saadian Tombs offer intense close-up detail — the carved arches, the geometric tilework, the light falling through small windows onto ancient marble. Bahia Palace offers wide-angle grandeur: sweeping courtyards, reflected light on tiles, and lush garden compositions.</p>
<p>If you're a photographer, the combination is ideal — very different subjects that complement each other well.</p>

<h2>Crowds</h2>
<p>Both sites are busiest between 10:00 and 13:00. The Saadian Tombs are smaller and can feel genuinely claustrophobic when multiple tour groups arrive at once. Bahia Palace is larger and absorbs crowds better, though the grand courtyard can still feel busy. Arriving early at both sites is strongly recommended.</p>

<h2>The Verdict: Visit Both If You Can</h2>
<p>If you have a day in the medina, visiting both monuments in a single morning or afternoon is highly achievable — they are 10 minutes apart on foot and each takes under 90 minutes. A combo ticket is the best value option and removes the need to queue at either site.</p>
<p>If you genuinely only have time for one: choose <strong>Bahia Palace</strong> if you want grandeur, architecture, and a longer, more varied experience. Choose the <strong>Saadian Tombs</strong> if you prefer intimate, intensely detailed spaces with a strong historical narrative.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 7. History of Bahia Palace
  // ─────────────────────────────────────────────────────────────
  {
    title: "Bahia Palace History: The Remarkable Story Behind Marrakech's Finest Palace",
    slug: 'bahia-palace-history-marrakech',
    locale: 'en',
    category: 'history',
    tags: 'bahia palace history,who built bahia palace,ba ahmed,si moussa,marrakech history,19th century morocco',
    excerpt: "The story of Bahia Palace is one of ambition, slavery, power, and collapse. Discover the remarkable history behind Marrakech's most celebrated monument.",
    seoTitle: "Bahia Palace History: Who Built It & Why | Marrakech's Story",
    seoDesc: "Discover the history of Bahia Palace Marrakech — who built it, the story of Ba Ahmed ibn Moussa, the palace's construction, and its dramatic fall from glory.",
    content: `<h2>A Palace Built by a Freed Slave</h2>
<p>The story of Bahia Palace begins not with a king or a sultan, but with a slave. Si Moussa was born into slavery in the mid-19th century, but through exceptional intelligence and political skill, he rose to become the Grand Vizier of Sultan Hassan I of Morocco — effectively the second most powerful man in the country. It was Si Moussa who began construction of the palace in the 1860s, starting with a private residence that would serve as the basis for everything that followed.</p>

<h2>Ba Ahmed ibn Moussa: The Architect of Ambition</h2>
<p>When Si Moussa died, his son <strong>Ba Ahmed ibn Moussa</strong> inherited both his father's wealth and his political position. Ba Ahmed went further than his father in every direction. He became Grand Vizier and de facto regent under the young Sultan Abdelaziz, and he transformed the modest family residence into the grandest private palace Morocco had ever seen.</p>
<p>Between 1894 and 1900, Ba Ahmed completely rebuilt and massively expanded the palace. He brought in 300 craftsmen from Fez — the great artistic capital of Morocco — and directed them to create something worthy of his ambition. The name he chose, <em>Bahia</em>, means "brilliance" or "the beautiful" in Arabic. It was not a modest name.</p>

<h2>Construction: Six Years of Craftsmanship</h2>
<p>The construction of Bahia Palace was an extraordinary undertaking. Ba Ahmed employed the finest craftsmen in Morocco to execute each element of the design:</p>
<ul>
  <li><strong>Zellige tilework:</strong> Geometric mosaic tiles cut and arranged by hand. The grand courtyard alone required thousands of individually cut pieces.</li>
  <li><strong>Carved stucco:</strong> The plasterwork panels and archways were carved by hand using traditional tools, their patterns designed using compasses and straightedges.</li>
  <li><strong>Painted cedar ceilings:</strong> Every ceiling in the palace was painted by hand, panel by panel, with mineral pigments mixed to traditional recipes. The cedar was sourced from the Atlas Mountains.</li>
  <li><strong>Marble floors:</strong> Imported Carrara marble from Italy was used in the most important rooms, alongside local stone.</li>
</ul>
<p>The palace eventually extended to 8,000 square metres, encompassing 150 rooms, multiple courtyards, and extensive gardens planted with orange, lemon, cypress, and jasmine.</p>

<h2>Life Inside the Palace</h2>
<p>Ba Ahmed used the palace as both a residence and a seat of power. He lived there with his four wives and 24 concubines, each with their own apartment within the palace complex. His four wives' quarters were arranged in a deliberate order of precedence — the first wife had the most prestigious rooms closest to the main courtyard.</p>
<p>Foreign dignitaries, merchants, and petitioners came to Bahia Palace to seek the Grand Vizier's favour. Ba Ahmed was reported to be extraordinarily wealthy — his personal fortune included vast land holdings, trade monopolies, and gifts from supplicants. The palace was his most visible expression of that wealth.</p>

<h2>The Fall: Stripped Bare in Hours</h2>
<p>In 1900, Ba Ahmed ibn Moussa died. Within hours of his death, Sultan Abdelaziz — who had long resented the Grand Vizier's power — ordered soldiers to enter Bahia Palace and strip it of its contents. Furniture, carpets, silverware, artworks, and moveable objects of every kind were seized and distributed among the Sultan's court.</p>
<p>What remained were the walls, the floors, the ceilings, and the gardens. The craftsmen's work — the zellige, the carved plasterwork, the painted cedar — could not be moved. And so the architectural shell of Bahia Palace survived, emptied but intact.</p>

<h2>The Palace After Ba Ahmed</h2>
<p>In the early 20th century, under the French Protectorate, Bahia Palace served as the official residence of the Resident-General of Morocco. French military commanders and administrators lived and held court in the same rooms where Ba Ahmed had governed Morocco. Some modifications were made during this period, though the core architecture was largely preserved.</p>
<p>After Moroccan independence in 1956, the palace passed into state ownership and was gradually opened to the public. Today it is managed as a heritage monument by the Moroccan government and attracts hundreds of thousands of visitors each year.</p>

<h2>What Remains Today</h2>
<p>Bahia Palace today is both a monument to extraordinary craftsmanship and a reminder of the instability of power. The rooms where Ba Ahmed held court, received wives, and governed Morocco stand exactly as they were built — but empty of everything that filled them. Restoration work continues on sections of the palace, ensuring that the zellige, plasterwork, and painted ceilings survive for future generations.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 8. Top 10 Things to Do Near Bahia Palace
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Top 10 Things to Do Near Bahia Palace in Marrakech Medina',
    slug: 'top-10-things-to-do-near-bahia-palace-marrakech',
    locale: 'en',
    category: 'guides',
    tags: 'things to do marrakech,near bahia palace,marrakech medina attractions,marrakech top sights',
    excerpt: "Visiting Bahia Palace? Don't stop there. Here are the 10 best things to do in the surrounding medina — all within walking distance of the palace.",
    seoTitle: 'Top 10 Things to Do Near Bahia Palace Marrakech Medina (2026)',
    seoDesc: 'Explore the best attractions near Bahia Palace in Marrakech medina — Saadian Tombs, El Badi Palace, Mellah, souks, riads, restaurants and more.',
    content: `<h2>Make the Most of Your Visit to the Southern Medina</h2>
<p>Bahia Palace sits in the southern quarter of Marrakech's medina, close to the city's other great monuments and some of its finest food, shopping, and hidden corners. Here are the 10 best things to combine with your palace visit — all within 15 minutes on foot.</p>

<h2>1. Saadian Tombs (8-minute walk)</h2>
<p>The royal mausoleum of the Saadian dynasty is one of the finest examples of Islamic architecture in Morocco. Built in the late 16th century and sealed for three centuries, the tombs were only rediscovered in 1917. The main chamber — the Hall of Twelve Columns — is breathtaking. Combine with Bahia Palace for the best combo in Marrakech.</p>

<h2>2. El Badi Palace Ruins (10-minute walk)</h2>
<p>Once the most magnificent palace in the Muslim world, El Badi was systematically demolished by Sultan Moulay Ismail in the 17th century — he used its marble and gold to build his new capital at Meknes. What remains is a vast, atmospheric ruin of earthen walls, sunken gardens, and stork nests. Entry is 70 MAD and rarely crowded.</p>

<h2>3. The Mellah — Marrakech's Jewish Quarter (5-minute walk)</h2>
<p>Directly adjacent to Bahia Palace, the Mellah is the old Jewish quarter of Marrakech, established in the 16th century. It has a distinctly different character from the rest of the medina: taller buildings with iron-railed balconies, a quieter pace, and the old Lazama Synagogue (still active and open to visitors). The covered food market in the Mellah sells the best olives, preserved lemons, and local spices in the city.</p>

<h2>4. Place des Ferblantiers (3-minute walk)</h2>
<p>This small square, surrounded by the workshops of Marrakech's lantern-makers, is one of the medina's most atmospheric corners. Hundreds of pierced-metal lanterns hang from every surface, lit up in the evenings. The quality of the work is excellent and the prices are reasonable — it's a far better place to buy lanterns than the tourist souks.</p>

<h2>5. Jemaa el-Fna Square (15-minute walk)</h2>
<p>The beating heart of Marrakech — an enormous public square that is UNESCO-listed for its Intangible Cultural Heritage. In the morning it's quiet; by afternoon storytellers, acrobats, dentists, and snake charmers appear; at night the food stalls open and it becomes one of the most extraordinary outdoor spectacles in the world.</p>

<h2>6. The Spice Souks (12-minute walk)</h2>
<p>The spice market near Rahba Kedima square is famous for its towers of coloured powders — saffron, ras el hanout, paprika, cumin, and dozens of medicinal herbs. The vendors will typically offer you a guided tour of the ingredients and a hard sell at the end. The quality is generally good; the prices are negotiable.</p>

<h2>7. Souk Cherratine — The Leather Souk (10-minute walk)</h2>
<p>The leather workers' quarter produces bags, belts, shoes, and jackets using traditional techniques. The quality varies enormously — look for thick, even stitching and properly finished edges before buying. Prices start high; patient negotiation usually achieves 40–50% off the opening offer.</p>

<h2>8. Maison de la Photographie (20-minute walk)</h2>
<p>An exceptional museum of historical Moroccan photography, housed in a beautifully restored riad. The collection spans 1870 to 1950 and includes extraordinary images of Marrakech, the Atlas Mountains, and traditional Moroccan life. The rooftop café is one of the best in the medina.</p>

<h2>9. Café des Épices (12-minute walk)</h2>
<p>The best rooftop café in the medina for a post-palace lunch. Located above the spice square, it serves simple Moroccan salads, sandwiches, and tajines at honest prices. The views over the rooftops are excellent and the atmosphere is calm — a good decompression after the bustle of the palace.</p>

<h2>10. Rue Riad Zitoun el Jedid — Gallery Street</h2>
<p>The street leading from Bahia Palace toward Jemaa el-Fna is lined with some of Marrakech's best contemporary art galleries and design shops. The work ranges from traditional Moroccan craft objects to contemporary photography and painting. Several galleries are worth ducking into even if you have no intention of buying.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 9. Marrakech with Kids
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Marrakech With Kids: The Ultimate Family Guide to the Medina (2026)',
    slug: 'marrakech-with-kids-family-guide-medina-2026',
    locale: 'en',
    category: 'guides',
    tags: 'marrakech with kids,family marrakech,marrakech medina kids,bahia palace family,marrakech family guide',
    excerpt: 'Planning a family trip to Marrakech? This guide covers the best things to do with children, how to visit Bahia Palace with kids, where to eat, and how to stay safe.',
    seoTitle: 'Marrakech With Kids: Family Guide to the Medina 2026',
    seoDesc: 'Everything you need for a family trip to Marrakech in 2026 — kid-friendly attractions, Bahia Palace with children, safe food, getting around, and practical tips.',
    content: `<h2>Is Marrakech a Good Destination for Families?</h2>
<p>Yes — with the right preparation. Marrakech is an extraordinary city for children: the visual stimulation of the medina, the magic of the souks, the acrobats of Jemaa el-Fna, and the garden escapes are all genuinely exciting for young travellers. Children are warmly welcomed in Morocco. But the medina is chaotic and the crowds can be overwhelming. This guide helps you navigate it smoothly.</p>

<h2>Visiting Bahia Palace With Children</h2>
<p>Bahia Palace is one of the most child-friendly monuments in Marrakech. Here's why:</p>
<ul>
  <li><strong>Open spaces:</strong> The grand courtyard and gardens give children room to move around — they don't need to stand quietly in a small, fragile space.</li>
  <li><strong>Visual excitement:</strong> The colourful zellige tiles, carved archways, and painted ceilings captivate children who might glaze over in a standard museum.</li>
  <li><strong>Free for children under 12:</strong> Children under 12 enter free, which is a genuine bonus for families.</li>
  <li><strong>Gardens to explore:</strong> The smaller gardens and courtyards toward the back of the palace give older children space to roam while parents look at the architecture.</li>
</ul>
<p><strong>Tip:</strong> Book a skip-the-line ticket online — standing in a queue with young children in the Marrakech heat is nobody's idea of fun. A timed entry gets you straight inside.</p>

<h2>Best Marrakech Attractions for Families</h2>
<h3>Jardin Majorelle</h3>
<p>The cobalt-blue villa and botanical garden is visually arresting for children and adults alike. The cactus garden, lotus pond, and the vibrancy of the blue-against-green make it feel almost otherworldly. The Yves Saint Laurent Museum beside it is interesting for older children. Entry is 150 MAD per adult; children under 12 are often free or reduced — check on arrival.</p>
<h3>Jemaa el-Fna — Best in the Evening</h3>
<p>Take children to Jemaa el-Fna at dusk. The acrobats, drummers, and food stalls opening simultaneously is genuinely spectacular for children. Stay near the edges of the square and keep a close eye on small children — the crowds are intense. The fresh orange juice stalls on the square's edge are a hit with every age group.</p>
<h3>Camel and Horse Rides</h3>
<p>On the Palmeraie road outside the city, operators offer short camel rides that are a highlight for younger children. Agree on the price before mounting. 30-minute rides are typically 100–150 MAD per person.</p>
<h3>The Tanneries</h3>
<p>Children are fascinated by the leather tanneries — the coloured vats of dye visible from rooftop terraces are unlike anything they'll have seen. Note: the smell is very strong. Shops surrounding the tanneries provide free viewing access from their terraces in exchange for a look at the merchandise — no obligation to buy.</p>

<h2>Where to Eat With Kids in Marrakech</h2>
<p>Moroccan food is generally family-friendly: tagines, couscous, flatbreads, and fresh-squeezed juices are familiar and accessible for most children. A few practical tips:</p>
<ul>
  <li><strong>Choose restaurants that are full of locals</strong> — a busy local restaurant has fast turnover, fresh food, and lower prices.</li>
  <li><strong>Rooftop restaurants near Jemaa el-Fna</strong> offer views over the square, which occupies children between courses.</li>
  <li><strong>Avoid raw salads and tap water</strong> — stick to cooked food and bottled water for children to avoid stomach upsets.</li>
  <li><strong>Argan oil bread and honey</strong> is a universally popular Moroccan breakfast that works for children of almost any age.</li>
</ul>

<h2>Getting Around the Medina With Kids</h2>
<p>The medina's streets are narrow, uneven, and busy with motorbikes and handcarts. Pushchairs and buggies are difficult to manoeuvre; a baby carrier or backpack carrier is a far better option for infants. For toddlers who walk independently, keep them close — the lanes can be disorienting and genuinely easy to get separated in.</p>
<p>Petit taxis (small red or beige taxis) can accommodate families of up to 4 and are the easiest way to cover longer distances. Agree on the price before getting in.</p>

<h2>Staying Safe in Marrakech as a Family</h2>
<ul>
  <li>Keep children within arm's reach in the souks and Jemaa el-Fna — pickpocketing targets distracted families.</li>
  <li>Apply sunscreen and ensure children drink plenty of water — heat illness can come quickly in summer.</li>
  <li>Brief older children about common scams (fake guides, henna traps) before you arrive.</li>
  <li>Keep a card with your riad's address (in Arabic as well as French/English) to show taxi drivers if you get lost.</li>
</ul>

<h2>Best Time to Visit Marrakech With Kids</h2>
<p>March–May and October–November are ideal for families — mild temperatures, manageable crowds, and all attractions fully open. Summer is viable but demanding in the heat. Winter is quieter and cooler, which some children prefer.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 10. Scam Prevention / Safety Guide
  // ─────────────────────────────────────────────────────────────
  {
    title: 'How to Avoid Tourist Scams in Marrakech: 2026 Safety Guide',
    slug: 'how-to-avoid-tourist-scams-marrakech-safety-guide-2026',
    locale: 'en',
    category: 'tips',
    tags: 'marrakech scams,marrakech tourist traps,marrakech safety,avoid scams marrakech,bahia palace scams',
    excerpt: 'The most common tourist scams in Marrakech — fake guides near Bahia Palace, henna traps, taxi overcharging, and how to avoid every one of them confidently.',
    seoTitle: 'How to Avoid Tourist Scams in Marrakech 2026 | Safety Guide',
    seoDesc: 'Complete guide to avoiding tourist scams in Marrakech 2026. Learn how to recognise fake guides near Bahia Palace, henna traps, taxi fraud, and more.',
    content: `<h2>The Reality of Scams in Marrakech</h2>
<p>Marrakech is a safe city for tourists. The vast majority of people you encounter — in the medina, the souks, and around the monuments — are genuine, friendly, and honest. But Marrakech's popularity also attracts a small number of persistent scammers who specifically target tourists who are new to the city. Knowing their tactics in advance makes them trivially easy to handle.</p>
<p>The golden rule: <strong>confidence and prior preparation are your best defences</strong>. Scammers rely on confusion, time pressure, and social awkwardness. A visitor who knows the price, has already booked their ticket, and walks with purpose is very rarely targeted.</p>

<h2>Scam 1: Fake Guides Near Bahia Palace</h2>
<p>Men standing outside the entrance to Bahia Palace approach tourists and claim that guiding is mandatory, that the palace is closed, or that they know a "special entrance". These are lies. Bahia Palace is open to independent visitors with no guide required.</p>
<p><strong>If approached:</strong> Say "No thank you" and walk directly to the entrance. The ticket booth is clearly visible from the gate. If you've already booked online, go straight to the skip-the-line entrance and show your QR code.</p>

<h2>Scam 2: The "Lost in the Medina" Setup</h2>
<p>A friendly local offers to help you find your hotel, the souks, or Jemaa el-Fna. They walk with you, chat, and then at your destination ask for a fee — 100–300 MAD is typical. Refusing feels awkward after accepting help.</p>
<p><strong>Prevention:</strong> Download an offline map of the medina before you arrive (Maps.me or Google Maps offline works well). If someone offers to help with directions, politely decline and consult your phone instead.</p>

<h2>Scam 3: Henna Trap</h2>
<p>Women near Jemaa el-Fna grab tourists' hands and begin applying henna without asking. Once done, they demand 200–500 MAD. Saying no feels impossible after the application has started.</p>
<p><strong>Prevention:</strong> Keep your hands in your pockets or close to your body when passing through crowded areas. If someone reaches for your hand, pull back firmly and say "La, shukran" (No, thank you). Do not stop walking.</p>

<h2>Scam 4: Taxi Overcharging</h2>
<p>Unregistered taxis or drivers who "forget" to use the meter charge 5–10 times the fair price. The airport to the medina should cost 70–100 MAD maximum. Short trips within the medina should cost 15–30 MAD.</p>
<p><strong>Prevention:</strong> Always use official Petit Taxis (small, metered, usually red or beige). Either insist the meter is turned on, or agree on the price explicitly before getting in. If the driver says the meter is broken, get out and find another taxi.</p>

<h2>Scam 5: The Carpet Shop Invitation</h2>
<p>A friendly local invites you to their brother's shop for "just to look" — or offers to show you a rooftop view, a traditional craft demonstration, or a cup of mint tea. Once inside, the hard sell begins and leaving without buying is made to feel rude or aggressive.</p>
<p><strong>What to know:</strong> You are under absolutely no obligation to buy anything. If you want to look at carpets, go in with a clear head: anything presented to you will be significantly overpriced initially. The social pressure you feel is deliberate. "Thank you, I'm just looking" is a complete sentence.</p>

<h2>Scam 6: Snake Charmers and Photo Pressure</h2>
<p>Snake charmers or handlers with monkeys place an animal on you without permission, or position one next to you for a photograph. They then demand 150–300 MAD before letting you leave.</p>
<p><strong>Prevention:</strong> Do not approach or make eye contact with snake charmers unless you intend to pay. If you want a photograph, agree on a price before any animal touches you.</p>

<h2>Scam 7: False Restaurant Menus</h2>
<p>A handful of restaurants near the main tourist areas show one menu when you arrive and present a different (much higher) bill when you leave. Less common than other scams but worth knowing.</p>
<p><strong>Prevention:</strong> Always confirm prices from the menu before ordering. Keep the menu until the bill arrives. If the bill doesn't match the menu, point it out calmly — genuine errors are usually corrected immediately.</p>

<h2>A Note on Booking Tickets in Advance</h2>
<p>One of the simplest ways to reduce exposure to scams at Bahia Palace, the Saadian Tombs, and other monuments is to book your tickets online before you arrive. When you walk up with a confirmation QR code on your phone, the window for fake guide approaches closes immediately — you don't need help, you don't need directions, and you don't need to stop and talk to anyone. Book ahead, arrive with purpose, and enjoy the palace.</p>`,
  },
];

async function main() {
  console.log('Seeding 10 blog articles...\n');

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
        published:   false,
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
        published:   false,
      },
    });
    console.log(`✓  ${post.title}`);
  }

  console.log('\nDone — 10 articles created (unpublished). Edit & publish from /admin/blog.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
