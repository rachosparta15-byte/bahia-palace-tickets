import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const SLUG = 'bahia-palace-vs-dar-si-said';
const COVER = '/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg';
const DATE = new Date('2026-06-27');

// ---------------------------------------------------------------------------
// FRENCH
// ---------------------------------------------------------------------------
const CONTENT_FR = `<p>La plupart des visiteurs de la médina sud de Marrakech passent devant un palais pour se rendre à l'autre. Le Palais Bahia attire les files d'attente, les cars de tourisme et la couverture des guides. Dar Si Said — aujourd'hui le Musée national du Tissage et du Tapis (rouvert en 2018 après restauration) — se trouve à quelques minutes sur la même rue, presque vide la plupart des matins. Ce que la plupart des guides ne mentionnent pas, c'est pourquoi les deux coexistent côte à côte : les deux édifices ont été construits entre 1894 et 1900, dans le même style architectural, par des frères de la même famille. Ba Ahmed ibn Moussa a agrandi et achevé le Palais Bahia dans son rôle de Grand Vizir ; son frère Si Said ibn Moussa, qui était ministre à la même cour, a construit ce qui est devenu Dar Si Said. En 2024, le Maroc a accueilli 17,4 millions de visiteurs internationaux (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Rapport annuel du tourisme marocain 2024</a>), et presque tous ont choisi Bahia. La bonne décision dépend de ce que vous cherchez.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>À retenir</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Les deux palais ont été construits par des frères de la même famille entre 1894 et 1900 par des artisans de Fès — ils partagent le même vocabulaire architectural mais diffèrent considérablement par leur échelle et leur agencement.</li>
  <li>Le Palais Bahia s'étend sur ~8 000 m² de plain-pied ; Dar Si Said est multi-niveaux avec un étage distinctif, un jardin riad et un pavillon en bois sculpté — plus petit, mais d'un caractère différent.</li>
  <li>Le principal avantage de Dar Si Said, c'est le calme : là où Bahia se remplit de groupes de touristes dès le milieu de la matinée, Dar Si Said est rarement bondé à n'importe quelle heure. Les deux peuvent se faire en une demi-journée.</li>
</ul>
</div>

<h2>Réponse rapide : Palais Bahia vs Dar Si Said en un coup d'œil</h2>

<table>
  <thead>
    <tr><th></th><th>Palais Bahia</th><th>Dar Si Said</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Construit par</strong></td><td>Ba Ahmed ibn Moussa (Grand Vizir)</td><td>Si Said ibn Moussa (ministre, frère de Ba Ahmed)</td></tr>
    <tr><td><strong>Période</strong></td><td>1894–1900</td><td>1894–1900</td></tr>
    <tr><td><strong>Vocation actuelle</strong></td><td>Architecture palatiale du XIXe siècle et histoire</td><td>Tissage, tapis et artisanat marocain (depuis 2018)</td></tr>
    <tr><td><strong>Disposition</strong></td><td>Plain-pied — cours multiples, jardins, salles de réception</td><td>Multi-niveaux — salle de mariage à l'étage, jardin riad, pavillon</td></tr>
    <tr><td><strong>Superficie</strong></td><td>~8 000 m²</td><td>Compact — empreinte bien plus petite</td></tr>
    <tr><td><strong>Temps de visite</strong></td><td>75–90 min</td><td>30–45 min</td></tr>
    <tr><td><strong>Entrée (2026)</strong></td><td>100 MAD (adulte étranger)</td><td>Vérifier sur place</td></tr>
    <tr><td><strong>Affluence</strong></td><td>Modérée à chargée (pic : 10h30–14h00)</td><td>Rarement bondé</td></tr>
    <tr><td><strong>Idéal pour</strong></td><td>Premières visites, grande échelle, histoire de cour</td><td>Passionnés d'artisanat, salle de l'étage, expérience calme</td></tr>
  </tbody>
</table>
<p style="font-size:0.85rem;color:#5C3D20;margin-top:0.5rem;">Prix en 2026 — vérifier sur place. Les deux caisses acceptent uniquement les espèces.</p>

<h2>Qu'est-ce que Dar Si Said ?</h2>

<p>Dar Si Said a été construit entre 1894 et 1900 par Si Said ibn Moussa, frère de Ba Ahmed — le Grand Vizir qui agrandit le Palais Bahia pendant les mêmes années. Si Said était ministre à la même cour, et les deux frères semblent avoir rivalisé d'ambition architecturale : tous deux ont fait appel à des artisans de Fès pour produire plâtre sculpté, zellige et plafonds en cèdre peint dans la même tradition. Le résultat fut deux palais de haute qualité construits en parallèle, à quelques centaines de mètres l'un de l'autre sur la même rue de la médina.</p>

<p>Contrairement au Palais Bahia, organisé sur un seul niveau de cours et de salles de réception interconnectées, Dar Si Said est multi-niveaux. Le rez-de-chaussée s'articule autour d'une cour avec jardin riad et pavillon en bois peint sculpté ; un escalier en bois sculpté mène à l'étage, où se trouve la pièce la plus célèbre du bâtiment — une salle de mariage ornée d'une décoration en stuc exceptionnelle et de plafonds en cèdre peint, traditionnellement utilisée pour les préparatifs et cérémonies nuptiales.</p>

<p>Depuis sa réouverture en 2018 après restauration, le bâtiment fonctionne comme Musée national du Tissage et du Tapis. La collection couvre les arts textiles marocains traditionnels : tapis et kilims tissés à la main de la tradition berbère de l'Atlas, styles d'ateliers urbains de Fès et Rabat, outils de tissage historiques et exemples de variation artisanale régionale à travers le Maroc. Vérifiez les horaires et le prix d'entrée sur place.</p>

<h2>Qu'est-ce que le Palais Bahia ?</h2>

<p>Le Palais Bahia a été agrandi et achevé par Ba Ahmed ibn Moussa entre 1894 et 1900, alors qu'il servait comme Grand Vizir sous le sultan Abdelaziz. À son achèvement, c'était la résidence privée la plus grande et la plus luxueusement décorée du Maroc. Ba Ahmed mourut en 1900 et, en l'espace de quelques jours, le sultan Abdelaziz fit retirer chaque meuble, tapis et objet décoratif des salles. Le bâtiment est vide depuis — c'est la première chose que les visiteurs remarquent et le détail qui nécessite le plus d'explications avant l'arrivée. L'histoire complète est dans l'<a href="/fr/blog/bahia-palace-history">article sur l'histoire du Palais Bahia</a>. Entrée : 100 MAD pour les adultes étrangers (tarif 2026 confirmé). Un <a href="/fr/tickets">billet réservé en ligne</a> évite la file à l'entrée sans changer le prix.</p>

<figure style="margin:1.5rem 0;text-align:center;">
  <img src="/images/gallery/bahia-palace-grand-courtyard-balcony-view-fountain.jpg" alt="La grande cour du riad du Palais Bahia Marrakech montrant l'agencement de plain-pied avec les orangers et la fontaine centrale — une disposition spatiale très différente du multi-niveaux de Dar Si Said" width="1200" height="800" loading="lazy" style="width:100%;max-width:900px;height:auto;border-radius:0.75rem;display:block;margin:0 auto;" />
  <figcaption style="font-size:0.8rem;color:#5C3D20;margin-top:0.5rem;">Le Grand Riad du Palais Bahia : une cour de plain-pied très différente de la disposition multi-niveaux de Dar Si Said. Photo : Abdellah / visitbahiapalace.com</figcaption>
</figure>

<h2>Comparaison architecturale</h2>

<p>Les deux palaces partagent le même vocabulaire de base — zellige, plâtre sculpté, plafonds en cèdre peint, cours avec fontaines — parce qu'ils ont été construits par les mêmes artisans de Fès pendant les mêmes années. Ce qui diffère, c'est la façon dont cet espace est organisé.</p>

<p>Le Palais Bahia est horizontal. Ses ~8 000 m² se déploient sur un seul niveau à travers une série de cours, de jardins et de salles de réception reliés, dont le Grand Riad — une vaste cour intérieure avec orangers — et les appartements privés de Ba Ahmed et son harem. L'échelle est écrasante ; la plupart des visiteurs passent 75 à 90 minutes à parcourir le site et n'ont toujours pas tout vu.</p>

<p>Dar Si Said est vertical. Sa cour centrale et son jardin riad en rez-de-chaussée cèdent la place à un étage supérieur accessible par un escalier en cèdre sculpté. La salle de mariage à l'étage — avec ses plafonds en cèdre peint et ses stucs exceptionnellement fins — est l'espace le plus remarquable du bâtiment et contraste avec tout ce qui se trouve au rez-de-chaussée. Plus petit au total, mais avec une concentration verticale que Bahia n'a pas.</p>

<h2>Expérience visiteur : foule, rythme, durée</h2>

<p>La plus grande différence pratique entre les deux sites n'est pas l'architecture — c'est la foule. Le Palais Bahia est la seule attraction à laquelle la plupart des circuits et groupes de Marrakech s'arrêtent dans ce quartier. Les cars arrivent entre 10h30 et 14h00 ; les couloirs se remplissent et les cours les plus célèbres voient passer plusieurs groupes guidés à la fois. Arriver à 9h00 à l'ouverture ou après 15h30 améliore sensiblement l'expérience.</p>

<p>Dar Si Said est rarement bondé à n'importe quelle heure. Les matins de semaine en particulier peuvent offrir un bâtiment presque entièrement pour soi. Si l'une de vos priorités est l'espace et le calme pour observer les détails architecturaux, Dar Si Said l'offre d'une manière que le Palais Bahia ne peut pas garantir aux heures de pointe.</p>

<h2>Peut-on visiter les deux dans la même demi-journée ?</h2>

<p>Oui, facilement. Les deux sites sont sur la même rue et séparés de 5 minutes à pied. Le Palais Bahia nécessite 75–90 minutes ; Dar Si Said, 30–45 minutes. Un total de 2 à 2h30 de visite couvre confortablement les deux, avec le temps de marche entre eux. Si vous incluez également la Place des Ferblantiers (4 min) et les Tombeaux Saadiens (7 min), vous pouvez construire une demi-journée complète de la médina sud sans taxi. Voir le <a href="/fr/blog/things-to-do-near-bahia-palace">guide de tout ce qu'il y a à faire près du Palais Bahia</a> pour les itinéraires suggérés.</p>

<h2>Lequel visiter si vous ne pouvez en choisir qu'un ?</h2>

<p>Pour une première visite à Marrakech : Palais Bahia. Son échelle, sa place dans l'histoire de la cour marocaine du XIXe siècle, et ses salles décoratives sont sans équivalent. C'est la visite de référence de la médina sud.</p>

<p>Pour les visiteurs qui reviennent, les passionnés d'artisanat, ou quiconque préfère un site moins fréquenté : Dar Si Said est un complément excellent et souvent sous-estimé. La collection textile est la meilleure de ce type à Marrakech, et la salle de mariage de l'étage est un espace remarquable que peu de voyageurs voient.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Réservez votre visite au Palais Bahia</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Billet coupe-file en ligne — passez directement à l'entrée sans file d'attente.</p>
  <a href="/fr/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Voir les billets →</a>
</div>`;

