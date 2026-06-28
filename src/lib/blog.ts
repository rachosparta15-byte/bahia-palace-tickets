export type BlogCategory = 'visit-tips' | 'history' | 'practical' | 'comparisons' | 'safety' | 'reviews' | 'guides' | 'itineraries';

export interface BlogPost {
  slug: string;
  locale: string;
  category: BlogCategory;
  title: string;
  excerpt: string;
  readTime: number;
  publishedAt: string;
  body: string[];
  tips?: string[];
}

const posts: BlogPost[] = [
  // ─── IS BAHIA PALACE WORTH VISITING ────────────────────────────────────────
  {
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'en',
    category: 'reviews',
    title: 'Is Bahia Palace Worth Visiting? An Honest 2026 Review',
    excerpt: 'An honest review of Bahia Palace in 2026: what genuinely impresses, what disappoints some visitors, who it\'s perfect for, and whether the ticket price is justified.',
    readTime: 7,
    publishedAt: '2026-01-20',
    body: [
      `<p><strong>Short answer: yes, without hesitation — for the right visitor.</strong> Bahia Palace is one of the finest pieces of 19th-century Islamic architecture in Morocco, and walking through it without prior knowledge still impresses. With context, it's exceptional. Here's the honest version.</p>

<h2>What's Genuinely Impressive</h2>
<h3>The Scale</h3>
<p>Most visitors underestimate it. They expect a riad-sized palace and find roughly 8,000 square meters of interconnected courtyards, reception halls, harem quarters, and gardens open to visitors. The Grand Riad alone — 1,500 square meters of zellige tilework under open sky — stops people mid-stride. This doesn't happen often in a medina where you've been walking through shoulder-width alleys for an hour.</p>
<h3>The Craftwork</h3>
<p>The hand-painted cedar ceilings are legitimately extraordinary. Thousands of skilled craftsmen from Fez worked on this building over multiple years, and their work shows. No two ceiling panels are identical. The mineral pigments — blues, golds, reds, terracottas — have barely faded in 125 years. The zellige tilework, the carved stucco arabesque panels, the Carrara marble columns: every material is high quality and in good condition. You're looking at the best version of what Moroccan craft could produce at its peak.</p>
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
<table><thead><tr><th>Site</th><th>What it offers</th><th>Time needed</th><th>Entry fee</th></tr></thead><tbody><tr><td>Bahia Palace</td><td>Architecture, scale, history, gardens</td><td>75–90 min</td><td>100 MAD</td></tr><tr><td>Saadian Tombs</td><td>Concentrated ornate detail, history</td><td>30–40 min</td><td>70 MAD</td></tr><tr><td>El Badi Palace</td><td>Atmospheric ruins, scale, storks</td><td>45 min</td><td>70 MAD</td></tr><tr><td>Majorelle Garden</td><td>Botanical, colour, design heritage</td><td>45–60 min</td><td>150 MAD</td></tr><tr><td>Ben Youssef Madrasa</td><td>Islamic architecture, zellige, courtyard</td><td>45 min</td><td>70 MAD</td></tr></tbody></table>
<p>At 100 MAD, Bahia Palace is priced higher than the Saadian Tombs and El Badi Palace (both 70 MAD) but offers significantly more content. Compared to Majorelle Garden (150 MAD), it offers more substance per dirham for visitors primarily interested in cultural heritage.</p>

<h2>Who It's Perfect For</h2>
<ul><li><strong>History enthusiasts</strong> — the story of Ba Ahmed and the collapse of his power is one of the most dramatic in Moroccan history; the palace is the physical embodiment of it</li><li><strong>Architecture and design lovers</strong> — the craftwork is the main attraction and it's in exceptional condition</li><li><strong>Photographers</strong> — zellige floors, carved ceilings, courtyard geometry, and garden light give you a huge range of subjects in a compact area</li><li><strong>First-time visitors to Morocco</strong> — Bahia Palace is the best single introduction to traditional Moroccan architecture and the country's recent political history</li><li><strong>Families with children</strong> — open spaces, visual variety, and children under 7 enter free</li></ul>

<h2>Who Might Prefer Something Else</h2>
<ul><li><strong>Visitors expecting a furnished, decorated interior</strong> like a European palace or stately home — the empty rooms will disappoint without prior context about why they're empty</li><li><strong>People with very limited time</strong> who only have 30 minutes — the palace rewards slower exploration; a 30-minute dash leaves most of it unseen</li><li><strong>Visitors primarily interested in gardens and botany</strong> — the palace gardens are pleasant but Majorelle Garden is more remarkable for this specific interest</li></ul>

<h2>The Verdict</h2>
<p>At 100 MAD and 90 minutes, Bahia Palace represents excellent value for what it delivers. The architecture is genuinely world-class. The story behind it is genuinely compelling. The main variable is how you engage with it — knowing the history and what to look for transforms a pleasant walk-through into a memorable experience.</p>
<p>Arrive early, read up beforehand (or use the audio guide), and skip the queue. Those three things — timing, context, and a <a href="/en/tickets/skip-the-line">pre-booked ticket</a> — are the difference between "nice palace" and "one of the highlights of Morocco."</p>

<h2>Frequently Asked Questions</h2>
<h3>Is Bahia Palace worth it for non-history lovers?</h3>
<p>Yes. You don't need to be a history enthusiast to be impressed by Bahia Palace. The architectural quality and the scale of the Grand Riad are visually striking even without context. That said, knowing the story of Ba Ahmed — a slave who became the most powerful man in Morocco — makes the visit significantly richer. Five minutes of reading before you go is well worth the investment.</p>
<h3>Is 100 MAD good value for Bahia Palace?</h3>
<p>Yes. 100 MAD is approximately €9 or $10. For that price you get roughly 8,000 square meters of exceptional Moroccan architecture open to visitors, 90 minutes of exploration, and access to one of the country's most significant cultural heritage sites. It's cheaper than Majorelle Garden (150 MAD) while offering more cultural content.</p>
<h3>What's the best way to prepare for a visit to Bahia Palace?</h3>
<p>Read a brief account of Ba Ahmed ibn Moussa's story before you visit — this blog's <a href="/en/blog/bahia-palace-history">history article</a> covers it in full. Know that the rooms are intentionally empty (the reason is part of the story). Arrive at 9:00 AM for the best light and fewest crowds. Book your <a href="/en/tickets/skip-the-line">skip-the-line ticket</a> in advance so you're inside within minutes of arriving.</p>`,
    ],
  },
  {
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'fr',
    category: 'reviews',
    title: 'Bahia Palace vaut-il le détour ? Avis honnête 2026',
    excerpt: 'Un avis honnête sur Bahia Palace en 2026 : ce qui impressionne vraiment, ce qui déçoit certains visiteurs, pour qui c\'est parfait, et qui pourrait préférer autre chose.',
    readTime: 7,
    publishedAt: '2026-01-20',
    body: [
      `<p><strong>Réponse courte : oui, sans hésitation — pour le bon visiteur.</strong> Bahia Palace est l'un des plus beaux exemples d'architecture islamique du XIXe siècle au Maroc, et le parcourir sans connaissance préalable impressionne déjà. Avec du contexte, c'est exceptionnel. Voici la version honnête.</p>

<h2>Ce qui est vraiment impressionnant</h2>
<h3>L'échelle</h3>
<p>La plupart des visiteurs la sous-estiment. Ils s'attendent à un palais de la taille d'un riad et trouvent environ 8 000 mètres carrés de cours interconnectées, salles de réception, appartements du harem et jardins ouverts aux visiteurs. Le Grand Riad seul — 1 500 mètres carrés de zellige sous ciel ouvert — arrête les gens en pleine marche. Ça n'arrive pas souvent dans une medina où l'on se faufile depuis une heure dans des ruelles larges d'une épaule.</p>
<h3>L'artisanat</h3>
<p>Les plafonds en cèdre peints à la main sont légitimement extraordinaires. Des milliers d'artisans qualifiés de Fès ont travaillé sur ce bâtiment pendant de nombreuses années, et leur travail se voit. Aucun panneau de plafond n'est identique. Les pigments minéraux — bleus, ors, rouges, terres cuites — ont à peine pâli en 125 ans. Le zellige, les panneaux d'arabesques en stuc sculpté, les colonnes en marbre de Carrare : chaque matériau est de haute qualité et en bon état.</p>
<h3>Les jardins</h3>
<p>Les jardins derrière les salles formelles sont plantés de jasmin, roses, orangers, bananiers et cyprès. Au printemps, le parfum est remarquable. En été, c'est un vrai refuge contre la chaleur. La plupart des visiteurs passent cinq minutes dans le jardin en sortant ; ceux qui y restent vingt minutes le décrivent systématiquement comme leur partie préférée de la visite.</p>
<h3>L'histoire</h3>
<p>Un homme né esclave, devenu la personne la plus puissante du Maroc, ayant construit le plus beau palais privé du pays, et mort pour le voir pillé en une nuit par le Sultan qu'il avait servi. C'est une histoire véritablement fascinante qui rend tout ce que vous regardez plus significatif.</p>

<h2>Ce que certains visiteurs trouvent décevant</h2>
<h3>Pas de meubles ni d'objets</h3>
<p>C'est la plainte la plus courante. Les pièces sont architecturalement spectaculaires mais vides — aucun meuble original, tapis, argenterie ou objet décoratif ne subsiste. À la mort de Ba Ahmed en 1900, le Sultan Abdelaziz a tout fait enlever immédiatement.</p>
<h3>Les foules à la mi-journée</h3>
<p>Entre 10h30 et 14h00, le Grand Riad se remplit de groupes touristiques qui se chevauchent. Les couloirs étroits entre les sections deviennent encombrés. C'est entièrement évitable avec un bon timing.</p>
<h3>Peu de signalétique</h3>
<p>Le balisage à l'intérieur du palais est rudimentaire. Un audioguide (disponible à l'entrée) ou la lecture de ce blog avant votre visite résout entièrement ce problème.</p>

<h2>Comparaison avec d'autres sites de Marrakech</h2>
<table><thead><tr><th>Site</th><th>Ce qu'il offre</th><th>Temps nécessaire</th><th>Entrée</th></tr></thead><tbody><tr><td>Bahia Palace</td><td>Architecture, échelle, histoire, jardins</td><td>75–90 min</td><td>100 MAD</td></tr><tr><td>Tombeaux Saadiens</td><td>Détail ornemental concentré, histoire</td><td>30–40 min</td><td>70 MAD</td></tr><tr><td>El Badi Palace</td><td>Ruines atmosphériques, échelle, cigognes</td><td>45 min</td><td>70 MAD</td></tr><tr><td>Jardin Majorelle</td><td>Botanique, couleur, patrimoine design</td><td>45–60 min</td><td>150 MAD</td></tr><tr><td>Medersa Ben Youssef</td><td>Architecture islamique, zellige, cour</td><td>45 min</td><td>70 MAD</td></tr></tbody></table>
<p>À 100 MAD, Bahia Palace est plus cher que les Tombeaux Saadiens et El Badi Palace (tous les deux 70 MAD) mais offre nettement plus de contenu. Comparé au Jardin Majorelle (150 MAD), il offre plus de substance par dirham pour les visiteurs principalement intéressés par le patrimoine culturel.</p>

<h2>Pour qui c'est parfait</h2>
<ul><li><strong>Les passionnés d'histoire</strong> — l'histoire de Ba Ahmed et l'effondrement de son pouvoir est l'une des plus dramatiques de l'histoire marocaine</li><li><strong>Les amoureux de l'architecture et du design</strong> — l'artisanat est l'attraction principale et il est en état exceptionnel</li><li><strong>Les photographes</strong> — sols en zellige, plafonds sculptés, géométrie des cours et lumière des jardins</li><li><strong>Les premiers visiteurs au Maroc</strong> — Bahia Palace est la meilleure introduction unique à l'architecture marocaine traditionnelle</li><li><strong>Les familles avec enfants</strong> — espaces ouverts, variété visuelle, enfants de moins de 7 ans gratuits</li></ul>

<h2>Qui pourrait préférer autre chose</h2>
<ul><li><strong>Les visiteurs qui s'attendent à un intérieur meublé et décoré</strong> comme un palais européen — les pièces vides décevront sans contexte</li><li><strong>Les personnes ayant très peu de temps</strong> qui n'ont que 30 minutes — le palais récompense l'exploration lente</li><li><strong>Les visiteurs principalement intéressés par les jardins et la botanique</strong> — le Jardin Majorelle est plus remarquable pour cet intérêt</li></ul>

<h2>Le verdict</h2>
<p>À 100 MAD et 90 minutes, Bahia Palace représente une excellente valeur pour ce qu'il offre. L'architecture est véritablement de classe mondiale. L'histoire qui le sous-tend est véritablement captivante.</p>
<p>Arrivez tôt, renseignez-vous au préalable (ou utilisez l'audioguide), et évitez la queue. Ces trois éléments — le timing, le contexte et un <a href="/fr/tickets/skip-the-line">billet pré-réservé</a> — font la différence entre « joli palais » et « l'un des temps forts du Maroc ».</p>

<h2>Questions fréquemment posées</h2>
<h3>Bahia Palace vaut-il le détour pour les non-passionnés d'histoire ?</h3>
<p>Oui. Il n'est pas nécessaire d'être un passionné d'histoire pour être impressionné par Bahia Palace. La qualité architecturale et l'échelle du Grand Riad sont visuellement frappantes même sans contexte. Cinq minutes de lecture avant de partir valent largement l'investissement.</p>
<h3>100 MAD, est-ce un bon rapport qualité-prix pour Bahia Palace ?</h3>
<p>Oui. 100 MAD représente environ 9€ ou 10$. Pour ce prix, vous obtenez environ 8 000 mètres carrés d'architecture marocaine exceptionnelle ouverts aux visiteurs, 90 minutes d'exploration et l'accès à l'un des sites du patrimoine culturel les plus importants du pays. C'est moins cher que le Jardin Majorelle (150 MAD) tout en offrant plus de contenu culturel.</p>
<h3>Quelle est la meilleure façon de se préparer à une visite de Bahia Palace ?</h3>
<p>Lisez un bref récit de l'histoire de Ba Ahmed ibn Moussa avant de visiter — l'<a href="/fr/blog/bahia-palace-history">article d'histoire</a> de ce blog la couvre en intégralité. Arrivez à 9h00 et réservez votre <a href="/fr/tickets/skip-the-line">billet skip-the-line</a> à l'avance.</p>`,
    ],
  },
  {
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'it',
    category: 'reviews',
    title: 'Bahia Palace vale la pena? Recensione onesta 2026',
    excerpt: 'Una recensione onesta di Bahia Palace nel 2026: cosa impressiona davvero, cosa delude alcuni visitatori, per chi è perfetto e chi potrebbe preferire altro.',
    readTime: 7,
    publishedAt: '2026-01-20',
    body: [
      `<p><strong>Risposta breve: sì, senza esitazione — per il visitatore giusto.</strong> Bahia Palace è uno dei più bei esempi di architettura islamica del XIX secolo in Marocco, e percorrerlo senza conoscenze preliminari è già di grande impatto. Con contesto, è eccezionale. Ecco la versione onesta.</p>

<h2>Cosa è davvero impressionante</h2>
<h3>La scala</h3>
<p>La maggior parte dei visitatori la sottovaluta. Si aspettano un palazzo delle dimensioni di un riad e trovano circa 8.000 metri quadrati di cortili interconnessi, sale di ricevimento, appartamenti dell'harem e giardini aperti ai visitatori. Il Grand Riad da solo — 1.500 metri quadrati di zellige a cielo aperto — ferma le persone a metà passo.</p>
<h3>L'artigianato</h3>
<p>I soffitti in cedro dipinti a mano sono straordinari. Migliaia di artigiani qualificati di Fès hanno lavorato su questo edificio per molti anni, e il loro lavoro si vede. Nessun pannello del soffitto è identico a un altro. I pigmenti minerali — blu, oro, rossi, terracotte — si sono appena sbiaditi in 125 anni.</p>
<h3>I giardini</h3>
<p>I giardini dietro le sale formali sono piantati con gelsomino, rose, aranci, banani e cipressi. In primavera, il profumo è straordinario. In estate, sono un vero rifugio dal calore.</p>
<h3>La storia</h3>
<p>Un uomo nato schiavo, diventato la persona più potente del Marocco, che ha costruito il più bel palazzo privato del paese, e morto per vederlo svuotato in una notte dal Sultano che aveva servito. È una storia davvero avvincente che rende tutto ciò che guardate più significativo.</p>

<h2>Cosa alcuni visitatori trovano deludente</h2>
<h3>Nessun mobile né oggetto</h3>
<p>Questo è il reclamo più comune. Le stanze sono architettonicamente spettacolari ma vuote — nessun mobile originale, tappeto, argenteria o oggetto decorativo è rimasto. Quando Ba Ahmed morì nel 1900, il Sultano Abdelaziz fece rimuovere tutto immediatamente.</p>
<h3>Le folle a mezzogiorno</h3>
<p>Tra le 10:30 e le 14:00, il Grand Riad si riempie di gruppi turistici che si sovrappongono. I corridoi stretti tra le sezioni si intasano. È del tutto evitabile con una buona pianificazione dei tempi.</p>
<h3>Poca segnaletica</h3>
<p>La segnaletica all'interno del palazzo è scarsa. Una guida audio (disponibile all'ingresso) o la lettura di questo blog prima di andare risolve completamente questo problema.</p>

<h2>Confronto con altri siti di Marrakech</h2>
<table><thead><tr><th>Sito</th><th>Cosa offre</th><th>Tempo necessario</th><th>Ingresso</th></tr></thead><tbody><tr><td>Bahia Palace</td><td>Architettura, scala, storia, giardini</td><td>75–90 min</td><td>100 MAD</td></tr><tr><td>Tombe Saadiane</td><td>Dettaglio ornamentale concentrato, storia</td><td>30–40 min</td><td>70 MAD</td></tr><tr><td>El Badi Palace</td><td>Rovine suggestive, scala, cicogne</td><td>45 min</td><td>70 MAD</td></tr><tr><td>Giardino Majorelle</td><td>Botanica, colore, patrimonio design</td><td>45–60 min</td><td>150 MAD</td></tr><tr><td>Madrasa Ben Youssef</td><td>Architettura islamica, zellige, cortile</td><td>45 min</td><td>70 MAD</td></tr></tbody></table>
<p>A 100 MAD, Bahia Palace è più costoso delle Tombe Saadiane e di El Badi Palace (entrambi 70 MAD) ma offre notevolmente più contenuto. Rispetto al Giardino Majorelle (150 MAD), offre più sostanza per dirham per i visitatori principalmente interessati al patrimonio culturale.</p>

<h2>Per chi è perfetto</h2>
<ul><li><strong>Gli appassionati di storia</strong> — la storia di Ba Ahmed e il crollo del suo potere è una delle più drammatiche della storia marocchina</li><li><strong>Gli amanti dell'architettura e del design</strong> — l'artigianato è l'attrazione principale ed è in condizioni eccezionali</li><li><strong>I fotografi</strong> — pavimenti in zellige, soffitti intagliati, geometria dei cortili e luce dei giardini</li><li><strong>I primi visitatori in Marocco</strong> — Bahia Palace è la migliore introduzione singola all'architettura marocchina tradizionale</li><li><strong>Le famiglie con bambini</strong> — spazi aperti, varietà visiva, e i bambini sotto i 7 anni entrano gratuitamente</li></ul>

<h2>Chi potrebbe preferire altro</h2>
<ul><li><strong>I visitatori che si aspettano un interno arredato e decorato</strong> come un palazzo europeo — le stanze vuote deluderanno senza contesto</li><li><strong>Le persone con pochissimo tempo</strong> che hanno solo 30 minuti — il palazzo premia l'esplorazione lenta</li><li><strong>I visitatori principalmente interessati ai giardini e alla botanica</strong> — il Giardino Majorelle è più notevole per questo interesse specifico</li></ul>

<h2>Il verdetto</h2>
<p>A 100 MAD e 90 minuti, Bahia Palace rappresenta un eccellente rapporto qualità-prezzo per quello che offre. L'architettura è genuinamente di livello mondiale. La storia che c'è dietro è genuinamente avvincente.</p>
<p>Arrivate presto, informatevi in anticipo (o usate la guida audio), ed evitate la coda. Questi tre elementi — tempistica, contesto e un <a href="/it/tickets/skip-the-line">biglietto pre-prenotato</a> — fanno la differenza tra « bel palazzo » e « uno dei momenti salienti del Marocco ».</p>

<h2>Domande frequenti</h2>
<h3>Bahia Palace vale la pena per chi non è appassionato di storia?</h3>
<p>Sì. Non è necessario essere appassionati di storia per essere impressionati da Bahia Palace. La qualità architettonica e la scala del Grand Riad sono visivamente colpenti anche senza contesto. Cinque minuti di lettura prima di andare valgono ampiamente l'investimento.</p>
<h3>100 MAD è un buon rapporto qualità-prezzo per Bahia Palace?</h3>
<p>Sì. 100 MAD corrispondono a circa 9€ o 10$. Per quel prezzo si ottengono circa 8.000 metri quadrati di architettura marocchina eccezionale aperti ai visitatori, 90 minuti di esplorazione e l'accesso a uno dei siti del patrimonio culturale più importanti del paese. È più economico del Giardino Majorelle (150 MAD) offrendo più contenuto culturale.</p>
<h3>Qual è il modo migliore per prepararsi a una visita di Bahia Palace?</h3>
<p>Leggete una breve storia di Ba Ahmed ibn Moussa prima di visitare — l'<a href="/it/blog/bahia-palace-history">articolo di storia</a> di questo sito la tratta per intero. Arrivate alle 9:00 e prenotate il vostro <a href="/it/tickets/skip-the-line">biglietto skip-the-line</a> in anticipo.</p>`,
    ],
  },
  {
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'de',
    category: 'reviews',
    title: 'Lohnt sich Bahia Palace? Ehrliche Bewertung 2026',
    excerpt: 'Eine ehrliche Bewertung von Bahia Palace im Jahr 2026: was wirklich beeindruckt, was manche Besucher enttäuscht, für wen es perfekt ist und wer vielleicht etwas anderes bevorzugen würde.',
    readTime: 7,
    publishedAt: '2026-01-20',
    body: [
      `<p><strong>Kurze Antwort: ja, ohne Zögern — für den richtigen Besucher.</strong> Bahia Palace ist eines der schönsten Beispiele islamischer Architektur des 19. Jahrhunderts in Marokko, und es zu erkunden ohne Vorkenntnisse beeindruckt bereits. Mit Kontext ist es außergewöhnlich. Hier ist die ehrliche Version.</p>

<h2>Was wirklich beeindruckend ist</h2>
<h3>Die Dimension</h3>
<p>Die meisten Besucher unterschätzen sie. Sie erwarten einen Palast in riad-Größe und finden rund 8.000 Quadratmeter miteinander verbundener Innenhöfe, Empfangssäle, Haremgemächer und Gärten, die für Besucher zugänglich sind. Der Grand Riad allein — 1.500 Quadratmeter zellige unter freiem Himmel — lässt Menschen mitten im Schritt innehalten.</p>
<h3>Das Handwerk</h3>
<p>Die handbemalten Zedernholzdecken sind schlicht außergewöhnlich. Tausende qualifizierter Handwerker aus Fès arbeiteten über viele Jahre an diesem Gebäude, und ihre Arbeit ist sichtbar. Keine zwei Deckenplatten sind identisch. Die mineralischen Pigmente — Blau, Gold, Rot, Terrakotta — sind in 125 Jahren kaum verblasst.</p>
<h3>Die Gärten</h3>
<p>Die Gärten hinter den Repräsentationsräumen sind mit Jasmin, Rosen, Orangenbäumen, Bananenbäumen und Zypressen bepflanzt. Im Frühling ist der Duft bemerkenswert. Im Sommer sind sie ein echter Rückzugsort vor der Hitze.</p>
<h3>Die Geschichte</h3>
<p>Ein Mann, der als Sklave geboren wurde, zur mächtigsten Person Marokkos aufstieg, den feinsten privaten Palast des Landes baute und starb, um ihn über Nacht vom Sultan geplündert zu sehen, dem er gedient hatte. Das ist eine wirklich fesselnde Geschichte, die allem mehr Bedeutung verleiht.</p>

<h2>Was manche Besucher enttäuschend finden</h2>
<h3>Keine Möbel oder Objekte</h3>
<p>Das ist die häufigste Beschwerde. Die Räume sind architektonisch spektakulär, aber leer — keine originalen Möbel, Teppiche, Silberwaren oder dekorativen Gegenstände sind erhalten geblieben. Als Ba Ahmed 1900 starb, ließ Sultan Abdelaziz alles sofort entfernen.</p>
<h3>Menschenmassen zur Mittagszeit</h3>
<p>Zwischen 10:30 und 14:00 Uhr füllt sich der Grand Riad mit überlappenden Reisegruppen. Die engen Korridore zwischen den Abschnitten werden verstopft. Mit guter Zeitplanung ist das vollständig vermeidbar.</p>
<h3>Begrenzte Beschilderung</h3>
<p>Die Beschriftung im Inneren des Palastes ist spärlich. Ein Audioguide (an der Eintrittskasse erhältlich) oder das vorherige Lesen dieses Blogs löst das vollständig.</p>

<h2>Vergleich mit anderen Sehenswürdigkeiten in Marrakech</h2>
<table><thead><tr><th>Sehenswürdigkeit</th><th>Was es bietet</th><th>Benötigte Zeit</th><th>Eintritt</th></tr></thead><tbody><tr><td>Bahia Palace</td><td>Architektur, Größe, Geschichte, Gärten</td><td>75–90 Min.</td><td>100 MAD</td></tr><tr><td>Saadische Gräber</td><td>Konzentriertes Ornament, Geschichte</td><td>30–40 Min.</td><td>70 MAD</td></tr><tr><td>El Badi Palace</td><td>Atmosphärische Ruinen, Störche</td><td>45 Min.</td><td>70 MAD</td></tr><tr><td>Majorelle-Garten</td><td>Botanik, Farbe, Design-Erbe</td><td>45–60 Min.</td><td>150 MAD</td></tr><tr><td>Ben Youssef Madrasa</td><td>Islamische Architektur, zellige, Hof</td><td>45 Min.</td><td>70 MAD</td></tr></tbody></table>
<p>Zu 100 MAD ist Bahia Palace teurer als die Saadischen Gräber und El Badi Palace (beide 70 MAD), bietet aber deutlich mehr Inhalt. Verglichen mit dem Majorelle-Garten (150 MAD) bietet er mehr Substanz pro Dirham für Besucher, die primär am kulturellen Erbe interessiert sind.</p>

<h2>Für wen es perfekt ist</h2>
<ul><li><strong>Geschichtsbegeisterte</strong> — die Geschichte von Ba Ahmed und der Zusammenbruch seiner Macht ist eine der dramatischsten der marokkanischen Geschichte</li><li><strong>Architektur- und Designliebhaber</strong> — das Handwerk ist die Hauptattraktion und in außergewöhnlichem Zustand</li><li><strong>Fotografen</strong> — zellige-Böden, geschnitzte Decken, Hofgeometrie und Gartenlichtverhältnisse</li><li><strong>Erstbesucher in Marokko</strong> — Bahia Palace ist die beste Einzeleinführung in die traditionelle marokkanische Architektur</li><li><strong>Familien mit Kindern</strong> — offene Räume, visuelle Abwechslung, Kinder unter 7 Jahren haben freien Eintritt</li></ul>

<h2>Wer vielleicht etwas anderes bevorzugen würde</h2>
<ul><li><strong>Besucher, die ein möbliertes, dekoriertes Interieur</strong> wie ein europäisches Schloss erwarten — die leeren Räume werden ohne Vorwissen enttäuschen</li><li><strong>Menschen mit sehr wenig Zeit</strong>, die nur 30 Minuten haben — der Palast belohnt langsame Erkundung</li><li><strong>Besucher, die primär an Gärten und Botanik interessiert sind</strong> — der Majorelle-Garten ist für dieses spezifische Interesse beeindruckender</li></ul>

<h2>Das Urteil</h2>
<p>Zu 100 MAD und 90 Minuten bietet Bahia Palace für das Gebotene ein ausgezeichnetes Preis-Leistungs-Verhältnis. Die Architektur ist wirklich weltklasse. Die Geschichte dahinter ist wirklich fesselnd.</p>
<p>Kommen Sie früh, informieren Sie sich im Voraus (oder nutzen Sie den Audioguide) und umgehen Sie die Schlange. Diese drei Dinge — Timing, Kontext und ein <a href="/de/tickets/skip-the-line">vorgebuchtes Ticket</a> — machen den Unterschied zwischen « schöner Palast » und « eines der Highlights Marokkos ».</p>

<h2>Häufig gestellte Fragen</h2>
<h3>Lohnt sich Bahia Palace für Nicht-Geschichtsbegeisterte?</h3>
<p>Ja. Man muss kein Geschichtsenthusiast sein, um von Bahia Palace beeindruckt zu sein. Die architektonische Qualität und die Dimension des Grand Riad sind visuell beeindruckend, auch ohne Kontext. Fünf Minuten Lektüre vor dem Besuch sind die Investition absolut wert.</p>
<h3>Ist Bahia Palace für 100 MAD ein gutes Preis-Leistungs-Verhältnis?</h3>
<p>Ja. 100 MAD sind ungefähr 9€ oder 10$. Dafür erhalten Sie rund 8.000 Quadratmeter außergewöhnlicher marokkanischer Architektur, die für Besucher zugänglich sind, 90 Minuten Erkundung und Zugang zu einer der bedeutendsten Kulturerbestätten des Landes. Es ist günstiger als der Majorelle-Garten (150 MAD) und bietet mehr kulturellen Inhalt.</p>
<h3>Was ist die beste Art, sich auf einen Besuch in Bahia Palace vorzubereiten?</h3>
<p>Lesen Sie vor dem Besuch einen kurzen Bericht über die Geschichte von Ba Ahmed ibn Moussa — der <a href="/de/blog/bahia-palace-history">Geschichtsartikel</a> auf dieser Website deckt alles ab. Kommen Sie um 9:00 Uhr und buchen Sie Ihr <a href="/de/tickets/skip-the-line">skip-the-line-Ticket</a> im Voraus.</p>`,
    ],
  },
  {
    slug: 'is-bahia-palace-worth-visiting',
    locale: 'es',
    category: 'reviews',
    title: '¿Vale la pena Bahia Palace? Reseña honesta 2026',
    excerpt: 'Una reseña honesta de Bahia Palace en 2026: qué impresiona de verdad, qué decepciona a algunos visitantes, para quién es perfecto y quién podría preferir otra cosa.',
    readTime: 7,
    publishedAt: '2026-01-20',
    body: [
      `<p><strong>Respuesta corta: sí, sin dudarlo — para el visitante adecuado.</strong> Bahia Palace es uno de los mejores ejemplos de arquitectura islámica del siglo XIX en Marruecos, y recorrerlo sin conocimiento previo ya impresiona. Con contexto, es excepcional. Aquí está la versión honesta.</p>

<h2>Lo que es genuinamente impresionante</h2>
<h3>La escala</h3>
<p>La mayoría de los visitantes la subestima. Esperan un palacio del tamaño de un riad y encuentran aproximadamente 8.000 metros cuadrados de patios interconectados, salas de recepción, aposentos del harén y jardines abiertos al público. El Grand Riad solo — 1.500 metros cuadrados de zellige bajo cielo abierto — detiene a la gente en seco.</p>
<h3>La artesanía</h3>
<p>Los techos de cedro pintados a mano son legítimamente extraordinarios. Miles de artesanos cualificados de Fez trabajaron en este edificio durante muchos años, y su trabajo se nota. No hay dos paneles de techo idénticos. Los pigmentos minerales — azules, dorados, rojos, terracotas — apenas se han desvanecido en 125 años.</p>
<h3>Los jardines</h3>
<p>Los jardines detrás de las salas formales están plantados con jazmín, rosas, naranjos, bananeros y cipreses. En primavera, el aroma es extraordinario. En verano, son un auténtico refugio del calor.</p>
<h3>La historia</h3>
<p>Un hombre nacido esclavo que se convirtió en la persona más poderosa de Marruecos, construyó el más fino palacio privado del país y murió para verlo saqueado en una noche por el Sultán al que había servido. Es una historia genuinamente cautivadora que hace más significativo todo lo que miras.</p>

<h2>Lo que algunos visitantes encuentran decepcionante</h2>
<h3>Sin muebles ni objetos</h3>
<p>Esta es la queja más común. Las salas son arquitectónicamente espectaculares pero están vacías — no quedan muebles originales, alfombras, platería ni objetos decorativos. Cuando Ba Ahmed murió en 1900, el Sultán Abdelaziz mandó retirarlo todo de inmediato.</p>
<h3>Las multitudes al mediodía</h3>
<p>Entre las 10:30 y las 14:00, el Grand Riad se llena de grupos turísticos superpuestos. Los estrechos corredores entre secciones se congestionan. Es totalmente evitable con un buen timing.</p>
<h3>Poca señalización</h3>
<p>El etiquetado dentro del palacio es escaso. Una audioguía (disponible en la entrada) o leer este blog antes de ir lo resuelve por completo.</p>

<h2>Comparación con otros sitios de Marrakech</h2>
<table><thead><tr><th>Sitio</th><th>Qué ofrece</th><th>Tiempo necesario</th><th>Entrada</th></tr></thead><tbody><tr><td>Bahia Palace</td><td>Arquitectura, escala, historia, jardines</td><td>75–90 min</td><td>100 MAD</td></tr><tr><td>Tumbas Saadíes</td><td>Detalle ornamental concentrado, historia</td><td>30–40 min</td><td>70 MAD</td></tr><tr><td>El Badi Palace</td><td>Ruinas atmosféricas, escala, cigüeñas</td><td>45 min</td><td>70 MAD</td></tr><tr><td>Jardín Majorelle</td><td>Botánica, color, patrimonio del diseño</td><td>45–60 min</td><td>150 MAD</td></tr><tr><td>Madrasa Ben Youssef</td><td>Arquitectura islámica, zellige, patio</td><td>45 min</td><td>70 MAD</td></tr></tbody></table>
<p>A 100 MAD, Bahia Palace es más caro que las Tumbas Saadíes y El Badi Palace (ambos 70 MAD) pero ofrece significativamente más contenido. Comparado con el Jardín Majorelle (150 MAD), ofrece más sustancia por dírham para los visitantes principalmente interesados en el patrimonio cultural.</p>

<h2>Para quién es perfecto</h2>
<ul><li><strong>Los entusiastas de la historia</strong> — la historia de Ba Ahmed y el colapso de su poder es una de las más dramáticas de la historia marroquí</li><li><strong>Los amantes de la arquitectura y el diseño</strong> — la artesanía es la atracción principal y está en estado excepcional</li><li><strong>Los fotógrafos</strong> — suelos de zellige, techos tallados, geometría de los patios y luz de los jardines</li><li><strong>Los primeros visitantes a Marruecos</strong> — Bahia Palace es la mejor introducción única a la arquitectura marroquí tradicional</li><li><strong>Las familias con niños</strong> — espacios abiertos, variedad visual, y los niños menores de 7 años entran gratis</li></ul>

<h2>Quién podría preferir otra cosa</h2>
<ul><li><strong>Los visitantes que esperan un interior amueblado y decorado</strong> como un palacio europeo — las salas vacías decepcionarán sin contexto previo</li><li><strong>Las personas con muy poco tiempo</strong> que solo tienen 30 minutos — el palacio recompensa la exploración lenta</li><li><strong>Los visitantes principalmente interesados en jardines y botánica</strong> — el Jardín Majorelle es más notable para ese interés específico</li></ul>

<h2>El veredicto</h2>
<p>A 100 MAD y 90 minutos, Bahia Palace representa un excelente valor por lo que ofrece. La arquitectura es genuinamente de clase mundial. La historia que hay detrás es genuinamente cautivadora.</p>
<p>Llega temprano, infórmate con antelación (o usa la audioguía), y salta la cola. Esas tres cosas — timing, contexto y una <a href="/es/tickets/skip-the-line">entrada pre-reservada</a> — son la diferencia entre «bonito palacio» y «uno de los puntos culminantes de Marruecos».</p>

<h2>Preguntas frecuentes</h2>
<h3>¿Vale la pena Bahia Palace para quienes no son amantes de la historia?</h3>
<p>Sí. No es necesario ser un entusiasta de la historia para quedarse impresionado por Bahia Palace. La calidad arquitectónica y la escala del Grand Riad son visualmente llamativas incluso sin contexto. Cinco minutos de lectura antes de ir bien valen la inversión.</p>
<h3>¿Son 100 MAD un buen valor para Bahia Palace?</h3>
<p>Sí. 100 MAD son aproximadamente 9€ o 10$. Por ese precio obtienes aproximadamente 8.000 metros cuadrados de excepcional arquitectura marroquí abiertos al público, 90 minutos de exploración y acceso a uno de los sitios del patrimonio cultural más importantes del país. Es más barato que el Jardín Majorelle (150 MAD) con más contenido cultural.</p>
<h3>¿Cuál es la mejor manera de prepararse para una visita a Bahia Palace?</h3>
<p>Lee un breve relato de la historia de Ba Ahmed ibn Moussa antes de visitar — el <a href="/es/blog/bahia-palace-history">artículo de historia</a> de este blog lo cubre íntegramente. Llega a las 9:00 y reserva tu <a href="/es/tickets/skip-the-line">entrada skip-the-line</a> con antelación.</p>`,
    ],
  },
  // ─── BAHIA PALACE ENTRANCE FEE 2026 (EN) ──────────────────────────────────
  {
    slug: 'bahia-palace-entrance-fee-2026',
    locale: 'en',
    category: 'practical',
    title: 'Bahia Palace Entrance Fee 2026: Adult, Child & Group Prices',
    excerpt: 'Bahia Palace entrance fee: 100 MAD (~€9) per adult, 2026. Children under 7 enter free. What\'s included, who gets discounts, and how to skip the 45-min door queue.',
    readTime: 9,
    publishedAt: '2026-06-21',
    body: [
      `<p><strong>TL;DR:</strong> The standard Bahia Palace entrance fee is 100 MAD — approximately €9 or $10 USD — for adult visitors in 2026. Children under 7 enter free. Children 7 and over pay the adult rate. No student or senior discount applies to foreign visitors. Pre-booking online skips the door queue, which runs 30–45 minutes in peak season.</p>

<h2>What Is the Standard Bahia Palace Entrance Fee in 2026?</h2>
<p>The adult entrance fee for Bahia Palace is 100 MAD in 2026 — set by Morocco's Ministry of Culture and applied uniformly to all foreign visitors regardless of nationality. At current exchange rates that is approximately €9, $10 USD, or £8 GBP. Morocco welcomed a record 17.4 million international tourists in 2024 (<a href="https://www.visitmorocco.com" rel="noopener noreferrer">Office National Marocain du Tourisme</a>), and Bahia Palace consistently ranks among the country's most visited cultural monuments. At 100 MAD, it remains one of the better-value heritage sites in Marrakech relative to what you get inside.</p>

<table><thead><tr><th>Visitor Type</th><th>Price (MAD)</th><th>Approx. EUR</th><th>Approx. USD</th><th>Approx. GBP</th></tr></thead><tbody><tr><td>Adult (foreign visitor)</td><td>100 MAD</td><td>~€9</td><td>~$10</td><td>~£8</td></tr><tr><td>Child under 7</td><td>Free</td><td>Free</td><td>Free</td><td>Free</td></tr><tr><td>Child 7 and over</td><td>100 MAD</td><td>~€9</td><td>~$10</td><td>~£8</td></tr></tbody></table>

<p>Currency conversions are approximate as of mid-2026. The Moroccan dirham (MAD) is a closed currency — you cannot purchase dirhams before arriving in Morocco. Exchange at your hotel, an ATM on arrival, or a bureau de change in Marrakech's city centre.</p>

<h2>What Does the Bahia Palace Entrance Fee Include?</h2>
<p>Your 100 MAD ticket provides full access to all areas of the palace complex open to visitors — approximately 8,000 square metres of interconnected rooms, courtyards, and gardens. There are no premium zones or reserved sections requiring a higher-tier ticket; the standard entrance fee covers everything.</p>

<p>Included with the standard 100 MAD ticket:</p>
<ul><li>The Grand Riad — 1,500 square metres of hand-laid zellige tilework under open sky, the palace's centrepiece courtyard</li><li>The private apartments and harem quarters, with original carved cedar ceilings and marble columns</li><li>The Petite Cour and the Small Riad connecting the main sections</li><li>The palace gardens: jasmine, roses, orange trees, cypress, and banana palms</li><li>Personal photography throughout — no extra photography fee for standard visitors</li></ul>

<p>Not included in the 100 MAD standard ticket:</p>
<ul><li><strong>Audio guide:</strong> Available separately at the entrance for approximately 20–30 MAD when in stock. Not always available — download a mobile guide as backup before you go.</li><li><strong>Guided tour commentary:</strong> Organised guided tours (available through third-party operators) include a guide, but these are separate products not purchased at the palace entrance.</li><li><strong>Commercial photography permit:</strong> Professional shoots, video production, or drone footage require a separate permit from the Ministry of Culture, arranged in advance.</li></ul>

<p>Typical visit duration: 75 to 90 minutes for a thorough self-guided tour of the main rooms and gardens. Visitors who move quickly can cover the principal areas in 45–50 minutes, but the carved ceilings, garden details, and smaller inner courtyards reward slower exploration. See our full <a href="/en/blog/is-bahia-palace-worth-visiting">honest review of what the visit delivers</a> to know what to expect before you go.</p>

<h2>How Does Bahia Palace Compare in Price to Other Marrakech Attractions?</h2>
<p>At 100 MAD, Bahia Palace sits in the middle of the Marrakech paid-attraction range — more expensive than most historic medina sites, but significantly cheaper than Majorelle Garden. The comparison below covers the main paid cultural sites for 2026.</p>

<table><thead><tr><th>Attraction</th><th>Adult Ticket</th><th>Typical Visit</th><th>What It Offers</th></tr></thead><tbody><tr><td><strong>Bahia Palace</strong></td><td><strong>100 MAD (~€9)</strong></td><td>75–90 min</td><td>19th-century royal palace: architecture, gardens, history</td></tr><tr><td>Majorelle Garden</td><td>150 MAD (~€14)</td><td>45–60 min</td><td>Botanical garden and Yves Saint Laurent museum</td></tr><tr><td>Ben Youssef Madrasa</td><td>70 MAD (~€6)</td><td>30–45 min</td><td>14th-century Islamic college: zellige and carved plasterwork</td></tr><tr><td>Saadian Tombs</td><td>70 MAD (~€6)</td><td>25–35 min</td><td>16th-century royal necropolis: ornate mausoleums</td></tr><tr><td>El Badi Palace</td><td>70 MAD (~€6)</td><td>40–50 min</td><td>Ruined 16th-century palace: scale, storks, rooftop views</td></tr><tr><td>Museum of Marrakech</td><td>50 MAD (~€5)</td><td>30–45 min</td><td>Moroccan art and history in a 19th-century riad</td></tr><tr><td>Menara Gardens</td><td>Free</td><td>Open-ended</td><td>Olive groves, pavilion, Atlas Mountain views</td></tr></tbody></table>

<p>On a per-dirham basis, Bahia Palace offers the most comprehensive cultural experience among the paid historic sites in the medina. The combination of architectural scale (8,000 square metres open to visitors), craftwork quality, and the dramatic history of Grand Vizier Ba Ahmed makes it difficult to match elsewhere in the city. Compared to Majorelle Garden — Marrakech's most visited paid attraction at 150 MAD — Bahia Palace delivers a longer visit, more cultural depth, and costs 33% less.</p>

<h2>Is There a Skip-the-Line Ticket Option and What Does It Cost?</h2>
<p>Pre-booking your Bahia Palace ticket online is the most practical improvement you can make to your visit, particularly in peak season (March–May, September–October), when the standard entrance queue runs 30–45 minutes before you even reach the cashier. An online ticket provides a QR code for the priority entrance, letting you scan and walk in within minutes of arriving.</p>

<p>Visitbahiapalace.com is an independent ticket booking platform — not the official palace management or a Moroccan government service. We offer pre-booked Bahia Palace entry tickets with priority access, instant confirmation by email or SMS, and free cancellation up to 24 hours before your visit date.</p>

<table><thead><tr><th>Ticket Option</th><th>Where to Buy</th><th>Typical Queue</th><th>Confirmation</th><th>Cancellation</th></tr></thead><tbody><tr><td>Standard entry (at the door)</td><td>Palace cashier, Rue Riad Zitoun el Jedid</td><td>20–45 min (peak season)</td><td>Paper ticket</td><td>N/A</td></tr><tr><td>Pre-booked entry (online)</td><td>This site — visitbahiapalace.com</td><td>Under 5 min</td><td>Mobile QR code</td><td>Free up to 24h before</td></tr></tbody></table>

<p>Beyond eliminating the queue, pre-booking also locks in your arrival time — which matters during Ramadan (shorter operating hours), on peak-season weekends when the entrance occasionally reaches capacity, and when you are combining the palace with other Marrakech sightseeing and need precise scheduling. Book your <a href="/en/tickets/skip-the-line">Bahia Palace skip-the-line ticket</a> before you travel and start your visit, not in the queue.</p>

<h2>Are There Discounts at Bahia Palace? Students, Seniors, Groups</h2>
<p>Bahia Palace operates a simple pricing structure with limited concession categories. Here is what is and is not available for foreign visitors in 2026.</p>

<p><strong>Children under 7:</strong> Free admission with no ticket required. This applies regardless of nationality or when you visit.</p>

<p><strong>Children 7 and over:</strong> Pay the standard adult rate of 100 MAD. No reduced child or teenager ticket exists for foreign visitors.</p>

<p><strong>Students:</strong> No student discount applies to international visitors at Bahia Palace. Moroccan students with a valid national student card may be eligible for a concessionary rate at the official cashier — present your card on arrival and ask.</p>

<p><strong>Seniors:</strong> No senior discount for foreign visitors at this time.</p>

<p><strong>Groups:</strong> No formal group discount is available through standard ticket channels for independent visitors. Licensed Moroccan tour operators who pre-arrange large group visits may negotiate rates separately with palace management. For families and independent groups, the 100 MAD adult rate applies to each visitor.</p>

<p><strong>Free-entry days:</strong> Bahia Palace does not operate free-admission days for foreign visitors. The 100 MAD fee applies year-round, including during Ramadan (when operating hours are shortened).</p>

<p><strong>Moroccan nationals and residents:</strong> Citizens and residents holding a valid Moroccan national ID card may be eligible for a reduced admission rate at the official cashier — this is set separately by the Ministry of Culture. Confirm the current rate at the entrance on arrival.</p>

<h2>Where and How Do I Buy Bahia Palace Tickets?</h2>
<p>There are three ways to secure your Bahia Palace entry. Here is what each involves and who each suits best.</p>

<p><strong>1. At the palace entrance (walk-in):</strong> The main cashier is at the entrance gate on Rue Riad Zitoun el Jedid, in the southern medina. Payment is in Moroccan dirhams — card payment is not always available, so carry cash. In high season, queue time at the cashier is 20–45 minutes. No advance booking required.</p>

<p><strong>2. Online in advance (recommended for peak season):</strong> Book through visitbahiapalace.com — an independent ticket platform — and receive a mobile QR code immediately. Present this at the priority entrance on arrival for access in under five minutes. Benefits: no queue, no cash needed at the door, free cancellation up to 24 hours before, instant confirmation. Particularly valuable if you are visiting during Ramadan, on a weekend in March–May, or combining the palace with other morning sightseeing. <a href="/en/tickets/skip-the-line">Book your ticket here</a>.</p>

<p><strong>3. As part of a guided tour:</strong> Many Marrakech half-day medina tours include Bahia Palace with a guide. The ticket is typically included in the tour price. Trade-off: you are on the operator's schedule rather than your own, and tour groups tend to arrive at 10:00–11:00 AM when the palace is busiest.</p>

<h2>When Should I Visit Bahia Palace to Get the Most from My Ticket?</h2>
<p>Getting the most from your 100 MAD entry comes down to timing. The palace opens at 9:00 AM; arriving in the first 30 minutes — before organised tour groups arrive from 10:00 onwards — gives you the Grand Riad and the main corridors largely to yourself. Morning light on the hand-painted cedar ceilings and zellige floors is also significantly better for photography than the harsh midday light that flattens the colour and detail.</p>

<p>Check the <a href="/en/opening-hours">full Bahia Palace opening hours</a> before you visit — the schedule varies on Fridays, during Ramadan, and on Moroccan public holidays. The palace closes for approximately two hours at midday on Fridays for prayer, and Ramadan hours are shortened to typically 9:00 AM–3:00 PM (exact times vary by year). Arriving without checking the current schedule is the most common cause of a wasted trip.</p>

<h2>Frequently Asked Questions</h2>

<h3>How much is Bahia Palace entrance fee in 2026?</h3>
<p>The standard adult entrance fee for Bahia Palace is 100 MAD in 2026 — approximately €9, $10 USD, or £8 GBP at current exchange rates. This price is set by Morocco's Ministry of Culture and applies uniformly to all foreign adult visitors. Children under 7 enter free. Children aged 7 and over pay the standard adult rate of 100 MAD.</p>

<h3>Can I book Bahia Palace tickets online in advance?</h3>
<p>Yes. Visitbahiapalace.com — an independent ticket booking platform, not the official palace management — offers pre-booked Bahia Palace entry tickets with priority access. You receive a mobile QR code by email immediately after booking; present it at the priority entrance to skip the queue entirely. Free cancellation is available up to 24 hours before your visit. Online pre-booking is strongly recommended during peak season (March–May, September–October) when the door queue runs 30–45 minutes.</p>

<h3>Is Bahia Palace cheaper than Majorelle Garden?</h3>
<p>Yes. Bahia Palace is 100 MAD (approximately €9), while Majorelle Garden is 150 MAD (approximately €14) — 50% more expensive. Bahia Palace also offers a longer visit (75–90 minutes of content) compared to Majorelle Garden (typically 45–60 minutes). For visitors primarily interested in Moroccan cultural heritage and architecture, Bahia Palace delivers more content per dirham.</p>

<h3>Are children free at Bahia Palace?</h3>
<p>Children under 7 years of age enter Bahia Palace completely free of charge. No ticket is required for this age group. Children aged 7 and over pay the standard adult rate of 100 MAD. There is no reduced-price child ticket for older children or teenagers.</p>

<h3>Is there a photography fee at Bahia Palace?</h3>
<p>No. Personal photography — including smartphones, compact cameras, and mirrorless cameras — is permitted throughout the palace at no extra charge as part of the standard 100 MAD entrance fee. Tripods are generally discouraged inside the enclosed rooms but tolerated in the open courtyards. Commercial photography, professional video production, and drone flights require a separate permit from Morocco's Ministry of Culture, arranged in advance.</p>

<h3>What happens if I arrive and Bahia Palace is closed?</h3>
<p>The palace closes for approximately two hours on Friday midday for prayer (the exact window varies by season). It also operates on a shortened schedule during Ramadan and is closed on certain Moroccan public holidays. Always check the <a href="/en/opening-hours">current opening hours</a> before travelling to the palace. If you have a pre-booked ticket and the palace is unexpectedly closed, contact the booking platform for a rescheduled visit or refund. Pre-booked tickets from visitbahiapalace.com include free cancellation up to 24 hours before your visit.</p>`,
    ],
  },
];

export function getBlogPosts(locale: string): BlogPost[] {
  return posts.filter((p) => p.locale === locale);
}

export function getBlogPost(locale: string, slug: string): BlogPost | undefined {
  return posts.find((p) => p.locale === locale && p.slug === slug);
}

export function getAllSlugs(): string[] {
  return [...new Set(posts.map((p) => p.slug))];
}
