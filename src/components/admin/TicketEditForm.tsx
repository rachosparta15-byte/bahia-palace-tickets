'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import type { TicketTypeModel } from '@/generated/prisma/models/TicketType';
import { ImageUploader } from './ImageUploader';

interface Props {
  ticket: TicketTypeModel;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6 mb-5">
      <h2 className="text-sm font-bold text-[#3D2817] uppercase tracking-wider mb-4">{title}</h2>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inputCls = 'w-full border border-[#E8D5B7] rounded-xl px-3 py-2.5 text-sm text-[#3D2817] bg-[#FAF3E7] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D]';

export function TicketEditForm({ ticket }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const imgs: string[] = (() => { try { return JSON.parse(ticket.images ?? '[]'); } catch { return []; } })();

  const [form, setForm] = useState({
    priceAdult:   String(ticket.priceAdult),
    priceChild:   String(ticket.priceChild),
    durationMins: String(ticket.durationMins),
    maxPerDay:    ticket.maxPerDay != null ? String(ticket.maxPerDay) : '',
    imageUrl:     imgs[0] ?? '',
    available:    ticket.available,
    nameEn: ticket.nameEn, nameFr: ticket.nameFr, nameIt: ticket.nameIt, nameDe: ticket.nameDe, nameEs: ticket.nameEs,
    descEn: ticket.descEn, descFr: ticket.descFr, descIt: ticket.descIt, descDe: ticket.descDe, descEs: ticket.descEs,
  });

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }));
  }

  async function save() {
    setSaved(false);
    await fetch(`/api/admin/tickets/${ticket.slug}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        priceAdult:   parseFloat(form.priceAdult)   || 0,
        priceChild:   parseFloat(form.priceChild)   || 0,
        durationMins: parseInt(form.durationMins)   || 60,
        maxPerDay:    form.maxPerDay ? parseInt(form.maxPerDay) : null,
        images:       JSON.stringify([form.imageUrl].filter(Boolean)),
        available:    form.available,
        nameEn: form.nameEn, nameFr: form.nameFr, nameIt: form.nameIt, nameDe: form.nameDe, nameEs: form.nameEs,
        descEn: form.descEn, descFr: form.descFr, descIt: form.descIt, descDe: form.descDe, descEs: form.descEs,
      }),
    });
    setSaved(true);
    startTransition(() => router.refresh());
  }

  return (
    <div>
      {/* Availability */}
      <Section title="Availability">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, available: true }))}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
              ${form.available ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-[#E8D5B7] text-[#8B6344] hover:bg-[#F5EFE4]'}`}
          >
            ✅ Live — bookable now
          </button>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, available: false }))}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors
              ${!form.available ? 'bg-[#3D2817] border-[#3D2817] text-[#E8A33D]' : 'bg-white border-[#E8D5B7] text-[#8B6344] hover:bg-[#F5EFE4]'}`}
          >
            🔒 Coming Soon
          </button>
        </div>
      </Section>

      {/* Pricing */}
      <Section title="Pricing">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Adult Price ($)">
            <input type="number" min="0" step="0.01" value={form.priceAdult} onChange={set('priceAdult')} className={inputCls} />
          </Field>
          <Field label="Child Price ($)">
            <input type="number" min="0" step="0.01" value={form.priceChild} onChange={set('priceChild')} className={inputCls} />
          </Field>
          <Field label="Duration (minutes)">
            <input type="number" min="1" value={form.durationMins} onChange={set('durationMins')} className={inputCls} />
          </Field>
          <Field label="Max per day (leave empty = unlimited)">
            <input type="number" min="1" value={form.maxPerDay} onChange={set('maxPerDay')} className={inputCls} placeholder="Unlimited" />
          </Field>
        </div>
      </Section>

      {/* Image */}
      <Section title="Main Photo">
        <ImageUploader
          value={form.imageUrl}
          onChange={url => setForm(f => ({ ...f, imageUrl: url }))}
        />
      </Section>

      {/* Names */}
      <Section title="Ticket Names (per language)">
        {(['En', 'Fr', 'Es', 'De', 'It'] as const).map(lang => (
          <Field key={lang} label={`Name (${lang})`}>
            <input value={form[`name${lang}`]} onChange={set(`name${lang}`)} className={inputCls} />
          </Field>
        ))}
      </Section>

      {/* Descriptions */}
      <Section title="Short Descriptions (per language)">
        {(['En', 'Fr', 'Es', 'De', 'It'] as const).map(lang => (
          <Field key={lang} label={`Description (${lang})`}>
            <textarea rows={2} value={form[`desc${lang}`]} onChange={set(`desc${lang}`)} className={inputCls + ' resize-none'} />
          </Field>
        ))}
      </Section>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={save}
          disabled={pending}
          className="px-6 py-2.5 bg-[#C4452D] text-white text-sm font-semibold rounded-xl hover:bg-[#A33824] transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save changes'}
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved!</span>}
      </div>
    </div>
  );
}
