'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { BOOKING_URL } from '@/lib/booking';
import { trackEvent } from '@/lib/analytics';
import { storeLeadPrefill } from '@/lib/lead-handoff';
import { usePaymentsFlags } from './PaymentsFlagsProvider';

interface Props {
  ticketType: string;
  onClose: () => void;
  onDone: () => void;
}

interface TrafficSource {
  sourcePage:  string;
  referrer:    string;
  utmSource:   string;
  utmMedium:   string;
  utmCampaign: string;
  device:      string;
}

/** Today's date in the visitor's local timezone as YYYY-MM-DD. */
function todayLocal(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function collectTrafficSource(locale: string, nextPathname: string): TrafficSource {
  // Use window.location.pathname so we get the full path including locale prefix
  // (next-intl's usePathname strips the locale, returning "/" for the homepage).
  const sourcePage = typeof window !== 'undefined'
    ? window.location.pathname
    : `/${locale}${nextPathname}`;

  const referrer = typeof document !== 'undefined' ? document.referrer : '';

  const params = typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search)
    : new URLSearchParams();

  const device = typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0)
    ? 'mobile'
    : 'desktop';

  return {
    sourcePage,
    referrer,
    utmSource:   params.get('utm_source')   ?? '',
    utmMedium:   params.get('utm_medium')   ?? '',
    utmCampaign: params.get('utm_campaign') ?? '',
    device,
  };
}