// ---------------------------------------------------------------------------
// ITALIAN
// ---------------------------------------------------------------------------
const CONTENT_IT = `<p>La maggior parte dei visitatori della medina meridionale di Marrakech passa davanti a un palazzo mentre si dirige verso l'altro. Bahia Palace attira le code, i pullman turistici e la copertura delle guide. Dar Si Said — ora il Museo Nazionale della Tessitura e dei Tappeti (riaperto nel 2018 dopo restauro) — si trova a pochi minuti sulla stessa strada, quasi vuoto la maggior parte delle mattine. Quello che la maggior parte delle guide non menziona è il motivo per cui i due edifici coesistono fianco a fianco: entrambi furono costruiti tra il 1894 e il 1900, nello stesso stile architettonico, da fratelli della stessa famiglia. Ba Ahmed ibn Musa ampliò e completò Bahia Palace nel suo ruolo di Gran Visir; suo fratello Si Said ibn Musa, che era ministro nella stessa corte, costruì ciò che divenne Dar Si Said. Nel 2024 il Marocco ha accolto 17,4 milioni di visitatori internazionali (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Rapporto annuale del turismo marocchino 2024</a>), e quasi tutti hanno scelto Bahia. Se sia la scelta giusta dipende da cosa stai cercando.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Da tenere a mente</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Entrambi i palazzi furono costruiti da fratelli della stessa famiglia tra il 1894 e il 1900 con artigiani di Fez — condividono lo stesso vocabolario architettonico ma differiscono notevolmente per scala e layout.</li>
  <li>Bahia Palace si estende su ~8.000 m² su un unico piano; Dar Si Said è su più livelli con un piano superiore caratteristico, un giardino riad e un padiglione in legno scolpito — più piccolo, ma di carattere diverso.</li>
  <li>Il principale vantaggio di Dar Si Said è la tranquillità: dove Bahia si riempie di gruppi turistici a metà mattina, Dar Si Said è raramente affollato a qualsiasi ora. Entrambi si possono visitare in mezza giornata.</li>
</ul>
</div>

<h2>Risposta rapida: Bahia Palace vs Dar Si Said a colpo d'occhio</h2>

<table>
  <thead>
    <tr><th></th><th>Bahia Palace</th><th>Dar Si Said</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Costruito da</strong></td><td>Ba Ahmed ibn Musa (Gran Visir)</td><td>Si Said ibn Musa (ministro, fratello di Ba Ahmed)</td></tr>
    <tr><td><strong>Periodo</strong></td><td>1894–1900</td><td>1894–1900</td></tr>
    <tr><td><strong>Uso attuale</strong></td><td>Architettura palatina del XIX secolo e storia</td><td>Tessitura, tappeti e artigianato marocchino (dal 2018)</td></tr>
    <tr><td><strong>Layout</strong></td><td>Piano unico — cortili multipli, giardini, sale di ricevimento</td><td>Multi-livello — sala nuziale al piano superiore, giardino riad, padiglione</td></tr>
    <tr><td><strong>Dimensioni</strong></td><td>~8.000 m²</td><td>Compatto — impronta molto più piccola</td></tr>
    <tr><td><strong>Tempo necessario</strong></td><td>75–90 min</td><td>30–45 min</td></tr>
    <tr><td><strong>Ingresso (2026)</strong></td><td>100 MAD (adulto straniero)</td><td>Verificare sul posto</td></tr>
    <tr><td><strong>Affollamento</strong></td><td>Moderato-intenso (picco: 10:30–14:00)</td><td>Raramente affollato</td></tr>
    <tr><td><strong>Ideale per</strong></td><td>Prime visite, scala, storia della corte</td><td>Appassionati di artigianato, piano superiore, esperienza tranquilla</td></tr>
  </tbody>
</table>

<h2>Che cos'è Dar Si Said?</h2>

<p>Dar Si Said fu costruito tra il 1894 e il 1900 da Si Said ibn Musa, fratello di Ba Ahmed — il Gran Visir che ampliò Bahia Palace negli stessi anni. Si Said era ministro nella stessa corte, e i due fratelli sembrano aver gareggiato in ambizione architettonica: entrambi commissionarono artigiani di Fez per produrre stucco scolpito, zellige e soffitti in cedro dipinto nella stessa tradizione. Il risultato furono due palazzi di alta qualità costruiti in parallelo, a poche centinaia di metri l'uno dall'altro sulla stessa strada della medina.</p>

<p>A differenza di Bahia Palace, organizzato su un unico piano di cortili e sale di ricevimento interconnessi, Dar Si Said è su più livelli. Il piano terra è incentrato su un cortile con giardino riad e padiglione in legno scolpito e dipinto; una scala in legno scolpito conduce al piano superiore, dove si trova la stanza più celebre dell'edificio — un'ornata sala nuziale con eccezionale decorazione in stucco e soffitti in cedro dipinto, tradizionalmente usata per i preparativi e le cerimonie nuziali.</p>

<p>Dal 2018, dopo la riapertura seguita al restauro, l'edificio funziona come Museo Nazionale della Tessitura e dei Tappeti. La collezione copre le arti tessili tradizionali marocchine: tappeti e kilim tessuti a mano dalle tradizioni berbere dell'Atlante, stili di laboratori urbani di Fez e Rabat, strumenti storici per la tessitura ed esempi di variazione artigianale regionale da tutto il Marocco. Verificare orari e prezzo di ingresso sul posto.</p>

<h2>Che cos'è Bahia Palace?</h2>

<p>Bahia Palace fu ampliato e completato da Ba Ahmed ibn Musa tra il 1894 e il 1900, quando serviva come Gran Visir sotto il sultano Abdelaziz. Alla sua completezza era la residenza privata più grande e sontuosamente decorata del Marocco. Ba Ahmed morì nel 1900 e nel giro di giorni il sultano Abdelaziz fece portare via ogni mobile, tappeto e oggetto decorativo dalle stanze. L'edificio è vuoto da allora — è la prima cosa che i visitatori notano e il dettaglio che più richiede spiegazione prima dell'arrivo. Il racconto completo è nell'<a href="/it/blog/bahia-palace-history">articolo sulla storia di Bahia Palace</a>. Ingresso: 100 MAD per adulti stranieri (tariffa 2026 confermata). Un <a href="/it/tickets">biglietto prenotato online</a> evita la coda all'ingresso senza cambiare il prezzo.</p>

<h2>Confronto architettonico</h2>

<p>Entrambi i palazzi condividono lo stesso vocabolario di base — zellige, stucco scolpito, soffitti in cedro dipinto, cortili con fontane — perché furono costruiti dagli stessi artigiani di Fez negli stessi anni. Ciò che differisce è il modo in cui questo spazio è organizzato.</p>

<p>Bahia Palace è orizzontale. I suoi ~8.000 m² si estendono su un unico piano attraverso una serie di cortili, giardini e sale di ricevimento collegati. Dar Si Said è verticale: il cortile centrale cede il posto a un piano superiore con la magnifica sala nuziale, accessibile tramite una scala in cedro scolpito.</p>

<h2>Esperienza del visitatore: folla, ritmo, durata</h2>

<p>La differenza pratica più grande tra i due siti non è l'architettura — è la folla. Bahia Palace è l'unica attrazione in cui si fermano la maggior parte dei tour e dei gruppi di Marrakech. I pullman arrivano tra le 10:30 e le 14:00; i corridoi si riempiono e i cortili più celebri vedono passare più gruppi guidati contemporaneamente. Arrivare alle 9:00 all'apertura o dopo le 15:30 migliora sensibilmente l'esperienza.</p>

<p>Dar Si Said è raramente affollato a qualsiasi ora. Le mattine dei giorni feriali in particolare possono offrire un edificio quasi interamente per sé. Se una delle tue priorità è lo spazio e la tranquillità per osservare i dettagli architettonici, Dar Si Said lo offre in un modo che Bahia Palace non può garantire nelle ore di punta.</p>

<h2>Si possono visitare entrambi nella stessa mezza giornata?</h2>

<p>Sì, facilmente. I due siti sono sulla stessa strada e separati da 5 minuti a piedi. Bahia Palace richiede 75–90 minuti; Dar Si Said, 30–45 minuti. Un totale di 2–2,5 ore copre comodamente entrambi. Se includi anche Place des Ferblantiers (4 min) e le Tombe Saadiane (7 min), puoi costruire una mezza giornata completa nella medina meridionale senza taxi. Vedi la <a href="/it/blog/things-to-do-near-bahia-palace">guida a cosa fare vicino a Bahia Palace</a> per gli itinerari suggeriti.</p>

<h2>Quale visitare se puoi sceglierne solo uno?</h2>

<p>Per una prima visita a Marrakech: Bahia Palace. La sua scala, il suo posto nella storia della corte marocchina del XIX secolo e le sue sale decorative non hanno eguali. È la visita di riferimento della medina meridionale.</p>

<p>Per i visitatori di ritorno, gli appassionati di artigianato, o chiunque preferisca un sito meno frequentato: Dar Si Said è un complemento eccellente e spesso sottovalutato. La collezione tessile è la migliore del suo genere a Marrakech, e la sala nuziale al piano superiore è uno spazio notevole che pochi viaggiatori vedono.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Prenota la tua visita a Bahia Palace</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Biglietto salta-fila online — accedi direttamente senza aspettare in coda.</p>
  <a href="/it/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Vedi i biglietti →</a>
</div>`;

