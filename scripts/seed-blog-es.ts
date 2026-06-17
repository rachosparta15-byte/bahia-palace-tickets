import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client';

const url = process.env.DATABASE_URL ?? 'file:./dev.db';
const authToken = process.env.TURSO_AUTH_TOKEN;
const adapter = new PrismaLibSql({ url, ...(authToken ? { authToken } : {}) });
const prisma = new PrismaClient({ adapter });

const COVER = 'https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=1400&q=80';

async function seed(slug: string, data: object) {
  await prisma.blogPost.upsert({
    where: { slug_locale: { slug, locale: 'es' } },
    update: data as any,
    create: { slug, locale: 'es', ...(data as any) },
  });
  console.log('✓ ES:', slug);
}

async function main() {
  await seed('palacio-bahia-marrakech-historia', {
    title: 'Palacio Bahia Marrakech: Historia, Secretos y Guía de Visita 2026',
    category: 'history',
    excerpt: 'Descubre la fascinante historia del palacio más bello de Marrakech — entre ambición política, historia de amor y secretos de la corte.',
    seoTitle: 'Palacio Bahia Marrakech: Historia, Secretos & Visita 2026',
    seoDesc: 'La fascinante historia del Palacio Bahia en Marrakech: secretos del Gran Visir Ba Ahmed, historia de amor, horarios, precios y consejos de visita 2026.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">Si estás planeando visitar el <strong>Palacio Bahia en Marrakech</strong>, te espera mucho más que un bonito edificio. Detrás de sus muros color ocre se esconde una historia fascinante de poder, amor y tragedia que marcó el Marruecos moderno.</p>

<h2>¿Quién construyó el Palacio Bahia? El ascenso de Ba Ahmed</h2>

<p>Para entender la grandiosidad de este <strong>palacio histórico de Marrakech</strong>, hay que conocer a su creador: <strong>Ahmed ben Moussa</strong>, conocido como <strong>Ba Ahmed</strong>.</p>

<p>Hijo de un sirviente de la corte del sultán, Ba Ahmed tenía un aspecto poco agraciado, pero su astucia política era extraordinaria. Tras la muerte del Sultán Hassan I en 1894, instaló al joven heredero <strong>Moulay Abdelaziz</strong> (entonces solo 14 años) en el trono, proclamándose Gran Visir — el hombre más poderoso y rico del Reino de Marruecos.</p>

<div class="highlight">
  <strong>¿Lo sabías?</strong> Hoy el Palacio Bahia se extiende sobre 8 hectáreas y cuenta con casi 150 habitaciones, convirtiéndolo en uno de los palacios históricos más vastos de Marruecos.
</div>

<h2>¿Quién era "Bahia"? La favorita del Gran Visir</h2>

<p>Contrariamente a lo que se cree, <strong>"Bahia" no es un apellido de familia</strong>, sino el nombre de una mujer. Ba Ahmed tenía un gran harén con 4 esposas legítimas y 24 concubinas. Entre ellas, una destacaba por su extraordinaria belleza y gracia: <strong>Lalla Boura</strong>.</p>

<p>El Gran Visir estaba perdidamente enamorado de ella. Para expresar su pasión, decidió dar el nombre de su creación más bella en su honor.</p>

<div class="highlight">
  En árabe, <strong>Al-Bahia</strong> significa <em>"La Resplandeciente"</em> o <em>"La Espléndida"</em>. El Palacio Bahia es, por tanto, en origen una inmensa declaración de amor arquitectónica.
</div>

<h2>¿Cuánto duró la construcción?</h2>

<p>Las obras duraron aproximadamente <strong>6 años, entre 1894 y 1900</strong>. Fue una obra faraónica e ininterrumpida.</p>

<p>El palacio fue concebido como un <strong>laberinto sin un plan arquitectónico global establecido</strong>. ¿Por qué? Simplemente porque Ba Ahmed compraba nuevos terrenos continuamente y añadía nuevas habitaciones, patios interiores y apartamentos privados cada vez que una nueva esposa o concubina se incorporaba a su harén.</p>

<h2>Los secretos de la corte: lo que las guías no cuentan</h2>

<h3>El trágico saqueo tras la muerte del Visir</h3>

<p>En 1900, la obsesión de Ba Ahmed se cumple: el palacio está finalmente terminado. Desgraciadamente, el destino es irónico. El Gran Visir muere ese mismo año, apenas unas semanas después de la finalización de las obras.</p>

<p>Nada más anunciarse su muerte, el joven Sultán Moulay Abdelaziz ordenó la <strong>confiscación de los bienes de su antiguo regente</strong>. En menos de 48 horas, el palacio fue completamente saqueado por cortesanos, guardias y la familia real.</p>

<div class="highlight">
  Alfombras de seda fina, muebles incrustados de nácar, joyas preciosas y espejos importados de Europa fueron robados. Por eso, durante tu visita al Palacio Bahia, encontrarás habitaciones arquitectónicamente suntuosas, pero <strong>completamente vacías</strong>.
</div>

<h2>La época del Protectorado Francés</h2>

<p>Unos años después, en <strong>1912</strong>, Marruecos pasó bajo protectorado francés. El <strong>general Hubert Lyautey</strong>, primer residente general francés en Marruecos, se enamoró de la mansión y decidió convertirla en su residencia oficial en Marrakech.</p>

<h2>Información práctica para 2026</h2>

<ul>
  <li><strong>Dirección:</strong> Rue Riad Zitoun el-Jedid, Medina de Marrakech</li>
  <li><strong>Horario:</strong> Todos los días 9:00–17:00</li>
  <li><strong>Precio adultos extranjeros:</strong> 100 MAD (≈ 9 €)</li>
  <li><strong>Niños extranjeros (7–13 años):</strong> 50 MAD</li>
  <li><strong>Niños menores de 7 años:</strong> Gratis</li>
  <li><strong>Duración recomendada:</strong> 1–1,5 horas (2 horas con guía)</li>
  <li><strong>Mejor momento:</strong> Temprano por la mañana (9h) o después de las 15h</li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Por qué las habitaciones del palacio están vacías?</h3>
<p>Tras la muerte de Ba Ahmed en 1900, el Sultán Moulay Abdelaziz ordenó la confiscación de sus bienes. El palacio fue <strong>completamente saqueado en menos de 48 horas</strong>.</p>

<h3>¿Hay visitas guiadas en español?</h3>
<p>Sí, nuestras visitas guiadas están disponibles en inglés, francés, español, italiano y alemán.</p>

<h3>¿Vale la pena visitar el Palacio Bahia?</h3>
<p>Absolutamente. Se considera uno de los mejores ejemplos de arquitectura y artesanía marroquí del siglo XIX. La escala, los detalles y la atmósfera lo convierten en el punto culminante de cualquier itinerario en Marrakech.</p>
`,
  });

  await seed('entradas-sin-cola-palacio-bahia-marrakech-2026', {
    title: 'Entradas Sin Cola al Palacio Bahia — Marrakech 2026',
    category: 'visit-tips',
    excerpt: 'Todo lo que necesitas saber sobre las entradas del Palacio Bahia 2026 — precios, opciones sin cola, horarios e información insider.',
    seoTitle: 'Sin Cola Palacio Bahia — Entradas Marrakech 2026',
    seoDesc: 'Compra entradas sin cola para el Palacio Bahia Marrakech. Precios, horarios, visitas guiadas & consejos insider para 2026. Sin esperas, confirmación instantánea.',
    coverImage: COVER,
    ogImage: COVER,
    author: 'Bahia Palace Tickets',
    published: true,
    publishedAt: new Date('2026-05-22'),
    content: `
<p class="intro">¿Estás planeando visitar el <strong>Palacio Bahia en Marrakech</strong>? Comprar las entradas con antelación es la decisión más inteligente que puedes tomar. Las largas colas en la entrada pueden robarte 30–45 minutos de tu precioso tiempo de vacaciones — aquí te explicamos cómo evitarlas por completo.</p>

<h2>Precios Entradas Palacio Bahia 2026</h2>

<p>El precio de entrada estándar es <strong>100 MAD</strong> para adultos extranjeros (aproximadamente 9 € / 10 $). Niños extranjeros de 7–13 años: 50 MAD. Los niños menores de 7 años entran gratis. Para los visitantes que desean una experiencia más completa, las visitas guiadas y opciones sin cola están disponibles desde <strong>10 €</strong>.</p>

<h2>¿Por qué comprar entradas sin cola?</h2>

<p>El Palacio Bahia es uno de los <strong>monumentos más visitados de Marruecos</strong>, con más de 500.000 visitantes al año. Durante la temporada alta (marzo–mayo y septiembre–noviembre), las colas en la entrada pueden alcanzar los 45 minutos o más. Con una entrada sin cola reservada con antelación, entras directamente — sin esperas, sin estrés.</p>

<h2>¿Qué incluye cada tipo de entrada?</h2>

<h3>Entrada Sin Cola Estándar</h3>
<p>Entrada pre-validada que te permite saltarte la cola en la puerta principal. Válida para la fecha que elijas. Incluye acceso a todas las áreas abiertas del palacio.</p>

<h3>Visita Guiada por Experto</h3>
<p>Todo lo incluido en la entrada sin cola más una guía local certificada. Duración: aproximadamente 2 horas.</p>

<h3>Visita Privada</h3>
<p>Una experiencia privada exclusiva para parejas, familias o grupos pequeños. Perfecto para aficionados a la fotografía y entusiastas de la historia.</p>

<h2>Horarios de apertura</h2>

<ul>
  <li><strong>Lunes – Domingo:</strong> 09:00 – 17:00</li>
  <li>Última entrada: 16:30</li>
  <li>Cerrado durante la oración del viernes (12:00–14:00 los viernes)</li>
</ul>

<h2>Consejos insider</h2>

<ul>
  <li><strong>Viste con modestia</strong> — hombros y rodillas deberían estar cubiertos como señal de respeto.</li>
  <li><strong>Lleva una cámara</strong> — los techos de cedro tallado y los mosaicos de zellige son de los más fotogénicos de todo Marruecos.</li>
  <li><strong>Combina tu visita</strong> con el Palacio Badi y las Tumbas Saadíes cercanas para un día completo de historia de Marrakech.</li>
  <li><strong>Reserva con antelación</strong> — especialmente durante el Ramadán o las vacaciones escolares.</li>
</ul>

<h2>Preguntas frecuentes</h2>

<h3>¿Puedo comprar entradas en taquilla?</h3>
<p>Sí, pero corres el riesgo de esperar hasta 45 minutos durante los períodos de mayor afluencia. La reserva anticipada garantiza tu horario de entrada y evita completamente las colas.</p>

<h3>¿Vale la pena visitar el Palacio Bahia?</h3>
<p>Absolutamente. Se considera uno de los mejores ejemplos de arquitectura y artesanía marroquí del siglo XIX.</p>

<h3>¿Hay visitas guiadas en español?</h3>
<p>Sí, nuestras visitas guiadas están disponibles en inglés, francés, español, italiano y alemán.</p>
`,
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
