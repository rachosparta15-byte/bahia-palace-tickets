'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';

export function LeadToast() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-2.5 bg-[#3D2817] text-white px-5 py-3.5 rounded-xl shadow-2xl text-sm font-medium whitespace-nowrap"
      style={{ animation: 'leadToastIn 0.3s ease' }}
    >
      <CheckCircle2 size={15} className="text-[#6B7B3A] shrink-0" />
      We&apos;ll send you visiting tips. Have a great visit!
      <style>{`@keyframes leadToastIn { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
    </div>
  );
}
