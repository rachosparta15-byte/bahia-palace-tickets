/**
 * The prose body of /tickets.
 *
 * WHY THIS FILE EXISTS. /tickets ranked at position 10.9 for "bahia palace
 * tickets" while every other commercial query on this site sat between 2 and 5.
 * Part of that was the title, fixed separately. The rest was that the page had
 * 281 words including its own header and footer — a heading and a price grid,
 * no prose at all — against a competitor ranking above it with a 2,400-word
 * guide covering the same ground.
 *
 * WHAT IT MUST NOT DO. Repeat /entrance-fee. That page owns the fee itself: the
 * bands, who pays what, the resident rate. Duplicating its table here would
 * recreate, between two of our own pages, exactly the cannibalisation the title
 * change was meant to end. The split:
 *
 *   /entrance-fee   how much does it cost      the price table
 *   /tickets        which ticket, bought where the purchase decision
 *
 * So this covers the three ways to buy, what entry does and does not include,
 * what the queue is actually like, and what to know before arriving — none of
 * which /entrance-fee answers.
 *
 * NUMBERS ARE PLACEHOLDERS, NOT LITERALS. {adult}, {child}, {ageMin} and
 * {ageMax} are filled from config/pricing.ts at render time. A price written
 * into prose in seven languages is a price that drifts in seven languages: the
 * meta descriptions on /entrance-fee had already drifted away from that page's
 * own table and told Spanish and Portuguese families a seven-year-old was free
 * when they pay 50 MAD. Nothing here restates a figure that lives in config.
 */

export interface TicketsContent {
  sections: { heading: string; paragraphs: string[] }[];
  faqHeading: string;
  faq: { q: string; a: string }[];
}

