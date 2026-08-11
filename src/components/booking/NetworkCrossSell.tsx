import { ArrowUpRight, MapPin } from 'lucide-react';

import { crossSellSites } from '@/config/network-sites';

/**
 * The other monuments, offered after a completed booking.
 *
 * Placed BELOW the QR code and the guide links, never above them. Someone who
 * has just paid is here to check one thing — that their ticket arrived. Putting
 * an offer in front of that answer is how a confirmation page starts feeling
 * like a funnel.
 *
 * Only rendered for confirmed bookings; see the call site.
 */
export function NetworkCrossSell({ className = '' }: { className?: string }) {
  const sites = crossSellSites();
  if (sites.length === 0) return null;

  const anyOpen = sites.some((s) => s.ticketsOpen);

  return (
    <section
      className={`rounded-2xl border border-[rgba(232,163,61,0.15)] bg-[#251A0F] p-6 sm:p-7 ${className}`}
      aria-labelledby="network-crosssell-heading"
    >
      <h2
        id="network-crosssell-heading"
        className="font-bold text-[#F5E8CC]"
        style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem' }}
      >
        While you are in Morocco
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[#C4A882]">
        {/* Says what these links are before they are clicked. "Part of the same
            network" is the honest framing: these are our sites, not neutral
            recommendations, and a customer who discovers that later has been
            misled by omission. */}
        Three more monuments we run visitor sites for.{' '}
        {anyOpen
          ? 'Tickets where you see a price; the rest are visitor guides for now.'
          : 'Visitor guides — opening hours, how to get there, what to see. Tickets are not on sale on these yet.'}
      </p>

      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {sites.map((site) => (
          <li key={site.url}>
            <a
              href={site.url}
              target="_blank"
              rel="noopener"
              className="group flex h-full flex-col rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#2E1F12]/60 p-4 transition-colors hover:border-[#E8A33D]/50"
            >
              <span className="flex items-start justify-between gap-2">
                <span className="font-semibold leading-snug text-[#F5E8CC]">{site.name}</span>
                <ArrowUpRight
                  size={14}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-[#C4A882] transition-colors group-hover:text-[#E8A33D]"
                />
              </span>

              <span className="mt-1.5 flex items-center gap-1 text-xs text-[#C4A882]/70">
                <MapPin size={11} aria-hidden="true" className="shrink-0" />
                {site.location}
              </span>

              <span className="mt-2.5 grow text-xs leading-relaxed text-[#C4A882]">
                {site.blurb}
              </span>

              {/* A price is shown only where one can actually be paid. On a
                  closed site it would read as a ticket on sale. */}
              <span className="mt-3 text-xs font-semibold text-[#E8A33D]">
                {site.ticketsOpen && site.priceEUR !== null
                  ? `Book from €${site.priceEUR.toFixed(2)}`
                  : 'Visitor guide'}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
