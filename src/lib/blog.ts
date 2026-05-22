export type BlogCategory = 'visit-tips' | 'history' | 'practical' | 'comparisons' | 'safety';

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
  // ─── ENGLISH ───────────────────────────────────────────────────────────────
  {
    slug: 'bahia-palace-skip-the-line-guide',
    locale: 'en',
    category: 'visit-tips',
    title: 'How to Skip the Line at Bahia Palace: A Complete Visitor\'s Guide',
    excerpt: 'Long queues at Bahia Palace are avoidable. This guide shows you exactly how to beat the crowds, when to visit, and why online tickets are the smarter choice.',
    readTime: 5,
    publishedAt: '2025-11-15',
    body: [
      'Bahia Palace is one of the most visited monuments in Morocco — and it shows. During peak season (March to May and September to October) the ticket line can stretch 30 to 45 minutes outside the main entrance on Rue Riad Zitoun el Jedid. For a monument that takes just 60 to 90 minutes to tour, that wait can feel disproportionate. The good news is that it\'s entirely avoidable.',
      'The simplest way to skip the queue is to purchase your ticket online before you arrive. Pre-validated tickets carry a QR code that grants you access to the priority entrance — no queuing at the booth, no cash required. Just walk up, scan, and walk in. Most visitors who buy in advance are inside the palace within 2 minutes of arriving.',
      'Timing also matters. The absolute quietest window is Tuesday and Thursday mornings between 9:00 and 10:30 AM. The palace opens at 9:00 and tour groups typically arrive from 10:00 onwards. Arriving early gives you empty corridors, soft morning light for photography, and the serenity to appreciate the zellige tilework without the crowds. Avoid Friday midday (local prayer time makes access unpredictable) and Saturday afternoons in peak season.',
      'One often-overlooked tip: the palace has a second entrance on the south side, near the Grande Cour. When the main entrance queue is long, staff occasionally redirect visitors there — ask politely if you don\'t see signage. Armed with an online ticket and a bit of timing intelligence, you can experience Bahia Palace at its absolute best.',
    ],
    tips: [
      'Buy online — it\'s the single most effective way to avoid queues.',
      'Arrive at 9:00 AM sharp on a weekday for the quietest experience.',
      'Avoid Saturdays and French school holiday weeks (February, April, July).',
      'Wear comfortable flat shoes — the marble and tile floors are uneven in places.',
      'Bring a light scarf or cover-up for shoulders/knees as a courtesy.',
    ],
  },
  {
    slug: 'history-of-bahia-palace',
    locale: 'en',
    category: 'history',
    title: 'The History of Bahia Palace: Power, Beauty, and Intrigue in Marrakech',
    excerpt: 'Built in secret, expanded by ambition, and eventually taken by force — the story of Bahia Palace is as dramatic as its architecture. Here\'s everything you need to know.',
    readTime: 6,
    publishedAt: '2025-11-10',
    body: [
      'Bahia Palace was not built in a single grand gesture. It grew slowly, in two phases, over several decades of the late 19th century — and its story is inseparable from the political intrigues of the Alaoui sultanate. The first phase was commissioned by Si Moussa, the influential chamberlain (and later Grand Vizier) of Sultan Moulay Hassan I. Si Moussa began construction in the 1860s, building a residence that reflected his enormous power and ambition. He named it "Bahia" — meaning "Brilliant" or "Beautiful" in Arabic.',
      'After Si Moussa\'s death, his son Ahmed ibn Moussa (known as Ba Ahmed) inherited the property and dramatically expanded it. Ba Ahmed served as Grand Vizier under Sultan Moulay Abdelaziz and used the palace to project his authority. He employed 150 workers from Fez and added the famous Grande Cour, the intricate muqarnas ceilings, and dozens of private apartments — one for each of his four wives and 24 concubines. The palace grew to cover nearly 8 hectares with over 150 rooms arranged around a series of riads and inner courtyards.',
      'The architectural vocabulary of Bahia Palace is a masterclass in Moroccan-Andalusian style. The craftsmen from Fez brought their traditions of geometric zellige tilework, hand-carved stucco plasterwork, and painted cedar wood ceilings — skills that had been refined over centuries. The interplay of light and shadow in the courtyards, the sound of fountains, and the fragrance of orange trees are as deliberate as any architectural feature: the palace was designed as a total sensory experience.',
      'When Ba Ahmed died in 1900, the French forces occupying Marrakech seized the palace almost immediately. General Hubert Lyautey used it as his residence during the French Protectorate era. The palace was looted of its finest furnishings, though much of the architectural fabric survived. Today it is one of the best-preserved examples of late 19th-century Moroccan palatial architecture — and a reminder that beauty, in Morocco, was never far from power.',
    ],
    tips: [
      'Look up — the painted cedar ceiling of the Grande Salle d\'Honneur is the highlight of the palace.',
      'The inner garden (riad) is most beautiful in spring when the orange trees bloom.',
      'The "harem" section has the most intimate and intricate decoration — don\'t rush through it.',
      'A licensed guide can reveal hidden details invisible to unaccompanied visitors.',
    ],
  },
  {
    slug: 'marrakech-tourist-scams-guide',
    locale: 'en',
    category: 'safety',
    title: 'Marrakech Tourist Scams Near Bahia Palace (And How to Avoid Them)',
    excerpt: 'A small number of scams target tourists around Bahia Palace and the surrounding medina. Knowing them in advance turns potential problems into non-events.',
    readTime: 5,
    publishedAt: '2025-11-05',
    body: [
      'Marrakech is a genuinely welcoming city with warm, hospitable people. The tourist experience around major monuments like Bahia Palace is overwhelmingly positive. That said, a small number of individuals target distracted or uninformed visitors — and knowing their tactics removes virtually all risk from your visit.',
      'The most common scam near Bahia Palace is the "closed monument" trick. A friendly stranger approaches as you walk toward the entrance and tells you the palace is unexpectedly closed — for a private event, a national holiday, or renovation. He then offers to take you somewhere "just as beautiful." The palace is open every single day from 9:00 AM to 5:00 PM. Walk directly to the entrance and ignore this approach entirely.',
      'A second common tactic is unofficial "guides" standing near the entrance who insist they are official or licensed. They may begin giving you information before you\'ve agreed to anything and then demand payment. Legitimate licensed guides wear a badge from the Regional Council for Tourism. Book your guide through a verified platform in advance.',
      'The surest protection against ticket-related scams is the same as the queue-busting strategy: buy your ticket online before you arrive. With a pre-validated QR ticket, there is nothing to negotiate at the entrance, no cash to exchange, and no reason to interact with anyone other than the official ticket scanner. The 60 seconds of friction involved in buying online removes the entire category of entrance-area scams.',
    ],
    tips: [
      'Buy tickets online — it eliminates the single most common category of entrance scams.',
      'Download Maps.me offline before entering the medina so you\'re never "lost."',
      'Negotiate all taxi prices before getting in, or insist the meter is used.',
      'Keep your bag in front of you in busy Jemaa el-Fna square.',
      'If someone approaches you aggressively, walk into any nearby shop and ask for help.',
    ],
  },

  // ─── FRENCH ────────────────────────────────────────────────────────────────
  {
    slug: 'bahia-palace-skip-the-line-guide',
    locale: 'fr',
    category: 'visit-tips',
    title: 'Comment éviter la file d\'attente au Palais Bahia : guide complet',
    excerpt: 'Les longues files au Palais Bahia sont évitables. Ce guide vous explique comment les contourner, quand visiter et pourquoi les billets en ligne sont le choix le plus intelligent.',
    readTime: 5,
    publishedAt: '2025-11-15',
    body: [
      'Le Palais Bahia est l\'un des monuments les plus visités du Maroc — et cela se ressent. En haute saison (mars à mai et septembre à octobre), la file d\'attente peut s\'étirer sur 30 à 45 minutes devant l\'entrée principale, rue Riad Zitoun el Jedid. Pour un monument qui se visite en 60 à 90 minutes, cette attente est disproportionnée. La bonne nouvelle : elle est entièrement évitable.',
      'La solution la plus simple est d\'acheter votre billet en ligne avant votre arrivée. Les billets pré-validés sont accompagnés d\'un QR code qui vous donne accès à l\'entrée prioritaire — sans attente à la caisse, sans espèces. Il vous suffit d\'approcher, de scanner et d\'entrer. La plupart des visiteurs ayant acheté en ligne sont à l\'intérieur en moins de 2 minutes.',
      'Le moment de la visite compte également. Le créneau le plus calme est le mardi ou jeudi matin entre 9h00 et 10h30. Le palais ouvre à 9h00 et les groupes arrivent généralement à partir de 10h00. Arriver tôt vous offre des couloirs vides, une lumière matinale idéale pour la photographie et la sérénité nécessaire pour apprécier les zelliges sans la foule. Évitez les vendredis à midi et les samedis après-midi en haute saison.',
      'Une astuce méconnue : le palais dispose d\'une deuxième entrée côté sud, près de la Grande Cour. Lorsque la file principale est longue, le personnel y redirige parfois les visiteurs — demandez poliment si vous ne voyez pas de signalétique. Avec un billet en ligne et un peu de sens du timing, vous pouvez vivre le Palais Bahia dans les meilleures conditions possibles.',
    ],
    tips: [
      'Achetez en ligne — c\'est la solution la plus efficace contre les files d\'attente.',
      'Arrivez à 9h pétantes un jour de semaine pour l\'expérience la plus paisible.',
      'Évitez les samedis et les semaines de vacances scolaires françaises.',
      'Portez des chaussures plates confortables — le sol en marbre et en zelliges est irrégulier.',
      'Emportez un foulard léger ou une veste pour couvrir épaules et genoux.',
    ],
  },
  {
    slug: 'history-of-bahia-palace',
    locale: 'fr',
    category: 'history',
    title: 'L\'histoire du Palais Bahia : pouvoir, beauté et intrigues à Marrakech',
    excerpt: 'Construit en secret, agrandi par l\'ambition, et finalement conquis de force — l\'histoire du Palais Bahia est aussi dramatique que son architecture.',
    readTime: 6,
    publishedAt: '2025-11-10',
    body: [
      'Le Palais Bahia ne fut pas construit en un seul grand geste. Il grandit lentement, en deux phases, sur plusieurs décennies de la fin du XIXe siècle — et son histoire est indissociable des intrigues politiques de la dynastie alaouite. La première phase fut commandée par Si Moussa, chambellan influent (puis Grand Vizir) du sultan Moulay Hassan Ier. Si Moussa commença la construction dans les années 1860, édifiant une résidence à la mesure de son pouvoir immense. Il la baptisa « Bahia » — signifiant « Brillante » ou « Belle » en arabe.',
      'À la mort de Si Moussa, son fils Ahmed ibn Moussa (dit Ba Ahmed) hérita du domaine et l\'agrandit considérablement. Ba Ahmed servit comme Grand Vizir sous le sultan Moulay Abdelaziz et utilisa le palais pour affirmer son autorité. Il fit appel à 150 artisans de Fès et ajouta la célèbre Grande Cour, les plafonds en muqarnas et des dizaines d\'appartements privés — un pour chacune de ses quatre épouses et ses vingt-quatre concubines. Le palais s\'étendit sur près de 8 hectares avec plus de 150 pièces organisées autour de riads et de cours intérieures.',
      'Le vocabulaire architectural du Palais Bahia est une leçon magistrale de style maroco-andalou. Les artisans de Fès apportèrent leurs traditions de zelliges géométriques, de plâtre sculpté à la main et de plafonds en bois de cèdre peint — des savoir-faire affinés au fil des siècles. Le jeu de lumière et d\'ombre dans les cours, le son des fontaines et le parfum des orangers sont aussi délibérés que n\'importe quel élément architectural : le palais était conçu comme une expérience sensorielle totale.',
      'À la mort de Ba Ahmed en 1900, les forces françaises occupant Marrakech s\'emparèrent du palais presque immédiatement. Le général Hubert Lyautey l\'utilisa comme résidence pendant l\'ère du Protectorat français. Le palais fut dépouillé de ses plus beaux mobiliers, bien que l\'essentiel du bâti ait survécu. Il est aujourd\'hui l\'un des exemples les mieux conservés de l\'architecture palatiale marocaine de la fin du XIXe siècle.',
    ],
    tips: [
      'Regardez en l\'air — le plafond peint en cèdre de la Grande Salle d\'Honneur est le clou du spectacle.',
      'Le jardin intérieur (riad) est le plus beau au printemps, quand les orangers fleurissent.',
      'La section « harem » possède la décoration la plus intime et la plus raffinée.',
      'Un guide officiel révèle des détails invisibles aux visiteurs non accompagnés.',
    ],
  },
  {
    slug: 'marrakech-tourist-scams-guide',
    locale: 'fr',
    category: 'safety',
    title: 'Arnaques touristiques à Marrakech près du Palais Bahia (et comment les éviter)',
    excerpt: 'Un petit nombre d\'arnaques ciblent les touristes autour du Palais Bahia. Les connaître à l\'avance les transforme en non-événements.',
    readTime: 5,
    publishedAt: '2025-11-05',
    body: [
      'Marrakech est une ville authentiquement accueillante, aux habitants chaleureux et hospitaliers. L\'expérience touristique autour des grands monuments comme le Palais Bahia est dans l\'ensemble très positive. Cela dit, une poignée d\'individus ciblent les visiteurs distraits ou mal informés — et connaître leurs méthodes supprime pratiquement tout risque.',
      'L\'arnaque la plus répandue près du Palais Bahia est la ruse du « monument fermé ». Un inconnu sympathique vous aborde alors que vous approchez de l\'entrée et vous annonce que le palais est exceptionnellement fermé — pour un événement privé, un jour férié ou des travaux. Il propose alors de vous emmener quelque part « tout aussi beau ». Le palais est ouvert tous les jours de 9h à 17h. Allez directement à l\'entrée et ignorez toute approche de ce type.',
      'Deuxième tactique courante : des « guides » non officiels postés près de l\'entrée, qui affirment être accrédités. Ils peuvent commencer à vous donner des informations avant même que vous n\'ayez rien accepté, puis exiger un paiement. Les vrais guides agréés portent un badge délivré par le Conseil Régional du Tourisme. Réservez votre guide à l\'avance via une plateforme vérifiée.',
      'La meilleure protection contre les arnaques liées aux billets est la même que la stratégie anti-file d\'attente : achetez votre billet en ligne avant d\'arriver. Avec un QR code pré-validé, il n\'y a rien à négocier à l\'entrée, aucun espèces à échanger, aucune raison d\'interagir avec qui que ce soit d\'autre que le scanner officiel.',
    ],
    tips: [
      'Achetez vos billets en ligne — cela élimine la catégorie d\'arnaques la plus fréquente à l\'entrée.',
      'Téléchargez Maps.me hors ligne avant d\'entrer dans la médina.',
      'Négociez toujours le prix du taxi avant de monter, ou exigez le compteur.',
      'Gardez votre sac devant vous sur la place Jemaa el-Fna.',
      'Si quelqu\'un vous aborde de manière agressive, entrez dans n\'importe quelle boutique et demandez de l\'aide.',
    ],
  },

  // ─── ITALIAN ───────────────────────────────────────────────────────────────
  {
    slug: 'bahia-palace-skip-the-line-guide',
    locale: 'it',
    category: 'visit-tips',
    title: 'Come saltare la fila al Palazzo Bahia: guida completa',
    excerpt: 'Le lunghe file al Palazzo Bahia sono evitabili. Ecco come battere la folla e godere del palazzo al meglio.',
    readTime: 4,
    publishedAt: '2025-11-15',
    body: [
      'Il Palazzo Bahia è uno dei monumenti più visitati del Marocco e, soprattutto in alta stagione (marzo-maggio e settembre-ottobre), la fila alla biglietteria può durare 30-45 minuti. Per un palazzo che richiede 60-90 minuti di visita, è un\'attesa sproporzionata — e completamente evitabile.',
      'Il modo più semplice è acquistare il biglietto online prima dell\'arrivo. I biglietti prevalidati includono un QR code che garantisce l\'accesso all\'ingresso prioritario: niente fila, niente contanti, niente stress. La maggior parte dei visitatori che comprano online entrano entro 2 minuti dall\'arrivo.',
      'Anche il momento della visita conta. La finestra più tranquilla è il martedì o giovedì mattina tra le 9:00 e le 10:30. Il palazzo apre alle 9:00 e i gruppi organizzati arrivano solitamente dalle 10:00 in poi. Evita i sabati pomeriggio e le settimane di vacanza scolastica italiana in alta stagione.',
    ],
    tips: [
      'Acquista online — è la strategia più efficace contro le file.',
      'Arriva puntuale alle 9:00 di un giorno feriale per il massimo della tranquillità.',
      'Porta scarpe comode e un copri-spalle leggero.',
    ],
  },
  {
    slug: 'history-of-bahia-palace',
    locale: 'it',
    category: 'history',
    title: 'La storia del Palazzo Bahia: potere, bellezza e intrighi a Marrakech',
    excerpt: 'Costruito in segreto, ampliato dall\'ambizione e infine conquistato con la forza — la storia del Palazzo Bahia è drammatica quanto la sua architettura.',
    readTime: 5,
    publishedAt: '2025-11-10',
    body: [
      'Il Palazzo Bahia non fu costruito in un unico grande gesto. Crebbe lentamente, in due fasi, nel corso di diversi decenni della fine del XIX secolo. La prima fase fu commissionata da Si Moussa, Grande Visir del sultano Moulay Hassan I, che iniziò i lavori negli anni 1860. Battezzò il palazzo "Bahia" — che significa "Splendente" o "Bella" in arabo.',
      'Dopo la morte di Si Moussa, il figlio Ba Ahmed ereditò la proprietà e la ampliò enormemente. Fece venire 150 artigiani da Fez e aggiunse il celebre Grande Cortile, soffitti in muqarnas e decine di appartamenti privati. Il palazzo si estese su quasi 8 ettari con oltre 150 stanze organizzate attorno a riad e cortili interni.',
      'Quando Ba Ahmed morì nel 1900, le forze francesi si impadronirono del palazzo quasi immediatamente. Il generale Lyautey lo usò come residenza durante il Protettorato francese. Oggi è uno degli esempi meglio conservati di architettura palaziale marocchina di fine Ottocento.',
    ],
    tips: [
      'Guarda in su — il soffitto in cedro dipinto è il punto culminante del palazzo.',
      'La sezione del harem ha la decorazione più intima e raffinata.',
      'Una guida ufficiale rivela dettagli invisibili ai visitatori non accompagnati.',
    ],
  },
  {
    slug: 'marrakech-tourist-scams-guide',
    locale: 'it',
    category: 'safety',
    title: 'Truffe turistiche a Marrakech vicino al Palazzo Bahia (e come evitarle)',
    excerpt: 'Un piccolo numero di truffe prende di mira i turisti attorno al Palazzo Bahia. Conoscerle in anticipo le rende innocue.',
    readTime: 4,
    publishedAt: '2025-11-05',
    body: [
      'Marrakech è una città genuinamente accogliente. L\'esperienza turistica attorno ai grandi monumenti è nel complesso molto positiva. Tuttavia, un piccolo numero di individui prende di mira i visitatori distratti — e conoscere le loro tattiche elimina quasi completamente ogni rischio.',
      'La truffa più comune vicino al Palazzo Bahia è quella del "monumento chiuso": uno sconosciuto ti avvicina e ti dice che il palazzo è chiuso per un evento privato, una festa o lavori di ristrutturazione, poi si offre di portarti da qualche parte "altrettanto bello". Il palazzo è aperto ogni giorno dalle 9:00 alle 17:00. Vai direttamente all\'ingresso e ignora qualsiasi approccio di questo tipo.',
      'La protezione migliore? Acquista il biglietto online prima di arrivare. Con un QR code prevalidato, non c\'è nulla da negoziare all\'ingresso e nessun motivo di interagire con persone non autorizzate.',
    ],
    tips: [
      'Acquista il biglietto online per eliminare le truffe all\'ingresso.',
      'Scarica Maps.me offline prima di entrare nella medina.',
      'Negozia sempre il prezzo del taxi prima di salire.',
    ],
  },

  // ─── GERMAN ────────────────────────────────────────────────────────────────
  {
    slug: 'bahia-palace-skip-the-line-guide',
    locale: 'de',
    category: 'visit-tips',
    title: 'Schlange am Bahia-Palast überspringen: vollständiger Reiseführer',
    excerpt: 'Die langen Warteschlangen am Bahia-Palast sind vermeidbar. So schlagen Sie die Massen und genießen den Palast von seiner besten Seite.',
    readTime: 4,
    publishedAt: '2025-11-15',
    body: [
      'Der Bahia-Palast ist eines der meistbesuchten Monumente Marokkos — besonders in der Hochsaison (März bis Mai und September bis Oktober) kann die Warteschlange an der Kasse 30 bis 45 Minuten betragen. Für ein Monument, das 60 bis 90 Minuten Besichtigungszeit benötigt, ist das unverhältnismäßig lang — und vollständig vermeidbar.',
      'Die einfachste Lösung ist der Online-Kauf des Tickets vor der Anreise. Vorvalidierte Tickets enthalten einen QR-Code, der Zugang zum Prioritätseingang gewährt — kein Anstehen an der Kasse, kein Bargeld erforderlich. Die meisten Besucher, die online kaufen, sind innerhalb von 2 Minuten nach der Ankunft im Palast.',
      'Auch das Timing spielt eine Rolle. Das ruhigste Zeitfenster ist dienstags oder donnerstags morgens zwischen 9:00 und 10:30 Uhr. Der Palast öffnet um 9:00 Uhr, und Reisegruppen kommen in der Regel ab 10:00 Uhr an. Meiden Sie Samstagsnachmittage und Schulferienwochen in der Hochsaison.',
    ],
    tips: [
      'Online kaufen — das ist die effektivste Strategie gegen Warteschlangen.',
      'Pünktlich um 9:00 Uhr an einem Wochentag ankommen.',
      'Bequeme flache Schuhe tragen und einen leichten Schal mitbringen.',
    ],
  },
  {
    slug: 'history-of-bahia-palace',
    locale: 'de',
    category: 'history',
    title: 'Die Geschichte des Bahia-Palasts: Macht, Schönheit und Intrigen in Marrakesch',
    excerpt: 'Im Verborgenen erbaut, durch Ehrgeiz erweitert und schließlich mit Gewalt erobert — die Geschichte des Bahia-Palasts ist so dramatisch wie seine Architektur.',
    readTime: 5,
    publishedAt: '2025-11-10',
    body: [
      'Der Bahia-Palast wurde nicht als einmaliger großer Wurf erbaut. Er wuchs langsam, in zwei Phasen, über mehrere Jahrzehnte des späten 19. Jahrhunderts. Die erste Phase wurde von Si Moussa in Auftrag gegeben, dem einflussreichen Großwesir von Sultan Moulay Hassan I. Er begann den Bau in den 1860er Jahren und nannte den Palast "Bahia" — auf Arabisch "die Strahlende" oder "die Schöne".',
      'Nach dem Tod von Si Moussa erbte sein Sohn Ba Ahmed das Anwesen und erweiterte es erheblich. Er ließ 150 Handwerker aus Fes kommen und fügte den berühmten Großen Hof, Muqarnas-Decken und Dutzende von Privatgemächern hinzu. Der Palast erstreckte sich schließlich über fast 8 Hektar mit mehr als 150 Zimmern.',
      'Als Ba Ahmed im Jahr 1900 starb, beschlagnahmten die französischen Besatzungskräfte den Palast fast sofort. General Lyautey nutzte ihn als Residenz während des französischen Protektorats. Heute ist er eines der am besten erhaltenen Beispiele marokkanischer Palastarchitektur des späten 19. Jahrhunderts.',
    ],
    tips: [
      'Schauen Sie nach oben — die bemalte Zedernholzdecke ist das Highlight des Palastes.',
      'Der Innengarten ist im Frühling am schönsten, wenn die Orangenbäume blühen.',
      'Ein offizieller Reiseführer enthüllt Details, die Einzelbesuchern oft entgehen.',
    ],
  },
  {
    slug: 'marrakech-tourist-scams-guide',
    locale: 'de',
    category: 'safety',
    title: 'Touristenbetrug in Marrakesch: Was Besucher des Bahia-Palasts wissen müssen',
    excerpt: 'Eine kleine Anzahl von Betrügereien zielt auf Touristen rund um den Bahia-Palast ab. Wer sie kennt, kann sie leicht vermeiden.',
    readTime: 4,
    publishedAt: '2025-11-05',
    body: [
      'Marrakesch ist eine aufrichtig gastfreundliche Stadt. Die touristische Erfahrung rund um große Sehenswürdigkeiten wie den Bahia-Palast ist überwiegend positiv. Dennoch gibt es eine kleine Anzahl von Personen, die auf unvorsichtige oder uninformierte Besucher abzielen — und wer ihre Taktiken kennt, schützt sich nahezu vollständig.',
      'Der häufigste Betrug in der Nähe des Bahia-Palasts ist der "geschlossenes Monument"-Trick: Ein freundlicher Fremder nähert sich und behauptet, der Palast sei wegen einer privaten Veranstaltung oder Renovierung geschlossen — und bietet an, Sie zu einem "genauso schönen" Ort zu führen. Der Palast ist täglich von 9:00 bis 17:00 Uhr geöffnet. Gehen Sie direkt zum Eingang und ignorieren Sie solche Annäherungsversuche.',
      'Der beste Schutz: Kaufen Sie Ihr Ticket online, bevor Sie ankommen. Mit einem vorvalidierten QR-Code gibt es am Eingang nichts zu verhandeln und keinen Grund, mit unbefugten Personen zu interagieren.',
    ],
    tips: [
      'Ticket online kaufen — beseitigt die häufigste Kategorie von Eingangsbetrügereien.',
      'Maps.me offline herunterladen, bevor Sie die Medina betreten.',
      'Taxipreise immer vorher aushandeln oder auf dem Taxameter bestehen.',
    ],
  },

  // ─── SPANISH ───────────────────────────────────────────────────────────────
  {
    slug: 'bahia-palace-skip-the-line-guide',
    locale: 'es',
    category: 'visit-tips',
    title: 'Cómo saltarse la cola en el Palacio Bahia: guía completa',
    excerpt: 'Las largas colas en el Palacio Bahia son evitables. Esta guía te muestra cómo superar las multitudes y disfrutar del palacio en su mejor momento.',
    readTime: 4,
    publishedAt: '2025-11-15',
    body: [
      'El Palacio Bahia es uno de los monumentos más visitados de Marruecos — y se nota. En temporada alta (marzo a mayo y septiembre a octubre) la cola de la taquilla puede extenderse 30-45 minutos. Para un monumento que se visita en 60-90 minutos, es una espera desproporcionada. La buena noticia: es completamente evitable.',
      'La solución más sencilla es comprar la entrada online antes de llegar. Las entradas prevalidadas incluyen un código QR que da acceso a la entrada prioritaria — sin cola, sin efectivo, sin estrés. La mayoría de los visitantes que compran online están dentro del palacio en menos de 2 minutos tras llegar.',
      'El momento de la visita también importa. El horario más tranquilo es el martes o jueves por la mañana entre las 9:00 y las 10:30. El palacio abre a las 9:00 y los grupos organizados suelen llegar a partir de las 10:00. Evita los sábados por la tarde y las semanas de vacaciones escolares en temporada alta.',
    ],
    tips: [
      'Compra online — es la estrategia más eficaz contra las colas.',
      'Llega puntual a las 9:00 un día entre semana para la mayor tranquilidad.',
      'Lleva zapatos cómodos y un fular ligero para cubrir hombros y rodillas.',
    ],
  },
  {
    slug: 'history-of-bahia-palace',
    locale: 'es',
    category: 'history',
    title: 'La historia del Palacio Bahia: poder, belleza e intrigas en Marrakech',
    excerpt: 'Construido en secreto, ampliado por la ambición y conquistado por la fuerza — la historia del Palacio Bahia es tan dramática como su arquitectura.',
    readTime: 5,
    publishedAt: '2025-11-10',
    body: [
      'El Palacio Bahia no se construyó en un único gran gesto. Creció lentamente, en dos fases, a lo largo de varias décadas de finales del siglo XIX. La primera fase fue encargada por Si Moussa, influyente chambelán y Gran Visir del sultán Moulay Hassan I. Comenzó la construcción en la década de 1860 y bautizó el palacio como "Bahia" — que significa "Brillante" o "Bella" en árabe.',
      'Tras la muerte de Si Moussa, su hijo Ba Ahmed heredó la propiedad y la amplió considerablemente. Hizo venir a 150 artesanos de Fez y añadió el famoso Gran Patio, techos de muqarnas y decenas de aposentos privados. El palacio se extendió por casi 8 hectáreas con más de 150 habitaciones organizadas alrededor de riads y patios interiores.',
      'Cuando Ba Ahmed murió en 1900, las fuerzas francesas se apoderaron del palacio casi de inmediato. El general Lyautey lo utilizó como residencia durante el Protectorado francés. Hoy es uno de los ejemplos mejor conservados de arquitectura palatial marroquí de finales del siglo XIX.',
    ],
    tips: [
      'Mira hacia arriba — el techo de cedro pintado es el punto culminante del palacio.',
      'El jardín interior es más hermoso en primavera, cuando florecen los naranjos.',
      'Una guía oficial revela detalles que los visitantes no acompañados no perciben.',
    ],
  },
  {
    slug: 'marrakech-tourist-scams-guide',
    locale: 'es',
    category: 'safety',
    title: 'Estafas a turistas en Marrakech cerca del Palacio Bahia (y cómo evitarlas)',
    excerpt: 'Un pequeño número de estafas se dirige a los turistas alrededor del Palacio Bahia. Conocerlas de antemano las convierte en simples anécdotas.',
    readTime: 4,
    publishedAt: '2025-11-05',
    body: [
      'Marrakech es una ciudad genuinamente acogedora, con gente cálida y hospitalaria. La experiencia turística alrededor de los grandes monumentos como el Palacio Bahia es abrumadoramente positiva. Dicho esto, un pequeño número de individuos se aprovecha de los visitantes distraídos o desinformados — y conocer sus tácticas elimina prácticamente todo riesgo.',
      'La estafa más común cerca del Palacio Bahia es el truco del "monumento cerrado": un desconocido amigable se acerca y te dice que el palacio está cerrado por un evento privado, festivo o reformas — y se ofrece a llevarte a un lugar "igualmente bello". El palacio está abierto todos los días de 9:00 a 17:00. Ve directamente a la entrada e ignora cualquier acercamiento de este tipo.',
      'La mejor protección es la misma que la estrategia para evitar colas: compra tu entrada online antes de llegar. Con un QR prevalidado, no hay nada que negociar en la entrada y ningún motivo para interactuar con personas no autorizadas.',
    ],
    tips: [
      'Compra la entrada online — elimina la categoría más común de estafas en la entrada.',
      'Descarga Maps.me sin conexión antes de entrar en la medina.',
      'Negocia siempre el precio del taxi antes de subir o insiste en el taxímetro.',
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
