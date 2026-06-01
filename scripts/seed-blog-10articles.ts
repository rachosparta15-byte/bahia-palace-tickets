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
  // 1. How to Get to Bahia Palace
  // ─────────────────────────────────────────────────────────────
  {
    title: 'How to Get to Bahia Palace from Jemaa el-Fna (Walk, Taxi & Map)',
    slug: 'how-to-get-to-bahia-palace',
    locale: 'en',
    category: 'practical',
    tags: 'how to get to bahia palace,bahia palace location,bahia palace from jemaa el fna,bahia palace directions',
    excerpt: 'Step-by-step directions to Bahia Palace from Jemaa el-Fna: walking route, taxi prices, caleche option, and Google Maps tips for the medina.',
    seoTitle: 'How to Get to Bahia Palace from Jemaa el-Fna',
    seoDesc: 'Step-by-step directions to Bahia Palace from Jemaa el-Fna: walking route (15 min), taxi prices, caleche, and Google Maps tips for the medina.',
    coverImage: '/images/gallery/bahia-palace-aerial-view-marrakech-medina-drone.jpg',
    content: `<p>Bahia Palace sits in the southern medina — about 1.2 km southeast of Jemaa el-Fna. It sounds close, and it is, but the medina's tangle of unmarked alleys trips up first-timers constantly. Here's everything you need to get there without getting lost.</p>

<h2>Bahia Palace Address</h2>
<p><strong>Rue Riad Zitoun el Jedid, Marrakech 40000, Morocco.</strong></p>
<p>GPS: <strong>31.6226° N, 7.9827° W</strong></p>
<p>The entrance is a set of large wooden doors on the left side of the street. There's a small sign in Arabic and French above the gate — easy to miss if you're walking fast. Save the GPS coordinates before you leave your accommodation.</p>

<h2>Walking from Jemaa el-Fna (~15 Minutes)</h2>
<p>Walking is the best option. The route takes you through the real medina — past craft workshops, spice stalls, and local tea houses — and it's part of the experience.</p>
<ol>
  <li>Stand in Jemaa el-Fna with the <strong>Koutoubia Mosque on your right</strong> (west side). Face east toward the medina entrance.</li>
  <li>Enter the medina and take <strong>Rue Riad Zitoun el Kedim</strong> heading south. This is a relatively wide covered lane — look for the sign at the entrance.</li>
  <li>Walk south for about <strong>10 minutes</strong>. You'll pass souvenir shops, small cafés, and craftsmen. Keep going straight.</li>
  <li>The lane merges into <strong>Rue Riad Zitoun el Jedid</strong>. Stay on this road.</li>
  <li>Bahia Palace entrance appears on your <strong>left</strong>, roughly 200m after the merge. If you hit the Mellah market, you've gone 100m too far — turn back.</li>
</ol>
<p><strong>Pro tip:</strong> Download Google Maps offline for Marrakech before you leave your hotel. The medina is mapped well enough for walking navigation, but mobile data can be unreliable in the narrow lanes.</p>

<h2>Taxi / Petit Taxi</h2>
<p>Marrakech's petit taxis are small red cars (usually Fiats) that run on meters — in theory. In practice, drivers often quote a fixed price to tourists.</p>
<ul>
  <li><strong>Fair meter price:</strong> 15–25 MAD from Jemaa el-Fna</li>
  <li><strong>What drivers will quote first:</strong> 50–80 MAD — negotiate firmly, agree before getting in</li>
  <li>Tell the driver <strong>"Palais Bahia"</strong> — every driver knows it</li>
  <li>Taxis can't enter the deepest medina lanes. They'll drop you at the nearest accessible point on Rue Riad Zitoun el Jedid — a 2–3 minute walk from the gate</li>
</ul>
<p>If you're using a ride-hailing app, both <strong>Careem</strong> and <strong>inDrive</strong> operate in Marrakech and show fares upfront. More reliable for price transparency than street-hailing.</p>

<h2>Caleche (Horse-Drawn Carriage)</h2>
<p>Caleches line up near Jemaa el-Fna and around the city walls. They're slow, scenic, and a legitimate way to travel if you're not in a rush.</p>
<ul>
  <li><strong>One-way price to Bahia Palace:</strong> 60–100 MAD (negotiate before boarding)</li>
  <li>They drop you at the edge of the pedestrian medina zone — same short walk to the gate</li>
  <li>Worth it for the experience on a first visit; impractical if you have a packed schedule</li>
</ul>

<h2>Google Maps Tips for the Medina</h2>
<p>The medina is mapped but imperfect. A few things that save frustration:</p>
<ul>
  <li><strong>Download offline maps</strong> for Marrakech before leaving your accommodation (Maps app → search Marrakech → Download)</li>
  <li>Set navigation to <strong>walking mode</strong> — driving directions are useless inside the medina</li>
  <li>When the app says "you've arrived" and you see nothing, look left — the entrance doors are easy to walk past</li>
  <li>Zoom in to street level in the final 200m for accuracy</li>
  <li><strong>What3words</strong> is a useful backup: every 3m² has a unique address and works offline</li>
</ul>

<h2>What's Nearby</h2>
<p>Bahia Palace is well-placed for a half-day or full-day medina loop:</p>
<ul>
  <li><strong>Saadian Tombs</strong> — 8-minute walk south. The Saadian dynasty's royal mausoleum, sealed for centuries. One of the finest pieces of Islamic architecture in Morocco. Entry 70 MAD.</li>
  <li><strong>El Badi Palace</strong> — 12-minute walk west. Atmospheric 16th-century ruins on a massive scale. Storks nest on the walls. Entry 70 MAD.</li>
  <li><strong>The Mellah</strong> — directly adjacent. Marrakech's old Jewish quarter, with a covered food market, the Lazama Synagogue, and a very different pace from the main souks.</li>
  <li><strong>Place des Ferblantiers</strong> — 3 minutes west. The lantern-makers' square, best in the early evening when everything lights up.</li>
</ul>

<h2>Book Before You Arrive</h2>
<p>The one thing worse than getting lost on the way to Bahia Palace is arriving and joining a 40-minute ticket queue. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket</a> before you leave and walk straight in. In peak season (March–May, September–November), the queue at the door regularly hits 30–45 minutes.</p>

<h2>Frequently Asked Questions</h2>
<h3>How long is the walk from Jemaa el-Fna to Bahia Palace?</h3>
<p>At a normal pace, the walk takes 12–18 minutes. It covers about 1.2 km along Rue Riad Zitoun el Kedim and Rue Riad Zitoun el Jedid. Allow a few extra minutes on your first visit to account for wrong turns or pausing to look at the souks on the way.</p>
<h3>Is it easy to find Bahia Palace on your own?</h3>
<p>Yes, if you use Google Maps or follow the route above. The road to the palace (Rue Riad Zitoun el Kedim → Rue Riad Zitoun el Jedid) is one of the more straightforward routes in the medina. The main mistake is walking past the entrance — the wooden doors are large but blend into the street. Look for the sign above them.</p>
<h3>Can I drive to Bahia Palace?</h3>
<p>You can't drive into the medina. If you have a car, park at <strong>Parking El Badi</strong> (on Place des Ferblantiers, about 600m west — free or very cheap) or <strong>Parking Mellah</strong> (just south of the Mellah market, a 5-minute walk from the gate). The parking guardian will collect 5–10 MAD when you leave — that's normal, not a scam.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 2. Bahia Palace vs Majorelle Garden
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace vs Majorelle Garden: Which Should You Visit First?',
    slug: 'bahia-palace-vs-majorelle-garden',
    locale: 'en',
    category: 'comparisons',
    tags: 'bahia palace vs majorelle garden,majorelle garden or bahia palace,best marrakech attractions',
    excerpt: 'Bahia Palace vs Majorelle Garden — price, time, crowds, photography, and which one to visit first. Honest comparison with a same-day itinerary.',
    seoTitle: 'Bahia Palace vs Majorelle Garden: Which to Visit First?',
    seoDesc: 'Bahia Palace vs Majorelle Garden: price, crowds, photography, and best for whom. Honest comparison plus a same-day itinerary that fits both.',
    coverImage: '/images/gallery/bahia-palace-arch-view-green-dome-fountain-palm.jpg',
    content: `<p>Two of Marrakech's most-visited sites, about 3 km apart. Both stunning, both crowded at the wrong time, and both worth visiting — but for completely different reasons. Here's how they compare so you can plan your time properly.</p>

<h2>Quick Comparison</h2>
<table>
  <thead>
    <tr><th></th><th>Bahia Palace</th><th>Majorelle Garden</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Entrance fee</strong></td><td>70 MAD (~€7)</td><td>150 MAD (~€15) + 50 MAD museum</td></tr>
    <tr><td><strong>Time needed</strong></td><td>60–90 min</td><td>45–75 min</td></tr>
    <tr><td><strong>Crowd peak</strong></td><td>10:00–14:00</td><td>10:30–15:00</td></tr>
    <tr><td><strong>Photography</strong></td><td>Excellent — interiors &amp; courtyards</td><td>Excellent — botanical, vibrant colour</td></tr>
    <tr><td><strong>Best for</strong></td><td>History, architecture, culture</td><td>Gardens, design, Instagram</td></tr>
    <tr><td><strong>Location</strong></td><td>Southern medina</td><td>Gueliz (New Town), 3 km northwest</td></tr>
    <tr><td><strong>Skip-the-line option</strong></td><td>Yes — recommended</td><td>Yes — essential in high season</td></tr>
  </tbody>
</table>

<h2>Bahia Palace: What You're Getting</h2>
<p>Bahia Palace is a 19th-century royal palace covering 8,000 square meters across multiple courtyards, reception halls, harem quarters, and gardens. The architecture is the entire point — hand-painted cedar ceilings, zellige tilework floors, carved stucco archways, and orange tree gardens that have barely changed in 125 years.</p>
<p><strong>What it delivers:</strong> A genuine sense of stepping into a different era. The Grand Riad courtyard alone stops most visitors in their tracks. The history is real and dramatic — Grand Vizier Ba Ahmed built this as the greatest private palace in Morocco, died in 1900, and it was stripped bare overnight by the Sultan.</p>
<p><strong>Who it's for:</strong> History enthusiasts, architecture fans, photographers who want interiors, and anyone interested in Moroccan cultural heritage.</p>
<p><strong>Honest downside:</strong> The rooms are empty — no original furniture or decorative objects remain. Some visitors find this underwhelming without context. An audio guide or prior reading makes a significant difference.</p>

<h2>Majorelle Garden: What You're Getting</h2>
<p>Majorelle Garden is a 1-hectare botanical garden designed by French painter Jacques Majorelle in the 1920s–30s and famously purchased by Yves Saint Laurent and Pierre Bergé in 1980. The signature cobalt blue villa (Majorelle Blue) against lush greenery, lotus ponds, and a remarkable cactus collection makes it one of the most photographed places in Morocco.</p>
<p><strong>What it delivers:</strong> Visual impact. The colour contrast — that specific shade of blue against tropical greens — is genuinely striking. The Berber Museum inside is excellent. The YSL Memorial Garden (where Saint Laurent's ashes were scattered) adds emotional resonance for fashion and design fans.</p>
<p><strong>Who it's for:</strong> Garden lovers, design and fashion enthusiasts, photographers shooting outdoors, and anyone wanting a break from the medina's intensity.</p>
<p><strong>Honest downside:</strong> It's expensive for its size. At 150 MAD entry (plus 50 MAD for the Berber Museum), you get less than an hour of content in a relatively compact space. It can feel crowded and rushed when tour groups arrive simultaneously.</p>

<h2>If You Only Have Time for One</h2>
<p><strong>Choose Bahia Palace if:</strong> You're interested in Moroccan history and architecture, you want to understand what Marrakech actually was, or you're a photographer who works well with interiors and structural subjects.</p>
<p><strong>Choose Majorelle Garden if:</strong> You're a garden or design enthusiast, you have limited time and want a single high-impact visual experience, or you're a YSL fan with a particular connection to the site.</p>
<p>For most first-time visitors to Marrakech, Bahia Palace offers more depth and cultural substance per dirham. Majorelle is beautiful but brief. If you only have one morning and one afternoon in the city, Bahia Palace is the stronger choice.</p>

<h2>Can You Do Both in One Day? Yes — Here's How</h2>
<p>Absolutely, and it's a very good day. The two sites are about 3 km apart — a 15-minute taxi or 35-minute walk through the medina.</p>
<p><strong>Recommended order and timing:</strong></p>
<ol>
  <li><strong>09:00</strong> — Arrive at Bahia Palace at opening. Spend 75–90 minutes inside before the tour groups arrive.</li>
  <li><strong>10:30</strong> — Walk north through the medina or take a petit taxi toward Gueliz.</li>
  <li><strong>11:00</strong> — Quick lunch in Gueliz (the neighbourhood around Majorelle has good café options).</li>
  <li><strong>12:30</strong> — Majorelle Garden. Pre-book your ticket online — the walk-in queue is brutal in high season. Spend 60–75 minutes.</li>
  <li><strong>14:00</strong> — Done. Afternoon free for the souks or other medina sites.</li>
</ol>
<p>The key is hitting Bahia Palace first at 9:00 AM. Both sites get crowded mid-morning; starting early at the palace and reaching Majorelle by midday (when the early crowds thin slightly) gives you the best experience at each.</p>

<h2>Book Your Bahia Palace Ticket Now</h2>
<p>The queue at Bahia Palace's single ticket window is the most common frustration visitors report. <a href="/en/tickets/skip-the-line">A skip-the-line ticket</a> bypasses it entirely — you show your confirmation and walk straight in. In high season, this saves 30–45 minutes of standing in the street.</p>

<h2>Frequently Asked Questions</h2>
<h3>Is Majorelle Garden more expensive than Bahia Palace?</h3>
<p>Yes, significantly. Bahia Palace costs 70 MAD (~€7). Majorelle Garden costs 150 MAD (~€15) for garden entry alone, or 200 MAD if you add the Berber Museum inside. For most visitors, Bahia Palace offers more content per dirham.</p>
<h3>Which is better for photography — Bahia Palace or Majorelle Garden?</h3>
<p>They offer completely different photographic subjects. Majorelle is better for colour and botanical photography — the cobalt blue against green is very distinctive. Bahia Palace is better for architectural photography — zellige floors, carved archways, painted ceilings, and courtyard geometry. If you shoot both styles, do both.</p>
<h3>Can you walk between Bahia Palace and Majorelle Garden?</h3>
<p>Yes, it's about 3 km and takes 35–45 minutes on foot. The route takes you through the medina and out into Gueliz (the modern city). It's a pleasant walk if you're not in a hurry and want to see how Marrakech transitions between old and new. In summer, a taxi makes more sense.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 3. Bahia Palace History
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace History: The Rise & Fall of Grand Vizier Ba Ahmed',
    slug: 'bahia-palace-history',
    locale: 'en',
    category: 'history',
    tags: 'bahia palace history,who built bahia palace,ba ahmed marrakech,palais bahia histoire',
    excerpt: 'The full story of Bahia Palace: from Si Moussa\'s modest beginning to Ba Ahmed\'s extraordinary ambition, his death, and the overnight looting that left the palace empty.',
    seoTitle: 'Bahia Palace History: Rise & Fall of Grand Vizier Ba Ahmed',
    seoDesc: 'The full history of Bahia Palace: who built it, Ba Ahmed\'s story from slave to Grand Vizier, the palace\'s construction, and its dramatic overnight looting.',
    coverImage: '/images/gallery/bahia-palace-arabic-calligraphy-stucco-zellige-courtyard.jpg',
    content: `<p>Most visitors walk through Bahia Palace knowing only that it's old and beautiful. The actual story is far more interesting — and considerably darker. It involves a man born into slavery who became the most powerful person in Morocco, built the greatest private palace the country had ever seen, and died knowing the Sultan had been waiting years to destroy everything he'd built.</p>

<h2>Who Was Si Moussa?</h2>
<p>The palace's origins begin with <strong>Si Moussa</strong>, a man of sub-Saharan African descent who was enslaved and brought into the Moroccan court. Through exceptional intelligence, loyalty, and political skill, he rose within the royal household until Sultan Muhammad IV appointed him Grand Vizier — effectively the second most powerful position in Morocco.</p>
<p>In the 1860s, Si Moussa began construction of a private residence in the southern medina of Marrakech. The first phase was relatively modest by royal standards — a riad with stuccoed rooms and a private garden. But the quality of the craftwork was exceptional: Si Moussa commissioned tilemakers, woodcarvers, and plasterwork specialists from Fez, then Morocco's artistic capital.</p>
<p>He named the residence <em>Dar Si Moussa</em> — the house of Si Moussa. It would later be renamed entirely by his son.</p>

<h2>Ba Ahmed: From Slave's Son to Grand Vizier</h2>
<p><strong>Ba Ahmed ibn Moussa</strong> was born into a very different world than his father. Si Moussa had secured his son's freedom and his place within the Moroccan elite before his death. Ba Ahmed inherited not only his father's wealth but his political position — and exceeded both.</p>
<p>Under Sultan Hassan I, Ba Ahmed consolidated power through a combination of diplomatic skill, ruthlessness, and an extraordinary ability to manage the competing interests of the Moroccan court. When Hassan I died suddenly in 1894 during a military campaign — reportedly with Ba Ahmed hiding the Sultan's death for days to prevent chaos — Ba Ahmed became the <em>de facto</em> regent for the young Sultan Abdelaziz, who was only 14 years old.</p>
<p>For the next six years, Ba Ahmed was Morocco. He controlled appointments, finances, foreign relations, and the military. Foreign governments dealt with him rather than the Sultan. He was wealthy beyond calculation, feared throughout the court, and — crucially — he had ambitions that extended beyond politics.</p>

<h2>Building the Palace: 1894–1900</h2>
<p>With absolute power came the resources and inclination to build on an entirely different scale. Ba Ahmed took his father's modest riad and expanded it into something Morocco had never seen from a private individual.</p>
<p>The construction ran from 1894 until approximately 1900 and involved:</p>
<ul>
  <li><strong>300 craftsmen from Fez</strong> working simultaneously at peak construction</li>
  <li><strong>Italian Carrara marble</strong> imported for the most important reception rooms</li>
  <li><strong>Hand-carved cedar ceilings</strong> painted with mineral pigments that have barely faded in 125 years</li>
  <li><strong>Zellige tilework</strong> covering floors and lower walls across dozens of rooms — each tile cut and placed by hand</li>
  <li><strong>150 rooms</strong> across multiple courtyards, including grand reception halls, private apartments, harem quarters, and staff areas</li>
  <li><strong>Gardens</strong> planted with orange, lemon, cypress, jasmine, and roses</li>
</ul>
<p>The name Ba Ahmed chose for the finished palace — <em>Bahia</em>, meaning "brilliance" or "the beautiful one" in Arabic — was not modest. It was a statement.</p>
<p>The scale of ambition was extraordinary given that Ba Ahmed was technically a servant of the Sultan, not a member of the royal family. Building the finest palace in Marrakech was an act of brazen display — and everyone in the court understood it as such.</p>

<h2>Life Inside the Palace</h2>
<p>Bahia Palace at its height was a complete world. Ba Ahmed lived there with:</p>
<ul>
  <li><strong>Four wives</strong>, each with their own apartment ranked in order of precedence — the first wife's rooms were closest to the Grand Riad</li>
  <li><strong>24 concubines</strong> housed in the harem quarters</li>
  <li>Hundreds of servants, guards, cooks, and officials</li>
</ul>
<p>Foreign ambassadors, merchants, and petitioners came to Bahia Palace to seek the Grand Vizier's audience. Ba Ahmed held court here, received gifts, conducted negotiations, and exercised power from within these walls.</p>
<p>The Grand Riad — the vast central courtyard covering 1,500 square meters — was where formal receptions took place. The smaller courtyards and rooms were private. The distinction was deliberate: architecture as a tool of power, controlling who could see what.</p>

<h2>Death and the Overnight Looting</h2>
<p>Ba Ahmed ibn Moussa died in <strong>May 1900</strong>, at the peak of his power. He had spent his final years knowing that Sultan Abdelaziz — now old enough to rule independently — resented his regent's dominance. The relationship between them had become openly hostile.</p>
<p>The consequences were immediate and total. Within hours of Ba Ahmed's death, the Sultan's soldiers entered Bahia Palace. Over the following days, everything moveable was seized and distributed: furniture, carpets, silver and gold objects, artworks, textiles, mirrors, and musical instruments.</p>
<p>What they couldn't take were the walls, the floors, the ceilings, and the gardens. The zellige, the carved stucco, the painted cedar — these were built in. The architectural shell of Bahia Palace survived intact; everything that had filled it was gone.</p>
<p>This is why you walk through Bahia Palace today and see beautiful, empty rooms. It wasn't always this way.</p>

<h2>The Palace Under French Protectorate</h2>
<p>When France established its protectorate over Morocco in 1912, Bahia Palace became the <strong>official residence of the Resident-General</strong> — France's representative and effective ruler of the country. Generals Lyautey and Noguès both lived here.</p>
<p>The French made modifications — some plumbing, electrical work, and minor structural changes — but largely preserved the palace's architecture. Photographs from the French period show the rooms still empty of the original furnishings but otherwise intact.</p>
<p>After Moroccan independence in 1956, the palace passed to the Moroccan state and was gradually opened to the public. It has been managed as a heritage monument since the 1960s, with ongoing restoration work continuing today.</p>

<h2>Bahia Palace Today</h2>
<p>What you see when you visit Bahia Palace is essentially what Ba Ahmed built between 1894 and 1900 — minus everything that could be carried out. The architecture is in remarkable condition given its age: the painted ceilings retain their colour, the zellige tilework is largely intact, and the gardens continue to be maintained.</p>
<p>Restoration work is ongoing. Sections are occasionally closed when scaffolding is needed for ceiling or plasterwork repair. The Moroccan government treats Bahia Palace as a significant national heritage site, and there is no risk of deterioration being allowed to advance unchecked.</p>
<p>Around 500,000 visitors pass through annually, making it one of the most visited monuments in Morocco. The story of Si Moussa and Ba Ahmed — slaves who became the most powerful men in the country, built one of its greatest buildings, and lost everything overnight — is still one of the most compelling in Moroccan history.</p>

<h2>See It for Yourself</h2>
<p>Understanding the history makes everything you see inside the palace more meaningful. Before your visit, consider reading up on Ba Ahmed or hiring an audio guide at the entrance. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket</a> and walk in ready to understand what you're looking at — not just that it's beautiful, but why it exists and what happened to it.</p>

<h2>Frequently Asked Questions</h2>
<h3>Who built Bahia Palace?</h3>
<p>The palace was built in two phases. The original structure was built by <strong>Si Moussa</strong>, a former slave who rose to become Grand Vizier of Morocco under Sultan Muhammad IV, starting in the 1860s. His son <strong>Ba Ahmed ibn Moussa</strong> massively expanded the palace between 1894 and 1900, transforming it into the 8,000 square meter complex you see today.</p>
<h3>Why is Bahia Palace empty?</h3>
<p>When Ba Ahmed died in 1900, Sultan Abdelaziz — who had long resented Ba Ahmed's power as regent — immediately ordered soldiers to strip the palace of all its contents. Furniture, carpets, artworks, silver, and all moveable objects were seized within days of Ba Ahmed's death. Only the fixed architecture — the tilework, carved ceilings, and built-in plasterwork — could not be removed. The palace has been empty of its original furnishings ever since.</p>
<h3>What does "Bahia" mean?</h3>
<p>"Bahia" (باهية) is an Arabic word meaning "brilliance," "radiance," or "the beautiful one." Ba Ahmed chose this name deliberately — it was a declaration of the palace's quality and, implicitly, of his own power and sophistication. It was also a name that would have been understood by everyone in the Moroccan court as an act of extraordinary ambition.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 4. Room-by-Room Guide
  // ─────────────────────────────────────────────────────────────
  {
    title: 'What to See Inside Bahia Palace: A Room-by-Room Guide',
    slug: 'bahia-palace-room-by-room-guide',
    locale: 'en',
    category: 'guides',
    tags: 'what to see in bahia palace,bahia palace rooms,bahia palace interior,bahia palace guide',
    excerpt: 'A complete room-by-room guide to Bahia Palace: what to look for in each section, the best photo spots, and what most visitors walk past without noticing.',
    seoTitle: 'What to See Inside Bahia Palace: Room-by-Room Guide',
    seoDesc: 'Room-by-room guide to Bahia Palace: the Grand Riad, harem quarters, gardens, cedar ceilings, and the best photography spots in each section.',
    coverImage: '/images/gallery/bahia-palace-inner-courtyard-central-fountain-stucco.jpg',
    content: `<p>Bahia Palace covers 8,000 square meters and most visitors walk through it in a vague loop, unsure of what they're looking at or whether they've seen everything. This guide solves that. Here's exactly what you'll encounter, section by section, and what's worth slowing down for in each one.</p>

<h2>The Main Entrance</h2>
<p>You enter through heavy wooden doors on Rue Riad Zitoun el Jedid. The entrance corridor is deliberately understated — narrow, cool, and dimly lit after the bright street. This is intentional: it makes the first courtyard you step into feel dramatically more spacious than it would otherwise.</p>
<p><strong>What to notice:</strong> The door itself — the ironwork, the carved wooden frame, the scale. Bahia Palace doors are among the finest examples of traditional Moroccan zouak woodworking in the city. The entrance corridor also has its first painted ceiling panel above you. Most people are looking ahead and miss it.</p>

<h2>The Small Riad (Si Moussa's Original Section)</h2>
<p>The first courtyard you enter is the older section — built by Si Moussa in the 1860s before Ba Ahmed's expansion. It's smaller and more intimate than what comes later, which makes it an interesting contrast.</p>
<p><strong>What to notice:</strong> The proportions are different here. The stucco work is slightly less elaborate than in Ba Ahmed's later additions, but the zellige tiling on the floor is in excellent condition. The rooms opening off this courtyard are smaller — these were originally private domestic quarters, not reception spaces.</p>
<p><strong>Photography:</strong> The smaller scale means you can get the entire courtyard in frame from the doorway. Good for establishing context before you hit the larger spaces.</p>

<h2>The Grand Riad</h2>
<p>This is the centrepiece of the palace and the space that stops most visitors mid-step. The Grand Riad covers approximately 1,500 square meters — a vast open courtyard paved with polychrome zellige tilework and framed on all sides by a painted wooden gallery (arcade) supported by ornamental columns.</p>
<p>Orange and lemon trees planted in precise geometric arrangements fill the courtyard with shade and scent. A central marble fountain marks the axis. The painted gallery above provides shade for the surrounding rooms.</p>
<p><strong>What to notice:</strong></p>
<ul>
  <li>The painted wooden gallery ceiling — each panel is unique. Look at three or four in succession and you'll see that no two share the same pattern</li>
  <li>The zellige floor pattern — geometric Islamic tilework that creates an optical depth effect when viewed from a low angle</li>
  <li>The marble columns — Italian Carrara marble, imported specifically for this courtyard</li>
  <li>The scale: 1,500 square meters is roughly the size of three tennis courts laid end to end</li>
</ul>
<p><strong>Photography:</strong> Best shot from the centre of the courtyard looking toward the north arcade. Early morning (9:00–10:00) gives you even, diffused light without harsh shadows. The fountain reflection works when the surface is still — arrive before the crowds disturb it.</p>

<h2>The Great Court (Grande Cour)</h2>
<p>Beyond the Grand Riad, a series of interconnected courtyards and reception rooms form what's often called the Great Court. These were Ba Ahmed's formal reception spaces — where he met petitioners, hosted dignitaries, and exercised his authority as Grand Vizier.</p>
<p><strong>What to notice:</strong> The Council Room (Salle du Conseil) has the palace's most elaborate painted ceiling — a dense, geometric composition in deep blues, reds, and gold that covers the entire surface. Stand directly below it and look straight up. Most people glance at it from the doorway; you need to be underneath to properly appreciate the scale of the work.</p>
<p>The carved stucco panels in these rooms are at their most intricate here. The upper sections of the walls feature arabesque plasterwork carved so finely it looks like lacework. Spotting the different craftsmen's approaches in different rooms (subtle variations in pattern density and depth) is something only visible on close inspection.</p>

<h2>The Harem Quarters</h2>
<p>Ba Ahmed's four wives and 24 concubines occupied these private apartments, arranged in a deliberate hierarchy. The first wife's rooms are closest to the Grand Riad — the most prestigious position. Further from the main court means lower rank.</p>
<p><strong>What to notice:</strong> The rooms here are smaller and more intimate than the formal reception spaces. The scale shifts from grand to human. Some rooms retain their original painted tile dados (lower wall panels) in excellent condition. The window grilles — carved wooden latticework (mashrabiya) — filtered light and allowed the women inside to observe activity without being seen.</p>
<p>The layout of the harem quarters tells a social story: the architectural hierarchy of the apartments mirrors exactly the social hierarchy of the women who lived in them. This is architecture as control.</p>
<p><strong>Photography:</strong> The narrow corridors between rooms create natural leading lines. The mashrabiya windows project geometric light patterns onto the floor in late morning — worth positioning yourself to catch this.</p>

<h2>The Gardens</h2>
<p>The palace gardens extend behind the formal rooms and are among the most peaceful spaces in the entire medina. Planted with jasmine, roses, banana trees, orange and lemon trees, and cypress, they're a genuine retreat.</p>
<p><strong>What to notice:</strong> The garden layout follows Islamic garden design principles — a central axis, geometric planting beds, shade from tall trees. In spring (March–April), the jasmine and roses are in bloom and the scent is remarkable. In summer, the canopy provides real relief from the heat.</p>
<p>Most visitors spend five minutes in the garden and leave. If you sit here for fifteen minutes and let the noise of the medina outside disappear, you get a very different experience of the palace.</p>
<p><strong>Photography:</strong> The contrast of the warm terracotta walls against the green garden is excellent in the late afternoon when the light turns golden. The doorways from the garden looking back into the covered rooms make strong compositional frames.</p>

<h2>Book Your Visit</h2>
<p>Knowing what to look for makes Bahia Palace a genuinely different experience from just walking through. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket</a> so you spend your time inside looking at the palace rather than outside queuing to get in. Check the <a href="/en/blog/bahia-palace-opening-hours-2026">opening hours</a> before you go — arriving at 9:00 AM gives you the Grand Riad largely to yourself.</p>

<h2>Frequently Asked Questions</h2>
<h3>How many rooms does Bahia Palace have?</h3>
<p>Bahia Palace contains approximately 150 rooms across its various sections — from grand reception halls and formal courtyards to private apartments, service rooms, and garden pavilions. Not all rooms are open to the public at any given time; some are occasionally closed for restoration work.</p>
<h3>Is the furniture original at Bahia Palace?</h3>
<p>No. When Ba Ahmed died in 1900, Sultan Abdelaziz ordered everything moveable to be seized immediately. All furniture, carpets, textiles, silver objects, and decorative items were removed within days of Ba Ahmed's death. What remains is only the fixed architecture: the tilework, carved plasterwork, painted ceilings, and structural elements. The rooms are beautiful but empty.</p>
<h3>How long does it take to see the whole palace?</h3>
<p>A thorough visit — seeing every open section, including the harem quarters and gardens — takes 75–90 minutes. Visitors who rush through the main courtyards and miss the further sections typically spend 30–45 minutes and leave feeling they've missed something. Budget 90 minutes and you won't feel rushed.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 5. Bahia Palace with Kids
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace with Kids: Family Visitor Guide 2026',
    slug: 'bahia-palace-with-kids',
    locale: 'en',
    category: 'visit-tips',
    tags: 'bahia palace with kids,bahia palace family,is bahia palace good for children,marrakech kids attractions',
    excerpt: 'Is Bahia Palace good for children? Ticket prices, what kids love most, practical tips for families, and the best time to visit with young children in 2026.',
    seoTitle: 'Bahia Palace with Kids: Family Visitor Guide 2026',
    seoDesc: 'Is Bahia Palace good for children? Ticket prices, what kids love, practical family tips, and the best time to visit with young children in 2026.',
    coverImage: '/images/gallery/bahia-palace-tourists-visiting-grand-courtyard.jpg',
    content: `<p>Bahia Palace works better for families than most people expect. It's not a museum full of fragile objects behind glass — it's a sequence of open courtyards, shaded gardens, and ornate rooms where children have space to move and things to look at. Here's what to expect if you're bringing kids.</p>

<h2>Is Bahia Palace Suitable for Children?</h2>
<p>Yes, genuinely. A few specific reasons:</p>
<ul>
  <li>The Grand Riad courtyard is large and open — children aren't confined to a narrow path or asked to be completely silent</li>
  <li>The gardens at the back give older children room to roam while parents look at the architecture</li>
  <li>The visual variety — bright coloured tiles, ornate carved archways, trees, fountains — holds children's attention better than a standard exhibition room</li>
  <li>There are no roped-off displays or "don't touch" cases everywhere. The main restriction is no touching the carved walls, which is easy to manage</li>
</ul>
<p>The honest caveat: there's no interactive element, no kids' guide, and no official programme for children. It's a heritage site, not a children's attraction. What it offers is beautiful space and genuine history — how much a child engages depends largely on how it's framed for them before the visit.</p>

<h2>Age-Appropriate Experience</h2>
<h3>Toddlers (under 4)</h3>
<p>Manageable with the right preparation. The main challenges are the walking distance (the full palace is about 1 km of indoor/outdoor walking) and some raised doorway thresholds that require lifting a buggy. A baby carrier is far easier than a pushchair inside the palace. Toddlers respond well to the coloured tiles and open spaces.</p>
<h3>Children aged 4–10</h3>
<p>This age group often gets the most out of Bahia Palace. The tile patterns, the large wooden ceilings, the gardens, and the fountains are all visually engaging. Frame the visit as an adventure — "this palace belonged to a man who was born a slave and became the most powerful person in Morocco" is a story most children find compelling when explained simply.</p>
<h3>Older children and teenagers</h3>
<p>Teenagers with an interest in history or architecture will find genuine depth here. Those without prior interest may disengage after 30–40 minutes — a reasonable outcome that means spending time in the gardens or heading to El Badi Palace next, which has more open space and a different atmosphere.</p>

<h2>Ticket Prices for Children</h2>
<ul>
  <li><strong>Children under 7:</strong> Free</li>
  <li><strong>Children 7 and over:</strong> 70 MAD (same as adults)</li>
  <li><strong>Moroccan national children:</strong> 10 MAD</li>
</ul>
<p>A family of two adults and two children under 7 pays 140 MAD total — around €14. That's genuinely good value for 90 minutes of cultural immersion. Check the <a href="/en/blog/bahia-palace-entrance-fee-2026">full entrance fee breakdown</a> for more details.</p>

<h2>What Kids Love Most Inside</h2>
<p>Based on what parents consistently report, the highlights for children are:</p>
<ul>
  <li><strong>The Grand Riad courtyard</strong> — the sheer scale impresses children of all ages; the orange trees are something to touch and smell</li>
  <li><strong>The zellige tile floors</strong> — children often crouch down to trace the patterns with their fingers (discourage touching the walls, but floor tiles are generally fine)</li>
  <li><strong>The painted ceilings</strong> — play "spot the differences" between ceiling panels; no two are identical</li>
  <li><strong>The gardens</strong> — younger children love running between the trees and finding the fountain</li>
  <li><strong>The doorways and arches</strong> — children naturally frame themselves in the ornate archways for photos</li>
</ul>

<h2>Practical Family Tips</h2>
<p><strong>Shade and heat:</strong> The Grand Riad courtyard has orange trees for shade, and the covered galleries and indoor rooms are cool even in summer. The gardens have good tree cover. The walk from your accommodation to the palace through the medina can be hot — plan this part for early morning.</p>
<p><strong>Water:</strong> Bring a water bottle for each child. There's no water station inside the palace. In summer, dehydration comes quickly in Marrakech's heat.</p>
<p><strong>Shoes:</strong> Comfortable, flat shoes with a grip. The zellige floors are polished and slippery; children running on them will fall. No need to remove shoes — Bahia Palace is not a mosque.</p>
<p><strong>Toilets:</strong> There are basic toilet facilities at the palace. Visit them before starting the interior tour rather than having to interrupt and retrace your steps.</p>
<p><strong>Pushchairs:</strong> Manageable in the main courtyards and gardens. The narrow connecting corridors between some sections have raised thresholds that require lifting. A lightweight, foldable pushchair is easier than a full travel system. A baby carrier is the best option for children under 18 months.</p>
<p><strong>Queue:</strong> Children in a 30-minute queue in the heat is not enjoyable for anyone. <a href="/en/tickets/skip-the-line">Book a skip-the-line ticket</a> in advance and walk straight in.</p>

<h2>Best Time to Visit with Kids</h2>
<p>For families, the timing priorities are slightly different from adult visits:</p>
<ul>
  <li><strong>9:00 AM opening</strong> is ideal — coolest part of the day, fewest people, children aren't tired yet</li>
  <li><strong>March–May and September–October</strong> are the best months — temperatures are comfortable (20–26°C) rather than exhausting</li>
  <li><strong>Avoid July and August midday</strong> with young children — 38–42°C in the medina streets is genuinely difficult for small children</li>
  <li><strong>Weekday mornings</strong> are noticeably less crowded than weekends</li>
</ul>

<h2>Family-Friendly Spots Nearby</h2>
<p>If you're making a half-day of it with children:</p>
<ul>
  <li><strong>Saadian Tombs</strong> (8-minute walk) — smaller and faster to visit; the ornate chambers fascinate children briefly and it's done in 30–40 minutes</li>
  <li><strong>El Badi Palace ruins</strong> (12-minute walk) — roofless, open, and atmospheric; children can walk the walls' base and the scale impresses them; storks nesting on the towers are a bonus</li>
  <li><strong>Place des Ferblantiers</strong> (3-minute walk) — the lantern-makers' square has enough visual interest to hold children for 10 minutes and requires no ticket</li>
</ul>

<h2>Book and Skip the Queue</h2>
<p>Managing children in a medina queue is significantly harder than managing adults. <a href="/en/tickets/skip-the-line">Book your family skip-the-line tickets online</a>, arrive at 9:00 AM, and you'll be inside within minutes of arriving. The time you save is better spent in the garden.</p>

<h2>Frequently Asked Questions</h2>
<h3>Is Bahia Palace free for children?</h3>
<p>Children under 7 enter Bahia Palace for free. Children aged 7 and over pay the standard entrance fee of 70 MAD (the same as adults). Moroccan national children pay 10 MAD regardless of age.</p>
<h3>Is there a kids' guide or audio tour for children at Bahia Palace?</h3>
<p>There is no official children's audio guide or kids' programme at Bahia Palace. The site is a heritage monument with a standard adult audio guide available for hire at the entrance. For younger children, the most effective approach is to tell the story of Ba Ahmed (a man born into slavery who became the most powerful person in Morocco and built this palace) in simple terms before the visit — it makes everything inside more engaging.</p>
<h3>Can you take a pushchair/stroller into Bahia Palace?</h3>
<p>Yes, with some limitations. The main courtyards and gardens are pushchair-accessible. Some of the narrow connecting corridors between sections have raised thresholds that require lifting the pushchair over. A lightweight, foldable pushchair is much easier than a larger travel system. A baby carrier is the most practical option for children under 18 months.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 6. Photography Guide
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Photography Guide: Best Shots, Light & Tips',
    slug: 'bahia-palace-photography-guide',
    locale: 'en',
    category: 'guides',
    tags: 'bahia palace photography,bahia palace photos,bahia palace best photo spots,photographing marrakech palaces',
    excerpt: 'Complete photography guide to Bahia Palace: best time for light, the top photo spots inside, camera vs phone, and how to get clean shots without crowds.',
    seoTitle: 'Bahia Palace Photography Guide: Best Shots, Light & Tips',
    seoDesc: 'Photography guide to Bahia Palace: best time for light, top photo spots (zellige floors, cedar ceilings, Grand Riad), camera vs phone, and crowd-free shot tips.',
    coverImage: '/images/gallery/bahia-palace-octagonal-cedar-ceiling-carved-wood.jpg',
    content: `<p>Bahia Palace is one of the most photogenic buildings in Morocco — and one of the most challenging to photograph well. The interiors are dim, the crowds arrive early, and the best angles take a few minutes to find. This guide gives you the exact information you need to come away with shots worth keeping.</p>

<h2>Photography Rules at Bahia Palace</h2>
<ul>
  <li><strong>Personal photography: fully allowed</strong> throughout the palace — no ticket or fee required</li>
  <li><strong>Flash photography: strictly prohibited</strong> — the painted ceilings and pigmented plasterwork are light-sensitive and several centuries old; guards enforce this actively</li>
  <li><strong>Drones: not permitted</strong> — inside or in the immediate vicinity</li>
  <li><strong>Tripods:</strong> no official prohibition, but in crowded rooms guards may ask you to put them away; early morning visits are your best chance to use one without issue</li>
  <li><strong>Commercial photography</strong> (for advertising, publications, etc.) requires a permit arranged with the Moroccan Ministry of Culture in advance</li>
</ul>

<h2>Best Time of Day for Photos</h2>
<p>This is the single most impactful decision you can make. <strong>9:00–10:30 AM is the best window by a significant margin.</strong></p>
<p>Here's why the light works in your favour in the morning:</p>
<ul>
  <li>The Grand Riad courtyard faces roughly north-south. In the morning, the low sun enters from the east, casting angled light across the zellige floor and the lower parts of the arcade — this is the light that makes the tilework look three-dimensional</li>
  <li>The indoor rooms are lit by reflected courtyard light. In the morning this is soft and even; at midday it becomes harsh and contrasty</li>
  <li>The harem quarters and gardens receive morning light that is noticeably warmer and more directional than afternoon light</li>
</ul>
<p>The afternoon isn't useless — the golden light from 15:30 onwards in summer (14:30 in winter) is genuinely good for the gardens and the exterior walls. But the courtyards are better in the morning.</p>

<h2>Best Photo Spots Inside</h2>

<h3>1. The Grand Riad Courtyard</h3>
<p>The most photographed space in the palace. For the best composition: stand at the south end of the courtyard and shoot toward the north arcade. Include the orange trees in the foreground for depth. Get low — waist height gives you a floor reflection in the fountain if the water is still. Arrive at 9:00 AM before the crowds break the surface.</p>

<h3>2. The Cedar Ceilings</h3>
<p>The Council Room and several reception halls have hand-painted cedar ceilings that are among the finest examples of Moroccan craftsmanship in existence. To photograph them properly: stand directly below the centre of the ceiling panel, shoot straight up, and use the widest lens or setting you have. Night mode on a modern phone handles the dim light better than flash-off on a camera with a slow lens.</p>

<h3>3. The Zellige Floor Patterns</h3>
<p>For floor shots: get as low as possible — lying on the floor is technically effective but attracts attention. Kneeling and shooting at a very shallow angle compresses the pattern into a strong graphic image. The polychrome zellige in the Grand Riad is the most complex; the monochrome sections near the entrance are cleaner for geometric abstracts.</p>

<h3>4. The Doorways and Arches</h3>
<p>Bahia Palace's carved plaster archways are natural frames. Position your subject (a person, or just the room beyond) inside the arch and expose for the highlights — let the arch fall dark to create a silhouette frame. The transition from the bright courtyard to the dark interior, shot through an arch, is one of the palace's best compositional opportunities.</p>

<h3>5. The Harem Corridor</h3>
<p>The long covered corridor leading to the harem quarters creates a strong vanishing-point perspective. Shoot from one end toward the other — include the repetition of archways and the light falling through the mashrabiya windows on one side. This works best before the tour groups fill the corridor.</p>

<h3>6. The Gardens</h3>
<p>The palace gardens are excellent in late morning when the light clears the surrounding walls. Shoot the doorways from the garden back into the rooms for a contrast between the bright outdoor green and the cool shadowed interior. The bougainvillea and jasmine, when in bloom (March–May), add colour that's unusual in an otherwise terracotta-and-white palette.</p>

<h2>Camera vs Phone: What Works Best</h2>
<table>
  <thead><tr><th>Situation</th><th>Camera</th><th>Phone</th></tr></thead>
  <tbody>
    <tr><td>Grand Riad (bright, outdoors)</td><td>Excellent</td><td>Excellent</td></tr>
    <tr><td>Cedar ceilings (dark interior)</td><td>Good with f/1.8+ lens</td><td>Good with Night Mode</td></tr>
    <tr><td>Zellige floor detail</td><td>Better (RAW, more control)</td><td>Good</td></tr>
    <tr><td>Archway silhouettes</td><td>Better (exposure control)</td><td>Good with manual exposure</td></tr>
    <tr><td>Garden shots</td><td>Excellent</td><td>Excellent</td></tr>
    <tr><td>Portability and discretion</td><td>Less convenient</td><td>Better</td></tr>
  </tbody>
</table>
<p>A modern flagship phone (iPhone 15, Samsung S24, Pixel 8) will produce excellent results in all conditions inside the palace. The main advantage of a camera is RAW files for post-processing and better low-light performance without the computational noise of phone night modes. Both tools work — use what you're most comfortable with.</p>

<h2>Avoiding Crowds in Your Shots</h2>
<ul>
  <li><strong>9:00 AM arrival</strong> is your primary weapon — the first 60–90 minutes are dramatically quieter</li>
  <li>In the Grand Riad, position yourself against one of the columns and wait for gaps between visitor groups — they come in waves, and there are genuine 20–30 second windows</li>
  <li>Shoot the harem quarters and gardens last — these are where tour groups thin out first, usually by 10:30</li>
  <li>For ceiling shots, shoot straight up — people walking through the frame are out of the shot entirely</li>
  <li>Long exposure (if using a tripod) can blur moving visitors into ghostly transparency — requires very early morning light levels to work without overexposure</li>
</ul>

<h2>Start Your Shoot on Time</h2>
<p>The best shots happen in the first 90 minutes after opening. <a href="/en/tickets/skip-the-line">Book a skip-the-line ticket</a> so you walk straight in at 9:00 AM without spending 30 minutes in a queue first. The light won't wait for the ticket booth.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can you use a camera with a lens at Bahia Palace?</h3>
<p>Yes. Cameras with interchangeable lenses are permitted for personal use. There's no official restriction on lens size for personal photography. Tripods are not prohibited but may attract attention from guards in crowded rooms. The only firm rule is no flash and no drones.</p>
<h3>What's the best lens for Bahia Palace photography?</h3>
<p>A wide-angle lens (16–24mm equivalent) is most useful for the courtyard shots and ceiling photography. A 35–50mm equivalent works well for room details and archway framing. A fast prime (f/1.8 or faster) helps significantly in the darker interior rooms. For phone photography, use the standard or ultra-wide lens — the telephoto lens performs poorly in low light.</p>
<h3>Is there a photography fee at Bahia Palace?</h3>
<p>No. Personal photography (photos and video for private use) is completely free at Bahia Palace. There is no camera entry fee or photography permit required for tourists. The only prohibitions are flash photography, drones, and commercial photography (which requires prior ministry approval).</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 7. Bahia Palace & Saadian Tombs One Day
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace & Saadian Tombs: Can You Visit Both in One Day?',
    slug: 'bahia-palace-and-saadian-tombs-one-day',
    locale: 'en',
    category: 'guides',
    tags: 'bahia palace and saadian tombs,saadian tombs bahia palace same day,marrakech monuments one day',
    excerpt: 'Yes, you can visit both in half a day. Here\'s the exact timing, the best order, what to see at each site, ticket prices, and where to eat between the two.',
    seoTitle: 'Bahia Palace & Saadian Tombs: Both in One Day (Half-Day Plan)',
    seoDesc: 'Yes, you can visit both in half a day. Exact timing, best order, what to see, ticket prices for each, and where to eat between Bahia Palace and Saadian Tombs.',
    coverImage: '/images/gallery/bahia-palace-bahia-inscription-arch-zellige-garden.jpg',
    content: `<p>Yes — and it's one of the best half-days you can spend in Marrakech. Bahia Palace and the Saadian Tombs are <strong>7 minutes apart on foot</strong>. They offer completely different architectural experiences, and together they cover 400 years of Moroccan history across a single compact route in the southern medina. Here's exactly how to do it.</p>

<h2>Distance Between the Two Sites</h2>
<ul>
  <li><strong>Walking time:</strong> 7–10 minutes between the two entrances</li>
  <li><strong>Distance:</strong> approximately 650 meters</li>
  <li>The route: from Bahia Palace, head south through the Mellah, following signs for the Saadian Tombs — they're well posted</li>
</ul>

<h2>Quick Overview of Each Site</h2>
<h3>Bahia Palace</h3>
<p>A 19th-century royal palace covering 8,000 square meters — grand courtyards, harem quarters, painted cedar ceilings, zellige tilework, and gardens. Built by Grand Vizier Ba Ahmed between 1894 and 1900. Entry: <strong>70 MAD</strong>. Time needed: <strong>60–90 minutes</strong>.</p>
<h3>Saadian Tombs</h3>
<p>A 16th-century royal mausoleum built for the Saadian dynasty under Sultan Ahmad al-Mansur. Three chambers of extraordinary carved plasterwork and zellige surround the tombs of 66 members of the royal family. Sealed by Sultan Moulay Ismail in the 17th century and only rediscovered in 1917. Entry: <strong>70 MAD</strong>. Time needed: <strong>30–45 minutes</strong>.</p>

<h2>Which to Visit First?</h2>
<p><strong>Start with Bahia Palace.</strong></p>
<p>Here's the logic: Bahia Palace opens at 9:00 AM and the first 90 minutes are the quietest of the day. The Saadian Tombs also open at 9:00 AM but are a smaller site — they absorb crowds better than the palace's single ticket window queue. Starting at Bahia Palace means you get the larger, more complex site when it's emptiest and move to the tombs when the palace is getting crowded.</p>
<p>The other reason: Bahia Palace takes longer. If you do the tombs first and rush to finish, you're leaving the palace when tour groups have already arrived. The correct order is palace first, tombs second.</p>

<h2>Half-Day Itinerary: Timings</h2>
<table>
  <thead><tr><th>Time</th><th>Activity</th></tr></thead>
  <tbody>
    <tr><td><strong>08:50</strong></td><td>Arrive at Bahia Palace (before gates open). Skip-the-line ticket holders go straight to the entrance.</td></tr>
    <tr><td><strong>09:00</strong></td><td>Enter. Start with the Grand Riad, work through the reception rooms, harem quarters, and gardens.</td></tr>
    <tr><td><strong>10:30</strong></td><td>Exit Bahia Palace. Walk south 7 minutes to Saadian Tombs.</td></tr>
    <tr><td><strong>10:40</strong></td><td>Enter Saadian Tombs. See the Hall of Twelve Columns, the middle chamber, and the garden.</td></tr>
    <tr><td><strong>11:20</strong></td><td>Exit Saadian Tombs. Option: walk 10 minutes west to El Badi Palace ruins (70 MAD) for a third site.</td></tr>
    <tr><td><strong>12:00</strong></td><td>Lunch. Head back through the medina or toward Jemaa el-Fna.</td></tr>
  </tbody>
</table>
<p>Total time for both sites: approximately 2.5–3 hours including the walk between them. A comfortable half-day, done by noon.</p>

<h2>Ticket Prices for Both</h2>
<table>
  <thead><tr><th>Site</th><th>Adult (foreign)</th><th>Moroccan national</th><th>Children under 7</th></tr></thead>
  <tbody>
    <tr><td>Bahia Palace</td><td>70 MAD (~€7)</td><td>10 MAD</td><td>Free</td></tr>
    <tr><td>Saadian Tombs</td><td>70 MAD (~€7)</td><td>10 MAD</td><td>Free</td></tr>
    <tr><td><strong>Total</strong></td><td><strong>140 MAD (~€14)</strong></td><td>20 MAD</td><td>Free</td></tr>
  </tbody>
</table>
<p>Both sites are cash only at the door. Bring dirhams. If you've booked a <a href="/en/tickets/skip-the-line">skip-the-line ticket for Bahia Palace</a> online, you can pay by card for that — but have cash ready for the Saadian Tombs.</p>

<h2>Where to Eat Between the Two</h2>
<p>The walk between the sites passes through the Mellah (old Jewish quarter) and near Place des Ferblantiers. A few options:</p>
<ul>
  <li><strong>Skip eating between the two</strong> — at 90 minutes per site, you'll be done by noon. A proper lunch after both sites makes more sense than a rushed snack midway</li>
  <li><strong>Café near Place des Ferblantiers</strong> — several small cafés on and around the square offer mint tea and simple snacks; 15 MAD for tea, 30–50 MAD for a sandwich</li>
  <li><strong>Lunch after both:</strong> Head to Rue Riad Zitoun el Kedim on the way back toward Jemaa el-Fna — several good tagine restaurants at honest prices, 60–120 MAD for a main</li>
</ul>

<h2>Add El Badi Palace for a Full Morning</h2>
<p>If you have until 13:00, El Badi Palace is 10 minutes west of the Saadian Tombs. Entry is 70 MAD. The ruins are atmospheric — vast roofless halls, nesting storks, and a very different scale from the intimate tombs. It adds about 45 minutes and rounds out the southern medina's three major monuments in a single morning.</p>

<h2>Book Your Bahia Palace Ticket</h2>
<p>The queue at Bahia Palace's door is the single biggest threat to this itinerary. A 40-minute queue means you're arriving at the Saadian Tombs at 11:30, just as the crowds peak. <a href="/en/tickets/skip-the-line">Book a skip-the-line ticket for Bahia Palace</a> in advance. The Saadian Tombs don't currently offer online booking — arrive early and the queue moves quickly.</p>

<h2>Frequently Asked Questions</h2>
<h3>Are the Saadian Tombs and Bahia Palace near each other?</h3>
<p>Yes — they are approximately 650 meters apart, a 7–10 minute walk through the southern medina. The route is straightforward: exit Bahia Palace, head south through the Mellah district, and follow the signs for the Saadian Tombs. They're well posted.</p>
<h3>Which is better — the Saadian Tombs or Bahia Palace?</h3>
<p>They're not really comparable — they offer different things. The Saadian Tombs are smaller, more concentrated, and intensely detailed in a small space. Bahia Palace is vast, varied, and architectural in scope. If you only have time for one, Bahia Palace offers more variety and a longer, richer experience. If you have 2–3 hours, do both — they complement each other perfectly.</p>
<h3>Do I need to book tickets for the Saadian Tombs in advance?</h3>
<p>There is no official advance booking system for the Saadian Tombs — tickets are purchased at the entrance (70 MAD cash). The queue is usually shorter than Bahia Palace's and moves faster, as the site is smaller. Arriving before 10:00 AM keeps the wait minimal. For Bahia Palace, an advance <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> is strongly recommended in high season.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 8. Is Bahia Palace Worth Visiting?
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Is Bahia Palace Worth Visiting? An Honest 2026 Review',
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'en',
    category: 'reviews',
    tags: 'is bahia palace worth visiting,bahia palace review,bahia palace honest opinion,should i visit bahia palace',
    excerpt: 'An honest review of Bahia Palace in 2026: what genuinely impresses, what disappoints some visitors, who it\'s perfect for, and who might prefer something else.',
    seoTitle: 'Is Bahia Palace Worth Visiting? Honest Review 2026',
    seoDesc: 'Honest 2026 review of Bahia Palace Marrakech: what impresses, what disappoints, who it\'s perfect for, and whether the ticket price is justified.',
    coverImage: '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg',
    content: `<p><strong>Short answer: yes, without hesitation — for the right visitor.</strong> Bahia Palace is one of the finest pieces of 19th-century Islamic architecture in Morocco, and walking through it without prior knowledge still impresses. With context, it's exceptional. Here's the honest version.</p>

<h2>What's Genuinely Impressive</h2>
<h3>The Scale</h3>
<p>Most visitors underestimate it. They expect a riad-sized palace and find 8,000 square meters of interconnected courtyards, reception halls, harem quarters, and gardens. The Grand Riad alone — 1,500 square meters of zellige tilework under open sky — stops people mid-stride. This doesn't happen often in a medina where you've been walking through shoulder-width alleys for an hour.</p>
<h3>The Craftwork</h3>
<p>The hand-painted cedar ceilings are legitimately extraordinary. 300 craftsmen from Fez worked on this building between 1894 and 1900, and their work shows. No two ceiling panels are identical. The mineral pigments — blues, golds, reds, terracottas — have barely faded in 125 years. The zellige tilework, the carved stucco arabesque panels, the Carrara marble columns: every material is high quality and in good condition. You're looking at the best version of what Moroccan craft could produce at its peak.</p>
<h3>The Gardens</h3>
<p>The gardens behind the formal rooms are planted with jasmine, roses, orange trees, banana trees, and cypress. In spring, the scent is remarkable. In summer, they're a genuine retreat from the heat. Most visitors spend five minutes in the garden on the way out; the people who sit here for twenty minutes consistently describe it as their favourite part of the visit.</p>
<h3>The Story</h3>
<p>A man born into slavery who became the most powerful person in Morocco, built the finest private palace in the country, and died to have it stripped bare overnight by the Sultan he'd served. This is a genuinely compelling story and it makes everything you look at more meaningful. The rooms are empty — but the reason they're empty is part of what makes the palace interesting.</p>

<h2>What Some Visitors Find Disappointing</h2>
<h3>No Furniture or Objects</h3>
<p>This is the most common complaint. The rooms are architecturally spectacular but empty — no original furniture, carpets, silverware, or decorative objects remain. When Ba Ahmed died in 1900, Sultan Abdelaziz had everything stripped out immediately. Visitors expecting a furnished, lived-in palace are sometimes underwhelmed. Knowing this in advance changes the experience: you're visiting a shell, but it's a shell of extraordinary quality.</p>
<h3>Crowds at Midday</h3>
<p>Between 10:30 and 14:00, the Grand Riad fills with overlapping tour groups. The narrow corridors between sections get congested. It's still worth visiting during these hours, but it's a noticeably different experience from a 9:00 AM visit. This is a management problem rather than a problem with the palace itself — and it's entirely avoidable with good timing.</p>
<h3>Limited English Signage</h3>
<p>The labelling inside the palace is sparse. Without context, some of the more elaborate rooms look similar to each other and visitors can miss significance they'd otherwise notice. An audio guide (available at the entrance) or reading this blog before you go solves this entirely.</p>

<h2>How It Compares to Other Marrakech Sites</h2>
<table>
  <thead><tr><th>Site</th><th>What it offers</th><th>Time needed</th><th>Entry fee</th></tr></thead>
  <tbody>
    <tr><td>Bahia Palace</td><td>Architecture, scale, history, gardens</td><td>75–90 min</td><td>70 MAD</td></tr>
    <tr><td>Saadian Tombs</td><td>Concentrated ornate detail, history</td><td>30–40 min</td><td>70 MAD</td></tr>
    <tr><td>El Badi Palace</td><td>Atmospheric ruins, scale, storks</td><td>45 min</td><td>70 MAD</td></tr>
    <tr><td>Majorelle Garden</td><td>Botanical, colour, design heritage</td><td>45–60 min</td><td>150 MAD</td></tr>
    <tr><td>Ben Youssef Madrasa</td><td>Islamic architecture, zellige, courtyard</td><td>45 min</td><td>70 MAD</td></tr>
  </tbody>
</table>
<p>At 70 MAD, Bahia Palace is the same price as the Saadian Tombs and El Badi Palace but offers significantly more content. Compared to Majorelle Garden (150 MAD), it offers more substance per dirham for visitors primarily interested in cultural heritage.</p>

<h2>Who It's Perfect For</h2>
<ul>
  <li><strong>History enthusiasts</strong> — the story of Ba Ahmed and the collapse of his power is one of the most dramatic in Moroccan history; the palace is the physical embodiment of it</li>
  <li><strong>Architecture and design lovers</strong> — the craftwork is the main attraction and it's in exceptional condition</li>
  <li><strong>Photographers</strong> — zellige floors, carved ceilings, courtyard geometry, and garden light give you a huge range of subjects in a compact area</li>
  <li><strong>First-time visitors to Morocco</strong> — Bahia Palace is the best single introduction to traditional Moroccan architecture and the country's recent political history</li>
  <li><strong>Families with children</strong> — open spaces, visual variety, and children under 7 enter free</li>
</ul>

<h2>Who Might Prefer Something Else</h2>
<ul>
  <li><strong>Visitors expecting a furnished, decorated interior</strong> like a European palace or stately home — the empty rooms will disappoint without prior context about why they're empty</li>
  <li><strong>People with very limited time</strong> who only have 30 minutes — the palace rewards slower exploration; a 30-minute dash leaves most of it unseen</li>
  <li><strong>Visitors primarily interested in gardens and botany</strong> — the palace gardens are pleasant but Majorelle Garden is more remarkable for this specific interest</li>
</ul>

<h2>The Verdict</h2>
<p>At 70 MAD and 90 minutes, Bahia Palace represents excellent value for what it delivers. The architecture is genuinely world-class. The story behind it is genuinely compelling. The main variable is how you engage with it — knowing the history and what to look for transforms a pleasant walk-through into a memorable experience.</p>
<p>Arrive early, read up beforehand (or use the audio guide), and skip the queue. Those three things — timing, context, and a <a href="/en/tickets/skip-the-line">pre-booked ticket</a> — are the difference between "nice palace" and "one of the highlights of Morocco."</p>

<h2>Frequently Asked Questions</h2>
<h3>Is Bahia Palace worth it for non-history lovers?</h3>
<p>Yes. You don't need to be a history enthusiast to be impressed by Bahia Palace. The architectural quality and the scale of the Grand Riad are visually striking even without context. That said, knowing the story of Ba Ahmed — a slave who became the most powerful man in Morocco — makes the visit significantly richer. Five minutes of reading before you go is well worth the investment.</p>
<h3>Is 70 MAD good value for Bahia Palace?</h3>
<p>Yes. 70 MAD is approximately €7 or $7.50. For that price you get 8,000 square meters of exceptional Moroccan architecture, 90 minutes of exploration, and access to one of the country's most significant cultural heritage sites. It's the same price as the Saadian Tombs and cheaper than Majorelle Garden, while offering more content than either.</p>
<h3>What's the best way to prepare for a visit to Bahia Palace?</h3>
<p>Read a brief account of Ba Ahmed ibn Moussa's story before you visit — this blog's <a href="/en/blog/bahia-palace-history">history article</a> covers it in full. Know that the rooms are intentionally empty (the reason is part of the story). Arrive at 9:00 AM for the best light and fewest crowds. Book your <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> in advance so you're inside within minutes of arriving.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 9. Marrakech 2-Day Itinerary
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Marrakech in 2 Days: The Perfect Itinerary Including Bahia Palace',
    slug: 'marrakech-2-day-itinerary',
    locale: 'en',
    category: 'itineraries',
    tags: 'marrakech 2 day itinerary,2 days in marrakech,marrakech weekend itinerary,what to do marrakech 48 hours',
    excerpt: '2 days in Marrakech: a complete hour-by-hour itinerary covering Bahia Palace, Saadian Tombs, Jemaa el-Fna, Majorelle Garden, and the souks. With real prices and practical tips.',
    seoTitle: 'Marrakech in 2 Days: Perfect Itinerary Including Bahia Palace',
    seoDesc: '2 days in Marrakech: hour-by-hour itinerary covering Bahia Palace, Saadian Tombs, Majorelle Garden, the souks, and Jemaa el-Fna. With real prices and tips.',
    coverImage: '/images/gallery/bahia-palace-rooftop-tower-dome-zellige-tiles.jpg',
    content: `<p>Two days is enough to see the best of Marrakech without rushing — the medina monuments, the garden escapes, the souks, and Jemaa el-Fna at night. This itinerary gives you real timings, honest prices, and a sequence that makes logistical sense so you're not backtracking across the city unnecessarily.</p>

<h2>Day 1 Morning: Bahia Palace + Saadian Tombs</h2>
<h3>08:50 — Arrive at Bahia Palace</h3>
<p>Get there before the 9:00 AM opening. If you've booked a <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> online, you walk straight to the entrance when the gates open. If not, join the ticket queue — it's shortest right at opening.</p>
<p><strong>Inside the palace:</strong> Start with the Grand Riad courtyard, work through the reception rooms, spend time in the harem quarters, and finish in the gardens. See the <a href="/en/blog/bahia-palace-room-by-room-guide">room-by-room guide</a> for exactly what to look for in each section. Budget 75–90 minutes.</p>
<p><strong>What to notice:</strong> The hand-painted cedar ceilings — no two panels are identical. The zellige floor patterns in the Grand Riad. The scale of the main courtyard (1,500 square meters) relative to what you've been walking through in the medina.</p>

<h3>10:30 — Walk to Saadian Tombs (7 minutes)</h3>
<p>Head south from Bahia Palace through the Mellah district. Follow the signs — they're in French and Arabic and well-placed. The Saadian Tombs entrance is on a small lane just past the Moulay El Yazid Mosque.</p>
<p><strong>Inside the tombs:</strong> Three chambers surround the burial plots of 66 members of the Saadian royal family. The Hall of Twelve Columns is the highlight — Italian marble columns, carved plaster at its most intricate, and an atmosphere that is genuinely different from Bahia Palace's grandeur. The site was sealed in the 17th century and not rediscovered until 1917. Budget 35–45 minutes. Entry: 70 MAD cash.</p>

<h3>11:30 — Optional: El Badi Palace (10 min walk)</h3>
<p>If you have the energy and time, El Badi Palace is worth 45 minutes. Head west from the Saadian Tombs toward Place des Ferblantiers. The ruins of this once-magnificent 16th-century palace are now open roofless grounds with nesting storks and an atmosphere unlike anything else in the medina. Entry: 70 MAD.</p>

<h2>Day 1 Afternoon: Medina Souks</h2>
<h3>12:30 — Lunch</h3>
<p>Head back through the medina toward Jemaa el-Fna. Along Rue Riad Zitoun el Kedim, several small restaurants serve tagines and couscous at honest prices (60–100 MAD for a main). Alternatively, the rooftop restaurants on the north side of Jemaa el-Fna give you views over the square while you eat.</p>
<h3>14:00 — The Souks</h3>
<p>Enter the main souk area north of Jemaa el-Fna. The relevant sections:</p>
<ul>
  <li><strong>Souk Smarine</strong> — the main covered souk; leather goods, textiles, and lanterns</li>
  <li><strong>Souk Cherratine</strong> — the leather workers' quarter; bags, belts, shoes</li>
  <li><strong>Souk Sabbaghin</strong> — the dyers' souk; dyed wool hanging to dry in vivid colours</li>
  <li><strong>Rahba Kedima (Spice Square)</strong> — herbs, spices, and a hard sell from the vendors</li>
</ul>
<p>Allow 90 minutes to walk through without specific shopping intention. If you're buying, add time. Negotiate everything — the opening price in tourist-facing souks is typically 2–3x the fair price. Start at 30% of what's quoted and meet somewhere in the middle.</p>

<h2>Day 1 Evening: Jemaa el-Fna at Night</h2>
<h3>18:00 — Return to Jemaa el-Fna</h3>
<p>The square transforms completely at dusk. Storytellers, musicians, acrobats, and food stall operators all appear simultaneously. The energy is loud, chaotic, and completely unlike anything you'll find elsewhere.</p>
<p><strong>Practical:</strong> Keep your bags in front of you — pickpocketing targets distracted tourists in the crowd. The food stalls on the square (numbered 1–100) are safe to eat from. Grilled meats, harira soup, snails, and fresh-squeezed orange juice are the main options. A full meal at a stall costs 80–150 MAD.</p>
<p>The rooftop restaurants surrounding the square offer the same view with a more relaxed setting and menu. Better for groups; the stalls are more fun for solo travellers and couples.</p>

<h2>Day 2 Morning: Majorelle Garden + YSL Museum</h2>
<h3>09:00 — Majorelle Garden</h3>
<p>Book your Majorelle Garden ticket online before you go — the walk-in queue is brutal in high season. Entry is 150 MAD for the garden, or 200 MAD with the Berber Museum. The famous cobalt blue villa against lush greenery, the cactus collection, and the lotus ponds make it one of the most photographed places in Morocco.</p>
<p>Budget 60–75 minutes for the garden. The YSL Museum next door (separate ticket, 100 MAD) is worth an additional 45 minutes if you have an interest in fashion or design. The memorial garden where Yves Saint Laurent's ashes were scattered is quiet and moving.</p>
<h3>10:30 — Gueliz Neighbourhood</h3>
<p>Majorelle sits in Gueliz — Marrakech's French-built new town. It's a different city from the medina: wide boulevards, European café architecture, and a noticeably lower-pressure atmosphere. Walk the main street (Avenue Mohammed V) for 20 minutes and have a coffee at one of the European-style cafés.</p>

<h2>Day 2 Afternoon: Shopping and the Ben Youssef Madrasa</h2>
<h3>12:00 — Lunch in Gueliz</h3>
<p>The restaurant options in Gueliz are better value and less tourist-oriented than Jemaa el-Fna. A good local tagine restaurant in this area costs 80–130 MAD for a main. Ask your accommodation for a specific recommendation — the good ones are known locally.</p>
<h3>14:00 — Ben Youssef Madrasa</h3>
<p>A 14th-century Quranic school in the northern medina and one of the finest examples of Islamic architecture in Morocco. Three floors of carved stucco and zellige surround a central courtyard — more intimate than Bahia Palace, more accessible than the Saadian Tombs. Entry 70 MAD. Budget 45 minutes.</p>
<h3>15:00 — Final Souk Pass or Rest</h3>
<p>The area around Ben Youssef Madrasa has some of the better craft shops in Marrakech — less tourist-oriented than the main souk strip. Pottery, leather, and textile workshops in this area sell at more realistic prices with less pressure.</p>

<h2>Day 2 Evening: Rooftop Dinner</h2>
<h3>19:00 — Rooftop Dinner</h3>
<p>Marrakech has excellent rooftop restaurants within the medina. A typical riad dinner with a set menu costs 200–400 MAD per person including a starter, main, dessert, and mint tea. Book in advance — the best ones fill up, particularly in spring and autumn.</p>
<p>Alternatively, return to Jemaa el-Fna for a second night at the stalls — the square is different every night, and the experience of watching the city wind down after dark is worth repeating.</p>

<h2>Practical Tips</h2>
<ul>
  <li><strong>Transport:</strong> Most of this itinerary is walkable within the medina. Use petit taxis for the 3 km trip between the medina and Gueliz/Majorelle — agree on the fare before getting in (20–35 MAD is fair)</li>
  <li><strong>Budget per person (excluding accommodation):</strong> Bahia Palace 70 MAD + Saadian Tombs 70 MAD + Majorelle 150 MAD + Ben Youssef 70 MAD + food 400–600 MAD per day = approximately 800–1,000 MAD (~€80–100) per person for 2 days of activities and meals</li>
  <li><strong>Cash:</strong> All monument ticket windows are cash only. Have dirhams available at all times — ATMs inside the medina are limited</li>
  <li><strong>Safety:</strong> Marrakech is safe for tourists. The main irritant is unsolicited "guides" near the monuments — a firm "no thank you" repeated once is enough. Don't follow anyone who approaches you unsolicited</li>
  <li><strong>Heat:</strong> In summer (June–September), schedule outdoor activities before 11:00 AM and after 17:00. The medina's covered lanes provide shade but the heat is real</li>
</ul>

<h2>Book Your Bahia Palace Ticket</h2>
<p>The opening of Day 1 sets the tone for the entire 2-day trip. A 40-minute queue at Bahia Palace turns a perfect morning into a rushed one. <a href="/en/tickets/skip-the-line">Book your skip-the-line ticket</a> before you travel and walk straight in at 9:00 AM. It's the best single investment you can make for this itinerary.</p>

<h2>Frequently Asked Questions</h2>
<h3>Is 2 days enough for Marrakech?</h3>
<p>Two days is enough to see the main highlights without feeling overwhelmed — Bahia Palace, Saadian Tombs, Majorelle Garden, Ben Youssef Madrasa, the souks, and Jemaa el-Fna. It doesn't leave time for day trips (Atlas Mountains, Essaouira) or deeper exploration of the medina. A third day adds significantly more breathing room.</p>
<h3>What's the best season for a 2-day Marrakech trip?</h3>
<p>March–May and September–November are the best months — temperatures are comfortable (20–26°C), all sites are open, and the city is active without summer's extreme heat. December–February is quiet and cool but pleasant. July–August is hot (38–42°C) but manageable if you stay in shade and start early.</p>
<h3>How much does 2 days in Marrakech cost?</h3>
<p>Accommodation varies enormously (50–500 MAD per night for a riad, 500–2000 MAD for a higher-end option). Activities for 2 days total roughly 500–600 MAD per person for the main monuments. Food costs 300–500 MAD per person per day depending on where you eat. Total budget excluding flights: approximately 1,200–2,500 MAD (~€120–250) per person for 2 days.</p>`,
  },

  // ─────────────────────────────────────────────────────────────
  // 10. Audio Guide
  // ─────────────────────────────────────────────────────────────
  {
    title: 'Bahia Palace Audio Guide: Do You Need One?',
    slug: 'bahia-palace-audio-guide',
    locale: 'en',
    category: 'practical',
    tags: 'bahia palace audio guide,bahia palace guide,bahia palace self guided tour,bahia palace tour',
    excerpt: 'Is there an official audio guide at Bahia Palace? What does it cost, what does it cover, and is it worth hiring? Honest comparison of all your options.',
    seoTitle: 'Bahia Palace Audio Guide: Is It Worth It? (2026)',
    seoDesc: 'Is there an official audio guide at Bahia Palace? Cost, what it covers, and whether it\'s worth it — plus free alternatives for a self-guided visit.',
    coverImage: '/images/gallery/bahia-palace-zellige-mosaic-arabic-calligraphy-stucco.jpg',
    content: `<p>Bahia Palace has no English signage worth speaking of inside. The rooms are stunning but empty, and without context, a lot of what you're looking at loses meaning. The question every visitor faces: do you hire the audio guide, book a guided tour, or go in armed with your own research? Here's everything you need to make that decision.</p>

<h2>Is There an Official Audio Guide at Bahia Palace?</h2>
<p><strong>Yes — but with caveats.</strong> Bahia Palace offers an audio guide for hire at the entrance. However, availability and quality are not guaranteed to be consistent:</p>
<ul>
  <li>The audio guide is available in French, English, Arabic, and Spanish (availability of specific languages varies)</li>
  <li>The devices are the classic handheld type — you enter a number at each marked point in the palace to hear the relevant commentary</li>
  <li>The commentary covers the main courtyards, the history of Si Moussa and Ba Ahmed, and the key architectural features</li>
  <li>It does <em>not</em> cover every room — several of the smaller sections and the gardens are not narrated</li>
</ul>

<h2>What the Audio Guide Covers</h2>
<p>Based on the standard audio guide available:</p>
<ul>
  <li>Overview of the palace's history — Si Moussa's original construction and Ba Ahmed's expansion</li>
  <li>The Grand Riad: architectural features, the marble columns, the painted gallery ceiling</li>
  <li>The Council Room: the painted cedar ceiling, the significance of the space as Ba Ahmed's reception hall</li>
  <li>The harem quarters: social context of the women's apartments, the hierarchy of room placement</li>
  <li>General information on zellige tilework, carved stucco, and zouak (painted cedar) techniques</li>
</ul>
<p>What it doesn't cover well: the smaller courtyards, the gardens, and the later history of the palace under the French protectorate. For these, you're on your own.</p>

<h2>Cost of the Audio Guide</h2>
<p>The audio guide typically costs <strong>50–70 MAD</strong> at the entrance — though the price can vary and is not always clearly posted. Pay in cash (as with the entrance ticket). A deposit may be required for the device.</p>
<p>Combined with the entrance fee of 70 MAD, you're looking at approximately <strong>120–140 MAD total</strong> for entry + audio guide.</p>

<h2>Guided Tour vs Audio Guide vs Self-Guided: Comparison</h2>
<table>
  <thead>
    <tr><th></th><th>Guided Tour</th><th>Audio Guide</th><th>Self-Guided</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Cost</strong></td><td>150–300 MAD extra</td><td>50–70 MAD extra</td><td>Free</td></tr>
    <tr><td><strong>Depth of information</strong></td><td>High — interactive, Q&amp;A</td><td>Medium — pre-recorded</td><td>Depends on your prep</td></tr>
    <tr><td><strong>Flexibility</strong></td><td>Low — fixed pace</td><td>High — go at your own pace</td><td>Complete</td></tr>
    <tr><td><strong>Language options</strong></td><td>English, French, Spanish (varies)</td><td>English, French, Arabic, Spanish</td><td>Any</td></tr>
    <tr><td><strong>Photography</strong></td><td>Harder — group pace</td><td>Easy — stop whenever</td><td>Complete freedom</td></tr>
    <tr><td><strong>Best for</strong></td><td>Deep history interest, no prep</td><td>Some context, own pace</td><td>Pre-read visitors, photographers</td></tr>
  </tbody>
</table>

<h2>Recommendation by Visitor Type</h2>
<p><strong>Book a guided tour if:</strong> You're a serious history or architecture enthusiast who wants to understand everything you're seeing, you haven't read anything about the palace beforehand, and you're happy to move at the guide's pace rather than your own. A good licensed guide brings the Ba Ahmed story to life in a way no audio track does.</p>
<p><strong>Hire the audio guide if:</strong> You want some context without being tied to a group, you're comfortable moving at your own pace, and you don't want to do prep work beforehand. The audio guide is the middle-ground option — better than nothing, less than a live guide.</p>
<p><strong>Go self-guided if:</strong> You've read the history of Ba Ahmed and Si Moussa (the <a href="/en/blog/bahia-palace-history">full history article</a> on this site covers everything), you know what to look for in each room, and you want complete flexibility — particularly important if you're a photographer who wants to linger for specific shots without a guide's schedule.</p>

<h2>Free Alternatives to the Audio Guide</h2>
<p>If you'd rather save the 50–70 MAD and go in informed:</p>
<ul>
  <li><strong>This site's blog</strong> — the <a href="/en/blog/bahia-palace-history">history article</a> and <a href="/en/blog/bahia-palace-room-by-room-guide">room-by-room guide</a> together take about 15 minutes to read and cover everything the audio guide does, plus more</li>
  <li><strong>Wikipedia's Bahia Palace article</strong> — a reasonable summary of the history with references to primary sources</li>
  <li><strong>YouTube</strong> — several documentary-style walk-through videos of the palace are available in English; watching one the evening before your visit gives you good visual context</li>
</ul>
<p>The honest assessment: 20 minutes of reading before your visit is as effective as the audio guide for most people, and it leaves your hands free and your pace entirely your own.</p>

<h2>Book Your Visit</h2>
<p>Whether you go guided, with an audio track, or fully self-directed, the most important booking is your entry ticket. <a href="/en/tickets/skip-the-line">Book a skip-the-line ticket</a> in advance — the queue at the entrance booth is where most of the unnecessary time gets lost, regardless of which guide option you choose. Walk straight in, spend your time inside the palace.</p>

<h2>Frequently Asked Questions</h2>
<h3>Can I hire a guide at the entrance to Bahia Palace?</h3>
<p>Licensed local guides sometimes position themselves near the entrance and can be hired on the spot. Prices vary — agree before you start, and confirm the language and duration. Rates are typically 150–300 MAD for a 60–90 minute tour. Make sure the guide is licensed (they should carry an official guide card) — unlicensed "guides" around major monuments offer much lower quality.</p>
<h3>Is the Bahia Palace audio guide worth the money?</h3>
<p>At 50–70 MAD, it adds modest value if you're arriving without any preparation. It covers the main spaces competently in English, and for visitors who prefer listening to reading, it's a reasonable investment. For visitors willing to spend 15–20 minutes reading about the palace beforehand, the free self-guided option using the room-by-room guide on this site is equally effective and more flexible.</p>
<h3>Is there an app for a Bahia Palace audio guide?</h3>
<p>There is no official Bahia Palace app. Several general Marrakech travel apps include brief audio content about the palace, but nothing purpose-built with the depth of an on-site audio guide. The most effective digital preparation remains reading or watching video content before your visit, combined with using GPS navigation to get to the palace without getting lost in the medina.</p>`,
  },
];

async function main() {
  console.log(`Seeding ${posts.length} SEO blog articles...\n`);

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
        coverImage:  post.coverImage,
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
        coverImage:  post.coverImage,
        author:      'Bahia Palace Team',
        published:   true,
        publishedAt: NOW,
      },
    });
    console.log(`✓  ${post.title}`);
  }

  console.log(`\nDone — ${posts.length} articles live at /en/blog`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
