import { Breadcrumb } from '@/components/tickets/Breadcrumb';
import { Link } from '@/i18n/navigation';
import { JsonLd } from '@/components/seo/JsonLd';
import { getLocale } from 'next-intl/server';
import { buildBreadcrumbSchema } from '@/lib/seo';

interface LegalSection {
  heading: string;
  /** Legacy shape, still supported: a paragraph, or an array shown as bullets. */
  body?: string | string[];
  /**
   * Anchor id. Deep links to a specific clause arrive from confirmation emails
   * and from the sister sites; the ids are identical across locales, so such a
   * link survives a language switch.
   */
  id?: string;
  /** Synced shape — paragraphs, bullets and a table can coexist in one section. */
  paragraphs?: string[];
  list?: string[];
  table?: { head: string[]; rows: string[][] };
}

interface LegalPageProps {
  title: string;
  subtitle?: string;
  lastUpdated: string;
  sections: LegalSection[];
  homeLabel: string;
  /**
   * The "pending review by a lawyer" line that ships with the synced documents.
   * Rendered rather than dropped: publishing an unreviewed legal text as though
   * it were settled is precisely the thing to avoid.
   */
  notice?: string;
}

export async function LegalPage({
  title,
  subtitle,
  lastUpdated,
  sections,
  homeLabel,
  notice,
}: LegalPageProps) {
  const locale = await getLocale();
  return (
    <div className="bg-[#1C1108] min-h-screen">
      <JsonLd data={buildBreadcrumbSchema(locale, [{ name: homeLabel, path: '' }, { name: title }])} />
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
          {notice ? (
            <p
              role="note"
              className="border-s-[3px] border-[#C4452D] ps-4 text-sm leading-relaxed text-[#C4A882]"
            >
              {notice}
            </p>
          ) : null}

          {sections.map((section, i) => {
            // The legacy `body` is normalised into the newer fields so both
            // shapes render through one path rather than two.
            const paragraphs =
              section.paragraphs ?? (typeof section.body === 'string' ? [section.body] : []);
            const list = section.list ?? (Array.isArray(section.body) ? section.body : []);

            return (
              <section key={section.id ?? i} id={section.id} className="scroll-mt-24">
                <h2
                  className="text-xl font-bold text-[#F5E8CC] mb-3"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {section.heading}
                </h2>

                {paragraphs.map((paragraph, j) => (
                  <p key={j} className="text-sm text-[#C4A882] leading-relaxed [&+p]:mt-3">
                    {paragraph}
                  </p>
                ))}

                {list.length > 0 ? (
                  <ul className={`space-y-2 ${paragraphs.length > 0 ? 'mt-3' : ''}`}>
                    {list.map((item, j) => (
                      <li
                        key={j}
                        className="text-sm text-[#C4A882] leading-relaxed flex items-start gap-2"
                      >
                        <span className="text-[#C4452D] mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.table ? (
                  // Scrolls inside its own box so the page body never scrolls
                  // sideways — these get read on phones.
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[22rem] border-collapse text-sm">
                      <thead>
                        <tr>
                          {section.table.head.map((cell) => (
                            <th
                              key={cell}
                              scope="col"
                              className="border-b border-[rgba(232,163,61,0.2)] px-3 py-2 text-start font-semibold text-[#F5E8CC]"
                            >
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row, r) => (
                          <tr key={r}>
                            {row.map((cell, c) => (
                              <td
                                key={c}
                                className="border-b border-[rgba(232,163,61,0.1)] px-3 py-2 align-top text-[#C4A882]"
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            );
          })}

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
