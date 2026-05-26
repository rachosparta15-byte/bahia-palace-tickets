'use client';

import { useEffect, useRef, useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { usePathname } from '@/i18n/navigation';
import { BOOKING_URL } from '@/lib/booking';

interface Props {
  ticketType: string;
  onClose: () => void;
  onDone: () => void;
}

export function LeadModal({ ticketType, onClose, onDone }: Props) {
  const locale    = useLocale();
  const pathname  = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);

  const [email,   setEmail]   = useState('');
  const [name,    setName]    = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/leads', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, name, ticketType, locale, sourcePage: pathname }),
      });
    } catch {
      // best-effort — still let the user through
    }
    setLoading(false);
    openPortal();
    onDone();
  };

  const handleSkip = () => {
    openPortal();
    onDone();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative bg-[#FAF3E7] rounded-2xl shadow-2xl w-full max-w-md border border-[#E8D5B7]">

        {/* Header */}
        <div className="bg-[#3D2817] rounded-t-2xl px-6 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#E8A33D] text-[10px] font-bold uppercase tracking-[0.22em] mb-1">
                One quick thing
              </p>
              <h2
                className="text-white font-bold leading-snug"
                style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem' }}
              >
                Get tips &amp; a future discount
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="text-white/40 hover:text-white/80 transition-colors mt-0.5 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-[#5C3D20] leading-relaxed">
            Leave your email and we&apos;ll send you the best time to visit, insider tips, and a discount code when guided tours launch. Completely optional.
          </p>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="First name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#E8D5B7] bg-white text-[#3D2817] text-sm placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors"
            />
            <input
              type="email"
              placeholder="Email address (optional)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              className="w-full px-4 py-3 rounded-xl border border-[#E8D5B7] bg-white text-[#3D2817] text-sm placeholder:text-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#E8A33D]/40 focus:border-[#E8A33D] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-[#C4452D] hover:bg-[#a83826] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Saving…' : <><span>Send me tips &amp; continue</span><ArrowRight size={15} /></>}
          </button>

          <button
            type="button"
            onClick={handleSkip}
            className="block w-full text-center text-sm text-[#8B6344] hover:text-[#3D2817] transition-colors py-1"
          >
            Skip &amp; continue to tickets →
          </button>
        </div>

        {/* Footer disclaimer */}
        <div className="px-6 pb-5 text-center">
          <p className="text-xs text-[#C4A882]">
            We never share your email. Unsubscribe anytime.{' '}
            <a
              href={`/${locale}/privacy`}
              className="underline hover:text-[#8B6344] transition-colors"
            >
              Privacy policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