// ---------------------------------------------------------------------------
// GERMAN
// ---------------------------------------------------------------------------
const CONTENT_DE = `<p>Die meisten Besucher der südlichen Medina von Marrakesch gehen an einem Palast vorbei, auf dem Weg zum anderen. Der Bahia Palast zieht die Warteschlangen, Reisebusse und Reiseführereinträge auf sich. Dar Si Said — heute das Nationale Museum für Weberei und Teppiche (nach Restaurierung 2018 wiedereröffnet) — befindet sich wenige Minuten entfernt auf derselben Straße, die meisten Morgen fast leer. Was die meisten Reiseführer nicht erwähnen: warum die beiden nebeneinander existieren. Beide Gebäude wurden zwischen 1894 und 1900, im selben Architekturstil, von Brüdern derselben Familie erbaut. Ba Ahmed ibn Musa baute den Bahia Palast in seiner Rolle als Großwesir aus und vollendete ihn; sein Bruder Si Said ibn Musa, der am selben Hof als Minister diente, baute das, was Dar Si Said wurde. Im Jahr 2024 empfing Marokko 17,4 Millionen internationale Besucher (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Jahresbericht Marokko-Tourismus 2024</a>), und fast alle wählten Bahia. Ob das die richtige Wahl ist, hängt davon ab, was Sie suchen.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Das Wichtigste in Kürze</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Beide Paläste wurden von Brüdern derselben Familie zwischen 1894 und 1900 mit Handwerkern aus Fez gebaut — sie teilen dasselbe architektonische Vokabular, unterscheiden sich jedoch erheblich in Größe und Grundriss.</li>
  <li>Der Bahia Palast erstreckt sich über ~8.000 m² auf einer Ebene; Dar Si Said ist mehrstöckig mit einem charakteristischen Obergeschoss, einem Riad-Garten und einem geschnitzten Holzpavillon — kleiner im Umfang, aber von anderem Charakter.</li>
  <li>Dar Si Saids größter Vorteil ist die Ruhe: Während Bahia sich ab Mitte des Vormittags mit Reisegruppen füllt, ist Dar Si Said zu jeder Stunde selten überfüllt. Beide können an einem halben Tag besucht werden.</li>
</ul>
</div>

<h2>Schnellantwort: Bahia Palast vs Dar Si Said auf einen Blick</h2>

<table>
  <thead>
    <tr><th></th><th>Bahia Palast</th><th>Dar Si Said</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Erbaut von</strong></td><td>Ba Ahmed ibn Musa (Großwesir)</td><td>Si Said ibn Musa (Minister, Bruder von Ba Ahmed)</td></tr>
    <tr><td><strong>Zeitraum</strong></td><td>1894–1900</td><td>1894–1900</td></tr>
    <tr><td><strong>Heute</strong></td><td>Palastarchitektur des 19. Jh. und Geschichte</td><td>Marokkanische Weberei, Teppiche, traditionelles Handwerk (seit 2018)</td></tr>
    <tr><td><strong>Grundriss</strong></td><td>Eingeschossig — mehrere Höfe, Gärten, Empfangsräume</td><td>Mehrstöckig — obere Hochzeitskammer, Riad-Garten, Pavillon</td></tr>
    <tr><td><strong>Größe</strong></td><td>~8.000 m²</td><td>Kompakt — viel kleinerer Grundriss</td></tr>
    <tr><td><strong>Benötigte Zeit</strong></td><td>75–90 Min.</td><td>30–45 Min.</td></tr>
    <tr><td><strong>Eintritt (2026)</strong></td><td>100 MAD (ausländischer Erwachsener)</td><td>Vor Ort prüfen</td></tr>
    <tr><td><strong>Besucheraufkommen</strong></td><td>Mäßig bis stark (Spitze: 10:30–14:00 Uhr)</td><td>Selten überfüllt</td></tr>
    <tr><td><strong>Ideal für</strong></td><td>Erstbesucher, Größe, Hofgeschichte</td><td>Kunsthandwerkliebhaber, Obergeschoss-Highlights, ruhiges Erlebnis</td></tr>
  </tbody>
</table>

<h2>Was ist Dar Si Said?</h2>

<p>Dar Si Said wurde zwischen 1894 und 1900 von Si Said ibn Musa erbaut, einem Bruder von Ba Ahmed — dem Großwesir, der den Bahia Palast in denselben Jahren ausbaute. Si Said diente als Minister am selben Hof, und die beiden Brüder scheinen in architektonischem Ehrgeiz miteinander gewetteifert zu haben: Beide beauftragten Handwerker aus Fez mit der Herstellung von geschnitztem Stuck, Zellige-Kacheln und bemalten Zedernholzdecken in derselben Tradition. Das Ergebnis waren zwei hochwertige Paläste, die parallel entstanden, wenige hundert Meter voneinander entfernt auf derselben Medina-Straße.</p>

<p>Im Gegensatz zum Bahia Palast, der auf einer einzigen Ebene miteinander verbundener Höfe und Empfangsräume angeordnet ist, ist Dar Si Said mehrstöckig. Das Erdgeschoss konzentriert sich auf einen Innenhof mit Riad-Garten und einem geschnitzten, bemalten Holzpavillon; eine geschnitzte Holztreppe führt ins Obergeschoss, wo sich das bekannteste Zimmer des Gebäudes befindet — eine prächtige Hochzeitskammer mit außergewöhnlicher Stuckdekoration und bemalten Zedernholzdecken, die traditionell für Hochzeitsvorbereitungen und -zeremonien genutzt wurde.</p>

<p>Seit der Wiedereröffnung nach Restaurierung im Jahr 2018 fungiert das Gebäude als Nationales Museum für Weberei und Teppiche. Die Sammlung umfasst traditionelle marokkanische Textilkünste: handgewebte Teppiche und Kelims aus den Berberttraditionen des Atlas, städtische Werkstattstile aus Fez und Rabat, historische Webwerkzeuge und Beispiele regionaler Handwerksvariationen aus ganz Marokko. Öffnungszeiten und Eintrittspreis vor Ort prüfen.</p>

<h2>Was ist der Bahia Palast?</h2>

<p>Der Bahia Palast wurde von Ba Ahmed ibn Musa zwischen 1894 und 1900 ausgebaut und vollendet, als er als Großwesir unter Sultan Abdelaziz diente. Bei seiner Vollendung war er die größte und luxuriöseste private Residenz Marokkos. Ba Ahmed starb 1900 und innerhalb weniger Tage ließ Sultan Abdelaziz jedes Möbelstück, jeden Teppich und jedes Dekorationsobjekt aus den Räumen entfernen. Das Gebäude steht seitdem leer — das ist das Erste, was Besucher bemerken, und das Detail, das vor der Ankunft am meisten erklärt werden muss. Den vollständigen Bericht finden Sie im <a href="/de/blog/bahia-palace-history">Artikel zur Geschichte des Bahia Palasts</a>. Eintritt: 100 MAD für ausländische Erwachsene (bestätigter 2026-Tarif). Ein <a href="/de/tickets">online vorgebuchtes Ticket</a> überspringt die Eingangswarteschlange ohne Preisänderung.</p>

<h2>Architekturvergleich</h2>

<p>Beide Paläste teilen dasselbe Grundvokabular — Zellige, geschnitzter Stuck, bemalte Zedernholzdecken, Höfe mit Brunnen — weil sie von denselben Handwerkern aus Fez in denselben Jahren gebaut wurden. Was sich unterscheidet, ist die Anordnung dieser Räume. Der Bahia Palast ist horizontal: Seine ~8.000 m² erstrecken sich auf einer Ebene. Dar Si Said ist vertikal: von der Erdgeschossebene gelangt man über eine prächtige Holztreppe zur Hochzeitskammer im Obergeschoss.</p>

<h2>Besuchererfahrung: Menschenmassen, Tempo, Dauer</h2>

<p>Der größte praktische Unterschied zwischen den beiden Stätten ist nicht die Architektur — es sind die Menschenmassen. Der Bahia Palast ist die einzige Sehenswürdigkeit, an der die meisten Marrakech-Touren und Gruppen in diesem Viertel halten. Die Busse kommen zwischen 10:30 und 14:00 Uhr; die Gänge füllen sich. Dar Si Said ist zu jeder Stunde selten überfüllt — Werktagmorgende können fast komplett allein erlebt werden.</p>

<h2>Können beide an einem halben Tag besucht werden?</h2>

<p>Ja, problemlos. Beide Stätten liegen an derselben Straße und sind 5 Gehminuten voneinander entfernt. Der Bahia Palast benötigt 75–90 Minuten; Dar Si Said 30–45 Minuten. Ein Gesamtaufwand von 2–2,5 Stunden deckt beide bequem ab. Einschließlich der Place des Ferblantiers (4 Min.) und der Saadischen Gräber (7 Min.) lässt sich ein vollständiger Halbtag in der südlichen Medina ohne Taxi zusammenstellen. Siehe den <a href="/de/blog/things-to-do-near-bahia-palace">Leitfaden zu Sehenswürdigkeiten nahe dem Bahia Palast</a> für vorgeschlagene Routen.</p>

<h2>Welchen besuchen, wenn man nur einen wählen kann?</h2>

<p>Für einen ersten Besuch in Marrakesch: Bahia Palast. Seine Größe, sein Platz in der Geschichte des marokkanischen Hofes des 19. Jahrhunderts und seine Dekorationsräume sind einzigartig. Er ist das Referenzerlebnis der südlichen Medina.</p>

<p>Für Wiederholungsbesucher, Handwerksbegeisterte oder alle, die einen weniger frequentierten Ort bevorzugen: Dar Si Said ist eine ausgezeichnete und oft unterschätzte Ergänzung. Die Textilsammlung ist die beste ihrer Art in Marrakesch, und die Hochzeitskammer im Obergeschoss ist ein bemerkenswerter Raum, den nur wenige Reisende sehen.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Buchen Sie Ihren Besuch im Bahia Palast</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Skip-the-Line-Ticket online — direkt hinein ohne Warteschlange am Eingang.</p>
  <a href="/de/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Tickets ansehen →</a>
</div>`;

