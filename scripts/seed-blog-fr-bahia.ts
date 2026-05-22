import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

const content = `
<p class="intro">
  Si vous cherchez le <strong>monument incontournable à visiter à Marrakech</strong>, le <strong>Palais de la Bahia</strong> arrive en tête de liste. Mais derrière ses murs ocre et ses jardins luxuriants se cache une histoire fascinante faite d'ambition politique, de secrets de cour et d'une passion amoureuse qui a marqué l'histoire du Maroc à la fin du XIX<sup>e</sup> siècle. Découvrez la véritable épopée de ce chef-d'œuvre de l'architecture marocaine, bien loin des clichés des guides de voyage traditionnels.
</p>

<h2 id="qui-a-construit">Qui a construit le Palais de la Bahia ? L'ascension de Ba Ahmed</h2>

<p>Pour comprendre la grandeur de ce <strong>palais impérial de Marrakech</strong>, il faut s'intéresser à son créateur : <strong>Ahmed ben Moussa</strong>, plus connu sous le nom de <strong>Ba Ahmed</strong>.</p>

<p>Issu d'une famille de serviteurs de la cour royale (son père, Si Moussa, était chambellan et grand vizir du Sultan Hassan I<sup>er</sup>), Ba Ahmed souffrait d'un physique ingrat, marqué par l'obésité et divers problèmes de santé. Pourtant, son intelligence politique était redoutable.</p>

<p>À la mort du Sultan Hassan I<sup>er</sup> en 1894, c'est lui qui installe le jeune héritier <strong>Moulay Abdelaziz</strong> (alors âgé de seulement 14 ans) sur le trône. Ba Ahmed s'autoproclame Grand Vizir et devient le véritable dirigeant, l'homme le plus puissant et le plus riche du Royaume du Maroc.</p>

<p>C'est à ce moment précis qu'il décide de marquer son pouvoir dans la pierre en ordonnant la construction du plus grand monument historique de Marrakech.</p>

<div class="highlight">
  <strong>Le saviez-vous ?</strong> Aujourd'hui, le Palais de la Bahia s'étend sur 8 hectares et compte près de 150 pièces, ce qui en fait l'un des plus vastes palais historiques du Maroc.
</div>

<h2 id="qui-etait-bahia">Qui était "La Bahia" ? La favorite du Grand Vizir</h2>

<p>Contrairement à une idée reçue, <strong>"Bahia" n'est pas le nom de la famille royale</strong>, mais le prénom d'une femme. Ba Ahmed possédait un harem important, composé de 4 épouses légitimes et de 24 concubines. Parmi elles, une femme se distinguait par sa beauté éclatante, sa grâce et son esprit : <strong>Lalla Boura</strong>.</p>

<p>Le Grand Vizir en était follement amoureux. Pour lui témoigner sa passion et asseoir son statut de favorite au sein de la cour, il décida de nommer sa plus belle création en son honneur.</p>

<div class="highlight">
  En arabe, <strong>Al-Bahia</strong> signifie <em>« La Brillante »</em> ou <em>« La Splendide »</em>. Le Palais de la Bahia est donc, à l'origine, une immense déclaration d'amour architecturale.
</div>

<h2 id="construction">Combien de temps a duré la construction du Palais ?</h2>

<p>Les travaux d'extension menés par Ba Ahmed ont duré environ <strong>6 ans, entre 1894 et 1900</strong>. Ce fut un chantier pharaonique et ininterrompu.</p>

<p>Le Grand Vizir, conscient de sa santé fragile et obsédé par l'idée de ne pas voir son œuvre achevée, pressait constamment les ouvriers. Les meilleurs artisans et maîtres d'œuvre du Maroc (les <strong>maâlems</strong>) ont été réquisitionnés de Fès, de Meknès et de Marrakech pour travailler jour et nuit.</p>

<p>Le palais a été conçu comme un <strong>labyrinthe sans plan architectural global préétabli</strong>. Pourquoi ? Tout simplement parce que Ba Ahmed achetait de nouveaux terrains au fur et à mesure et ajoutait de nouvelles pièces, des cours intérieures (riads) et des appartements privés dès qu'une nouvelle épouse ou concubine intégrait son harem, ou pour accueillir ses invités de marque.</p>

<h2 id="secrets-cour">Les secrets de la cour : ce que les manuels ne vous disent pas</h2>

<h3>Le pillage tragique après la mort du Vizir</h3>

<p>En 1900, l'obsession de Ba Ahmed se réalise : le palais est enfin achevé. Malheureusement, le destin est ironique. Le Grand Vizir meurt cette même année, quelques semaines seulement après la fin des travaux.</p>

<p>Dès l'annonce de son décès, le jeune Sultan Moulay Abdelaziz (qui reprenait enfin le contrôle du pouvoir) ordonna la <strong>saisie des biens de son ancien régent</strong>. En moins de 48 heures, le palais fut entièrement pillé par les courtisans, les gardes et la famille royale.</p>

<div class="highlight">
  Les tapis de soie fine, les meubles incrustés de nacre, les bijoux précieux et les miroirs importés d'Europe furent vidés. C'est pour cette raison que lors de votre visite du Palais de la Bahia, vous découvrirez des pièces architecturalement somptueuses, mais <strong>totalement nues</strong>.
</div>

<h2 id="protectorat">L'époque du Protectorat Français</h2>

<p>Quelques années plus tard, en <strong>1912</strong>, le Maroc passe sous protectorat français. Le <strong>général Hubert Lyautey</strong>, premier résident général de France au Maroc, tombe sous le charme de la demeure. Il décide d'en faire sa résidence officielle à Marrakech.</p>

<p>Pour s'adapter au confort moderne, Lyautey y fit installer l'électricité, le chauffage central et même des cheminées, modifiant légèrement la structure d'origine sans en gâcher la beauté arabo-andalouse.</p>

<p>Aujourd'hui, le palais accueille toujours occasionnellement des hôtes de marque du Roi Mohammed VI dans une partie strictement privée, fermée au public.</p>

<h2 id="infos-pratiques">Visiter le Palais de la Bahia : Infos Pratiques 2026</h2>

<ul>
  <li><strong>Adresse :</strong> Rue Riad Zitoun el-Jedid, Médina de Marrakech</li>
  <li><strong>Horaires :</strong> Tous les jours de 9h00 à 17h00 (9h–15h pendant le Ramadan)</li>
  <li><strong>Tarif adultes étrangers :</strong> 100 DH (≈ 9,50 €)</li>
  <li><strong>Tarif enfants (-12 ans) :</strong> 30 DH</li>
  <li><strong>Tarif Marocains / résidents :</strong> 30 DH</li>
  <li><strong>Durée conseillée :</strong> 1h à 1h30 (2h avec guide)</li>
  <li><strong>Meilleur moment :</strong> Tôt le matin (9h) ou après 15h pour éviter les groupes</li>
</ul>

<h3>Conseils pour votre visite</h3>
<ul>
  <li>Prenez un guide officiel pour comprendre l'histoire et les détails architecturaux</li>
  <li>Portez des chaussures confortables : le palais est vaste</li>
  <li>Évitez les heures de pointe (11h–14h)</li>
  <li>N'oubliez pas votre appareil photo : la lumière y est magnifique</li>
</ul>

<h2 id="faq">FAQ : Vos questions sur le Palais de la Bahia</h2>

<h3>Quel est le prix d'entrée du Palais de la Bahia en 2026 ?</h3>
<p>L'entrée coûte <strong>100 dirhams</strong> (environ 9,50 €) pour les adultes étrangers, 30 dirhams pour les enfants de moins de 12 ans, et 30 dirhams pour les Marocains et résidents au Maroc.</p>

<h3>Combien de temps faut-il prévoir pour la visite ?</h3>
<p>Comptez entre <strong>1h et 1h30</strong> pour une visite complète. Avec un guide, prévoyez environ 2 heures pour profiter pleinement des explications historiques.</p>

<h3>Le Palais de la Bahia est-il accessible aux personnes à mobilité réduite ?</h3>
<p>L'accès est partiellement possible. La cour principale et plusieurs pièces sont accessibles, mais certains passages comportent des marches et des seuils typiques de l'architecture traditionnelle marocaine.</p>

<h3>Peut-on visiter le Palais de la Bahia sans guide ?</h3>
<p>Oui, la visite libre est possible. Cependant, un guide officiel (40–80 DH) enrichit considérablement l'expérience en révélant l'histoire et les détails cachés du palais.</p>

<h3>Pourquoi les pièces du palais sont-elles vides ?</h3>
<p>À la mort de Ba Ahmed en 1900, le Sultan Moulay Abdelaziz ordonna la saisie de ses biens. Le palais fut <strong>entièrement pillé en moins de 48 heures</strong> par les courtisans, les gardes et la famille royale.</p>

<h3>Quels autres monuments visiter près du Palais de la Bahia ?</h3>
<p>À proximité, ne manquez pas <strong>la Place Jemaa el-Fna</strong>, <strong>les Tombeaux Saâdiens</strong>, <strong>le Palais Badi</strong> et <strong>la Médina</strong>. Tous sont accessibles à pied.</p>

<h2>Pourquoi visiter le Palais de la Bahia ?</h2>

<p>Visiter le <strong>Palais de la Bahia à Marrakech</strong>, c'est bien plus qu'admirer un monument historique. C'est plonger dans une histoire d'amour, de pouvoir et de tragédie qui a façonné le Maroc moderne. C'est marcher dans les pas de Ba Ahmed, sentir l'ombre de Lalla Boura, et imaginer les fastes d'une cour disparue.</p>

<p>Ce chef-d'œuvre de l'architecture arabo-andalouse mérite amplement sa place dans le top 3 des choses à faire à Marrakech. Que vous soyez passionné d'histoire, amateur d'architecture ou simple voyageur curieux, le Palais de la Bahia vous laissera un souvenir impérissable.</p>
`;

