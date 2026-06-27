'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
  const t = useTranslations('contactPage');

  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
        <div className="w-14 h-14 bg-[#8FA63C]/10 rounded-full flex items-center justify-center">
          <CheckCircle2 size={28} className="text-[#8FA63C]" />
        </div>
        <p className="font-semibold text-[#F5E8CC]">{t('success')}</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-sm text-[#C4A882] hover:text-[#C4452D] transition-colors underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  const inputCls = 'w-full border border-[rgba(232,163,61,0.20)] rounded-lg px-4 py-2.5 text-sm text-[#F5E8CC] placeholder:text-[#C4A882]/50 focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-[#2E1F12]';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#F5E8CC] mb-1.5">{t('nameLabel')}</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputCls}
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-[#F5E8CC] mb-1.5">{t('emailLabel')}</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputCls}
            placeholder="you@email.com"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#F5E8CC] mb-1.5">{t('subjectLabel')}</label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => update('subject', e.target.value)}
          className={inputCls}
          placeholder="Question about my booking"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-[#F5E8CC] mb-1.5">{t('messageLabel')}</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update('message', e.target.value)}
          className={`${inputCls} resize-none`}
          placeholder="How can we help you?"
        />
      </div>

      {status === 'error' && (
        <div className="flex items-center gap-2 text-sm text-[#C4452D] bg-[#C4452D]/5 border border-[#C4452D]/20 rounded-lg px-4 py-3">
          <AlertCircle size={15} className="shrink-0" />
          {t('error')}
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        loading={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? t('sending') : t('send')}
      </Button>
    </form>
  );
}