// ---------------------------------------------------------------------------
// SPANISH
// ---------------------------------------------------------------------------
const CONTENT_ES = `<p>La mayoría de los visitantes de la medina sur de Marrakech pasan por delante de un palacio de camino al otro. El Palacio Bahia atrae las colas, los autobuses turísticos y la cobertura de las guías. Dar Si Said — ahora el Museo Nacional de Tejidos y Alfombras (reabierto en 2018 tras su restauración) — está a pocos minutos en la misma calle, casi vacío la mayoría de las mañanas. Lo que la mayoría de las guías no mencionan es por qué los dos coexisten uno al lado del otro: ambos edificios fueron construidos entre 1894 y 1900, en el mismo estilo arquitectónico, por hermanos de la misma familia. Ba Ahmed ibn Musa amplió y completó el Palacio Bahia en su papel de Gran Visir; su hermano Si Said ibn Musa, que era ministro en la misma corte, construyó lo que se convirtió en Dar Si Said. En 2024, Marruecos recibió 17,4 millones de visitantes internacionales (<a href="https://www.visitmorocco.com" rel="noopener noreferrer" target="_blank">ONMT, Informe anual del turismo de Marruecos 2024</a>), y casi todos eligieron Bahia. Si esa es la decisión correcta depende de lo que estés buscando.</p>

<div style="background:#FDF9F3;border:1px solid #E8D5B7;border-radius:0.75rem;padding:1.25rem 1.5rem;margin:2rem 0;">
<strong>Lo más importante</strong>
<ul style="margin:0.5rem 0 0;padding-left:1.25rem;">
  <li>Ambos palacios fueron construidos por hermanos de la misma familia entre 1894 y 1900 con artesanos de Fez — comparten el mismo vocabulario arquitectónico pero difieren considerablemente en escala y distribución.</li>
  <li>El Palacio Bahia se extiende por ~8.000 m² en un solo nivel; Dar Si Said es de varios niveles con un piso superior característico, un jardín riad y un pabellón de madera tallada — más pequeño en planta, pero de carácter diferente.</li>
  <li>La mayor ventaja de Dar Si Said es la tranquilidad: mientras Bahia se llena de grupos turísticos a media mañana, Dar Si Said rara vez está concurrido a cualquier hora. Ambos se pueden hacer en media jornada.</li>
</ul>
</div>

<h2>Respuesta rápida: Palacio Bahia vs Dar Si Said de un vistazo</h2>

<table>
  <thead>
    <tr><th></th><th>Palacio Bahia</th><th>Dar Si Said</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>Construido por</strong></td><td>Ba Ahmed ibn Musa (Gran Visir)</td><td>Si Said ibn Musa (ministro, hermano de Ba Ahmed)</td></tr>
    <tr><td><strong>Período</strong></td><td>1894–1900</td><td>1894–1900</td></tr>
    <tr><td><strong>Hoy</strong></td><td>Arquitectura palaciega del siglo XIX e historia</td><td>Tejidos, alfombras y artesanía marroquí (desde 2018)</td></tr>
    <tr><td><strong>Distribución</strong></td><td>Un solo nivel — patios múltiples, jardines, salas de recepción</td><td>Varios niveles — cámara nupcial en el piso superior, jardín riad, pabellón</td></tr>
    <tr><td><strong>Tamaño</strong></td><td>~8.000 m²</td><td>Compacto — planta mucho más pequeña</td></tr>
    <tr><td><strong>Tiempo necesario</strong></td><td>75–90 min</td><td>30–45 min</td></tr>
    <tr><td><strong>Entrada (2026)</strong></td><td>100 MAD (adulto extranjero)</td><td>Verificar al llegar</td></tr>
    <tr><td><strong>Afluencia</strong></td><td>Moderada a intensa (pico: 10:30–14:00)</td><td>Rara vez concurrido</td></tr>
    <tr><td><strong>Ideal para</strong></td><td>Primera visita, escala, historia de la corte</td><td>Amantes de la artesanía, planta superior, experiencia tranquila</td></tr>
  </tbody>
</table>

<h2>¿Qué es Dar Si Said?</h2>

<p>Dar Si Said fue construido entre 1894 y 1900 por Si Said ibn Musa, hermano de Ba Ahmed — el Gran Visir que amplió el Palacio Bahia en esos mismos años. Si Said era ministro en la misma corte, y los dos hermanos parecen haber competido en ambición arquitectónica: ambos encargaron a artesanos de Fez la producción de yeso tallado, zellige y techos de cedro pintado en la misma tradición. El resultado fueron dos palacios de alta calidad construidos en paralelo, a pocos cientos de metros el uno del otro en la misma calle de la medina.</p>

<p>A diferencia del Palacio Bahia, organizado en un único nivel de patios y salas de recepción interconectados, Dar Si Said es de varios niveles. La planta baja se centra en un patio con jardín riad y pabellón de madera tallada y pintada; una escalera de madera tallada conduce a la planta superior, donde se encuentra la habitación más célebre del edificio — una ornamentada cámara nupcial con decoración de estuco excepcional y techos de cedro pintado, usada tradicionalmente para los preparativos y ceremonias nupciales.</p>

<p>Desde su reapertura en 2018 tras la restauración, el edificio funciona como Museo Nacional de Tejidos y Alfombras. La colección cubre las artes textiles tradicionales marroquíes: alfombras y kilims tejidos a mano de las tradiciones bereberes del Atlas, estilos de talleres urbanos de Fez y Rabat, herramientas de tejido históricas y ejemplos de variación artesanal regional de todo Marruecos. Verificar horarios y precio de entrada al llegar.</p>

<h2>¿Qué es el Palacio Bahia?</h2>

<p>El Palacio Bahia fue ampliado y completado por Ba Ahmed ibn Musa entre 1894 y 1900, cuando servía como Gran Visir bajo el sultán Abdelaziz. A su finalización era la residencia privada más grande y lujosamente decorada de Marruecos. Ba Ahmed murió en 1900 y en cuestión de días el sultán Abdelaziz ordenó retirar cada mueble, alfombra y objeto decorativo de las habitaciones. El edificio ha estado vacío desde entonces — es lo primero que los visitantes notan y el detalle que más necesita explicación antes de llegar. La historia completa está en el <a href="/es/blog/bahia-palace-history">artículo sobre la historia del Palacio Bahia</a>. Entrada: 100 MAD para adultos extranjeros (tarifa 2026 confirmada). Una <a href="/es/tickets">entrada comprada online</a> evita la cola en la puerta sin cambiar el precio.</p>

<h2>Comparación arquitectónica</h2>

<p>Ambos palacios comparten el mismo vocabulario básico — zellige, yeso tallado, techos de cedro pintado, patios con fuentes — porque fueron construidos por los mismos artesanos de Fez en los mismos años. Lo que difiere es cómo está organizado ese espacio. El Palacio Bahia es horizontal: sus ~8.000 m² se despliegan en un único nivel. Dar Si Said es vertical: desde el patio central se sube por una escalera de cedro tallado hasta la magnífica cámara nupcial del piso superior.</p>

<h2>Experiencia del visitante: afluencia, ritmo, duración</h2>

<p>La diferencia práctica más grande entre los dos sitios no es la arquitectura — es la gente. El Palacio Bahia es la única atracción en la que se detienen la mayoría de los tours y grupos de Marrakech. Los autobuses llegan entre las 10:30 y las 14:00; los pasillos se llenan. Dar Si Said rara vez está concurrido a cualquier hora — las mañanas de entre semana pueden ofrecer el edificio casi para uno solo.</p>

<h2>¿Se pueden visitar ambos en la misma media jornada?</h2>

<p>Sí, fácilmente. Los dos sitios están en la misma calle y separados por 5 minutos a pie. El Palacio Bahia requiere 75–90 minutos; Dar Si Said, 30–45 minutos. Un total de 2–2,5 horas cubre cómodamente ambos. Si incluyes también la Place des Ferblantiers (4 min) y las Tumbas Saadíes (7 min), puedes construir una media jornada completa en la medina sur sin tomar un taxi. Ver la <a href="/es/blog/things-to-do-near-bahia-palace">guía de qué hacer cerca del Palacio Bahia</a> para los itinerarios sugeridos.</p>

<h2>¿Cuál visitar si solo puedes elegir uno?</h2>

<p>Para una primera visita a Marrakech: Palacio Bahia. Su escala, su lugar en la historia de la corte marroquí del siglo XIX y sus salas decorativas no tienen igual. Es la visita de referencia de la medina sur.</p>

<p>Para visitantes que regresan, amantes de la artesanía, o cualquiera que prefiera un sitio menos concurrido: Dar Si Said es un complemento excelente y a menudo infravalorado. La colección textil es la mejor de su tipo en Marrakech, y la cámara nupcial del piso superior es un espacio notable que pocos viajeros ven.</p>

<div style="background:#F5EDE0;border:1px solid #D4A96A;border-radius:0.75rem;padding:1.5rem;margin:2.5rem 0;text-align:center;">
  <p style="font-weight:700;color:#3D1F00;margin:0 0 0.75rem;">Reserva tu visita al Palacio Bahia</p>
  <p style="color:#5C3D20;font-size:0.95rem;margin:0 0 1rem;">Entrada sin colas online — accede directamente sin esperar en la puerta.</p>
  <a href="/es/tickets" style="display:inline-block;background:#C4452D;color:#fff;font-weight:700;padding:0.75rem 2rem;border-radius:0.5rem;text-decoration:none;">Ver entradas →</a>
</div>`;

