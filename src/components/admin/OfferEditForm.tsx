'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from './ImageUploader';
import type { OfferDefaults } from '@/lib/offer-admin';

type CardForm = {
  id: string;
  section: string;
  builtIn: boolean;
  hidden: boolean;
  title: string;
  tagline: string;
  duration: string;
  includes: string;
  note: string;
  price: string;
  priceNote: string;
  buttonUrl: string;
  imageUrl: string;
  ribbon: string;
  badge: string;
};
type TextKey = Exclude<keyof CardForm, 'id' | 'section' | 'builtIn' | 'hidden'>;

const inputCls =
  'w-full border border-[#E8D5B7] rounded-xl px-3 py-2.5 text-sm text-[#3D2817] bg-[#FAF3E7] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D]';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 mb-5">
      <h2 className="text-sm font-bold text-[#3D2817] uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

export function OfferEditForm({ card, defaults }: { card: CardForm; defaults: OfferDefaults | null }) {
  const router = useRouter();
  const [form, setForm] = useState(card);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const featured = card.section === 'featured';

  const set = (key: TextKey) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  /** One field, with what the site shows today when it is left empty. */
  // Called as a function, not used as <Field />: a component declared inside
  // this one would be a new type on every keystroke and the input would lose focus.
  function field({ k, label, help, area }: { k: TextKey; label: string; help?: string; area?: boolean }) {
    const current = defaults?.[k as keyof OfferDefaults];
    return (
      <div className="mb-4">
        <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">{label}</label>
        {area ? (
          <textarea className={inputCls} rows={5} value={form[k]} onChange={set(k)} />
        ) : (
          <input className={inputCls} value={form[k]} onChange={set(k)} />
        )}
        {help && <p className="mt-1 text-[11px] text-[#8B6344]">{help}</p>}
        {card.builtIn && current ? (
          <p className="mt-1 text-[11px] text-[#8B6344]">
            <span className="font-semibold">If empty, the site shows:</span>{' '}
            <span className="whitespace-pre-line">{current}</span>
          </p>
        ) : null}
      </div>
    );
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    const { id, section: _s, builtIn: _b, ...body } = form;
    const res = await fetch(`/api/admin/offers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    setSaving(false);
    setMessage(res.ok ? { ok: true, text: 'Saved. The homepage shows it within a minute.' } : { ok: false, text: data.error ?? 'Could not save' });
    if (res.ok) router.refresh();
  }

  async function remove() {
    const question = card.builtIn
      ? 'Reset this card to what the site showed before your edits?'
      : 'Delete this card from the site?';
    if (!window.confirm(question)) return;
    await fetch(`/api/admin/offers/${card.id}`, { method: 'DELETE' });
    router.push('/admin/offers');
    router.refresh();
  }

  return (
    <div>
      <Section title="Visibility">
        <label className="flex items-center gap-3 text-sm text-[#3D2817]">
          <input
            type="checkbox"
            checked={!form.hidden}
            onChange={(e) => setForm((f) => ({ ...f, hidden: !e.target.checked }))}
            className="h-4 w-4"
          />
          Show this card on the homepage
        </label>
      </Section>

      <Section title="Text (English page)">
        {field({ k: "title", label: "Title" })}
        {featured && field({ k: "tagline", label: "Subtitle" })}
        {field({ k: "duration", label: "Duration line", help: 'For example "Self-guided • ~1–2 hours".' })}
        {featured && field({ k: "includes", label: "What is included", help: "One item per line.", area: true })}
        {field({ k: "note", label: "Small line at the bottom", help: 'For example "Booked and charged by our partner Viator". Type - to remove it.' })}
        {featured && field({ k: "ribbon", label: "Ribbon on the photo", help: 'For example "Available Now". Type - to remove it.' })}
        {featured && field({ k: "badge", label: "Badge on the photo", help: 'For example "Audio guide included". Type - to remove it.' })}
      </Section>

      <Section title="Price and button (all languages)">
        {field({ k: "price", label: "Price shown", help: 'Shown exactly as you type it, for example "$13.00" or "€12.99".' })}
        {featured && field({ k: "priceNote", label: "Line under the price", help: "Type - to remove it." })}
        {field({ k: "buttonUrl", label: "Button link", help: "Where the card and its button go. Starts with https://" })}
      </Section>

      <Section title="Photo (all languages)">
        <ImageUploader
          value={form.imageUrl}
          onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
          label="Upload a photo from your computer (JPG, PNG or WebP, up to 5 MB)"
        />
        {card.builtIn && !form.imageUrl && defaults?.imageUrl && (
          <div className="mt-3">
            <p className="text-[11px] font-semibold text-[#8B6344] mb-1">If empty, the site shows:</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={defaults.imageUrl} alt="" className="h-28 rounded-xl object-cover" />
          </div>
        )}
      </Section>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-[#3D2817] px-6 py-3 text-sm font-semibold text-white hover:bg-[#5C3D20] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={remove}
          className="rounded-xl border border-[#C4452D] px-5 py-3 text-sm font-semibold text-[#C4452D] hover:bg-[#FBE9E4]"
        >
          {card.builtIn ? 'Reset to the original' : 'Delete card'}
        </button>
        {message && <p className={`text-sm ${message.ok ? 'text-[#5F7A1E]' : 'text-[#C4452D]'}`}>{message.text}</p>}
      </div>
    </div>
  );
}
