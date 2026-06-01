'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/navigation';

const STORAGE_KEY = 'cookie_consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 bg-[#2A1B0E] text-white px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-white/85 leading-relaxed flex-1">
          We use cookies to improve your experience and analyse site traffic. See our{' '}
          <Link href="/cookies" className="underline text-[#E8A33D] hover:text-white transition-colors">
            Cookie Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={decline}
            className="text-sm text-white/60 hover:text-white transition-colors px-3 py-2"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-sm bg-[#C4452D] hover:bg-[#a83826] text-white font-semibold px-5 py-2 rounded-lg transition-colors"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
