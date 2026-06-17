import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter } as any);

const ARTICLES = [
  {
    slug: 'bahia-palace-opening-hours-best-time-to-visit',
    locale: 'en',
    title: 'Bahia Palace Opening Hours 2026 — And the One Time Slot You Should Avoid',
    excerpt: 'Bahia Palace is open every day, but not all hours are equal. Here\'s exactly when to go, when to stay away, and what to do if you hit the midday rush.',
    category: 'practical',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>The Basic Schedule (And Why It Changes)</h2>
<p>Bahia Palace opens at 9:00 AM and closes at 5:00 PM, seven days a week — including Fridays, which surprises a lot of visitors who assume it shuts for prayers. It doesn't. The palace belongs to the Moroccan Ministry of Culture, so it follows a secular government schedule rather than mosque hours.</p>
<p>That said, hours do shift slightly during <strong>Ramadan</strong>. In recent years the palace has been closing around 4:00 PM and sometimes opening a touch later. If you're visiting during the holy month, check on arrival day rather than assuming the standard times apply.</p>

<h2>The One Time Slot You Should Avoid</h2>
<p>Between 10:30 AM and 12:30 PM on any weekday, the Grand Riad courtyard fills up fast. Tour buses from the main Marrakech circuit drop groups here en masse — and those groups tend to stop in the same spots, taking photos of the same carved ceilings for the same amount of time. The flow gets stuck.</p>
<p>This doesn't mean the palace is unpleasant at midday. It means the central courtyard — arguably the most photogenic part — becomes a bottleneck. If you're there for Instagram shots with no one in the frame, this window will frustrate you.</p>

<h2>The Two Windows That Actually Work</h2>
<p><strong>Early morning (9:00–10:15 AM):</strong> This is the cleanest visit you'll get. The light through the carved cedar screens is soft, the staff are setting up and not yet crowded around the entrance, and you can stand in the middle of the Grand Riad without anyone walking into your frame. Book a <a href="/tickets/skip-the-line">skip-the-line ticket</a> and arrive right at opening — you'll have portions of the palace almost to yourself.</p>
<p><strong>Late afternoon (3:30–5:00 PM):</strong> Groups have moved on by now. The golden afternoon light comes in low and warm, which is spectacular on the zellige tile floors. The palace does feel a little more tired by this point — cleaners haven't come through yet — but the atmosphere is quieter and genuinely lovely. Note that you need to be inside before 5:00 PM; staff begin ushering people out from around 4:45.</p>

<h2>What About Weekends?</h2>
<p>Saturdays and Sundays actually see slightly fewer Western tour groups (most organized tours run Monday–Friday). However, the palace gets more Moroccan families on weekends, particularly Saturday afternoons. This gives it a completely different energy — not worse, just different. Less hushed, more lively.</p>

<h2>Practical Notes</h2>
<ul>
  <li>The ticket office opens at 9:00 AM. If you have a pre-booked ticket, use the fast-entry lane — it's on the right side of the main entrance gate.</li>
  <li>There is no café inside the palace. Bring water, especially in summer when the courtyards trap heat.</li>
  <li>The palace closes for national holidays occasionally. This is rare but happens. Check if your visit falls on a major Moroccan public holiday.</li>
  <li>Guided tours can be booked for any time within opening hours — the guide adjusts the route based on crowd flow.</li>
</ul>

<h2>How Long Should You Plan For?</h2>
<p>The palace covers 8,000 square meters across several courtyards and rooms. A self-guided visit at a relaxed pace takes about 45 to 60 minutes. With a <a href="/tickets/guided-tour">guided tour</a>, you'll spend 75–90 minutes and actually understand what you're looking at. Private tours can stretch to two hours if you want the full storytelling experience.</p>
<p>There's nothing worse than rushing through a place this beautiful. If your schedule allows, give it at least an hour.</p>

<h2>One Last Thing</h2>
<p>The entrance ticket price is <strong>100 MAD</strong> (around €9 / $10) for the standard queue. If you book skip-the-line access through this site, you skip the ticket queue entirely and walk straight in. On busy mornings that queue can run 20–30 minutes — so pre-booking pays for itself in time alone.</p>`,
  },
  {
    slug: 'bahia-palace-entrance-fee-2026-tickets-prices',
    locale: 'en',
    title: 'Bahia Palace Entrance Fee 2026: What You Pay, What It Gets You',
    excerpt: 'The official entrance fee, what\'s included, what isn\'t, and how to avoid paying twice for things the ticket doesn\'t cover.',
    category: 'practical',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>The Standard Ticket Price</h2>
<p>The official entrance fee for Bahia Palace is <strong>100 MAD per adult</strong> (foreign visitors) — that's roughly €9, $10, or £8 at current exchange rates. Foreign children 7–13 pay 50 MAD. Children under 7 enter free. There is no separate "student rate" or "resident discount" at the gate for international visitors.</p>
<p>The 100 MAD gets you access to the palace grounds, including the Grand Riad courtyard, the Small Riad, the Apartment of Ba Ahmed, the Reception Hall, and the gardens. That's essentially the full palace — there are no paid "premium zones" inside once you're in.</p>

<h2>What's NOT Included</h2>
<p>This is where people sometimes feel surprised. The entrance fee does not include:</p>
<ul>
  <li><strong>An audio guide</strong> — these are sold separately at the entrance kiosk for around 20–30 MAD. Worth it if you're going without a guide, genuinely not worth it if you can read our <a href="/blog/what-to-see-inside-bahia-palace-room-by-room">room-by-room guide</a> in advance and take it with you.</li>
  <li><strong>A guided tour</strong> — official guides wait outside the entrance and charge 100–200 MAD for a tour. Quality varies significantly. If you want proper storytelling, <a href="/tickets/guided-tour">book a certified guide through us</a> instead — fixed price, no negotiation at the gate.</li>
  <li><strong>Photography permits</strong> — you can photograph freely inside with a smartphone or personal camera. Tripods and professional camera rigs technically require a permit from the Ministry of Culture (rarely enforced, but worth knowing if you're shooting commercially).</li>
</ul>

<h2>Skip-the-Line vs Standard Ticket</h2>
<p>The 100 MAD ticket bought at the gate puts you in the standard queue. On a typical morning between 10:00 AM and 12:00 PM, that queue runs 15–30 minutes. In peak season (April–June, September–October) it can push to 45 minutes on bad days.</p>
<p>A skip-the-line ticket booked in advance costs a bit more but gives you a dedicated fast-entry lane — you present your booking confirmation at the door and walk straight in. For most visitors traveling on a schedule, this is simply the smarter option.</p>

<h2>The Combo Option</h2>
<p>If you're planning to visit both Bahia Palace and the Saadian Tombs (a 10-minute walk away), a <a href="/tickets/combo-saadian-tombs">combo ticket</a> bundles both sites at a reduced combined rate. The Saadian Tombs charge their own entrance fee (50 MAD), so buying separately costs more. The combo makes sense if both sites are on your list — which they probably should be.</p>

<h2>Is It Worth It?</h2>
<p>Blunt answer: yes, easily. The palace is one of the finest examples of late 19th-century Moroccan architecture in existence. The carved cedar ceilings, the hand-painted stucco walls, the zellige tile floors — there's nothing mass-produced about any of it. At 100 MAD, it's genuinely one of the best-value cultural sites in North Africa.</p>
<p>The only scenario where it might disappoint is if you go at peak midday and spend the whole visit fighting through tour groups. Go early, have a <a href="/tickets/skip-the-line">pre-booked ticket</a>, and you'll understand exactly why this palace has captured travelers for over a century.</p>`,
  },
  {
    slug: 'how-to-get-to-bahia-palace-from-jemaa-el-fna',
    locale: 'en',
    title: 'How to Get to Bahia Palace from Jemaa el-Fna (Every Route, Honestly Ranked)',
    excerpt: 'Four ways to get from Jemaa el-Fna to Bahia Palace — walking, taxi, calèche, and guided route. Here\'s which one to actually take.',
    category: 'practical',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>First: How Far Is It Actually?</h2>
<p>Bahia Palace sits in the southern Medina, about 1.4 kilometers from Jemaa el-Fna by the most direct walking route. That translates to roughly 18–22 minutes on foot at a normal pace — less if you know the shortcut through Rue Riad Zitoun el Kedim, more if you get turned around in the souks (which happens to almost everyone at least once).</p>
<p>The good news: you can't get lost badly enough to miss it entirely. The Medina is dense but not infinite, and most residents can point you toward "Bahia" without hesitation.</p>

<h2>Option 1: Walk Through the Souks (Recommended)</h2>
<p>This is the route most worth taking, especially on your first day in Marrakech. Head south from Jemaa el-Fna along <strong>Rue Riad Zitoun el Kedim</strong> — look for the sign pointing toward Bahia. The street passes through textile shops, spice sellers, and small workshops, and it's one of the more authentic corridors in the Medina (compared to the tourist-heavy northern souks).</p>
<p>After about 12 minutes, you'll see directional signs for Bahia Palace posted on the walls. Follow them. The entrance is on the left side of a quiet street, slightly set back behind a large wooden door.</p>
<p><strong>The honest caveat:</strong> the walking route involves several turns and the street names aren't always clearly marked. Download the route on Google Maps before you leave the hotel, or use it live. Morocco's mobile data is cheap and widely available.</p>

<h2>Option 2: Petit Taxi (Fast, Easy, Fair)</h2>
<p>A petit taxi from Jemaa el-Fna to Bahia Palace should cost around <strong>20–30 MAD</strong> on the meter. That's roughly €2. The ride itself is 5–8 minutes. This is the right option if you're tired, carrying bags, or have limited time.</p>
<p>The key rule with Marrakech petit taxis: insist on the meter. Say "compteur s'il vous plaît" when you get in. Taxis trying to negotiate a fixed price upfront are almost always charging more than the meter would. If a driver refuses the meter for a short trip like this, just get out and take the next one.</p>
<p>Petit taxis are the small beige/orange cars. They take up to 3 passengers.</p>

<h2>Option 3: Calèche (Scenic, But Know the Pitfalls)</h2>
<p>A calèche is a horse-drawn carriage — they line up at the northern edge of Jemaa el-Fna near the Koutoubia Mosque. The experience is genuinely lovely: slow, old-world, good for photos. The problem is they can't enter the narrow Medina streets, so they drop you at the edge of the southern Medina and you walk the last 500 meters anyway.</p>
<p>Negotiate the price firmly before getting in — 100–150 MAD for a one-way trip to the Bahia area is reasonable. Some drivers will name a much higher price and wait for you to negotiate down.</p>

<h2>Option 4: Join a Walking Tour</h2>
<p>Several <a href="/tickets/guided-tour">guided tours</a> start from Jemaa el-Fna and walk you through the souks to the palace, narrating the neighborhood along the way. This is ideal if you want context for what you're passing through, not just navigation. The palace entry is included in the tour price.</p>

<h2>The Route Back</h2>
<p>Heading back from Bahia Palace to Jemaa el-Fna, the walk is the same route in reverse — easier in practice because you've done it once. Alternatively, petit taxis pick up near the palace entrance and the same 20–30 MAD meter fare applies. In the late afternoon when you're tired, this is usually worth the few dirhams.</p>

<h2>From Your Hotel?</h2>
<p>If you're staying inside the Medina, ask your riad for the walking route specific to your location — most riads have a hand-drawn map or can describe it clearly. If you're staying in Gueliz (the modern district), take a grand taxi or petit taxi directly to Bahia Palace — the trip runs about 15–20 minutes and costs 40–60 MAD.</p>`,
  },
  {
    slug: 'bahia-palace-vs-badi-palace-which-to-visit',
    locale: 'en',
    title: 'Bahia Palace vs Badi Palace: An Honest Comparison (2026)',
    excerpt: 'Two great palaces, one afternoon. Here\'s how they actually compare — architecture, atmosphere, crowds, and which one to prioritize if you only have time for one.',
    category: 'comparisons',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>The Short Version</h2>
<p>If you only have time for one: visit <strong>Bahia Palace</strong>. If you have half a day and enjoy history, visit both — they're a 10-minute walk apart and tell completely different stories about Moroccan power and architecture.</p>

<h2>What Bahia Palace Actually Is</h2>
<p>Bahia (meaning "brilliance" in Arabic) was built in the late 1800s by Ba Ahmed, the Grand Vizier of Sultan Abd al-Aziz. It's not a royal palace in the Ottoman sense — it was a private residence, and that distinction matters. Everything about it is personal: the intimate scale of the rooms, the lush garden courtyards, the intricate cedar ceilings carved by craftsmen from Fez, the zellige tile floors that took years to complete.</p>
<p>It's a palace built by one man who wanted to demonstrate his wealth and taste. Walking through it, you feel that ambition — and occasionally his ego. The harem quarters alone housed 24 concubines and four wives.</p>

<h2>What Badi Palace Actually Is</h2>
<p>Badi ("the incomparable") is a 16th-century ruin. Once one of the most magnificent palaces in the Islamic world — built by the Saadian sultan Ahmed al-Mansour with marble from Italy and gold from Sudan — it was stripped bare by the later Alaouite sultan Moulay Ismail, who spent decades removing everything valuable and transporting it to his new capital in Meknès. What's left is the shell: massive earthen walls, sunken gardens, deep pools, and a sense of former grandeur that hits you differently than a preserved palace does.</p>
<p>There are storks nesting in the crumbling towers. The space feels archaeological, contemplative, almost melancholy.</p>

<h2>Architecture: Completely Different Experiences</h2>
<p><strong>Bahia:</strong> Intact, restored, richly decorated. You're walking through a living record of Moroccan craftsmanship — stucco carving, painted wood, geometric tilework, carved plaster. Every surface has been considered. It photographs beautifully in close detail.</p>
<p><strong>Badi:</strong> Ruined but monumental. The scale is enormous — the central pool alone stretches 90 meters. The atmosphere is what you're coming for, not decorative detail. It photographs dramatically in wide angle.</p>

<h2>Crowds</h2>
<p>Bahia gets significantly more visitors and is better known internationally. Tour groups pass through on a fixed circuit. Badi is quieter — not empty, but rarely packed. If solitude matters to you, Badi wins.</p>

<h2>Entrance Fees</h2>
<p>Bahia Palace: 100 MAD. Badi Palace: 70 MAD. You can visit both for 170 MAD total, which is around €15 — genuinely excellent value for a half-day of world-class history.</p>
<p>There's also a <a href="/tickets/combo-saadian-tombs">Bahia + Saadian Tombs combo</a> available through this site — the Saadian Tombs are actually closer to Bahia than Badi is, so that's another option if you're prioritizing burial monuments.</p>

<h2>Which One First?</h2>
<p>Go to Bahia first (ideally early morning, before the tour groups peak). Then walk to Badi in the late morning or early afternoon — you'll appreciate the contrast between opulent preservation and ruined grandeur. The walk between them passes through the Mellah (the old Jewish quarter), which is worth a few minutes of slow exploration in itself.</p>

<h2>The Verdict</h2>
<p>They're not competitors — they're a pair. Bahia shows you what Moroccan court life looked like at its richest. Badi shows you what happens to power when it passes. Together they make one of the best half-days in Marrakech.</p>`,
  },
  {
    slug: 'bahia-palace-vs-saadian-tombs-which-to-visit',
    locale: 'en',
    title: 'Bahia Palace vs Saadian Tombs: Which One Should You Visit?',
    excerpt: 'Both are within walking distance, both are stunning — but they offer completely different experiences. Here\'s how to decide which to prioritize.',
    category: 'comparisons',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>Two Sites, One Neighborhood</h2>
<p>Bahia Palace and the Saadian Tombs sit about 700 meters apart in the southern Medina — close enough to visit both in a single morning. But they shouldn't be treated as interchangeable stops on a checklist. They're different in character, scale, and what they demand from you as a visitor.</p>

<h2>Bahia Palace: Architecture and Atmosphere</h2>
<p>Bahia is a 19th-century residential palace. The experience is walking through rooms — courtyards, reception halls, private quarters — and absorbing the accumulated detail of Moroccan craftsmanship. Cedar ceilings with geometric muqarnas. Hand-laid zellige tile floors. Carved plaster walls. A garden courtyard with orange trees and the sound of birds.</p>
<p>It takes 45–90 minutes to explore properly. The emotional register is one of quiet luxury — you're inside someone's extraordinary home.</p>

<h2>Saadian Tombs: History and Introspection</h2>
<p>The Saadian Tombs are a 16th-century royal necropolis — a mausoleum containing the remains of Saadian dynasty sultans, their families, and courtiers. There are roughly 66 bodies in the main chamber and around 100 more in the garden. The interior of the main chamber is exquisitely decorated with Italian marble columns and intricate stucco carved with Quranic verses.</p>
<p>The space is small. The site covers less than the footprint of a tennis court. Visits tend to be 20–30 minutes — you look, you absorb, you leave. It's not a wandering experience like Bahia. It's an encounter with something specific and quietly sacred.</p>

<h2>For First-Time Visitors: The Recommendation</h2>
<p>If this is your first time in Marrakech and you have limited time: <strong>Bahia Palace first</strong>. It's larger, more varied, and gives you a richer visual experience of Moroccan interior design. The Saadian Tombs are essential — but shorter and more focused, so they work better as a second stop.</p>
<p>If you're specifically interested in Islamic art, funerary architecture, or Moroccan dynastic history, the Tombs may actually be the more meaningful stop for you personally. They're less Instagram-famous but deeply affecting.</p>

<h2>Crowds: The Real Difference</h2>
<p>Bahia is more crowded throughout the day. The Saadian Tombs are also popular but the smaller space means flow moves faster — groups don't linger as long. Both have queues in peak morning hours; both are calmer in late afternoon.</p>

<h2>Combo Ticket</h2>
<p>We offer a <a href="/tickets/combo-saadian-tombs">Bahia Palace + Saadian Tombs combo ticket</a> that bundles both sites at a discount. If you're planning to visit both — which we genuinely recommend — booking the combo is the obvious move. You get skip-the-line access to both and pay less than buying separately at the gate.</p>

<h2>The Honest Comparison</h2>
<table>
  <thead><tr><th>Feature</th><th>Bahia Palace</th><th>Saadian Tombs</th></tr></thead>
  <tbody>
    <tr><td>Time needed</td><td>45–90 min</td><td>20–30 min</td></tr>
    <tr><td>Era</td><td>19th century</td><td>16th century</td></tr>
    <tr><td>Style</td><td>Residential palace</td><td>Royal mausoleum</td></tr>
    <tr><td>Crowds</td><td>Moderate–heavy</td><td>Moderate</td></tr>
    <tr><td>Photography</td><td>Excellent</td><td>Good (small space)</td></tr>
    <tr><td>Entrance fee</td><td>100 MAD</td><td>50 MAD</td></tr>
  </tbody>
</table>
<p>Both sites together cost less than €12 and deliver some of the finest historic architecture on the African continent. There's no wrong choice — but there is a smarter order: Bahia first, Tombs second, lunch in the Mellah after.</p>`,
  },
  {
    slug: 'top-5-palaces-to-visit-in-marrakech-ranked',
    locale: 'en',
    title: 'Top 5 Palaces to Visit in Marrakech (Ranked Honestly)',
    excerpt: 'Marrakech has several historic palaces, but not all are worth your limited time. Here\'s an honest ranking based on what each site actually delivers.',
    category: 'comparisons',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>Why Marrakech Has So Many Palaces</h2>
<p>Marrakech served as an imperial capital multiple times across different dynasties. Each ruling family built to demonstrate power, taste, and permanence. The result: a city dotted with palaces, some intact, some ruined, some converted to museums. Here's an honest ranking of the five worth visiting.</p>

<h2>#1 — Bahia Palace</h2>
<p><strong>Best for: everyone, especially first-time visitors</strong></p>
<p>Bahia Palace is the benchmark. Built in the late 1800s by Grand Vizier Ba Ahmed, it covers 8,000 square meters of crafted interior space — carved cedar ceilings, zellige tile floors, painted stucco walls, garden courtyards. It's the most intact large-scale example of Moroccan residential architecture in the city and arguably in the country.</p>
<p>It gets the most visitors for good reason. The quality of the craftsmanship is consistently stunning room after room. Pre-book a <a href="/tickets/skip-the-line">skip-the-line ticket</a> and arrive early to get it at its best.</p>
<p>Entrance: 100 MAD | Time: 60–90 min</p>

<h2>#2 — Dar Si Said Museum</h2>
<p><strong>Best for: those interested in Moroccan decorative arts</strong></p>
<p>Built around the same era as Bahia by Ba Ahmed's brother, Dar Si Said now houses the National Museum of Weaving and Carpets. It's smaller and quieter than Bahia but the interior decoration is of comparable quality — some argue the carved ceilings here are even finer. The carpet and textile collection is genuinely exceptional.</p>
<p>Entrance: 20 MAD | Time: 30–45 min</p>

<h2>#3 — Badi Palace (Ruins)</h2>
<p><strong>Best for: history lovers and atmosphere seekers</strong></p>
<p>Once the most spectacular palace in the Islamic world — stripped to a shell by a later sultan. What remains is monumental: vast earthen walls, deep pools, stork nests in the towers. It's not what it was, but what it was is still legible in the ruins. Bring your imagination and give it time.</p>
<p>Entrance: 70 MAD | Time: 45–60 min</p>

<h2>#4 — Marrakech Museum (Dar Menebhi Palace)</h2>
<p><strong>Best for: those already in the northern Medina</strong></p>
<p>This 19th-century palace houses the Marrakech Museum of art and history. The building itself — another example of late-Saadian architecture — is at least as interesting as the collection inside. The large central courtyard is spectacular. It's often skipped by visitors focused on Bahia and the southern Medina, which makes it pleasantly uncrowded.</p>
<p>Entrance: 40 MAD | Time: 30–45 min</p>

<h2>#5 — Royal Palace (Dar el-Makhzen)</h2>
<p><strong>Listed for completeness — but it's closed to the public</strong></p>
<p>The Royal Palace is the official Marrakech residence of the King of Morocco. It covers a vast area in the southern Medina. You can walk past the famous golden gates and photograph the exterior, but the interior is not open to visitors. It's worth a passing glance but shouldn't be on your planning list as an attraction you can "visit."</p>

<h2>The Practical Answer</h2>
<p>For one morning: Bahia Palace. For one full day: Bahia + Dar Si Said + Badi (all within walking distance of each other). Add the Marrakech Museum if you're in the northern Medina visiting the Ben Youssef Medersa.</p>
<p>The combo tickets available through this site let you bundle Bahia with the Saadian Tombs — the Tombs aren't a palace but they're directly on this southern Medina route and among the most beautiful funerary architecture in Morocco.</p>`,
  },
  {
    slug: 'who-built-bahia-palace-history-ba-ahmed',
    locale: 'en',
    title: 'Who Built Bahia Palace? The Real Story Behind Ba Ahmed and His Obsession',
    excerpt: 'Bahia Palace wasn\'t built by a king. It was built by a slave who became the most powerful man in Morocco — and who spent decades trying to prove it.',
    category: 'history',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>The Man Behind the Palace</h2>
<p>Most visitors walk through Bahia Palace knowing roughly nothing about the man who built it. Which is a shame, because his story is one of the stranger and more compelling tales in 19th-century North African history.</p>
<p>Ba Ahmed — full name Ahmad ibn Moussa, nicknamed "Ba Ahmed" by those around him — was born into slavery in the mid-19th century. He rose through the Makhzen (the Moroccan royal court) through a combination of political intelligence and extraordinary loyalty to Sultan Hassan I. By the time of his death in 1900, he had been Regent of Morocco and the effective ruler of the country for seven years.</p>

<h2>How a Slave Became Grand Vizier</h2>
<p>Ba Ahmed began his career as a palace chamberlain under Hassan I, managing the logistics of the royal household and becoming indispensable to the Sultan's daily operations. His organizational skills were exceptional. More importantly, he understood power — how it moved, who held it, how to accumulate it without appearing to.</p>
<p>When Hassan I died suddenly on campaign in 1894, Ba Ahmed made his most decisive move. He concealed the Sultan's death for days, keeping the royal procession moving south toward Marrakech while he secured his own position. By the time the death was announced, Ba Ahmed had already arranged for the young Sultan Abd al-Aziz (14 years old) to be proclaimed Sultan — with Ba Ahmed himself as Grand Vizier and, effectively, regent.</p>
<p>For seven years until his own death, Ba Ahmed was Morocco.</p>

<h2>The Palace as Power Statement</h2>
<p>Bahia Palace — the name means "brilliance" or "the beautiful" in Arabic — was built in two major phases. The first section was constructed by Ba Ahmed's father, Si Moussa, who was also Grand Vizier under an earlier sultan. Ba Ahmed inherited the property and then expanded it dramatically, essentially rebuilding and extending it throughout the 1890s.</p>
<p>The construction was an explicit statement of status. Ba Ahmed hired the finest craftsmen from Fez (then the center of Moroccan artistic production) and spent what were enormous sums on carved cedar ceilings, hand-cut zellige tile floors, and stucco carving. The harem alone housed 24 concubines and four official wives — itself a display of wealth and power.</p>
<p>He was building the thing that Morocco's kings had and he did not: a permanent monument to his own existence.</p>

<h2>The Harem Quarters</h2>
<p>The harem complex within Bahia is one of the more intimate and humanizing parts of the palace. Unlike the grand reception halls (designed for public display), the harem rooms are personal in scale — private gardens, small sleeping quarters, shaded corridors. The women who lived here were not free, but within the harem they had their own social hierarchy, their own economy, their own politics.</p>
<p>Ba Ahmed's four official wives each had a designated suite. The 24 concubines shared communal space. The children — Ba Ahmed had many — grew up in this enclosed world.</p>

<h2>After Ba Ahmed</h2>
<p>When Ba Ahmed died in 1900, the palace was looted within hours. The young Sultan Abd al-Aziz — now free of his regent — reportedly stood by as court officials stripped the rooms of their furnishings, jewelry, and valuables. The humiliation was posthumous and deliberate.</p>
<p>The palace later passed to the French Protectorate administration (Morocco was colonized in 1912) and served as a residence for the Resident-General. After Moroccan independence in 1956, it came under state ownership and eventually opened to the public.</p>

<h2>What This Means When You Visit</h2>
<p>Walking through Bahia knowing this history changes the experience. The grand courtyard isn't just beautiful — it's the physical embodiment of one man's ambition, built against the grain of his birth. The ornate ceilings aren't just craftsmanship — they're proof of something Ba Ahmed felt he needed to prove.</p>
<p>It's a palace built on a kind of anxious magnificence. And that makes it interesting in a way that purely dynastic palaces often aren't.</p>`,
  },
  {
    slug: 'what-to-see-inside-bahia-palace-room-by-room',
    locale: 'en',
    title: 'What to See Inside Bahia Palace: A Room-by-Room Guide',
    excerpt: 'The palace covers 8,000 square meters across multiple courtyards and rooms. Here\'s what\'s actually worth your attention — and what most visitors walk past without realizing what they\'re looking at.',
    category: 'visit-tips',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>Before You Walk In</h2>
<p>Bahia Palace doesn't announce itself. The entrance is a plain doorway on a quiet street — no grand façade, no dramatic gate. This is intentional in traditional Moroccan architecture: the outside is modest, deliberately so, because all the beauty is interior and private. Walking through that door is the beginning of the experience.</p>

<h2>The Small Riad (Petit Riad)</h2>
<p>The first courtyard you enter is the Small Riad, built by Si Moussa (Ba Ahmed's father) in the 1860s. It's smaller and simpler than what comes next, which makes it a useful calibration. Notice the central fountain, the orange trees, and the carved stucco around the doorways. The zellige tilework on the lower walls follows geometric patterns derived from Islamic mathematics — no human figures, just infinite interlocking angles.</p>
<p>Most visitors pass through this courtyard quickly, heading for the Grand Riad. Don't rush it. Look up at the painted wooden ceiling above the surrounding gallery. The color has faded but the geometry is still extraordinary.</p>

<h2>The Great Courtyard (Grand Riad)</h2>
<p>This is what most people come for, and it earns it. The Grand Riad was the ceremonial heart of Ba Ahmed's palace — a large open courtyard surrounded by a gallery on four sides, with a garden of orange and olive trees in the center. The carved cedar gallery ceiling is the finest thing in the building: panels of geometric arabesque carving that interlock without a single repeated motif across the visible surface.</p>
<p>In morning light, the contrast between the deep shadow of the gallery and the bright courtyard creates a dramatic visual effect. In afternoon light, the warm stone picks up gold tones that look different again. Photographers: the gallery corners give the best angles.</p>

<h2>Ba Ahmed's Apartment</h2>
<p>The private apartments of Ba Ahmed himself occupy the section to the south of the Grand Riad. These rooms are more intimate than the ceremonial spaces — lower ceilings, more personal scale, rooms that feel like they were actually lived in rather than performed in. The painted wood paneling here still retains much of its original color.</p>
<p>One room has a small raised platform — a takht, a kind of throne-couch where Ba Ahmed would receive personal visitors. It's easy to miss if you're not looking for it.</p>

<h2>The Harem</h2>
<p>The harem complex is a separate wing, reached through a corridor from the main riad. It's easy to underestimate — architecturally it's simpler than the grand spaces, with more emphasis on privacy than display. But the scale tells you something: there are multiple courtyards, multiple room clusters, a full living environment for the women and children who lived here permanently.</p>
<p>The central courtyard of the harem has a particularly lovely fountain and some of the most detailed zellige tile work in the palace.</p>

<h2>The Reception Hall (Grande Salle)</h2>
<p>The grande salle de réception is where Ba Ahmed held formal audiences. It's the most overtly ceremonial space in the palace — high ceilings, large scale, built for visibility and impression. The carved plaster ceiling here differs from the cedar carving in the Grand Riad: this is stucco, worked into muqarnas (stalactite formations) above the doorways and windows.</p>

<h2>The Gardens</h2>
<p>The palace gardens are often overlooked in favor of the interior rooms. Don't make that mistake. The gardens are planted with orange trees, jasmine, and various herbs — they were originally productive as well as ornamental. In the late afternoon, the smell of jasmine (if it's blooming) is remarkable. The gardens also provide the only views of the exterior walls from inside, which gives you a sense of the palace's scale that the interior rooms don't.</p>

<h2>What Most Visitors Miss</h2>
<p>The zellige patterns on the lower walls. People look up at the ceilings (justifiably) but the tile floors and lower panels deserve the same attention. Look for the transition points between different geometric systems — some craftsmen from Fez, some from Marrakech, slightly different vocabularies of pattern fitting together. It's subtle but visible once you notice it.</p>
<p>Also: the small subsidiary rooms off the main corridors. Doors that look closed often aren't — they lead to quieter corners of the palace that the main tour flow never visits.</p>`,
  },
  {
    slug: 'visiting-bahia-palace-in-ramadan-2026',
    locale: 'en',
    title: 'Visiting Bahia Palace During Ramadan 2026: What Actually Changes',
    excerpt: 'Ramadan 2026 falls in March. If your Marrakech trip overlaps with it, here\'s what changes at Bahia Palace and what doesn\'t — and why it might actually be a better time to visit.',
    category: 'practical',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>The Basics First</h2>
<p>Bahia Palace stays open during Ramadan. It's a state-managed tourist site, not a mosque, and it continues to welcome visitors throughout the holy month. The experience does change, though — in ways that are sometimes better and sometimes just different from a non-Ramadan visit.</p>
<p>Ramadan 2026 is expected to begin around late February or early March (the exact date follows the lunar calendar and is confirmed when the moon is sighted). If you're planning a March trip, there's a real chance your visit overlaps with Ramadan.</p>

<h2>What Actually Changes</h2>
<p><strong>Hours:</strong> The palace typically adjusts its closing time during Ramadan, often shutting around 4:00–4:30 PM rather than the usual 5:00 PM. This is to allow staff to prepare for iftar (the breaking of the fast at sunset). The opening time may also shift slightly later. These changes aren't posted far in advance — check on the day or ask your accommodation.</p>
<p><strong>Staff energy:</strong> The staff at the palace are fasting. They're working a full day without food or water. This deserves acknowledgment. They remain professional and helpful, but some of the usual energy of peak tourist season is replaced by something quieter. It's not a negative, but it's different.</p>
<p><strong>Food options nearby:</strong> The cafés and small restaurants around the palace have reduced hours during the day (many serve only coffee, some close entirely until iftar). Don't plan to find lunch in the immediate neighborhood — eat before you go or plan to eat back near Jemaa el-Fna, which has more international options staying open during daylight.</p>

<h2>What Doesn't Change</h2>
<p>The palace itself is the same palace. The cedar ceilings, the zellige floors, the harem courtyard, the gardens — none of it is affected by the time of year. If anything, the lighting in March (when Ramadan 2026 falls) is exceptional: cool mornings, clear light, and none of the summer heat that makes afternoon visits in July nearly unbearable.</p>

<h2>Why Ramadan Might Actually Be the Better Time</h2>
<p>This is counterintuitive but genuine: Ramadan significantly reduces international tour group traffic. Fewer organized tour buses come to Marrakech during Ramadan, particularly from European markets. The palace is quieter. The lines are shorter. The courtyards are less chaotic.</p>
<p>The city itself has a different atmosphere during Ramadan — slower by day, extraordinarily alive at night. If you're staying for more than two days, this is worth experiencing. The medina after iftar is one of the great urban experiences in North Africa: streets full of families, food everywhere, a generosity of spirit that's genuinely affecting.</p>

<h2>Practical Tips</h2>
<ul>
  <li>Don't eat or drink in public spaces in the Medina during daylight hours. It's not illegal but it's considered disrespectful.</li>
  <li>Inside the palace you can drink water discreetly — it's a tourist site and this is accepted. Loud snacking is not appropriate.</li>
  <li>Dress conservatively: shoulders and knees covered. This applies year-round but is especially important during Ramadan.</li>
  <li>Pre-book your ticket. The ticket office has slightly reduced operating hours during Ramadan, and you don't want to arrive to find it closed or understaffed. Online booking guarantees your entry time.</li>
  <li>If you want to experience iftar — breaking the fast at sunset — the area around Jemaa el-Fna is extraordinary. Plan to be there around sunset and you'll witness something memorable.</li>
</ul>

<h2>The Bottom Line</h2>
<p>A Ramadan visit to Bahia Palace is completely viable. It requires a little more planning around food and timing, but the quieter crowds and the unique city atmosphere make it a genuinely interesting time to be in Marrakech. Go with an open mindset and you'll likely find it one of the more memorable travel experiences you have.</p>`,
  },
  {
    slug: 'bahia-palace-in-1-hour-quick-visit-guide',
    locale: 'en',
    title: 'Bahia Palace in 1 Hour: How to See the Best of It Without Rushing',
    excerpt: 'Only have an hour? Here\'s the exact route to take, what to prioritize, and what to skip — so you leave feeling like you actually saw the palace.',
    category: 'visit-tips',
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date(),
    content: `<h2>Is One Hour Enough?</h2>
<p>Honest answer: an hour is tight but workable if you're focused. The palace covers 8,000 square meters across multiple courtyards and rooms — a leisurely visit takes 90 minutes. But if your schedule genuinely allows only an hour, you can see the essential parts without feeling like you shortchanged yourself. The key is knowing what to prioritize and having the discipline to move past the rest.</p>

<h2>The One-Hour Route</h2>

<h3>Minutes 0–5: Entry and First Courtyard</h3>
<p>Walk through the entrance and into the <strong>Small Riad</strong> (Petit Riad). Don't linger — glance at the fountain, note the carved gallery ceiling above you, and keep moving. You'll wish you'd spent more time here later, but the Grand Riad is where you need to be while your energy is fresh.</p>

<h3>Minutes 5–25: The Grand Riad</h3>
<p>This is the main event. The Grand Riad is the large central courtyard with the carved cedar gallery running around its perimeter. Spend 20 minutes here properly. Walk the full perimeter of the gallery and look up at the ceiling from different angles — the carving looks different from every position. Find a corner where you can stand without other visitors in your frame and just look at it for a moment.</p>
<p>The garden in the center of the courtyard has orange trees. If you're there in blossom season (March–April), the smell is absurd.</p>

<h3>Minutes 25–40: Ba Ahmed's Apartment and Reception Hall</h3>
<p>Move through to the private apartments. These rooms are smaller and more personal — you're seeing where the man actually lived, not just where he performed power. The painted wood paneling retains its color better than most other surfaces in the palace. The grande salle de réception (the formal audience hall) is at the end of this section — high ceilings, carved stucco above the doors.</p>

<h3>Minutes 40–55: The Harem</h3>
<p>The harem complex is a separate wing. People who don't know the layout often miss it — it's accessed through a corridor that feels like it leads to a dead end. Follow the corridor. The harem courtyard has some of the best zellige tilework in the palace. It's also usually quieter than the Grand Riad, which makes it easier to actually absorb.</p>

<h3>Minutes 55–60: The Gardens</h3>
<p>On your way out, pass through the garden section rather than retracing your steps. The gardens are planted with orange trees, jasmine, and herbs. They also give you the best views of the exterior walls — the only point where you can appreciate the actual scale of the building.</p>

<h2>What to Skip If You're Tight on Time</h2>
<p>The secondary corridors between the main spaces can be beautiful but are not essential. If you're behind schedule, walk purposefully from courtyard to courtyard rather than exploring every side passage.</p>

<h2>The Tip That Makes This Possible</h2>
<p>Pre-book your ticket. This is non-negotiable for a one-hour visit. If you queue at the ticket office and that queue takes 25 minutes, your hour is already compromised before you've walked through the door. A <a href="/tickets/skip-the-line">skip-the-line ticket</a> means you arrive, show your booking, and walk in immediately. It's the single thing that makes a tight schedule workable.</p>

<h2>Arrive Early</h2>
<p>If your one hour is at 9:00 AM (right when it opens), you'll find the palace nearly empty and the quality of what you see in that hour is significantly higher than what you'd see in the same hour at 11:00 AM with tour groups flowing through. Same palace, very different experience.</p>`,
  },
];

async function main() {
  console.log('Seeding batch 3 — 10 human-written SEO articles...\n');

  for (const article of ARTICLES) {
    await prisma.blogPost.upsert({
      where: { slug_locale: { slug: article.slug, locale: article.locale } },
      update: {
        title:       article.title,
        excerpt:     article.excerpt,
        content:     article.content,
        category:    article.category,
        published:   article.published,
        publishedAt: article.publishedAt,
      },
      create: article,
    });
    console.log(`✓  ${article.title}`);
  }

  console.log('\nDone — 10 articles published.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