const COVER = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80';

async function main() {
  const data = {
    title:       'Palais de la Bahia à Marrakech : Histoire, Secrets et Guide de Visite 2026',
    slug:        'palais-de-la-bahia-marrakech-histoire',
    locale:      'fr',
    category:    'history',
    tags:        'Palais de la Bahia,Marrakech,Ba Ahmed,histoire,architecture marocaine,visite 2026',
    excerpt:     "Découvrez l'épopée fascinante du plus beau palais de Marrakech, entre ambition politique, passion amoureuse et secrets de cour.",
    seoTitle:    'Palais de la Bahia Marrakech : Histoire, Secrets & Visite 2026',
    seoDesc:     "Découvrez l'histoire fascinante du Palais de la Bahia à Marrakech : secrets du Grand Vizir Ba Ahmed, passion amoureuse, horaires, tarifs et conseils de visite 2026.",
    coverImage:  COVER,
    ogImage:     COVER,
    author:      'Bahia Palace Tickets',
    published:   true,
    publishedAt: new Date('2026-05-22'),
    content,
  };

  await prisma.blogPost.upsert({
    where:  { slug_locale: { slug: data.slug, locale: data.locale } },
    update: data,
    create: data,
  });

  console.log('✓ Article français mis à jour : palais-de-la-bahia-marrakech-histoire');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
