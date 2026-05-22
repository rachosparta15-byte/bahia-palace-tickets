const BASE = 'http://localhost:3001';

const tips = [
  {
    title: 'Fake Guides Near Bahia Palace Entrance',
    body: 'Men outside the entrance claim guiding is mandatory or offer a "free" tour. They demand 100–300 MAD at the end. Official guides wear a numbered badge from the Ministry of Tourism.\n\nBook your guide online before arriving. Walk past anyone who approaches you outside — the ticket booth is clearly marked inside the gate.',
    icon: 'guide', order: 1,
  },
  {
    title: 'Henna Trap in Marrakech Streets',
    body: 'Women near Jemaa el-Fna grab tourists hands and apply henna without asking, then demand 200–500 MAD. You did not agree to a price — yet saying no feels impossible once it is done.\n\nKeep your hands in your pockets in busy areas. If approached, say firmly "La shukran" (No thank you) and do not stop walking.',
    icon: 'scam', order: 2,
  },
  {
    title: 'Snake Charmers & Animal Photo Scam',
    body: 'Snake charmers place a snake or monkey on you for an unsolicited photo, then demand 150–300 MAD. Refusing after contact is very difficult.\n\nDo not approach or make eye contact with snake charmers unless you intend to pay. If you want a photo, agree on a price before anything touches you.',
    icon: 'scam', order: 3,
  },
  {
    title: 'Taxi Overcharging & Fake Meters',
    body: 'Unregistered taxis or drivers who forget to use the meter charge 5–10x the normal fare. The ride from the airport to the medina should cost 70–100 MAD maximum.\n\nAlways agree on the price before getting in, or insist the meter is used. Use official Petit Taxis (beige or red) and avoid drivers who approach you first.',
    icon: 'taxi', order: 4,
  },
  {
    title: 'Free Mint Tea = Pressure to Buy',
    body: 'Shop owners invite you in for free mint tea. Once seated, they bring out rugs, leather goods or spices and make leaving without buying feel rude or aggressive.\n\nYou owe nothing. Say "Merci, je regarde" (thank you, just looking) and leave. It is a sales technique, not genuine hospitality.',
    icon: 'shop', order: 5,
  },
  {
    title: 'Getting Lost in the Medina',
    body: 'The Marrakech medina has thousands of narrow unnamed alleys with no grid. Locals sometimes "help" you find your way then ask for money.\n\nDownload Google Maps offline before entering. Drop a pin at your riad entrance. If you need directions, ask inside a shop rather than men on the street.',
    icon: 'info', order: 6,
  },
  {
    title: 'Pickpockets at Jemaa el-Fna Square',
    body: 'The main square is crowded day and night, making it ideal for pickpockets. Bags on the back, hanging phones and open pockets are the main targets.\n\nWear a crossbody bag in front. Keep your phone in a front pocket. Do not leave valuables at outdoor café tables. Be extra vigilant after sunset.',
    icon: 'warning', order: 7,
  },
  {
    title: 'Restaurant Overcharging & Hidden Prices',
    body: 'Some restaurants show photo menus without prices, then charge tourists 3–5x local prices. Bread and olives brought automatically are often charged separately.\n\nAlways ask for a written menu with prices before ordering. Check that service and tax are included. Read recent Google Maps reviews before entering.',
    icon: 'money', order: 8,
  },
  {
    title: 'Currency Exchange Scams',
    body: 'Unofficial money changers offer better rates but shortchange you quickly or swap notes. Some return fake MAD bills mixed into the real ones.\n\nOnly use bank ATMs or official Bureau de Change offices. Never exchange money on the street. Count every bill before leaving the counter.',
    icon: 'money', order: 9,
  },
  {
    title: 'Photography: Always Ask First',
    body: 'Many people in the medina — performers, spice sellers, water sellers in traditional costume — demand payment after you photograph them, even from a distance.\n\nAlways ask permission before photographing people. Agree on a price if they expect payment. Do not photograph anyone near the palace interior.',
    icon: 'photo', order: 10,
  },
  {
    title: 'Drinking Water Safety in Marrakech',
    body: 'Tap water in Marrakech is technically treated but not recommended for tourists. Drinking it often causes stomach problems within 24–48 hours.\n\nDrink only bottled water (Sidi Ali or Ain Saiss). Use bottled water to brush your teeth if your stomach is sensitive. Avoid ice in drinks from street stalls.',
    icon: 'health', order: 11,
  },
  {
    title: 'Street Food Safety: What to Eat Safely',
    body: 'Jemaa el-Fna has dozens of food stalls at night. Meat left in the heat for hours is the main risk for food poisoning.\n\nChoose stalls busy with locals — high turnover means fresher food. Stick to freshly cooked items like kefta or harira soup. Avoid seafood far from the coast.',
    icon: 'health', order: 12,
  },
  {
    title: 'Dress Code: Respect the Local Culture',
    body: 'Marrakech is a Muslim city. Visiting the palace or medina in shorts or sleeveless tops draws unwanted attention and is considered disrespectful. Women especially may receive harassment.\n\nWear loose clothing covering shoulders and knees. A light scarf for women is very useful. You will be more comfortable and treated with more respect.',
    icon: 'dress', order: 13,
  },
  {
    title: 'Heat & Sun: The Invisible Danger',
    body: 'Marrakech regularly exceeds 40°C in summer. Tourists walking the medina for hours without protection frequently suffer heat exhaustion.\n\nVisit the palace early (9–10am) before peak heat. Carry at least 1.5L of water. Wear a hat and SPF 50+ sunscreen. Rest in the shade between 12pm and 3pm.',
    icon: 'health', order: 14,
  },
  {
    title: 'Horse & Carriage Overcharging',
    body: 'Calèches have official fixed rates (60–100 MAD for a circuit) but drivers quote 10x the amount to tourists without mentioning the real price.\n\nNegotiate the price and route before getting in. Ask "quel est le prix fixe?" (what is the fixed price?). Take a photo of the carriage number in case of disputes.',
    icon: 'taxi', order: 15,
  },
  {
    title: 'Solo Female Traveler Safety Tips',
    body: 'Marrakech is generally safe for solo women but verbal harassment in the medina is common — comments, following or persistent attention. It is rarely physical but can be exhausting.\n\nWalk confidently without making eye contact. If followed, enter any shop and ask the shopkeeper for help. Avoid the medina alone after 10pm.',
    icon: 'warning', order: 16,
  },
  {
    title: 'Fake Argan Oil & Counterfeit Spices',
    body: 'Some cooperatives selling argan oil or spices operate as tourist traps. You are shown a convincing production demonstration then pressured to buy at very high prices. Products are sometimes diluted or fake.\n\nBuy from certified cooperatives with official signage. Compare prices: pure 100ml argan oil should cost 80–150 MAD maximum.',
    icon: 'shop', order: 17,
  },
  {
    title: 'Airport Taxi Scams at Marrakech Menara',
    body: 'Unofficial drivers at Marrakech Menara Airport approach arrivals before the official taxi rank and charge 200–500 MAD for a 70–100 MAD ride, often claiming official taxis are unavailable.\n\nWalk past all drivers inside and go to the official taxi rank outside. Or arrange a hotel transfer in advance. Careem (ride-hailing) is available in Marrakech.',
    icon: 'taxi', order: 18,
  },
  {
    title: 'Children Begging & Street Sellers',
    body: 'Children selling tissues, bracelets or asking for money are common. Giving money directly to child beggars encourages families to keep children out of school.\n\nDo not give money to children on the street. If you want to help, donate to a verified local charity. You may buy from an adult seller rather than giving cash directly.',
    icon: 'info', order: 19,
  },
  {
    title: 'Emergency Numbers to Know in Marrakech',
    body: 'Police: 19 — Ambulance: 15 — Tourist Police (Brigade Touristique): +212 524 384 601. The brigade handles tourist complaints including scams and theft.\n\nSave these numbers before arriving. Keep a photo of your passport on your phone. The nearest hospital to the medina is Polyclinique du Sud on Rue de Yougoslavie.',
    icon: 'health', order: 20,
  },
];

let created = 0;
for (const tip of tips) {
  try {
    const res = await fetch(`${BASE}/api/admin/safety`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...tip, published: true }),
    });
    if (res.ok) {
      created++;
      console.log(`✓ [${tip.order}/20] ${tip.title}`);
    } else {
      const err = await res.json();
      console.log(`✗ [${tip.order}] ${tip.title} — ${err.error}`);
    }
  } catch (e) {
    console.log(`✗ Network error on tip ${tip.order}`);
  }
}
console.log(`\nDone: ${created}/20 tips created.`);