/** `**bold**` is the only markup honoured — see renderEmphasis in page.tsx. */
export const TICKETS_CONTENT: Record<string, TicketsContent> = {
  en: {
    sections: [
      {
        heading: 'Where you can buy a Bahia Palace ticket',
        paragraphs: [
          'There are three ways in. They differ in what you pay for and how long you queue — not in what you see. Every visitor walks the same route through the same rooms.',
          '**At the gate.** Pay on the day in Moroccan dirhams, cash only; the window does not take cards. This is the cheapest option and the slowest one. The queue is outside, and most of it has no shade.',
          '**On the official portal.** Morocco’s Ministry of Culture sells timed entry online. You choose a date and a slot, pay by card, and arrive with a QR code. It costs the same as the gate.',
          '**Skip-the-line with an audio guide.** A partner ticket bundling timed entry with a digital guide you play on your own phone. It costs more than the gate price, and what the difference buys is the queue and the commentary.',
        ],
      },
      {
        heading: 'What a ticket includes — and what it does not',
        paragraphs: [
          'Entry covers the whole visitable palace: the great courtyard, the small riad, the council chamber, the apartments and the gardens. Nothing inside is ticketed separately, and there is no upper floor to pay extra for.',
          'It does not include a human guide. Guides wait at the entrance and negotiate their own fee. A digital audio guide, where a ticket bundles one, is not the same thing and does not replace one.',
          'It does not include transport, food or parking. There is no cafe inside the palace.',
        ],
      },
      {
        heading: 'How long the queue actually is',
        paragraphs: [
          'Off-season and early in the morning, you walk straight in. The wait builds through the middle of the day and is at its worst in spring and autumn — March to May, October to November — and at weekends, when 45 to 90 minutes is normal.',
          'The queue is for the ticket window, not for the door. A ticket bought in advance, on the official portal or through a partner, is what removes it.',
        ],
      },
      {
        heading: 'Before you go',
        paragraphs: [
          'The palace opens every day from 9:00 to 17:00, and last entry falls before closing rather than at it — arriving at 16:50 does not buy you ten minutes inside.',
          'Keep the ticket on your phone; a screenshot works and nothing needs printing. Dress for a monument rather than a mosque: shoulders and knees covered is courteous. The floors are uneven tilework throughout, so soles with grip beat smooth ones.',
        ],
      },
    ],
    faqHeading: 'Bahia Palace tickets: common questions',
    faq: [
      {
        q: 'How much is a Bahia Palace ticket?',
        a: '{adult} MAD for foreign adults at the gate, {child} MAD for children aged {ageMin} to {ageMax}, and free for children under {ageMin}. Moroccan nationals and residents pay 30 MAD.',
      },
      {
        q: 'Can I buy Bahia Palace tickets at the entrance?',
        a: 'Yes, in cash and in Moroccan dirhams only. The window does not take cards, and the queue is why most visitors buy ahead.',
      },
      {
        q: 'Do I need to book Bahia Palace tickets in advance?',
        a: 'Not in order to get in — the palace does not sell out. You book ahead to skip the ticket queue, which matters most at midday, at weekends, and in spring and autumn.',
      },
      {
        q: 'Is an audio guide included with the ticket?',
        a: 'Not with a gate ticket. Some partner tickets bundle a digital audio guide you play on your own phone. A human guide is always a separate, negotiated fee.',
      },
      {
        q: 'How long does a visit to Bahia Palace take?',
        a: 'Most visitors spend 45 minutes to an hour and a half inside. The palace is large but single-storey, and the route through it is short.',
      },
    ],
  },

  fr: {
    sections: [
      {
        heading: 'Où acheter un billet pour le Palais Bahia',
        paragraphs: [
          'Il y a trois façons d’entrer. Elles diffèrent par ce que vous payez et par le temps d’attente, pas par ce que vous voyez : tout le monde suit le même parcours dans les mêmes salles.',
          '**Au guichet.** Paiement sur place, en dirhams et en espèces uniquement ; la carte n’est pas acceptée. C’est l’option la moins chère et la plus lente. La file est dehors et reste sans ombre sur la majeure partie de son trajet.',
          '**Sur le portail officiel.** Le ministère de la Culture vend des entrées horodatées en ligne. Vous choisissez une date et un créneau, vous payez par carte et vous arrivez avec un QR code. Le tarif est celui du guichet.',
          '**Coupe-file avec audioguide.** Un billet partenaire qui associe une entrée horodatée à un guide numérique écouté sur votre téléphone. Il coûte plus cher que le tarif d’entrée : la différence paie la file évitée et le commentaire.',
        ],
      },
      {
        heading: 'Ce que le billet comprend — et ce qu’il ne comprend pas',
        paragraphs: [
          'L’entrée donne accès à tout le palais visitable : la grande cour, le petit riad, la salle du conseil, les appartements et les jardins. Rien à l’intérieur ne se paie séparément et aucun étage ne se règle en supplément.',
          'Elle ne comprend pas de guide humain. Les guides attendent à l’entrée et négocient leur tarif. Un audioguide numérique, quand un billet en inclut un, n’est pas la même chose et ne le remplace pas.',
          'Elle ne comprend ni transport, ni repas, ni stationnement. Il n’y a pas de café à l’intérieur du palais.',
        ],
      },
      {
        heading: 'La durée réelle de la file',
        paragraphs: [
          'Hors saison et tôt le matin, vous entrez directement. L’attente monte en milieu de journée et culmine au printemps et à l’automne — de mars à mai, d’octobre à novembre — ainsi que le week-end, où 45 à 90 minutes sont courantes.',
          'La file est celle du guichet, pas celle de la porte. Un billet acheté à l’avance, sur le portail officiel ou chez un partenaire, est ce qui la supprime.',
        ],
      },
      {
        heading: 'Avant de partir',
        paragraphs: [
          'Le palais ouvre tous les jours de 9h à 17h, et la dernière entrée précède la fermeture : arriver à 16h50 ne vous offre pas dix minutes à l’intérieur.',
          'Gardez le billet sur votre téléphone ; une capture d’écran suffit et rien n’a besoin d’être imprimé. Habillez-vous pour un monument, pas pour une mosquée : épaules et genoux couverts par courtoisie. Les sols sont en zellige irrégulier partout, mieux vaut des semelles qui accrochent.',
        ],
      },
    ],
    faqHeading: 'Billets du Palais Bahia : questions fréquentes',
    faq: [
      {
        q: 'Combien coûte un billet pour le Palais Bahia ?',
        a: '{adult} MAD pour les adultes étrangers au guichet, {child} MAD pour les enfants de {ageMin} à {ageMax} ans, et gratuit pour les moins de {ageMin} ans. Les Marocains et les résidents paient 30 MAD.',
      },
      {
        q: 'Peut-on acheter les billets du Palais Bahia sur place ?',
        a: 'Oui, en espèces et en dirhams uniquement. Le guichet n’accepte pas la carte, et c’est la file d’attente qui pousse la plupart des visiteurs à acheter à l’avance.',
      },
      {
        q: 'Faut-il réserver les billets du Palais Bahia à l’avance ?',
        a: 'Pas pour entrer : le palais n’affiche jamais complet. On réserve pour éviter la file du guichet, surtout en milieu de journée, le week-end, au printemps et à l’automne.',
      },
      {
        q: 'L’audioguide est-il inclus dans le billet ?',
        a: 'Pas avec un billet acheté au guichet. Certains billets partenaires incluent un audioguide numérique à écouter sur votre téléphone. Un guide humain reste toujours un tarif négocié à part.',
      },
      {
        q: 'Combien de temps faut-il pour visiter le Palais Bahia ?',
        a: 'La plupart des visiteurs y passent de 45 minutes à une heure et demie. Le palais est vaste mais de plain-pied, et le parcours y est court.',
      },
    ],
  },

  es: {
    sections: [
      {
        heading: 'Dónde comprar una entrada para el Palacio Bahía',
        paragraphs: [
          'Hay tres formas de entrar. Se diferencian en lo que pagas y en cuánto esperas, no en lo que ves: todos los visitantes recorren las mismas salas por el mismo camino.',
          '**En taquilla.** Se paga el mismo día, en dirhams y solo en efectivo; la ventanilla no acepta tarjeta. Es la opción más barata y la más lenta. La cola está fuera y en su mayor parte no tiene sombra.',
          '**En el portal oficial.** El Ministerio de Cultura vende entradas con hora por internet. Eliges día y franja, pagas con tarjeta y llegas con un código QR. Cuesta lo mismo que en taquilla.',
          '**Sin colas con audioguía.** Una entrada de socio que combina el acceso con hora y una guía digital que escuchas en tu propio móvil. Cuesta más que el precio de taquilla: la diferencia paga la cola evitada y el comentario.',
        ],
      },
      {
        heading: 'Qué incluye la entrada y qué no',
        paragraphs: [
          'La entrada da acceso a todo el palacio visitable: el gran patio, el riad pequeño, la sala del consejo, los aposentos y los jardines. Nada del interior se paga aparte y no hay una planta superior con suplemento.',
          'No incluye guía humano. Los guías esperan en la entrada y negocian su tarifa. Una audioguía digital, cuando una entrada la incluye, no es lo mismo ni la sustituye.',
          'No incluye transporte, comida ni aparcamiento. Dentro del palacio no hay cafetería.',
        ],
      },
      {
        heading: 'Cuánto dura la cola en realidad',
        paragraphs: [
          'Fuera de temporada y a primera hora se entra directamente. La espera crece a mediodía y es peor en primavera y otoño — de marzo a mayo y de octubre a noviembre — y los fines de semana, cuando 45 a 90 minutos es lo normal.',
          'La cola es la de la taquilla, no la de la puerta. Una entrada comprada por adelantado, en el portal oficial o con un socio, es lo que la elimina.',
        ],
      },
      {
        heading: 'Antes de ir',
        paragraphs: [
          'El palacio abre todos los días de 9:00 a 17:00, y la última entrada es antes del cierre, no a la hora del cierre: llegar a las 16:50 no te da diez minutos dentro.',
          'Lleva la entrada en el móvil; una captura sirve y no hace falta imprimir nada. Vístete para un monumento, no para una mezquita: hombros y rodillas cubiertos por cortesía. Los suelos son de zellige irregular en todo el recorrido, así que mejor suelas con agarre.',
        ],
      },
    ],
    faqHeading: 'Entradas del Palacio Bahía: preguntas frecuentes',
    faq: [
      {
        q: '¿Cuánto cuesta una entrada del Palacio Bahía?',
        a: '{adult} MAD para adultos extranjeros en taquilla, {child} MAD para niños de {ageMin} a {ageMax} años y gratis para menores de {ageMin}. Los marroquíes y residentes pagan 30 MAD.',
      },
      {
        q: '¿Se pueden comprar las entradas del Palacio Bahía en la puerta?',
        a: 'Sí, en efectivo y solo en dirhams. La ventanilla no acepta tarjeta, y la cola es el motivo por el que la mayoría compra por adelantado.',
      },
      {
        q: '¿Hay que reservar las entradas del Palacio Bahía con antelación?',
        a: 'No para entrar: el palacio no se agota. Se reserva para evitar la cola de la taquilla, que importa sobre todo a mediodía, los fines de semana y en primavera y otoño.',
      },
      {
        q: '¿La audioguía está incluida en la entrada?',
        a: 'No con una entrada de taquilla. Algunas entradas de socios incluyen una audioguía digital para escuchar en tu móvil. Un guía humano es siempre una tarifa aparte y negociada.',
      },
      {
        q: '¿Cuánto se tarda en visitar el Palacio Bahía?',
        a: 'La mayoría pasa entre 45 minutos y hora y media dentro. El palacio es grande pero de una sola planta, y el recorrido es corto.',
      },
    ],
  },

  de: {
    sections: [
      {
        heading: 'Wo Sie ein Ticket für den Bahia-Palast kaufen',
        paragraphs: [
          'Es gibt drei Wege hinein. Sie unterscheiden sich darin, wofür Sie zahlen und wie lange Sie anstehen — nicht darin, was Sie sehen. Alle Besucher gehen denselben Weg durch dieselben Räume.',
          '**An der Kasse.** Zahlung am selben Tag, in Dirham und nur bar; Karten nimmt der Schalter nicht. Das ist die günstigste und die langsamste Variante. Die Schlange steht draußen, über weite Strecken ohne Schatten.',
          '**Über das offizielle Portal.** Das marokkanische Kulturministerium verkauft Zeitfenster-Tickets online. Sie wählen Datum und Uhrzeit, zahlen per Karte und kommen mit einem QR-Code. Der Preis entspricht dem an der Kasse.',
          '**Skip-the-Line mit Audioguide.** Ein Partnerticket, das Zeitfenster-Eintritt mit einem digitalen Guide auf Ihrem eigenen Telefon verbindet. Es kostet mehr als der Kassenpreis; die Differenz zahlt die gesparte Schlange und den Kommentar.',
        ],
      },
      {
        heading: 'Was im Ticket enthalten ist — und was nicht',
        paragraphs: [
          'Der Eintritt gilt für den gesamten begehbaren Palast: den großen Hof, den kleinen Riad, den Ratssaal, die Wohnräume und die Gärten. Nichts im Inneren wird separat berechnet, und es gibt kein Obergeschoss gegen Aufpreis.',
          'Ein menschlicher Guide ist nicht enthalten. Guides warten am Eingang und verhandeln ihr Honorar selbst. Ein digitaler Audioguide, sofern ein Ticket einen enthält, ist etwas anderes und ersetzt ihn nicht.',
          'Transport, Verpflegung und Parken sind nicht enthalten. Im Palast gibt es kein Café.',
        ],
      },
      {
        heading: 'Wie lang die Schlange wirklich ist',
        paragraphs: [
          'Außerhalb der Saison und früh am Morgen gehen Sie direkt hinein. Die Wartezeit wächst über die Mittagsstunden und ist im Frühjahr und Herbst am längsten — März bis Mai, Oktober bis November — sowie an Wochenenden, wenn 45 bis 90 Minuten normal sind.',
          'Die Schlange steht am Ticketschalter, nicht an der Tür. Ein im Voraus gekauftes Ticket, über das offizielle Portal oder einen Partner, ist das, was sie beseitigt.',
        ],
      },
      {
        heading: 'Vor dem Besuch',
        paragraphs: [
          'Der Palast öffnet täglich von 9 bis 17 Uhr, und der letzte Einlass liegt vor der Schließung, nicht zu ihr: Wer um 16:50 Uhr ankommt, bekommt keine zehn Minuten drinnen.',
          'Behalten Sie das Ticket auf dem Telefon; ein Screenshot genügt, gedruckt werden muss nichts. Kleiden Sie sich für ein Baudenkmal, nicht für eine Moschee: bedeckte Schultern und Knie sind höflich. Die Böden sind durchgehend unebenes Zellige, griffige Sohlen sind besser als glatte.',
        ],
      },
    ],
    faqHeading: 'Bahia Palast Tickets: häufige Fragen',
    faq: [
      {
        q: 'Was kostet ein Ticket für den Bahia-Palast?',
        a: '{adult} MAD für ausländische Erwachsene an der Kasse, {child} MAD für Kinder von {ageMin} bis {ageMax} Jahren und frei für Kinder unter {ageMin} Jahren. Marokkaner und Ansässige zahlen 30 MAD.',
      },
      {
        q: 'Kann ich Tickets für den Bahia-Palast am Eingang kaufen?',
        a: 'Ja, bar und ausschließlich in Dirham. Der Schalter nimmt keine Karten, und die Schlange ist der Grund, warum die meisten vorher kaufen.',
      },
      {
        q: 'Muss ich Tickets für den Bahia-Palast im Voraus buchen?',
        a: 'Nicht um hineinzukommen — der Palast ist nie ausverkauft. Man bucht vorher, um die Schlange am Schalter zu umgehen, was mittags, am Wochenende und im Frühjahr und Herbst am meisten zählt.',
      },
      {
        q: 'Ist ein Audioguide im Ticket enthalten?',
        a: 'Nicht bei einem Kassenticket. Manche Partnertickets enthalten einen digitalen Audioguide für das eigene Telefon. Ein menschlicher Guide ist immer ein separates, ausgehandeltes Honorar.',
      },
      {
        q: 'Wie lange dauert ein Besuch im Bahia-Palast?',
        a: 'Die meisten Besucher bleiben 45 Minuten bis anderthalb Stunden. Der Palast ist groß, aber ebenerdig, und der Rundgang ist kurz.',
      },
    ],
  },

  it: {
    sections: [
      {
        heading: 'Dove acquistare un biglietto per il Palazzo Bahia',
        paragraphs: [
          'Ci sono tre modi per entrare. Differiscono per quello che paghi e per quanto aspetti, non per quello che vedi: tutti percorrono le stesse sale lungo lo stesso itinerario.',
          '**Alla biglietteria.** Si paga in giornata, in dirham e solo in contanti; lo sportello non accetta carte. È l’opzione più economica e la più lenta. La fila è all’aperto e per gran parte del percorso non ha ombra.',
          '**Sul portale ufficiale.** Il Ministero della Cultura vende ingressi a orario online. Scegli data e fascia, paghi con carta e arrivi con un codice QR. Costa quanto la biglietteria.',
          '**Salta-fila con audioguida.** Un biglietto partner che unisce l’ingresso a orario e una guida digitale da ascoltare sul tuo telefono. Costa più del prezzo alla biglietteria: la differenza paga la fila evitata e il commento.',
        ],
      },
      {
        heading: 'Cosa comprende il biglietto e cosa no',
        paragraphs: [
          'L’ingresso dà accesso a tutto il palazzo visitabile: il grande cortile, il piccolo riad, la sala del consiglio, gli appartamenti e i giardini. Nulla all’interno si paga a parte e non esiste un piano superiore a supplemento.',
          'Non comprende una guida umana. Le guide aspettano all’ingresso e contrattano il proprio compenso. Un’audioguida digitale, quando un biglietto la include, non è la stessa cosa e non la sostituisce.',
          'Non comprende trasporto, pasti o parcheggio. All’interno del palazzo non c’è un bar.',
        ],
      },
      {
        heading: 'Quanto dura davvero la fila',
        paragraphs: [
          'Fuori stagione e di prima mattina si entra subito. L’attesa cresce a metà giornata ed è peggiore in primavera e in autunno — da marzo a maggio, da ottobre a novembre — e nei fine settimana, quando 45-90 minuti sono normali.',
          'La fila è quella della biglietteria, non quella della porta. Un biglietto comprato in anticipo, sul portale ufficiale o tramite un partner, è ciò che la elimina.',
        ],
      },
      {
        heading: 'Prima di andare',
        paragraphs: [
          'Il palazzo apre tutti i giorni dalle 9:00 alle 17:00, e l’ultimo ingresso precede la chiusura invece di coincidere con essa: arrivare alle 16:50 non regala dieci minuti dentro.',
          'Tieni il biglietto sul telefono; uno screenshot basta e non serve stampare nulla. Vestiti per un monumento, non per una moschea: spalle e ginocchia coperte è cortesia. I pavimenti sono in zellige irregolare ovunque, meglio suole che fanno presa.',
        ],
      },
    ],
    faqHeading: 'Biglietti Palazzo Bahia: domande frequenti',
    faq: [
      {
        q: 'Quanto costa un biglietto per il Palazzo Bahia?',
        a: '{adult} MAD per adulti stranieri alla biglietteria, {child} MAD per bambini dai {ageMin} ai {ageMax} anni e gratis sotto i {ageMin} anni. Marocchini e residenti pagano 30 MAD.',
      },
      {
        q: 'Si possono comprare i biglietti del Palazzo Bahia all’ingresso?',
        a: 'Sì, in contanti e solo in dirham. Lo sportello non accetta carte, e la fila è il motivo per cui la maggior parte dei visitatori compra in anticipo.',
      },
      {
        q: 'Bisogna prenotare in anticipo i biglietti del Palazzo Bahia?',
        a: 'Non per entrare: il palazzo non va mai esaurito. Si prenota per saltare la fila della biglietteria, che pesa soprattutto a metà giornata, nei fine settimana e in primavera e autunno.',
      },
      {
        q: 'L’audioguida è inclusa nel biglietto?',
        a: 'Non con un biglietto della biglietteria. Alcuni biglietti partner includono un’audioguida digitale da ascoltare sul proprio telefono. Una guida umana è sempre un compenso separato e contrattato.',
      },
      {
        q: 'Quanto tempo serve per visitare il Palazzo Bahia?',
        a: 'La maggior parte dei visitatori resta dentro dai 45 minuti a un’ora e mezza. Il palazzo è ampio ma su un solo piano, e il percorso è breve.',
      },
    ],
  },

  pt: {
    sections: [
      {
        heading: 'Onde comprar um bilhete para o Palácio Bahia',
        paragraphs: [
          'Há três formas de entrar. Diferem no que paga e no tempo que espera, não no que vê: todos os visitantes fazem o mesmo percurso pelas mesmas salas.',
          '**Na bilheteira.** Paga no próprio dia, em dirhams e apenas em numerário; o guichê não aceita cartão. É a opção mais barata e a mais lenta. A fila é no exterior e em grande parte não tem sombra.',
          '**No portal oficial.** O Ministério da Cultura vende entradas com hora marcada online. Escolhe a data e o horário, paga com cartão e chega com um código QR. Custa o mesmo que na bilheteira.',
          '**Sem fila com audioguia.** Um bilhete de parceiro que junta a entrada com hora marcada a um guia digital que ouve no seu próprio telemóvel. Custa mais do que o preço da bilheteira: a diferença paga a fila evitada e o comentário.',
        ],
      },
      {
        heading: 'O que o bilhete inclui e o que não inclui',
        paragraphs: [
          'A entrada dá acesso a todo o palácio visitável: o grande pátio, o pequeno riad, a sala do conselho, os aposentos e os jardins. Nada no interior se paga à parte e não há um piso superior com suplemento.',
          'Não inclui guia humano. Os guias esperam à entrada e negoceiam o seu próprio valor. Um audioguia digital, quando um bilhete o inclui, não é a mesma coisa nem o substitui.',
          'Não inclui transporte, refeições ou estacionamento. Dentro do palácio não há café.',
        ],
      },
      {
        heading: 'Quanto dura a fila na realidade',
        paragraphs: [
          'Fora de época e de manhã cedo entra-se de imediato. A espera cresce a meio do dia e é pior na primavera e no outono — de março a maio, de outubro a novembro — e aos fins de semana, quando 45 a 90 minutos é o normal.',
          'A fila é a da bilheteira, não a da porta. Um bilhete comprado com antecedência, no portal oficial ou através de um parceiro, é o que a elimina.',
        ],
      },
      {
        heading: 'Antes de ir',
        paragraphs: [
          'O palácio abre todos os dias das 9:00 às 17:00, e a última entrada é antes do fecho e não à hora do fecho: chegar às 16:50 não lhe dá dez minutos lá dentro.',
          'Leve o bilhete no telemóvel; uma captura de ecrã serve e não é preciso imprimir nada. Vista-se para um monumento, não para uma mesquita: ombros e joelhos cobertos é cortesia. Os pisos são de zellige irregular em todo o percurso, por isso solas com aderência são melhores do que lisas.',
        ],
      },
    ],
    faqHeading: 'Bilhetes do Palácio Bahia: perguntas frequentes',
    faq: [
      {
        q: 'Quanto custa um bilhete para o Palácio Bahia?',
        a: '{adult} MAD para adultos estrangeiros na bilheteira, {child} MAD para crianças dos {ageMin} aos {ageMax} anos e grátis para menores de {ageMin} anos. Marroquinos e residentes pagam 30 MAD.',
      },
      {
        q: 'Posso comprar bilhetes do Palácio Bahia à entrada?',
        a: 'Sim, em numerário e apenas em dirhams. O guichê não aceita cartão, e a fila é a razão pela qual a maioria compra com antecedência.',
      },
      {
        q: 'É preciso reservar os bilhetes do Palácio Bahia com antecedência?',
        a: 'Não para entrar: o palácio nunca esgota. Reserva-se para evitar a fila da bilheteira, o que conta sobretudo a meio do dia, aos fins de semana e na primavera e no outono.',
      },
      {
        q: 'O audioguia está incluído no bilhete?',
        a: 'Não num bilhete de bilheteira. Alguns bilhetes de parceiros incluem um audioguia digital para ouvir no próprio telemóvel. Um guia humano é sempre um valor à parte e negociado.',
      },
      {
        q: 'Quanto tempo demora a visita ao Palácio Bahia?',
        a: 'A maioria dos visitantes passa lá dentro entre 45 minutos e hora e meia. O palácio é grande mas de um só piso, e o percurso é curto.',
      },
    ],
  },

  ar: {
    sections: [
      {
        heading: 'أين تشتري تذكرة قصر الباهية',
        paragraphs: [
          'هناك ثلاث طرق للدخول. تختلف فيما تدفعه وفي مدة الانتظار، لا فيما تراه: كل الزوار يسلكون المسار نفسه عبر القاعات نفسها.',
          '**عند الشبّاك.** الدفع في اليوم نفسه، بالدرهم ونقدًا فقط؛ الشبّاك لا يقبل البطاقات. هذا أرخص الخيارات وأبطؤها. الطابور في الخارج، ومعظمه بلا ظل.',
          '**عبر البوابة الرسمية.** تبيع وزارة الثقافة المغربية تذاكر بموعد محدّد عبر الإنترنت. تختار التاريخ والتوقيت، وتدفع بالبطاقة، وتصل برمز QR. السعر هو سعر الشبّاك نفسه.',
          '**تخطّي الطابور مع دليل صوتي.** تذكرة من شريك تجمع بين الدخول بموعد محدّد ودليل رقمي تشغّله على هاتفك. ثمنها أعلى من سعر الشبّاك، والفرق يشتري الطابور والشرح.',
        ],
      },
      {
        heading: 'ما تشمله التذكرة وما لا تشمله',
        paragraphs: [
          'الدخول يغطي القصر كله بما يمكن زيارته: الفناء الكبير، والرياض الصغير، وقاعة المجلس، والأجنحة، والحدائق. لا شيء في الداخل يُدفع على حدة، ولا يوجد طابق علوي برسم إضافي.',
          'لا تشمل مرشدًا بشريًا. المرشدون ينتظرون عند المدخل ويتفاوضون على أجرهم. والدليل الصوتي الرقمي، حين تتضمنه تذكرة، شيء آخر ولا يحلّ محلّه.',
          'لا تشمل النقل ولا الطعام ولا موقف السيارات. ولا يوجد مقهى داخل القصر.',
        ],
      },
      {
        heading: 'كم يطول الطابور فعلاً',
        paragraphs: [
          'خارج الموسم وفي الصباح الباكر تدخل مباشرة. ينمو الانتظار في منتصف النهار ويبلغ ذروته في الربيع والخريف — من مارس إلى ماي، ومن أكتوبر إلى نونبر — وفي عطل نهاية الأسبوع، حيث 45 إلى 90 دقيقة أمر معتاد.',
          'الطابور هو طابور شبّاك التذاكر، لا طابور الباب. والتذكرة المشتراة مسبقًا، من البوابة الرسمية أو عبر شريك، هي ما يلغيه.',
        ],
      },
      {
        heading: 'قبل الذهاب',
        paragraphs: [
          'يفتح القصر يوميًا من 9:00 إلى 17:00، وآخر دخول يسبق الإغلاق ولا يوافقه: الوصول في 16:50 لا يمنحك عشر دقائق في الداخل.',
          'احتفظ بالتذكرة على هاتفك؛ لقطة الشاشة تكفي ولا حاجة للطباعة. البس لزيارة معلمة تاريخية لا لزيارة مسجد: تغطية الكتفين والركبتين من حسن الذوق. الأرضيات زليج غير مستوٍ في كل المسار، فالنعل الذي يمسك أفضل من الأملس.',
        ],
      },
    ],
    faqHeading: 'تذاكر قصر الباهية: أسئلة شائعة',
    faq: [
      {
        q: 'كم ثمن تذكرة قصر الباهية؟',
        a: '{adult} درهم للبالغين الأجانب عند الشبّاك، و{child} درهمًا للأطفال من {ageMin} إلى {ageMax} سنة، ومجانًا لمن هم دون {ageMin} سنوات. المغاربة والمقيمون يدفعون 30 درهمًا.',
      },
      {
        q: 'هل يمكن شراء تذاكر قصر الباهية عند المدخل؟',
        a: 'نعم، نقدًا وبالدرهم فقط. الشبّاك لا يقبل البطاقات، والطابور هو السبب الذي يجعل معظم الزوار يشترون مسبقًا.',
      },
      {
        q: 'هل يلزم حجز تذاكر قصر الباهية مسبقًا؟',
        a: 'ليس للدخول: القصر لا تنفد تذاكره. الحجز المسبق لتفادي طابور الشبّاك، وهو ما يهمّ أكثر في منتصف النهار وفي عطل نهاية الأسبوع وفي الربيع والخريف.',
      },
      {
        q: 'هل الدليل الصوتي مشمول في التذكرة؟',
        a: 'ليس مع تذكرة الشبّاك. بعض تذاكر الشركاء تتضمّن دليلًا صوتيًا رقميًا تشغّله على هاتفك. أما المرشد البشري فأجره دائمًا منفصل ومتفاوَض عليه.',
      },
      {
        q: 'كم تستغرق زيارة قصر الباهية؟',
        a: 'يقضي معظم الزوار من 45 دقيقة إلى ساعة ونصف في الداخل. القصر واسع لكنه من طابق واحد، والمسار داخله قصير.',
      },
    ],
  },
};