// ---------------------------------------------------------------------------
// SEED
// ---------------------------------------------------------------------------
async function upsert(slug: string, locale: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale } },
    update: data as any,
    create: { slug, locale, ...(data as any) },
  });
  console.log(`✓ ${locale.toUpperCase()}: ${slug}`);
}

async function main() {
  await upsert(SLUG, 'fr', {
    title: 'Bahia Palace ou Dar Si Said : lequel visiter à Marrakech en 2026 ?',
    category: 'comparisons',
    excerpt: 'Bahia Palace et Dar Si Said ont été construits par deux frères entre 1894 et 1900 et se trouvent à 5 minutes l\'un de l\'autre dans la médina. Comparez foules, tarifs et ce qu\'offre chacun.',
    seoTitle: 'Bahia Palace vs Dar Si Said : lequel visiter ?',
    seoDesc: 'Bahia Palace et Dar Si Said, construits par deux frères, sont à 5 minutes l\'un de l\'autre dans la médina. Comparez foules, tarifs et ce qu\'offre chacun.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_FR,
  });

  await upsert(SLUG, 'it', {
    title: 'Bahia Palace vs Dar Si Said: quale visitare a Marrakech nel 2026?',
    category: 'comparisons',
    excerpt: 'Bahia Palace e Dar Si Said, costruiti da due fratelli tra il 1894 e il 1900, distano 5 minuti l\'uno dall\'altro nella medina. Confronta folla, biglietti e cosa offre ciascuno.',
    seoTitle: 'Bahia Palace vs Dar Si Said: quale visitare?',
    seoDesc: 'Bahia Palace e Dar Si Said, costruiti da due fratelli, distano 5 minuti l\'uno dall\'altro nella medina. Confronta folla, biglietti e cosa offre ciascuno.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_IT,
  });

  await upsert(SLUG, 'de', {
    title: 'Bahia Palace vs Dar Si Said: Welchen Palast sollten Sie 2026 besuchen?',
    category: 'comparisons',
    excerpt: 'Bahia Palace und Dar Si Said, von zwei Brüdern zwischen 1894 und 1900 erbaut, liegen 5 Minuten voneinander in der Medina. Vergleich: Besuchermengen, Eintritt und Highlights.',
    seoTitle: 'Bahia Palace vs Dar Si Said: Welcher lohnt sich?',
    seoDesc: 'Bahia Palace und Dar Si Said, von zwei Brüdern erbaut, liegen 5 Minuten voneinander in der Medina. Vergleich: Besuchermengen, Eintritt und Highlights.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_DE,
  });

  await upsert(SLUG, 'es', {
    title: 'Palacio Bahia vs Dar Si Said: ¿cuál visitar en Marrakech en 2026?',
    category: 'comparisons',
    excerpt: 'El Palacio Bahia y Dar Si Said, construidos por dos hermanos entre 1894 y 1900, están a 5 minutos el uno del otro en la medina. Compara afluencia, precios de entrada y lo que ofrece cada palacio.',
    seoTitle: 'Palacio Bahia vs Dar Si Said: ¿cuál visitar?',
    seoDesc: 'Palacio Bahia y Dar Si Said, construidos por dos hermanos, están a 5 minutos el uno del otro en la medina. Compara afluencia, precios de entrada y lo que ofrece cada palacio.',
    coverImage: COVER, ogImage: COVER, author: 'Abdellah',
    published: true, publishedAt: DATE, content: CONTENT_ES,
  });

  console.log('All vs-dar-si-said translations inserted.');
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
