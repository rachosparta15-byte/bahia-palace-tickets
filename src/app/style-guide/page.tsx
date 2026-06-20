import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ZelligePattern, OrnamentDivider } from '@/components/ui/ZelligePattern';

const COLORS = [
  { name: 'Terracotta',    hex: '#C4452D', var: '--color-terracotta',  bg: 'bg-[#C4452D]' },
  { name: 'Terracotta Dk', hex: '#A33824', var: '--color-terracotta-dark', bg: 'bg-[#A33824]' },
  { name: 'Saffron',       hex: '#E8A33D', var: '--color-saffron',     bg: 'bg-[#E8A33D]' },
  { name: 'Majorelle',     hex: '#2E4A7B', var: '--color-majorelle',   bg: 'bg-[#2E4A7B]' },
  { name: 'Deep Brown',    hex: '#3D2817', var: '--color-deep-brown',  bg: 'bg-[#3D2817]' },
  { name: 'Cream',         hex: '#FAF3E7', var: '--color-cream',       bg: 'bg-[#FAF3E7] border border-[#E8D5B7]' },
  { name: 'Sand',          hex: '#E8D5B7', var: '--color-sand',        bg: 'bg-[#E8D5B7]' },
  { name: 'Olive',         hex: '#6B7B3A', var: '--color-olive',       bg: 'bg-[#6B7B3A]' },
];

export default function StyleGuidePage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Title */}
        <div className="mb-16 text-center">
          <ZelligePattern className="w-16 h-16 text-[#E8A33D] mx-auto mb-4" />
          <h1
            className="text-[#3D2817] mb-3"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 700 }}
          >
            Bahia Palace — Design System
          </h1>
          <p className="text-[#5C3D20]">Moroccan aesthetic tokens, components, and typography.</p>
        </div>

        {/* ─── COLOURS ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Colour Palette
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {COLORS.map(({ name, hex, bg }) => (
              <div key={hex} className="moroccan-card overflow-hidden">
                <div className={`h-20 ${bg}`} />
                <div className="p-3">
                  <p className="font-semibold text-sm text-[#3D2817]">{name}</p>
                  <p className="text-xs text-[#5C3D20] font-mono">{hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── TYPOGRAPHY ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Typography
          </h2>
          <div className="moroccan-card p-8 space-y-8">
            <div>
              <p className="text-xs text-[#5C3D20] uppercase tracking-widest mb-2">Hero — Cormorant Garamond 700</p>
              <p className="text-[#3D2817] leading-tight" style={{ fontFamily: 'var(--font-heading)', fontSize: '3.5rem', fontWeight: 700 }}>
                Bahia Palace Tickets
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5C3D20] uppercase tracking-widest mb-2">H1 — Cormorant Garamond 600</p>
              <p className="text-[#3D2817]" style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 600 }}>
                Skip the Line in Marrakech
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5C3D20] uppercase tracking-widest mb-2">H2 — Cormorant Garamond 600</p>
              <h2 className="text-[#3D2817]" style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>
                Choose Your Experience
              </h2>
            </div>
            <div>
              <p className="text-xs text-[#5C3D20] uppercase tracking-widest mb-2">Body — Inter 400 (1rem, lh 1.75)</p>
              <p className="text-[#5C3D20] leading-relaxed">
                Built in the late 19th century, Bahia Palace is a masterpiece of Moroccan architecture. Its intricate zellige tilework and carved cedar ceilings enchant visitors from around the world.
              </p>
            </div>
            <div>
              <p className="text-xs text-[#5C3D20] uppercase tracking-widest mb-2">Arabic Accent — Amiri</p>
              <p className="text-[#3D2817] text-2xl" style={{ fontFamily: 'Amiri, serif', direction: 'rtl' }}>
                قصر الباهية — مراكش
              </p>
            </div>
          </div>
        </section>

        {/* ─── BUTTONS ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Buttons
          </h2>
          <div className="moroccan-card p-8">
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <Button variant="primary">Book Tickets Now</Button>
              <Button variant="secondary">See Tour Options</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="outline">Outline</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center mb-6">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
            <div className="flex flex-wrap gap-4 items-center">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </section>

        {/* ─── BADGES ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Badges
          </h2>
          <div className="moroccan-card p-8 flex flex-wrap gap-3">
            <Badge variant="default">Most Popular</Badge>
            <Badge variant="saffron">Official Partner</Badge>
            <Badge variant="majorelle">Guided Tour</Badge>
            <Badge variant="olive">Skip the Line</Badge>
            <Badge variant="sand">Free Cancellation</Badge>
          </div>
        </section>

        {/* ─── ORNAMENT ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Ornamental Divider
          </h2>
          <div className="moroccan-card p-8">
            <OrnamentDivider />
            <OrnamentDivider label="Visit Marrakech" />
          </div>
        </section>

        {/* ─── CARD ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Card Component
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {['Skip-the-Line', 'Guided Tour', 'Private Tour'].map((t) => (
              <div key={t} className="moroccan-card p-6">
                <div className="h-8 w-8 rounded-full bg-[#FAF3E7] mb-3" />
                <h3
                  className="text-[#3D2817] mb-1"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}
                >
                  {t}
                </h3>
                <p className="text-[#5C3D20] text-sm">From $12 per person</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ZELLIGE PATTERNS ─── */}
        <section className="mb-16">
          <h2
            className="text-[#3D2817] mb-6"
            style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}
          >
            Zellige Patterns
          </h2>
          <div className="moroccan-card p-8 flex flex-wrap gap-8 items-center">
            <ZelligePattern className="w-16 h-16 text-[#C4452D]" />
            <ZelligePattern className="w-16 h-16 text-[#E8A33D]" />
            <ZelligePattern className="w-16 h-16 text-[#2E4A7B]" />
            <ZelligePattern className="w-16 h-16 text-[#6B7B3A]" />
            <div className="w-40 h-40 zellige rounded-xl border border-[#E8D5B7]" />
          </div>
        </section>
      </div>
    </div>
  );
}
