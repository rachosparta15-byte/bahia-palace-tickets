'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { ImageUploader } from './ImageUploader';
import { RichTextEditor } from './RichTextEditor';

interface FormData {
  title:      string;
  slug:       string;
  locale:     string;
  category:   string;
  excerpt:    string;
  content:    string;
  coverImage: string;
  published:  boolean;
}

interface Props {
  initial?: Partial<FormData> & { id?: string };
  mode: 'new' | 'edit';
}

const LOCALES    = ['en', 'fr', 'it', 'de', 'es'];
const CATEGORIES = ['visit-tips', 'history', 'safety', 'practical', 'comparisons'];

function slugify(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

const inputCls = 'w-full border border-[#D4BC96] rounded-lg px-4 py-2.5 text-sm text-[#3D2817] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D] transition-colors bg-white';
const labelCls = 'block text-sm font-semibold text-[#3D2817] mb-1.5';

export function BlogPostForm({ initial = {}, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    title:      initial.title      ?? '',
    slug:       initial.slug       ?? '',
    locale:     initial.locale     ?? 'en',
    category:   initial.category   ?? 'visit-tips',
    excerpt:    initial.excerpt    ?? '',
    content:    initial.content    ?? '',
    coverImage: initial.coverImage ?? '',
    published:  initial.published  ?? false,
  });
  const [saving,   setSaving]   = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error,    setError]    = useState('');

  function set(key: keyof FormData, value: string | boolean) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleTitleChange(val: string) {
    setForm(f => ({
      ...f,
      title: val,
      slug: mode === 'new' ? slugify(val) : f.slug,
    }));
  }

  async function handleSave(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const url    = mode === 'new' ? '/api/admin/blog' : `/api/admin/blog/${initial.id}`;
      const method = mode === 'new' ? 'POST' : 'PATCH';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        const { error: msg } = await res.json() as { error: string };
        setError(msg ?? 'Failed to save');
      }
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this article? This cannot be undone.')) return;
    setDeleting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/blog/${initial.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/blog');
        router.refresh();
      } else {
        const { error: msg } = await res.json() as { error: string };
        setError(msg ?? 'Failed to delete');
      }
    } catch {
      setError('Network error');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && (
        <div className="text-sm text-[#C4452D] bg-[#C4452D]/5 border border-[#C4452D]/20 rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title */}
        <div className="md:col-span-2">
          <label className={labelCls}>Title *</label>
          <input
            type="text" required value={form.title}
            onChange={e => handleTitleChange(e.target.value)}
            className={inputCls} placeholder="How to Skip the Line at Bahia Palace…"
          />
        </div>

        {/* Slug */}
        <div>
          <label className={labelCls}>Slug *</label>
          <input
            type="text" required value={form.slug}
            onChange={e => set('slug', slugify(e.target.value))}
            className={inputCls} placeholder="how-to-skip-the-line"
          />
          {form.slug && (
            <div className="mt-1.5 flex items-center gap-2">
              {form.published ? (
                <a
                  href={`/${form.locale}/blog/${form.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2E4A7B] hover:underline"
                >
                  🔗 /{form.locale}/blog/{form.slug}
                  <span className="text-[#8B6344]">(open)</span>
                </a>
              ) : (
                <span className="text-xs text-[#8B6344]">
                  🔒 /{form.locale}/blog/{form.slug}
                  <span className="ml-1 text-amber-600 font-medium">(Draft — only visible after publishing)</span>
                </span>
              )}
            </div>
          )}
          {!form.slug && (
            <p className="text-xs text-[#8B6344] mt-1">URL will appear here once you type the title</p>
          )}
        </div>

        {/* Locale */}
        <div>
          <label className={labelCls}>Language</label>
          <select value={form.locale} onChange={e => set('locale', e.target.value)} className={inputCls}>
            {LOCALES.map(l => <option key={l} value={l}>{l.toUpperCase()}</option>)}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className={labelCls}>Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)} className={inputCls}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Published toggle — prominent */}
        <div className={`md:col-span-2 flex items-center justify-between px-5 py-4 rounded-xl border-2 cursor-pointer transition-colors ${form.published ? 'bg-emerald-50 border-emerald-400' : 'bg-amber-50 border-amber-300'}`}
          onClick={() => set('published', !form.published)}
        >
          <div>
            <p className="font-semibold text-[#3D2817] text-sm">
              {form.published ? '✅ Published — visible on the site' : '⏸ Draft — hidden from visitors'}
            </p>
            <p className="text-xs text-[#5C3D20] mt-0.5">
              {form.published ? 'Article will appear on /blog' : 'Click to publish and make it visible'}
            </p>
          </div>
          <input
            id="published" type="checkbox"
            checked={form.published}
            onChange={e => set('published', e.target.checked)}
            onClick={e => e.stopPropagation()}
            className="w-5 h-5 accent-[#C4452D]"
          />
        </div>

        {/* Cover image */}
        <div className="md:col-span-2">
          <ImageUploader
            label="Cover Image"
            value={form.coverImage}
            onChange={url => setForm(f => ({ ...f, coverImage: url }))}
          />
        </div>

        {/* Excerpt */}
        <div className="md:col-span-2">
          <label className={labelCls}>Excerpt</label>
          <textarea
            value={form.excerpt} rows={2}
            onChange={e => set('excerpt', e.target.value)}
            className={inputCls} placeholder="Short description shown in the blog listing…"
          />
        </div>

        {/* Content */}
        <div className="md:col-span-2">
          <label className={labelCls}>Content *</label>
          <RichTextEditor value={form.content} onChange={val => set('content', val)} />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#E8D5B7]">
        <div className="flex gap-3">
          <button
            type="submit" disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#C4452D] text-white text-sm font-medium rounded-lg hover:bg-[#A33824] disabled:opacity-50 transition-colors"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {mode === 'new' ? 'Create Article' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/blog')}
            className="px-6 py-2.5 border border-[#D4BC96] text-sm font-medium text-[#3D2817] rounded-lg hover:bg-[#FAF3E7] transition-colors"
          >
            Cancel
          </button>
        </div>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-red-200 text-sm font-medium text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {deleting && <Loader2 size={15} className="animate-spin" />}
            Delete Article
          </button>
        )}
      </div>
    </form>
  );
}
