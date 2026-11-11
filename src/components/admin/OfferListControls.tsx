'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, ArrowDown, Eye, EyeOff, Plus } from 'lucide-react';

const btn = 'inline-flex items-center justify-center rounded-lg border border-[#E8D5B7] p-2 text-[#5C3D20] hover:bg-[#FAF3E7] disabled:opacity-30';

/** Move up, move down and show/hide for one card in /admin/offers. */
export function OfferListControls(props: {
  id: string;
  hidden: boolean;
  order: number;
  upId: string | null;
  downId: string | null;
  upOrder: number | null;
  downOrder: number | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function swap(otherId: string | null, otherOrder: number | null) {
    if (!otherId || otherOrder === null) return;
    setBusy(true);
    // Equal orders would not move anything: then step just past the other card.
    const mine = otherOrder === props.order ? otherOrder + (otherId === props.upId ? -1 : 1) : otherOrder;
    await fetch('/api/admin/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: [{ id: props.id, sortOrder: mine }, { id: otherId, sortOrder: props.order }] }),
    });
    setBusy(false);
    router.refresh();
  }

  async function toggle() {
    setBusy(true);
    await fetch(`/api/admin/offers/${props.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: !props.hidden }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1.5">
      <button type="button" className={btn} disabled={busy || !props.upId} onClick={() => swap(props.upId, props.upOrder)} title="Move up">
        <ArrowUp size={14} />
      </button>
      <button type="button" className={btn} disabled={busy || !props.downId} onClick={() => swap(props.downId, props.downOrder)} title="Move down">
        <ArrowDown size={14} />
      </button>
      <button type="button" className={btn} disabled={busy} onClick={toggle} title={props.hidden ? 'Show on the site' : 'Hide from the site'}>
        {props.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
      </button>
    </div>
  );
}

/** Adds a new (hidden) card to a section and opens it for editing. */
export function AddOfferButton({ section }: { section: 'featured' | 'grid' }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const res = await fetch('/api/admin/offers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ section }),
        });
        const data = (await res.json()) as { id?: string };
        setBusy(false);
        if (data.id) router.push(`/admin/offers/${data.id}`);
      }}
      className="inline-flex items-center gap-1.5 rounded-xl bg-[#C4452D] px-3 py-2 text-xs font-semibold text-white hover:bg-[#A53A25] disabled:opacity-50"
    >
      <Plus size={13} /> Add a card
    </button>
  );
}
