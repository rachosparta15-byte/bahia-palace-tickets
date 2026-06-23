import { CheckCircle, Ban, Smartphone, ShieldCheck } from 'lucide-react';

export function TrustStrip() {

  const items = [
    { icon: CheckCircle, label: 'Instant confirm', color: '#6B7B3A' },
    { icon: Ban,         label: 'Free cancel',     color: '#2E4A7B' },
    { icon: Smartphone,  label: 'Mobile ticket',   color: '#C4452D' },
    { icon: ShieldCheck, label: 'Official portal',  color: '#6B7B3A' },
  ];

  return (
    <section className="bg-white border-y border-[#E8D5B7] py-3 relative">
      {/* Right fade hint — shows more items on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none sm:hidden" />

      <div
        className="flex items-center gap-2.5 overflow-x-auto px-4 max-w-6xl mx-auto sm:justify-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map(({ icon: Icon, label, color }, i) => (
          <div key={i} className="contents">
            <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-medium text-[#3D2817]">
              <Icon size={12} style={{ color }} className="shrink-0" />
              <span className="whitespace-nowrap">{label}</span>
            </div>
            {i < items.length - 1 && (
              <div className="w-px h-3 bg-[#E8D5B7] shrink-0" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
