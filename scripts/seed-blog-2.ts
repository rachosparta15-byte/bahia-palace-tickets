import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const posts = [

  // ── 1. 2 Days in Marrakech ──────────────────────────────────
  {
    title: '2 Days in Marrakech: The Perfect Weekend Itinerary (2026)',
    slug: '2-days-in-marrakech-perfect-weekend-itinerary-2026',
    locale: 'en',
    category: 'itineraries',
    tags: '2 days marrakech,marrakech weekend,marrakech short trip,weekend marrakech itinerary',
    excerpt: 'Only have two days in Marrakech? This tight but complete itinerary covers Bahia Palace, the souks, Jardin Majorelle, the Saadian Tombs, and the best food — without rushing.',
    seoTitle: '2 Days in Marrakech: Perfect Weekend Itinerary 2026',
    seoDesc: 'Make the most of 2 days in Marrakech with this complete weekend itinerary. Bahia Palace, Saadian Tombs, Jardin Majorelle, souks, food — all covered.',
    content: `<h2>Is Two Days in Marrakech Enough?</h2>
<p>Two days is tight — but with the right plan, you can see Marrakech's greatest highlights without feeling like you're rushing. The key is to book tickets in advance (especially for Bahia Palace and Jardin Majorelle), stay inside the medina, and resist the temptation to wander aimlessly. Here is the itinerary that works.</p>

<h2>Day 1: The Medina's Greatest Monuments</h2>
<h3>Morning: Bahia Palace + Saadian Tombs (09:00 – 12:30)</h3>
<p>Start at <strong>Bahia Palace</strong> when the doors open at 09:00. Book your skip-the-line ticket online before you arrive — you'll walk straight in while other visitors queue. Allow 75–90 minutes to see the grand courtyard, the private apartments, the painted cedar ceilings, and the gardens properly.</p>
<p>At around 10:30, walk 10 minutes to the <strong>Saadian Tombs</strong>. The royal mausoleum opens at 09:00 and is significantly quieter once the first tour groups have moved on. Allow 35–40 minutes. The Hall of Twelve Columns is exceptional — don't rush through it.</p>
<h3>Midday: Lunch in the Mellah (12:30 – 14:00)</h3>
<p>The <strong>Mellah</strong>, Marrakech's old Jewish quarter, is directly beside Bahia Palace. Its covered food market sells fresh olives, preserved lemons, pastilla, and local street food at honest prices. Eat here — it's far better value than the tourist restaurants near Jemaa el-Fna.</p>
<h3>Afternoon: El Badi Palace + Jemaa el-Fna Approach (14:00 – 17:30)</h3>
<p>Walk 10 minutes to the ruins of <strong>El Badi Palace</strong> — the once-magnificent 16th-century palace now reduced to atmospheric earthen walls and nesting storks. Entry is 70 MAD. Rarely crowded. Budget 45 minutes.</p>
<p>From El Badi, work your way through the souks toward Jemaa el-Fna. The route takes you past the spice market at Rahba Kedima, the dyers' souk, and the leather workers' quarter. Don't follow anyone who offers to guide you — just walk and explore.</p>
<h3>Evening: Jemaa el-Fna at Sunset (17:30 – 20:00)</h3>
<p>Arrive at <strong>Jemaa el-Fna</strong> at dusk, when the square is at its most spectacular. The food stalls open, the acrobats perform, and the sound of Gnawa music fills the air. Eat dinner from the stalls — grilled meats, harira soup, and fresh orange juice.</p>

<h2>Day 2: Gardens, Modern Marrakech & the Ben Youssef Madrasa</h2>
<h3>Morning: Jardin Majorelle (09:00 – 11:00)</h3>
<p><strong>Jardin Majorelle</strong> is one of the most photographed places in Morocco — a cobalt-blue villa surrounded by an extraordinary botanical garden. Yves Saint Laurent and Pierre Bergé owned it for decades; the Yves Saint Laurent Museum is adjacent. Entry is 150 MAD. Go early — the garden becomes very crowded from 11:00 onward. Allow 90 minutes minimum.</p>
<h3>Late Morning: Ben Youssef Madrasa (11:30 – 13:00)</h3>
<p>Back in the medina, the <strong>Ben Youssef Madrasa</strong> is one of Morocco's finest examples of Islamic architecture. Founded in the 14th century, it functioned as a Quranic school for six centuries. The carved stucco, zellige tilework, and cedar woodwork are among the most intricate in the country. Entry is 70 MAD and it's rarely as crowded as the main monuments.</p>
<h3>Afternoon: Souks + Coffee (13:30 – 16:30)</h3>
<p>Spend your final afternoon properly exploring the souks. The <strong>Souk Cherratine</strong> (leatherwork), <strong>Souk des Teinturiers</strong> (dyers), and the covered <strong>Kissaria</strong> (textiles) are the most visually interesting. Budget 2–3 hours, bring cash, and expect opening prices to be 2–3 times what you should pay.</p>
<p>Finish with coffee and a view at one of the rooftop cafés overlooking the souks — <strong>Café des Épices</strong> is the best option.</p>

<h2>Two-Day Marrakech Tips</h2>
<ul>
  <li><strong>Book all tickets online in advance</strong> — Bahia Palace, Saadian Tombs, Jardin Majorelle. Queuing eats into your limited time.</li>
  <li><strong>Stay in the medina</strong> — a riad puts you within walking distance of everything on this itinerary.</li>
  <li><strong>Start every day at 09:00</strong> — the best monuments are significantly quieter in the first hour after opening.</li>
  <li><strong>Walk everywhere you can</strong> — Marrakech's medina is compact and best understood on foot.</li>
</ul>`,
  },

  // ── 2. 1 Day in Marrakech / Day Trip ─────────────────────────
  {
    title: 'Marrakech in One Day: The Perfect Day Trip Itinerary (2026)',
    slug: 'marrakech-one-day-itinerary-day-trip-2026',
    locale: 'en',
    category: 'itineraries',
    tags: 'marrakech one day,marrakech day trip,1 day marrakech,marrakech itinerary day',
    excerpt: 'Visiting Marrakech for just one day? This focused itinerary covers the absolute must-sees — Bahia Palace, Jemaa el-Fna, and the souks — without wasting a minute.',
    seoTitle: 'Marrakech in One Day: Perfect Day Trip Itinerary 2026',
    seoDesc: 'Make the most of one day in Marrakech with this focused itinerary. Bahia Palace, Jemaa el-Fna, the souks, and the best food — all in a single day.',
    content: `<h2>One Day in Marrakech: Is It Worth It?</h2>
<p>Absolutely — if you plan it well. Marrakech is compact, its greatest monuments are close together, and a single well-planned day gives you a genuine taste of the city. The non-negotiable rule: book your tickets in advance. A day tripper who queues loses 30–45 minutes at each monument. A day tripper with a skip-the-line ticket sees twice as much.</p>

<h2>The One-Day Marrakech Itinerary</h2>
<h3>08:45 — Arrive and Orient Yourself</h3>
<p>If you're arriving from Casablanca or another Moroccan city, aim to be in the medina by 08:45. If coming from a riad outside the walls, walk in. Get your bearings at Jemaa el-Fna, grab a coffee, and head south.</p>

<h3>09:00 — Bahia Palace (90 minutes)</h3>
<p>Your first stop is <strong>Bahia Palace</strong>, the 19th-century masterpiece of Moroccan craftsmanship. With a pre-booked skip-the-line ticket, you walk straight in at opening time — no queue, no stress. The grand courtyard, painted cedar ceilings, horseshoe archways, and garden are magnificent at this hour, when light is soft and crowds are minimal. Budget 75–90 minutes.</p>

<h3>10:30 — Saadian Tombs (40 minutes)</h3>
<p>A 10-minute walk from Bahia Palace, the <strong>Saadian Tombs</strong> are the sealed royal mausoleum of the Saadian dynasty. The Hall of Twelve Columns, with its Italian marble columns and intricate stucco honeycomb ceiling, is genuinely stunning. 40 minutes is enough to see everything carefully.</p>

<h3>11:15 — Quick Look at El Badi Palace (optional, 30 minutes)</h3>
<p>If your pace allows, the atmospheric ruins of <strong>El Badi Palace</strong> are 5 minutes on foot. The vast empty grounds — once the most magnificent palace in the Muslim world — take only 30 minutes to walk and are rarely crowded. Entry 70 MAD.</p>

<h3>12:00 — Lunch at the Mellah Market</h3>
<p>The covered market in the <strong>Mellah</strong> (old Jewish quarter) is two minutes from Bahia Palace and serves the best-value food in this part of the medina. Pastilla, harira soup, kefta sandwiches, and fresh juice. Budget 50–80 MAD per person.</p>

<h3>13:30 — The Souks (2 hours)</h3>
<p>Walk north from Jemaa el-Fna into the <strong>medina souks</strong>. Don't follow a fixed route — the souks reward wandering. The spice market at Rahba Kedima, the dyers' vats, the leather workshops, and the covered Kissaria textile market are the highlights. Give yourself two hours.</p>

<h3>15:30 — Rooftop Coffee Break</h3>
<p><strong>Café des Épices</strong> on Rahba Kedima square is the best rooftop in this part of the medina. A coffee and a view over the souks for 25–35 MAD. Rest your feet and watch Marrakech move below you.</p>

<h3>16:30 — Jemaa el-Fna in the Afternoon</h3>
<p>The square transforms in the late afternoon. Snake charmers, acrobats, and storytellers appear. The light is golden and the energy builds toward the evening. Even 30–45 minutes here is memorable.</p>

<h3>17:30 — Depart or Stay for Dinner</h3>
<p>If you're day-tripping, head to your departure point. If you have the evening, stay for dinner at the Jemaa el-Fna food stalls — one of the great experiences of any Moroccan trip.</p>

<h2>One-Day Marrakech: Essential Tips</h2>
<ul>
  <li>Book Bahia Palace online — the queue on a busy day is 30–45 minutes you don't have.</li>
  <li>Wear comfortable shoes — you'll walk 8–10 km.</li>
  <li>Carry cash (dirhams) — many souks and market stalls don't accept cards.</li>
  <li>Don't accept offers of "help" with directions — this leads to commission-based shops.</li>
  <li>Download an offline map (Maps.me or Google Maps offline) before you arrive.</li>
</ul>`,
  },

  // ── 3. Marrakech Weather Guide ───────────────────────────────
  {
    title: 'Marrakech Weather by Month: When Is the Best Time to Visit in 2026?',
    slug: 'marrakech-weather-by-month-best-time-to-visit-2026',
    locale: 'en',
    category: 'tips',
    tags: 'marrakech weather,best time visit marrakech,marrakech temperature,when to go marrakech,marrakech climate',
    excerpt: 'Planning a trip to Marrakech? This month-by-month weather guide tells you exactly when to visit, when to avoid the heat, and how the seasons affect Bahia Palace crowds.',
    seoTitle: 'Marrakech Weather by Month 2026: Best Time to Visit Guide',
    seoDesc: 'Complete month-by-month Marrakech weather guide for 2026. Temperatures, rainfall, crowds at Bahia Palace, and the best months to visit explained.',
    content: `<h2>Marrakech's Climate: What to Expect</h2>
<p>Marrakech sits at the foot of the Atlas Mountains, which gives it a semi-arid climate with hot, dry summers and mild winters. The city has warm sun for most of the year, but the difference between January (cool and quiet) and August (baking hot and crowded) is dramatic. Knowing when to go makes a significant difference to your experience — especially at monuments like Bahia Palace, where crowds and temperature interact directly.</p>

<h2>Month-by-Month Breakdown</h2>

<h3>January — Cool, Quiet, Clear</h3>
<p><strong>Temperature:</strong> 7–18°C | <strong>Crowds:</strong> Low | <strong>Rain:</strong> Occasional</p>
<p>January is one of the best months to visit Marrakech if you don't mind cool mornings and evenings. Days are bright and blue-skied, the medina is calm, and Bahia Palace can be nearly empty at opening time. Pack a jacket for the evenings — it can drop to 5–7°C after dark.</p>

<h3>February — Warming Up, Still Quiet</h3>
<p><strong>Temperature:</strong> 9–20°C | <strong>Crowds:</strong> Low-Medium | <strong>Rain:</strong> Occasional</p>
<p>February sees the first hints of spring and is an excellent month to visit. The almond trees in the Atlas Mountains bloom spectacularly. Prices are low, crowds are manageable, and the weather is comfortable for walking. One of the most underrated months.</p>

<h3>March — Spring Begins, Ideal Weather</h3>
<p><strong>Temperature:</strong> 12–23°C | <strong>Crowds:</strong> Medium | <strong>Rain:</strong> Light</p>
<p>March marks the start of peak visiting season. Temperatures are ideal for sightseeing — warm enough for short sleeves by midday, cool enough to be comfortable in the medina. The palace gardens are at their most beautiful. Book accommodation and tickets well in advance.</p>

<h3>April — Peak Spring Season</h3>
<p><strong>Temperature:</strong> 15–27°C | <strong>Crowds:</strong> Medium-High | <strong>Rain:</strong> Very light</p>
<p>April is excellent — arguably the best month of the year for Marrakech. Warm, sunny, with longer days and the medina buzzing with energy. Bahia Palace is crowded between 10:00 and 13:00 but manageable at opening time or late afternoon. Book everything ahead.</p>

<h3>May — Hot But Manageable</h3>
<p><strong>Temperature:</strong> 19–32°C | <strong>Crowds:</strong> Medium | <strong>Rain:</strong> Rare</p>
<p>May brings real heat by midday. The evenings remain pleasant. Visit monuments in the morning (by 09:30) to avoid the worst heat. A good month if you're comfortable in warm weather.</p>

<h3>June — Getting Hot</h3>
<p><strong>Temperature:</strong> 23–38°C | <strong>Crowds:</strong> Medium | <strong>Rain:</strong> Negligible</p>
<p>June is hot — regularly hitting 35°C by afternoon. The medina can feel oppressive. If you visit, stay in air-conditioned accommodation, visit Bahia Palace at 09:00, and plan afternoon siestas. Late evenings are pleasant.</p>

<h3>July & August — Extreme Heat, Peak Crowds</h3>
<p><strong>Temperature:</strong> 28–42°C | <strong>Crowds:</strong> Very High | <strong>Rain:</strong> None</p>
<p>July and August are the most challenging months to visit. Temperatures regularly exceed 40°C. The medina is crowded with European summer holidaymakers. If this is your only option: arrive at Bahia Palace at 09:00, carry water at all times, and avoid outdoor activity between 12:00 and 16:00.</p>

<h3>September — Heat Eases, Still Busy</h3>
<p><strong>Temperature:</strong> 24–37°C | <strong>Crowds:</strong> High | <strong>Rain:</strong> Rare</p>
<p>September remains hot but the peak crowd pressure begins to ease. By late September, temperatures become more manageable. A decent month if March–May isn't possible.</p>

<h3>October — Autumn Sweet Spot</h3>
<p><strong>Temperature:</strong> 18–30°C | <strong>Crowds:</strong> Medium | <strong>Rain:</strong> Light</p>
<p>October is the second-best month of the year. Temperatures are warm but comfortable, crowds are lower than summer, and the light is beautiful for photography. The roses in Bahia Palace's gardens are often still in bloom. Highly recommended.</p>

<h3>November — Quiet and Pleasant</h3>
<p><strong>Temperature:</strong> 13–23°C | <strong>Crowds:</strong> Low-Medium | <strong>Rain:</strong> Occasional</p>
<p>November is excellent for visitors who want the city without the summer crowds. The weather is mild, the souks are calm, and Bahia Palace is peaceful in the mornings. One of the most enjoyable months for independent travellers.</p>

<h3>December — Festive, Cool, Quiet</h3>
<p><strong>Temperature:</strong> 8–18°C | <strong>Crowds:</strong> Low (except Christmas week) | <strong>Rain:</strong> Occasional</p>
<p>December is generally quiet and cool — perfect for those who prefer uncrowded monuments. The exception is the Christmas holiday week (Dec 23–Jan 2), when Marrakech becomes very busy and prices spike. Outside those dates, December is wonderful.</p>

<h2>Summary: The Best and Worst Months</h2>
<ul>
  <li><strong>Best months overall:</strong> March, April, October, November</li>
  <li><strong>Good for budget travellers:</strong> January, February, December (outside Christmas)</li>
  <li><strong>Avoid if possible:</strong> July, August (heat + crowds)</li>
  <li><strong>Best for Bahia Palace photography:</strong> March–April (garden blooms) and October–November (golden light)</li>
</ul>`,
  },

  // ── 4. Marrakech Food Guide ───────────────────────────────────
  {
    title: "Marrakech Food Guide 2026: What to Eat and Where to Find It",
    slug: 'marrakech-food-guide-what-to-eat-2026',
    locale: 'en',
    category: 'guides',
    tags: 'marrakech food,what to eat marrakech,marrakech restaurants,moroccan cuisine,marrakech street food',
    excerpt: 'The essential Marrakech food guide — from tagine and couscous to pastilla and sfenj. What to eat, where to find the best version of it, and what to avoid.',
    seoTitle: 'Marrakech Food Guide 2026: What to Eat, Where to Go',
    seoDesc: 'Complete Marrakech food guide for 2026. Best Moroccan dishes to try, where to eat near Bahia Palace, street food picks, and restaurants worth visiting.',
    content: `<h2>Moroccan Food in Marrakech: An Introduction</h2>
<p>Marrakech has one of the most distinctive food cultures in Africa. Moroccan cuisine is built on slow-cooked stews, fragrant spice blends, preserved ingredients, and communal eating. The city's food ranges from the 10-MAD street snack to elaborate multi-course riads dinners — and both ends of the spectrum are worth experiencing.</p>

<h2>Dishes You Must Try</h2>

<h3>Tagine</h3>
<p>The most iconic Moroccan dish — slow-cooked meat or vegetables in a conical clay pot. The best tagines in Marrakech take 2–3 hours to cook properly. Look for: lamb and prune tagine, chicken with preserved lemon and olives, and kefta (spiced meatball) tagine with egg. Avoid: pre-made tagines sitting on burners in tourist restaurants near Jemaa el-Fna — these are reheated and flavourless.</p>

<h3>Couscous (Friday Tradition)</h3>
<p>Traditional couscous is served on Fridays — the Islamic day of rest — when families gather for the weekly communal meal. Hand-rolled couscous, steamed three times, topped with slow-cooked vegetables and meat. If you're in Marrakech on a Friday, seek out a local restaurant serving the traditional version.</p>

<h3>Pastilla (B'stilla)</h3>
<p>A remarkable combination: flaky warqa pastry filled with spiced pigeon (or chicken) and almonds, dusted with powdered sugar and cinnamon. The contrast of savoury and sweet is uniquely Moroccan and deeply delicious. Available at better restaurants and the Mellah market.</p>

<h3>Harira</h3>
<p>A thick, hearty soup of tomatoes, lentils, chickpeas, lamb, and fresh herbs — traditionally eaten to break the Ramadan fast. Available year-round at local eateries for 10–15 MAD a bowl. One of the great bargain meals in Morocco.</p>

<h3>Mechoui</h3>
<p>Whole lamb slow-roasted in an earthen pit, served with cumin salt and fresh bread. The mechoui stalls in the Mellah market are the most authentic — you buy by weight, eat standing, and watch the butcher carve from the whole animal. 80–120 MAD for a generous portion.</p>

<h3>Sfenj</h3>
<p>Morocco's answer to the doughnut — irregular rings of fried dough dipped in honey or sugar. Sold from street carts in the morning. The best sfenj in Marrakech is found in the Mellah. 2–3 MAD each.</p>

<h3>Msemen and Meloui</h3>
<p>Flatbreads — msemen is square and flaky (like a Moroccan paratha), meloui is round and spiral-layered. Both are eaten for breakfast with argan oil and honey, or used to scoop up tagine. A breakfast plate at a local café costs 20–30 MAD.</p>

<h2>Where to Eat Near Bahia Palace</h2>

<h3>The Mellah Market — Best Value</h3>
<p>The covered market in the Mellah, directly beside Bahia Palace, has the best street food in this part of the medina. Local lunch counters serve harira, mechoui, kefta, and fresh-squeezed orange juice at prices local workers pay. Budget 40–70 MAD for a filling meal.</p>

<h3>Café Clock (15-minute walk)</h3>
<p>A beloved institution for both locals and visitors. Famous for its camel burger (genuinely excellent), traditional music evenings, and cooking classes. Serves Moroccan and international food. A bit of everything, done well. 80–150 MAD per person.</p>

<h3>Jemaa el-Fna Food Stalls (Evening Only)</h3>
<p>From sunset, the square fills with around 100 food stalls. The experience is as much spectacle as meal. Vendors call out in multiple languages, smoke rises from grills, and the noise is extraordinary. Stick to busy stalls (high turnover = fresh food). Grilled meat, snail soup (a Marrakech specialty), and sheep's head are the adventurous options. A full meal costs 60–100 MAD.</p>

<h2>What to Drink</h2>
<ul>
  <li><strong>Atay (Moroccan mint tea):</strong> Sweet, strong, served in a glass from a height for froth. The ritual of tea service is as important as the drink itself. Free in souks (it's a sales technique); 10–20 MAD in cafés.</li>
  <li><strong>Fresh orange juice:</strong> Marrakech's orange juice from the Jemaa el-Fna stalls is among the best in the world. 4–5 MAD a glass.</li>
  <li><strong>Avocado smoothie:</strong> An unlikely staple — blended avocado with milk, honey, and sometimes almonds. Sold at juice stalls throughout the medina. 15–20 MAD.</li>
</ul>

<h2>What to Avoid</h2>
<p>Avoid restaurants that display menus in 5 languages with photos of every dish — these exist exclusively for tourists and the food is mediocre. The best Moroccan food in Marrakech is found in local eateries with handwritten menus, market stalls with queues of local workers, and riads that source their ingredients daily from the market.</p>`,
  },

  // ── 5. Marrakech Airport to Medina ────────────────────────────
  {
    title: 'How to Get from Marrakech Airport to the Medina (2026 Guide)',
    slug: 'marrakech-airport-to-medina-transport-guide-2026',
    locale: 'en',
    category: 'practical',
    tags: 'marrakech airport medina,marrakech airport transfer,how to get marrakech medina,marrakech transport,RAK airport',
    excerpt: 'Landing at Marrakech Menara Airport and not sure how to get to your riad? This guide covers taxis, buses, and private transfers — with prices and tips to avoid being overcharged.',
    seoTitle: 'Marrakech Airport to Medina 2026: All Transport Options & Prices',
    seoDesc: 'How to get from Marrakech Menara Airport to the medina in 2026. Taxi prices, bus options, private transfers, and tips to avoid tourist overcharging.',
    content: `<h2>Marrakech Menara Airport: Your First Challenge</h2>
<p>Marrakech Menara Airport (IATA: RAK) is just 6 km from the city centre — close enough to see in a taxi in 15–20 minutes, far enough that every unscrupulous driver will try to overcharge you. Being prepared with prices in advance makes all the difference.</p>

<h2>Option 1: Petit Taxi (Official Metered Cab)</h2>
<p><strong>Cost: 70–100 MAD | Duration: 15–20 minutes</strong></p>
<p>Petit Taxis are Marrakech's official city taxis — small cars, usually red or beige, with meters. This is the best option for most travellers arriving at the airport.</p>
<p><strong>How to use them correctly:</strong></p>
<ul>
  <li>Exit arrivals and walk past the unofficial drivers who approach you inside the terminal — go to the official taxi rank outside.</li>
  <li>Always insist the meter is turned on. If the driver says it's broken, take the next taxi.</li>
  <li>The official rate to the medina is 70–100 MAD. At night (after 20:00) a 50% surcharge applies — 100–150 MAD is fair.</li>
  <li>Have the address of your riad written in French and Arabic — many drivers don't read Latin script well.</li>
</ul>

<h2>Option 2: Grand Taxi (Shared or Private)</h2>
<p><strong>Cost: 100–200 MAD (private) | Duration: 15–20 minutes</strong></p>
<p>Grand Taxis are larger vehicles — often Mercedes saloons. They can be shared (you wait until 6 passengers fill the car) or hired privately for immediate departure. For the airport, agree a price before getting in. 150 MAD for a private Grand Taxi to the medina is a fair price to negotiate toward.</p>

<h2>Option 3: Bus Line 19</h2>
<p><strong>Cost: 20 MAD | Duration: 30–45 minutes</strong></p>
<p>Bus number 19 connects the airport to Jemaa el-Fna square directly. It runs regularly and is perfectly comfortable. The journey takes longer than a taxi (30–45 minutes depending on traffic) and involves a 10–20-minute walk from the bus stop to many riads in the medina. Best option if you're traveling on a tight budget and have manageable luggage.</p>

<h2>Option 4: Pre-Booked Private Transfer</h2>
<p><strong>Cost: €15–25 | Duration: 15–20 minutes</strong></p>
<p>Many riads and hotels offer airport transfers, and third-party transfer companies can be booked online before you travel. A driver meets you in arrivals with a name sign and takes you directly to your accommodation. The most stress-free option, especially for a first visit or late-night arrival. Worth the slight premium for the peace of mind.</p>

<h2>What to Avoid at Marrakech Airport</h2>
<ul>
  <li><strong>Unofficial drivers inside the terminal:</strong> Men in civilian clothes approaching you in arrivals claiming to be "official taxi" drivers. They are not. Walk past them to the taxi rank outside.</li>
  <li><strong>Agreeing to a price before seeing the taxi:</strong> Always go to the official rank and insist on the meter.</li>
  <li><strong>Offers of a "fixed price" to a specific riad:</strong> These are almost always higher than the metered fare. If someone quotes you 300 MAD for a 15-minute ride, that's 3–4 times the correct price.</li>
</ul>

<h2>Getting from the Medina to the Airport (Return)</h2>
<p>The same rules apply in reverse. Ask your riad to book a taxi for you the evening before your flight — they know reliable drivers and the correct price. Alternatively, walk to a main road and hail a Petit Taxi (make sure the meter is on). Allow 30–40 minutes to the airport from inside the medina, more during morning rush hour.</p>

<h2>Once You've Arrived: Getting to Bahia Palace</h2>
<p>From your riad or hotel, Bahia Palace is an easy 10–20-minute walk from most medina accommodation, or a short 20–30 MAD taxi ride. Book your skip-the-line ticket before you arrive so you can walk straight in — the palace is at its best in the first hour after opening.</p>`,
  },

  // ── 6. Jardin Majorelle vs Bahia Palace ──────────────────────
  {
    title: 'Jardin Majorelle vs Bahia Palace: Which Should You Visit First?',
    slug: 'jardin-majorelle-vs-bahia-palace-marrakech',
    locale: 'en',
    category: 'guides',
    tags: 'jardin majorelle,majorelle garden,jardin majorelle vs bahia palace,marrakech attractions,yves saint laurent marrakech',
    excerpt: 'Two of Marrakech\'s most visited attractions — Jardin Majorelle and Bahia Palace. Different in every way. Here\'s how to choose, and how to see both in one day.',
    seoTitle: 'Jardin Majorelle vs Bahia Palace Marrakech: Which to Visit?',
    seoDesc: 'Jardin Majorelle or Bahia Palace — which Marrakech attraction should you visit? Compare highlights, tickets, timing, and crowds to plan your perfect day.',
    content: `<h2>Two Icons, Completely Different Experiences</h2>
<p>Jardin Majorelle and Bahia Palace are consistently listed among Marrakech's top attractions — and they couldn't be more different. One is a botanical garden, the other a royal palace. One was shaped by a 20th-century French artist, the other by a 19th-century Moroccan Grand Vizier. Understanding the difference helps you plan your time and set the right expectations.</p>

<h2>Jardin Majorelle at a Glance</h2>
<ul>
  <li><strong>Type:</strong> Botanical garden and artist's villa</li>
  <li><strong>Created:</strong> 1923 by French artist Jacques Majorelle; restored by Yves Saint Laurent and Pierre Bergé from 1980</li>
  <li><strong>Size:</strong> 1 hectare</li>
  <li><strong>Ticket price:</strong> 150 MAD (garden) + 50 MAD (YSL Museum, optional)</li>
  <li><strong>Visit duration:</strong> 60–90 minutes</li>
  <li><strong>Location:</strong> Gueliz (modern Marrakech) — 3 km from the medina</li>
  <li><strong>Best for:</strong> Photography, plant lovers, fans of art and design history</li>
</ul>

<h2>Bahia Palace at a Glance</h2>
<ul>
  <li><strong>Type:</strong> 19th-century royal palace and gardens</li>
  <li><strong>Built:</strong> 1866–1900 by Grand Vizier Ba Ahmed ibn Moussa</li>
  <li><strong>Size:</strong> 8,000 m²</li>
  <li><strong>Ticket price:</strong> 100 MAD (foreign adults) / skip-the-line available online</li>
  <li><strong>Visit duration:</strong> 60–90 minutes</li>
  <li><strong>Location:</strong> Southern medina — walking distance from Jemaa el-Fna</li>
  <li><strong>Best for:</strong> Architecture, history, Moroccan craftsmanship, culture</li>
</ul>

<h2>The Cobalt Blue vs The Golden Zellige</h2>
<p><strong>Jardin Majorelle</strong> is an exercise in colour and botanical contrast. The villa's famous cobalt blue — now known internationally as "Majorelle Blue" — is painted against tropical greenery: towering cacti, bamboo groves, lotus ponds, and bougainvillea. Jacques Majorelle spent 40 years designing it. Yves Saint Laurent and Pierre Bergé saved it from developers in 1980 and restored it to its current immaculate state. It's photogenic in a way that few places anywhere match.</p>
<p><strong>Bahia Palace</strong> is the opposite: warm tones of terracotta, saffron gold, and earthy browns, with intricate geometric zellige tile floors and hand-painted cedar ceilings that took master craftsmen years to complete. The scale is the surprise — the grand courtyard is 1,500 square metres of sheer splendour. Where Majorelle is designed for the eye, Bahia is designed for power.</p>

<h2>Crowds: Which Is Busier?</h2>
<p>Both are busy in high season (April–May, October, and July–August). Jardin Majorelle attracts around 1 million visitors per year — more than Bahia Palace. The garden is small (1 hectare) and feels extremely crowded from 11:00 onward. Bahia Palace's 8,000 m² absorbs crowds more comfortably.</p>
<p><strong>Strategy:</strong> Visit Jardin Majorelle at 09:00 when it opens, and Bahia Palace in the afternoon. Or do Bahia first at 09:00 (when it's most peaceful) and Majorelle in the late afternoon.</p>

<h2>Which to Visit First If You Only Have Time for One?</h2>
<p>If you're interested in <strong>Moroccan culture and history</strong> → Bahia Palace is the priority. It tells a story unique to Morocco and cannot be replicated anywhere else.<br/>
If you're primarily interested in <strong>photography and design</strong> → Jardin Majorelle's visual impact is extraordinary and worth prioritising.<br/>
If you have <strong>a full day</strong> → Visit both. They're different enough that neither overshadows the other, and combined they give a genuine sense of Marrakech's range.</p>

<h2>Can You Do Both in One Day?</h2>
<p>Yes, easily. The standard approach:</p>
<ol>
  <li>09:00 — Jardin Majorelle (arrive at opening, before crowds)</li>
  <li>10:45 — Taxi or walk to medina (~25 minutes)</li>
  <li>11:30 — Bahia Palace (skip-the-line ticket, straight in)</li>
  <li>13:00 — Lunch in the Mellah market</li>
  <li>Afternoon — Saadian Tombs + Jemaa el-Fna</li>
</ol>`,
  },

  // ── 7. Bahia Palace Photography Guide ───────────────────────
  {
    title: 'Bahia Palace Photography Guide: The Best Spots and Tips (2026)',
    slug: 'bahia-palace-photography-guide-best-spots-tips',
    locale: 'en',
    category: 'guides',
    tags: 'bahia palace photography,marrakech photography,bahia palace photos,instagram marrakech,moroccan architecture photography',
    excerpt: 'Planning to photograph Bahia Palace? This guide covers the best spots, the best light, camera settings, and the insider tips that separate tourist snapshots from great shots.',
    seoTitle: 'Bahia Palace Photography Guide 2026: Best Spots, Light & Tips',
    seoDesc: 'Complete photography guide for Bahia Palace Marrakech. Best spots, optimal lighting times, composition tips, and advice for phone and camera photographers.',
    content: `<h2>Why Bahia Palace Is a Photographer's Dream</h2>
<p>Bahia Palace offers some of the most photographically rich architecture in Morocco. The combination of intricate zellige tilework, hand-painted cedar ceilings, horseshoe archways, courtyard reflections, and garden light creates conditions that reward patient photographers at almost any time of day. The challenge is managing the crowds — and knowing exactly where to stand.</p>

<h2>The Best Light: When to Arrive</h2>
<h3>09:00 — 10:15: Morning Gold (Best)</h3>
<p>The palace opens at 09:00. In the first 75 minutes, the light in the grand courtyard is soft, directional, and warm. The low sun catches the zellige tiles at an angle that emphasises their texture and colour. Crowds are minimal. This is the single best window for photography — arrive at opening.</p>
<h3>14:00 — 16:00: Afternoon Shade</h3>
<p>The covered corridors and interior rooms are best photographed in the afternoon when direct sunlight is less harsh and the contrast between light and shadow is more controllable. The small riad garden areas, shaded by orange trees, are particularly photogenic at this time.</p>
<h3>Avoid 10:30 — 13:00</h3>
<p>This is the busiest period and the harshest light — high sun overhead, flat illumination, and tourist groups in every frame.</p>

<h2>The Best Spots Inside Bahia Palace</h2>
<h3>1. The Grand Courtyard</h3>
<p>The palace's centrepiece — 1,500 square metres of multi-coloured zellige tiles, flanked by carved stucco arcades and shaded by orange trees. <strong>Best angle:</strong> from the far corners, shooting diagonally across the courtyard to compress the perspective. In morning light, the reflections on the polished tiles are stunning.</p>
<h3>2. The Painted Ceilings</h3>
<p>Every room in Bahia Palace has a different hand-painted cedar ceiling. <strong>Technique:</strong> set your phone or camera to "portrait" or wide mode and shoot straight up. In rooms with windows, use the natural light entering from the side — don't use flash. The colours are most accurate in diffused natural light.</p>
<h3>3. The Horseshoe Archways</h3>
<p>The internal archways between rooms and corridors create natural frames. <strong>Best approach:</strong> position yourself so that a second archway is visible through the first — layered arches add depth that flat shots can't match. Human scale (a person in the frame, even a stranger) gives context to the arch's size.</p>
<h3>4. The Small Riad Gardens</h3>
<p>The garden areas toward the back of the palace — planted with roses, jasmine, banana trees, and citrus — are consistently less crowded than the grand courtyard. <strong>Best for:</strong> detail shots of flowers against tilework, and wide shots of the architecture through foliage.</p>
<h3>5. The Long Corridor</h3>
<p>A corridor connecting sections of the palace creates a natural leading line. <strong>Technique:</strong> position yourself at one end and use the tiles on the floor and the ceiling pattern above as converging lines. Works beautifully with a wide-angle lens or the ultra-wide mode on modern smartphones.</p>

<h2>Camera Settings and Phone Tips</h2>
<ul>
  <li><strong>For interiors:</strong> Use HDR mode on smartphones. On a camera, ISO 400–800 with a wide aperture (f/2.8 or wider). The palace interiors are dim — don't rely on auto settings.</li>
  <li><strong>For the zellige floors:</strong> Shoot from a high angle (directly above, if possible) or at a very low angle to show depth and perspective. The pattern reads best from these extremes.</li>
  <li><strong>For ceilings:</strong> Stabilise your phone/camera against a wall or use a mini tripod. Long exposures work well in darker rooms.</li>
  <li><strong>For crowd-free shots:</strong> Be patient. Even in busy periods, people move — wait 30–60 seconds and a frame will clear. Wide shots require more patience than close-up detail shots.</li>
</ul>

<h2>Practical Tips for Photographers</h2>
<ul>
  <li>Tripods are generally permitted inside Bahia Palace — confirm with staff on arrival.</li>
  <li>Commercial photography requires a permit — tourist photography does not.</li>
  <li>The palace's architecture photographs better in soft light; direct midday sun creates harsh shadows in the carved stucco that are difficult to correct in post-processing.</li>
  <li>Book a morning skip-the-line ticket specifically for the 09:00 slot to maximise your time in the best light.</li>
</ul>`,
  },

  // ── 8. Solo Travel Marrakech ──────────────────────────────────
  {
    title: 'Marrakech Solo Travel Guide 2026: Tips, Safety & Itinerary',
    slug: 'marrakech-solo-travel-guide-tips-safety-2026',
    locale: 'en',
    category: 'guides',
    tags: 'marrakech solo travel,solo trip marrakech,marrakech solo female,marrakech safety solo,travelling alone marrakech',
    excerpt: 'Travelling to Marrakech alone in 2026? This guide covers everything a solo traveller needs — safety, accommodation, how to visit Bahia Palace, and the best solo experiences.',
    seoTitle: 'Marrakech Solo Travel Guide 2026: Safety, Tips & Itinerary',
    seoDesc: 'Complete solo travel guide to Marrakech 2026. Safety tips for solo visitors, best areas to stay, how to visit Bahia Palace alone, and recommended experiences.',
    content: `<h2>Is Marrakech Safe for Solo Travellers?</h2>
<p>Yes — Marrakech is one of the most popular solo travel destinations in Africa, visited by hundreds of thousands of independent travellers every year. The city is generally safe, well-touristed, and has a strong infrastructure for visitors. The main challenges for solo travellers are not safety concerns but social ones: persistent touts, unsolicited "guides," and the social pressure of the souks. These are manageable with preparation.</p>

<h2>Solo Travel Safety: The Honest Assessment</h2>
<h3>For All Solo Travellers</h3>
<p>Petty theft (pickpocketing, bag snatching) occurs in crowded areas — Jemaa el-Fna and the busiest souks. Keep valuables in a front pocket or a zipped bag worn across your body. Don't display expensive cameras, phones, or jewellery conspicuously.</p>
<p>The medina's lanes are genuinely confusing. Download an offline map (Google Maps or Maps.me) before you arrive. Getting lost is inevitable; getting seriously lost is avoidable.</p>
<h3>For Solo Female Travellers</h3>
<p>Solo female travel in Marrakech is common and generally safe. Street harassment (verbal) occurs — particularly in less-touristed parts of the medina — and is best handled by ignoring it completely and keeping walking. Eye contact and responses (even negative ones) are read as engagement. Dressing modestly (shoulders and knees covered) significantly reduces unwanted attention. Travelling between the main tourist areas and your riad after dark is fine; deserted lanes late at night are better avoided.</p>

<h2>Where to Stay as a Solo Traveller</h2>
<p>A riad in the medina is the best accommodation choice for solo visitors — the gated, courtyard-style guesthouses are quiet, secure, and staffed by people who understand the needs of independent travellers. Many riads have rooftop terraces where solo guests naturally meet each other. Booking a riad near Bahia Palace or the Saadian Tombs puts you within walking distance of the medina's greatest monuments.</p>

<h2>Visiting Bahia Palace Solo</h2>
<p>Bahia Palace is an excellent solo experience — you can move at your own pace, spend as long as you want in any room, and photograph freely without coordinating with companions. A few tips:</p>
<ul>
  <li>Book a skip-the-line ticket online — arriving alone at a long queue is a common target for "guide" approaches.</li>
  <li>Consider booking a guided tour — solo travellers who visit with a guide consistently rate the experience more highly than those who visit unaccompanied, because the historical context makes the rooms come alive.</li>
  <li>Visit at 09:00 — the palace is peaceful at opening, which is particularly enjoyable for solo visitors who prefer a contemplative pace.</li>
</ul>

<h2>The Best Solo Experiences in Marrakech</h2>
<h3>Cooking Classes</h3>
<p>Marrakech has excellent cooking schools that cater to solo travellers — you join a small group, visit the Mellah market to source ingredients, and cook a full Moroccan meal. La Maison Arabe and Souk Cuisine are the most consistently recommended. Budget 350–600 MAD per person.</p>
<h3>Hammam</h3>
<p>A traditional Moroccan hammam (steam bath) is one of the great solo travel experiences. Public hammams are single-sex — a budget option used by locals (10–20 MAD). Tourist-oriented hammams are mixed and more expensive but provide English-speaking staff and a guided experience. Allow 1–2 hours and book the full treatment (gommage scrub + massage).</p>
<h3>Day Trip to the Atlas Mountains</h3>
<p>Solo travellers can join group day trips to the Atlas Mountains through any riad or tour operator in Marrakech. The Ourika Valley is the most popular route — waterfalls, Berber villages, and mountain scenery 45 minutes from the city. Cost: 200–400 MAD depending on the tour.</p>

<h2>Solo Travel: Practical Checklist</h2>
<ul>
  <li>Keep a card with your riad's address (in Arabic) to show taxi drivers</li>
  <li>Download offline maps before arriving</li>
  <li>Share your itinerary with someone at home</li>
  <li>Carry small-denomination notes — 20 and 50 MAD bills</li>
  <li>Book Bahia Palace and other major monuments in advance</li>
  <li>Trust your instincts — if a situation feels wrong, leave</li>
</ul>`,
  },

  // ── 9. Marrakech Souks Guide ──────────────────────────────────
  {
    title: "Marrakech Souks Guide 2026: What to Buy and How to Bargain",
    slug: 'marrakech-souks-guide-what-to-buy-how-to-bargain-2026',
    locale: 'en',
    category: 'guides',
    tags: 'marrakech souks,marrakech shopping,marrakech souks guide,what to buy marrakech,bargaining marrakech',
    excerpt: 'The definitive guide to Marrakech\'s souks — what to buy, what to avoid, how to find the best quality, and how to bargain without getting ripped off.',
    seoTitle: 'Marrakech Souks Guide 2026: What to Buy & How to Bargain',
    seoDesc: 'Complete guide to shopping in Marrakech\'s souks. What to buy, where to find quality goods, how to bargain, and the best souks to visit near Bahia Palace.',
    content: `<h2>Marrakech's Souks: An Introduction</h2>
<p>The souks of Marrakech are one of the great shopping experiences in the world — a labyrinthine network of covered markets organised by trade, where leatherworkers, silversmiths, weavers, spice merchants, and lantern-makers have occupied the same lanes for centuries. Shopping here is nothing like a mall. It requires time, patience, a willingness to walk away, and an understanding that the price you're first quoted bears no relation to what you should pay.</p>

<h2>The Best Souks to Visit</h2>
<h3>Souk Cherratine — Leatherwork</h3>
<p>Located northeast of Jemaa el-Fna, this is Marrakech's leather souk. Bags, belts, wallets, shoes, and jackets in genuine leather. Quality varies enormously — examine stitching closely and check that leather is thick and even. The best pieces are expensive by souk standards but significantly cheaper than equivalent quality in Europe.</p>
<h3>Souk Haddadine — Blacksmiths and Metal</h3>
<p>The metalworkers' souk produces Marrakech's famous pierced-metal lanterns, mirrors, trays, and decorative objects. The sound of hammering echoes through the lanes. Buy lanterns here rather than from tourist shops — better quality, better prices, and you can watch the craftsmen at work.</p>
<h3>Souk Sabbaghin — The Dyers</h3>
<p>Skeins of freshly dyed wool hung from drying racks in vivid oranges, blues, reds, and greens — one of the most photographed spots in Marrakech. The dyers' souk is partially visible from a rooftop viewpoint. The silk and wool textiles sold here are among the finest quality in the medina.</p>
<h3>Rahba Kedima — Spices and Herbs</h3>
<p>The spice square sells saffron, ras el hanout, paprika, cumin, and dozens of traditional Moroccan herbs and remedies. Genuine Moroccan saffron (dried, deep red threads, strong aroma) is sold here at a fraction of European prices. Avoid powdered "saffron" — it's almost always adulterated. Smell before buying.</p>
<h3>Souk Smarine — Textiles and Clothing</h3>
<p>The main covered textile souk runs north from Jemaa el-Fna. Djellabas, kaftans, scarves, and babouche slippers line the walls. Excellent for modest clothing if you've arrived underprepared for the palace dress code.</p>

<h2>What to Buy (and What to Avoid)</h2>
<h3>Worth Buying</h3>
<ul>
  <li><strong>Argan oil:</strong> Buy from a women's cooperative (look for the certification). Culinary argan oil is extraordinary; cosmetic argan oil is genuinely useful. 50–100 MAD for 100ml is a fair price.</li>
  <li><strong>Babouche slippers:</strong> The traditional Moroccan slipper, made from goatskin. Get them in natural leather (undyed) — they last longer. 80–150 MAD for a well-made pair.</li>
  <li><strong>Zellige tiles:</strong> Small decorative tiles or coasters. Buy at tile workshops rather than tourist shops — ask to see where they're made.</li>
  <li><strong>Brass lanterns:</strong> Pierced-metal lanterns from Souk Haddadine, not tourist shops. The quality difference is significant.</li>
  <li><strong>Hand-woven textiles:</strong> Flat-woven Berber kilims and cushion covers from the Mellah and textile souks.</li>
</ul>
<h3>Approach With Caution</h3>
<ul>
  <li><strong>Saffron:</strong> Real saffron is expensive everywhere. Very cheap "saffron" is not saffron — it's coloured safflower or marigold.</li>
  <li><strong>Antiques:</strong> Genuinely old pieces rarely reach the souks legally. Most "antiques" are new objects artificially aged. Buy because you like the object, not because you believe it's old.</li>
</ul>

<h2>How to Bargain in Marrakech's Souks</h2>
<p>Bargaining is expected everywhere in the souks. The opening price is typically 2–4 times what the seller will accept. Here is a reliable framework:</p>
<ol>
  <li><strong>Express interest casually</strong> — don't reach for your wallet or show excitement.</li>
  <li><strong>Ask the price</strong> — "Bchhal?" in Darija, or "Combien?" in French.</li>
  <li><strong>Counter at 30–40% of the asking price.</strong> This is not rude — it's expected.</li>
  <li><strong>Meet in the middle slowly.</strong> Each counter-offer should be smaller than the last.</li>
  <li><strong>Be willing to walk away.</strong> "Walking away" closes more sales at a fair price than any other tactic. If the seller lets you leave, the price you offered was too low. If they follow you, you have room to push further.</li>
</ol>
<p><strong>Never begin serious bargaining unless you intend to buy at the right price.</strong> Offering a price and then walking away after the seller accepts is considered genuinely rude — and rightly so.</p>`,
  },

  // ── 10. Marrakech Budget Guide ───────────────────────────────
  {
    title: 'Marrakech on a Budget 2026: How Much Does a Trip Really Cost?',
    slug: 'marrakech-budget-guide-how-much-does-trip-cost-2026',
    locale: 'en',
    category: 'practical',
    tags: 'marrakech budget,marrakech cost,how much marrakech,cheap marrakech,marrakech travel cost 2026',
    excerpt: 'How much does a trip to Marrakech actually cost in 2026? A breakdown of accommodation, transport, food, entrance fees, and how to see Bahia Palace without overspending.',
    seoTitle: 'Marrakech Budget Guide 2026: How Much Does a Trip Cost?',
    seoDesc: 'How much does Marrakech cost in 2026? Budget breakdown for accommodation, food, transport, Bahia Palace tickets, and activities. Plan your trip cost.',
    content: `<h2>Is Marrakech an Expensive Destination?</h2>
<p>Marrakech is one of the most affordable major tourist destinations in the Mediterranean world — but it's easy to overspend if you don't know the local prices. The city operates on a dual pricing system: there are prices for locals, and prices for tourists who don't ask. Knowing what things should cost puts you firmly in control of your budget.</p>
<p>All prices below are in Moroccan Dirhams (MAD). At current rates, 1 EUR ≈ 10–11 MAD and 1 USD ≈ 10 MAD.</p>

<h2>Accommodation: 150–2,000+ MAD per night</h2>
<h3>Budget (150–350 MAD / night)</h3>
<p>Hostel dorms and the cheapest guesthouses in the medina. Basic but perfectly functional — many include a simple breakfast. Look for accommodation with positive recent reviews for cleanliness and security.</p>
<h3>Mid-range Riad (400–900 MAD / night)</h3>
<p>A traditional Moroccan riad with a courtyard, rooftop terrace, and breakfast included. This is the sweet spot for most visitors — you get an authentic experience at a reasonable price. Many of Marrakech's most characterful riads fall in this range.</p>
<h3>Luxury Riad or Hotel (1,000–3,000+ MAD / night)</h3>
<p>Converted palaces, boutique design hotels, and the famous Mamounia (Marrakech's grandest hotel). If you're splurging, the Mamounia's gardens and pool alone justify a drink at the bar even if you're not staying.</p>

<h2>Entrance Fees: The Key Monuments</h2>
<table>
  <tr><th>Monument</th><th>Price</th></tr>
  <tr><td>Bahia Palace (standard)</td><td>100 MAD</td></tr>
  <tr><td>Bahia Palace (skip-the-line, online)</td><td>From 80 MAD</td></tr>
  <tr><td>Saadian Tombs</td><td>70 MAD</td></tr>
  <tr><td>El Badi Palace</td><td>70 MAD</td></tr>
  <tr><td>Jardin Majorelle</td><td>150 MAD</td></tr>
  <tr><td>Ben Youssef Madrasa</td><td>70 MAD</td></tr>
</table>
<p><strong>Total for all major monuments:</strong> approximately 530 MAD (€53) per person — excellent value for the quality of what you're seeing.</p>

<h2>Food: 40–400 MAD per meal</h2>
<h3>Budget Eating (40–80 MAD per person)</h3>
<p>Local eateries, the Mellah market, harira stalls, and street food. A filling lunch of harira, kefta, bread, and fresh juice costs 40–60 MAD at a local counter. This is how Marrakech residents eat and it's genuinely excellent.</p>
<h3>Mid-range Restaurant (100–200 MAD per person)</h3>
<p>A sit-down restaurant with a full tagine, salads, bread, and mint tea. Cafés and mid-range restaurants throughout the medina. This is the right budget for a relaxed dinner.</p>
<h3>Tourist Restaurants near Jemaa el-Fna (150–300 MAD per person)</h3>
<p>The restaurants with rooftop views over Jemaa el-Fna charge premium prices for average food. The view is worth one meal — don't make it your daily choice.</p>

<h2>Transport: 15–150 MAD per journey</h2>
<ul>
  <li><strong>Petit Taxi within the medina:</strong> 15–30 MAD</li>
  <li><strong>Petit Taxi to Jardin Majorelle:</strong> 30–50 MAD</li>
  <li><strong>Airport to medina (taxi):</strong> 70–100 MAD</li>
  <li><strong>Bus Line 19 (airport to Jemaa el-Fna):</strong> 20 MAD</li>
  <li><strong>Caleche (horse-drawn carriage, short tour):</strong> 80–150 MAD negotiated</li>
</ul>

<h2>Sample Daily Budgets</h2>
<h3>Budget Traveller: 500–700 MAD / day (€50–70)</h3>
<p>Hostel dorm (150 MAD) + street food and local restaurants (150 MAD) + 2 monument tickets (140 MAD) + transport (60 MAD) + miscellaneous (100 MAD)</p>
<h3>Mid-range Traveller: 900–1,400 MAD / day (€90–140)</h3>
<p>Mid-range riad (600 MAD including breakfast) + one nice dinner and local lunches (250 MAD) + monuments (200 MAD) + transport (100 MAD)</p>
<h3>Comfort Traveller: 2,000–4,000+ MAD / day</h3>
<p>Luxury riad + restaurant dinners + private guide + all monuments + transfers</p>

<h2>How to See Bahia Palace Without Overspending</h2>
<p>The standard ticket (100 MAD) is genuinely affordable. A skip-the-line ticket costs slightly more but saves 30–45 minutes of queuing — time worth far more than the small price difference. A guided tour adds context that makes the visit significantly richer. Even on a tight budget, Bahia Palace is one of Morocco's best-value experiences.</p>`,
  },
];

async function main() {
  console.log('Seeding 10 new blog articles...\n');
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
        publishedAt: new Date(),
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
        publishedAt: new Date(),
      },
    });
    console.log(`✓  ${post.title}`);
  }
  console.log('\nDone — 10 new articles published.');
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
