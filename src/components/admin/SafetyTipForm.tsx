'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface FormData {
  title:     string;
  body:      string;
  icon:      string;
  published: boolean;
  order:     number;
}

interface Props {
  initial?: Partial<FormData> & { id?: string };
  mode: 'new' | 'edit';
}

const ICONS = [
  { value: 'warning',  label: '⚠️  Warning' },
  { value: 'scam',     label: '🚨  Scam Alert' },
  { value: 'money',    label: '💰  Money / Prices' },
  { value: 'photo',    label: '📸  Photography' },
  { value: 'guide',    label: '🧭  Fake Guides' },
  { value: 'taxi',     label: '🚕  Transport' },
  { value: 'shop',     label: '🛍️  Shops / Souks' },
  { value: 'dress',    label: '👗  Dress Code' },
  { value: 'health',   label: '🏥  Health & Safety' },
  { value: 'info',     label: 'ℹ️  General Info' },
];

const inputCls = 'w-full border border-[#D4BC96] rounded-lg px-4 py-2.5 text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-500 transition-colors bg-white';
const labelCls = 'block text-sm font-semibold text-[#3D2817] mb-1.5';

export function SafetyTipForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title:     initial.title     ?? '',
    body:      initial.body      ?? '',
    icon:      initial.icon      ?? 'warning',
    published: initial.published ?? false,
    order:     initial.order     ?? 0,
  });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState('');

  function set<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true); setError('');
    try {
      const url    = mode === 'new' ? '/api/admin/safety' : `/api/admin/safety/${initial.id}`;
      const method = mode === 'new' ? 'POST' : 'PATCH';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { router.push('/admin/safety'); router.refresh(); }
      else { const { error: msg } = await res.json() as { error: string }; setError(msg ?? 'Failed to save'); }
    } catch { setError('Network error'); }
    finally { setSaving(false); }
  }

  async function handleDelete() {
    if (!confirm('Delete this safety tip? This cannot be undone.')) return;
    setDeleting(true); setError('');
    try {
      const res = await fetch(`/api/admin/safety/${initial.id}`, { method: 'DELETE' });
      if (res.ok) { router.push('/admin/safety'); router.refresh(); }
      else { const { error: msg } = await res.json() as { error: string }; setError(msg ?? 'Failed to delete'); }
    } catch { setError('Network error'); }
    finally { setDeleting(false); }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && (
        <div className="text-sm text-[#C4452D] bg-[#C4452D]/5 border border-[#C4452D]/20 rounded-lg px-4 py-3">{error}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelCls}>Title *</label>
          <input type="text" required value={form.title} onChange={e => set('title', e.target.value)}
            className={inputCls} placeholder="Beware of unofficial guides near the entrance…" />
        </div>

        {/* Icon */}
        <div>
          <label className={labelCls}>Category / Icon</label>
          <select value={form.icon} onChange={e => set('icon', e.target.value)} className={inputCls}>
            {ICONS.map(ic => <option key={ic.value} value={ic.value}>{ic.label}</option>)}
          </select>
        </div>

        {/* Order */}
        <div>
          <label className={labelCls}>Display Order</label>
          <input type="number" min={0} value={form.order}
            onChange={e => set('order', parseInt(e.target.value) || 0)}
            className={inputCls} placeholder="0" />
          <p className="text-xs text-[#8B6344] mt-1">Lower number = shown first</p>
        </div>

        {/* Published toggle */}
        <div
          className={`md:col-span-2 flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${form.published ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-300'}`}
          onClick={() => set('published', !form.published)}
        >
          <div>
            <p className="font-semibold text-[#3D2817] text-sm">
              {form.published ? '✅ Published — visible to visitors' : '⏸ Draft — hidden from visitors'}
            </p>
            <p className="text-xs text-[#5C3D20] mt-0.5">
              {form.published ? 'Tip will appear on the Safety Guide page' : 'Click to publish and make it visible'}
            </p>
          </div>
          <input type="checkbox" checked={form.published}
            onChange={e => set('published', e.target.checked)}
            onClick={e => e.stopPropagation()}
            className="w-5 h-5 accent-amber-500" />
        </div>

        {/* Body */}
        <div className="md:col-span-2">
          <label className={labelCls}>Content *</label>
          <textarea required value={form.body} rows={6}
            onChange={e => set('body', e.target.value)}
            className={inputCls}
            placeholder="Describe the scam or tip in detail. What to watch out for, how to avoid it, what to do if it happens…" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E8D5B7]">
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 disabled:opacity-50 transition-colors">
            {saving && <Loader2 size={15} className="animate-spin" />}
            {mode === 'new' ? 'Create Tip' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.push('/admin/safety')}
            className="px-6 py-2.5 border border-[#D4BC96] text-sm font-medium text-[#3D2817] rounded-lg hover:bg-[#FAF3E7] transition-colors">
            Cancel
          </button>
        </div>
        {mode === 'edit' && (
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors">
            {deleting && <Loader2 size={15} className="animate-spin" />}
            Delete Tip
          </button>
        )}
      </div>
    </form>
  );
}