export function LeadModal({ ticketType, onClose, onDone }: Props) {
  const router = useRouter();
  // Decides portal vs. our own checkout. False unless the server says otherwise.
  const { enabled: paymentsEnabled } = usePaymentsFlags();
  const locale    = useLocale();
  const pathname  = usePathname();

  const [email,     setEmail]     = useState('');
  const [name,      setName]      = useState('');
  const [whatsapp,  setWhatsapp]  = useState('');
  const [partySize, setPartySize] = useState('');
  const [visitDate, setVisitDate] = useState(() => todayLocal());
  const [loading,   setLoading]   = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Capture traffic source once when the modal first opens.
  const [source] = useState<TrafficSource>(() => collectTrafficSource(locale, pathname));

  // Track modal open
  useEffect(() => {
    trackEvent('modal_open', { ticketType, device: source.device, locale });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Lock body scroll while open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  const openPortal = () =>
    window.open(BOOKING_URL, '_blank', 'noopener,noreferrer');

  /** Returns the saved Lead's id, or null if capture failed. */
  const saveLead = async (email: string, name: string): Promise<string | null> => {
    try {
      const res = await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:       email.trim()  || null,
          name:        name.trim()   || null,
          whatsapp:    whatsapp.trim() || null,
          partySize:   partySize ? Number(partySize) : null,
          visitDate:   visitDate || null,
          ticketType,
          locale,
          sourcePage:  source.sourcePage,
          referrer:    source.referrer    || null,
          utmSource:   source.utmSource   || null,
          utmMedium:   source.utmMedium   || null,
          utmCampaign: source.utmCampaign || null,
          device:      source.device,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; id?: string };
      return data.id ?? null;
    } catch {
      // best-effort — never block the user
      return null;
    }
  };

  const partySizeValid = /^\d+$/.test(partySize.trim()) && Number(partySize) >= 1 && Number(partySize) <= 99;
  const visitDateValid = /^\d{4}-\d{2}-\d{2}$/.test(visitDate);
  // WhatsApp is optional. Empty is fine; if something IS typed it still has to
  // look like a number, otherwise we save a value we can never actually use.
  const whatsappEntered = whatsapp.trim().length > 0;
  const whatsappValid   = !whatsappEntered || whatsapp.replace(/[^\d]/g, '').length >= 7;
  const emailValid     = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleSubmit = async () => {
    if (!emailValid || !whatsappValid || !partySizeValid || !visitDateValid) {
      setShowErrors(true);
      return;
    }
    setLoading(true);
    // The lead is saved before any handoff, so we keep it either way.
    const leadId = await saveLead(email, name);
    trackEvent('lead_submit', { hasEmail: !!email.trim(), ticketType, locale });
    setLoading(false);

    if (paymentsEnabled) {
      // Carry what they already typed so the pack form doesn't ask twice —
      // plus the row id, so checkout updates this lead instead of duplicating it.
      storeLeadPrefill({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        visitDate: visitDate || undefined,
        visitors: Number(partySize) || undefined,
        leadId: leadId ?? undefined,
      });
      trackEvent('pack_handoff', { ticketType, locale });
      onClose();
      // next-intl's router prepends the active locale, so a French visitor
      // lands on /fr/visitor-pack without us building the path by hand.
      router.push('/visitor-pack');
      return;
    }

    // Payments off → unchanged legacy behaviour: the official portal.
    openPortal();
    onDone();
  };

  // Rendered via portal into document.body so it escapes any ancestor
  // backdrop-filter / transform that would make position:fixed relative
  // to the ancestor instead of the viewport (e.g. Header's backdrop-blur-sm).
  const modal = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      {/* Dark backdrop — clicking closes the modal */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centering wrapper */}
      <div className="relative min-h-full flex items-center justify-center p-4">

        {/* Panel */}
        <div
          className="relative bg-[#251A0F] rounded-2xl shadow-2xl w-full border border-[rgba(232,163,61,0.15)]"
          style={{ maxWidth: '400px' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-[#2E1F12] rounded-t-2xl px-6 pt-5 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[#E8A33D] text-[10px] font-bold uppercase tracking-[0.22em] mb-1">
                  One quick thing
                </p>
                <h2
                  className="text-white font-bold leading-snug"
                  style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem' }}
                >
                  Get tips &amp; a future discount
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close"
                className="text-white/40 hover:text-white/80 transition-colors shrink-0 flex items-center justify-center -me-2 -mt-1"
                style={{ minWidth: '44px', minHeight: '44px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-4">
            <p className="text-sm text-[#C4A882] leading-relaxed">
              Tell us how many tickets you need and when you&apos;re visiting. Leave your email too and we&apos;ll send you the best time to visit, insider tips, and a discount code when guided tours launch.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="First name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 rounded-xl border border-[rgba(232,163,61,0.20)] bg-[#2E1F12] text-[#F5E8CC] placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors"
                style={{ fontSize: '16px', minHeight: '48px' }}
              />
              <div>
                <label className="block text-[11px] font-semibold text-[#C4A882] uppercase tracking-wide mb-1.5">
                  Email address <span className="text-[#C4452D]">*</span>
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  className={`w-full px-4 rounded-xl border bg-[#2E1F12] text-[#F5E8CC] placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors ${
                    showErrors && !emailValid ? 'border-[#C4452D]' : 'border-[rgba(232,163,61,0.20)]'
                  }`}
                  style={{ fontSize: '16px', minHeight: '48px' }}
                />
                {showErrors && !emailValid ? (
                  <p className="mt-1.5 text-xs text-[#C4452D]">
                    Please enter a valid email address.
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-[#C4A882]">
                    This is how we reach you. Add WhatsApp below only if you prefer it.
                  </p>
                )}
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#C4A882] uppercase tracking-wide mb-1.5">
                  WhatsApp number{' '}
                  <span className="font-normal normal-case text-[#C4A882]/70">(optional)</span>
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="faster replies, if you use it"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className={`w-full px-4 rounded-xl border bg-[#2E1F12] text-[#F5E8CC] placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors ${
                    showErrors && !whatsappValid ? 'border-[#C4452D]' : 'border-[rgba(232,163,61,0.20)]'
                  }`}
                  style={{ fontSize: '16px', minHeight: '48px' }}
                />
                {showErrors && !whatsappValid && (
                  <p className="mt-1.5 text-xs text-[#C4452D]">
                    That does not look like a valid number. Leave it blank if you
                    would rather we used email.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#C4A882] uppercase tracking-wide mb-1.5">
                    How many tickets? <span className="text-[#C4452D]">*</span>
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={99}
                    placeholder="e.g. 2"
                    value={partySize}
                    onChange={e => setPartySize(e.target.value)}
                    className={`w-full px-3 rounded-xl border bg-[#2E1F12] text-[#F5E8CC] placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors ${
                      showErrors && !partySizeValid ? 'border-[#C4452D]' : 'border-[rgba(232,163,61,0.20)]'
                    }`}
                    style={{ fontSize: '16px', minHeight: '48px' }}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#C4A882] uppercase tracking-wide mb-1.5">
                    Visit date <span className="text-[#C4452D]">*</span>
                  </label>
                  <input
                    type="date"
                    value={visitDate}
                    min={todayLocal()}
                    onChange={e => setVisitDate(e.target.value)}
                    className={`w-full px-3 rounded-xl border bg-[#2E1F12] text-[#F5E8CC] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors [color-scheme:dark] ${
                      showErrors && !visitDateValid ? 'border-[#C4452D]' : 'border-[rgba(232,163,61,0.20)]'
                    }`}
                    style={{ fontSize: '16px', minHeight: '48px' }}
                  />
                </div>
              </div>

              {showErrors && (!partySizeValid || !visitDateValid) && (
                <p className="text-xs text-[#C4452D]">
                  Please tell us how many tickets you need and your visit date to continue.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center justify-center gap-2 w-full bg-[#C4452D] hover:bg-[#a83826] disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm"
              style={{ minHeight: '48px' }}
            >
              {loading ? 'Saving…' : <><span>Get your ticket &amp; skip the line</span><ArrowRight size={15} /></>}
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <p className="text-xs text-[#C4A882]">
              We never share your email. Unsubscribe anytime.{' '}
              <a
                href={`/${locale}/privacy`}
                className="underline hover:text-[#F5E8CC] transition-colors"
              >
                Privacy policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
