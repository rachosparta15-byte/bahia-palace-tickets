'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
  available: boolean;
}

export function TicketQuickToggle({ slug, available }: Props) {
  const [on, setOn] = useState(available);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  async function toggle() {
    const next = !on;
    setOn(next);
    await fetch(`/api/admin/tickets/${slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: next }),
    });
    startTransition(() => router.refresh());
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none
        ${on ? 'bg-emerald-500' : 'bg-[#D5C5A8]'} ${pending ? 'opacity-60' : ''}`}
      title={on ? 'Click to set Coming Soon' : 'Click to set Live'}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform
          ${on ? 'translate-x-6' : 'translate-x-1'}`}
      />
    </button>
  );
}
