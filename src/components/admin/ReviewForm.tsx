'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface ReviewData {
  id?: string;
  authorName: string;
  authorImg: string;
  country: string;
  rating: number;
  body: string;
  locale: string;
  published: boolean;
  order: number;
}

interface Props {
  mode: 'new' | 'edit';
  initial?: ReviewData;
}

const inputCls = 'w-full border border-[#E8D5B7] rounded-xl px-3 py-2.5 text-sm text-[#3D2817] bg-[#FAF3E7] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D]';
const LOCALES = ['en', 'fr', 'es', 'de', 'it'];

export function ReviewForm({ mode, initial }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState<ReviewData>(initial ?? {
    authorName: '', authorImg: '', country: '', rating: 5,
    body: '', locale: 'en', published: true, order: 0,
  });

  function set<K extends keyof ReviewData>(key: K, value: ReviewData[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setSaved(false);
  }

  async function save() {
    const url  = mode === 'new' ? '/api/admin/reviews' : `/api/admin/reviews/${initial!.id}`;
    const method = mode === 'new' ? 'POST' : 'PATCH';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaved(true);
    startTransition(() => {
      if (mode === 'new') router.push('/admin/reviews');
      else router.refresh();
    });
  }

  async function del() {
    if (!confirm('Delete this review?')) return;
    await fetch(`/api/admin/reviews/${initial!.id}`, { method: 'DELETE' });
    router.push('/admin/reviews');
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 space-y-4">

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Author name *</label>
          <input value={form.authorName} onChange={e => set('authorName', e.target.value)} className={inputCls} placeholder="Sarah M." />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Country</label>
          <input value={form.country} onChange={e => set('country', e.target.value)} className={inputCls} placeholder="France" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Author photo URL (optional)</label>
        <input type="url" value={form.authorImg} onChange={e => set('authorImg', e.target.value)} className={inputCls} placeholder="https://..." />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Rating (1–5)</label>
          <input type="number" min={1} max={5} value={form.rating} onChange={e => set('rating', parseInt(e.target.value) || 5)} className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Locale</label>
          <select value={form.locale} onChange={e => set('locale', e.target.value)} className={inputCls}>
            {LOCALES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Order</label>
          <input type="number" min={0} value={form.order} onChange={e => set('order', parseInt(e.target.value) || 0)} className={inputCls} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">Review text *</label>
        <textarea rows={4} value={form.body} onChange={e => set('body', e.target.value)} className={inputCls + ' resize-none'} placeholder="The palace was absolutely stunning..." />
      </div>

      <div className="flex items-center gap-3">
        <input id="pub" type="checkbox" checked={form.published} onChange={e => set('published', e.target.checked)} className="w-4 h-4 accent-[#C4452D]" />
        <label htmlFor="pub" className="text-sm text-[#5C3D20] font-medium">Published (visible on site)</label>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-4">
          <button
            onClick={save}
            disabled={pending}
            className="px-6 py-2.5 bg-[#C4452D] text-white text-sm font-semibold rounded-xl hover:bg-[#A33824] disabled:opacity-60"
          >
            {pending ? 'Saving…' : mode === 'new' ? 'Create review' : 'Save changes'}
          </button>
          {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>}
        </div>
        {mode === 'edit' && (
          <button onClick={del} className="text-sm text-red-500 hover:text-red-700 font-medium">Delete</button>
        )}
      </div>
    </div>
  );
}
