import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';

interface LegalSection {
  heading: string;
  body: string | string[];
}

interface LegalPageProps {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: LegalSection[];
  homeLabel: string;
}

export function LegalPage({ title, subtitle, lastUpdated, sections, homeLabel }: LegalPageProps) {
  return (
    <div className="bg-[#1C1108] min-h-screen">
      <div className="bg-[#251A0F] border-b border-[rgba(232,163,61,0.15)] text-white px-6 py-12 md:px-10">
        <div className="max-w-3xl mx-auto">
          <Breadcrumb
            variant="light"
            items={[{ label: homeLabel, href: '/' }, { label: title }]}
          />
          <h1
            className="mt-6 font-bold text-white"
            style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
          >
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-white/70 text-sm">{subtitle}</p>}
          <p className="mt-1 text-white/50 text-xs">Last updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-[#251A0F] rounded-2xl border border-[rgba(232,163,61,0.13)] p-8 md:p-10 space-y-8">
          {sections.map((section, i) => (
            <section key={i}>
              <h2
                className="text-xl font-bold text-[#F5E8CC] mb-3"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {section.heading}
              </h2>
              {Array.isArray(section.body) ? (
                <ul className="space-y-2">
                  {section.body.map((item, j) => (
                    <li key={j} className="text-sm text-[#C4A882] leading-relaxed flex items-start gap-2">
                      <span className="text-[#C4452D] mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#C4A882] leading-relaxed">{section.body}</p>
              )}
            </section>
          ))}

          <div className="pt-6 border-t border-[rgba(232,163,61,0.13)] text-center">
            <p className="text-sm text-[#C4A882] mb-3">Questions? We're here to help.</p>
            <Link
              href="/contact"
              className="inline-block bg-[#C4452D] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#A33824] transition-colors text-sm"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
