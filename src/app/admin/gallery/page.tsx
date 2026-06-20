'use client';

import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2, Pencil, Loader2, Plus, X, Check, GripVertical, Eye, EyeOff } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  altText: string;
  title: string;
  caption: string | null;
  seoKeyword: string | null;
  order: number;
  published: boolean;
  createdAt: string;
}

interface EditState {
  altText: string;
  title: string;
  caption: string;
  seoKeyword: string;
  order: number;
}

export default function AdminGalleryPage() {
  const [images, setImages]     = useState<GalleryImage[]>([]);
  const [loading, setLoading]   = useState(true);
  const [uploading, setUploading] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [editData, setEditData] = useState<EditState>({ altText: '', title: '', caption: '', seoKeyword: '', order: 0 });
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  // New image form
  const [showAdd, setShowAdd]       = useState(false);
  const [newUrl, setNewUrl]         = useState('');
  const [newForm, setNewForm]       = useState<EditState>({ altText: '', title: '', caption: '', seoKeyword: '', order: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
      if (!res.ok) setError((data as { error?: string }).error ?? 'Failed to load');
    } catch {
      setError('Network error — could not load gallery');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function uploadFile(file: File): Promise<string | null> {
    const fd = new FormData();
    fd.append('file', file);
    const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
    const data = await res.json() as { url?: string; error?: string };
    if (!res.ok || !data.url) { setError(data.error ?? 'Upload failed'); return null; }
    return data.url;
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const url = await uploadFile(file);
    setUploading(false);
    if (url) { setNewUrl(url); setShowAdd(true); }
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleAdd() {
    if (!newUrl || !newForm.altText || !newForm.title) {
      setError('Alt text and title are required');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/admin/gallery', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl, ...newForm }),
    });
    if (res.ok) {
      setShowAdd(false);
      setNewUrl('');
      setNewForm({ altText: '', title: '', caption: '', seoKeyword: '', order: 0 });
      await load();
    } else {
      const d = await res.json() as { error?: string };
      setError(d.error ?? 'Failed to save');
    }
    setSaving(false);
  }

  async function handleSave(id: string) {
    setSaving(true);
    await fetch(`/api/admin/gallery/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editData),
    });
    setSaving(false);
    setEditId(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this image from the gallery?')) return;
    await fetch(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    await load();
  }

  async function togglePublished(img: GalleryImage) {
    await fetch(`/api/admin/gallery/${img.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !img.published }),
    });
    await load();
  }

  function startEdit(img: GalleryImage) {
    setEditId(img.id);
    setEditData({ altText: img.altText, title: img.title, caption: img.caption ?? '', seoKeyword: img.seoKeyword ?? '', order: img.order });
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'var(--font-heading)' }}>
          Gallery
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#8B6344]">{images.length} photo{images.length !== 1 ? 's' : ''}</span>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFileSelect} />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#C4452D] hover:bg-[#a83826] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {uploading ? <><Loader2 size={15} className="animate-spin" /> Uploading…</> : <><Plus size={15} /> Add Photo</>}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between">
          <p className="text-sm text-red-600">{error}</p>
          <button onClick={() => setError('')}><X size={14} className="text-red-400" /></button>
        </div>
      )}

      {/* New image form */}
      {showAdd && newUrl && (
        <div className="mb-6 bg-white rounded-2xl border-2 border-[#C4452D]/30 p-6">
          <div className="flex gap-6">
            <div className="w-40 h-32 rounded-xl overflow-hidden bg-[#F5EFE4] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1">Alt Text (SEO) *</label>
                <input
                  value={newForm.altText}
                  onChange={e => setNewForm(p => ({ ...p, altText: e.target.value }))}
                  placeholder="e.g. Bahia Palace carved cedar ceiling Marrakech"
                  className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4452D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1">Title *</label>
                <input
                  value={newForm.title}
                  onChange={e => setNewForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Carved Cedar Ceiling"
                  className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4452D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1">SEO Keyword</label>
                <input
                  value={newForm.seoKeyword}
                  onChange={e => setNewForm(p => ({ ...p, seoKeyword: e.target.value }))}
                  placeholder="e.g. bahia palace ceiling"
                  className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4452D]"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1">Caption</label>
                <input
                  value={newForm.caption}
                  onChange={e => setNewForm(p => ({ ...p, caption: e.target.value }))}
                  placeholder="Optional description shown below the photo"
                  className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4452D]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1">Order</label>
                <input
                  type="number"
                  value={newForm.order}
                  onChange={e => setNewForm(p => ({ ...p, order: Number(e.target.value) }))}
                  className="w-full border border-[#E8D5B7] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#C4452D]"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 justify-end">
            <button onClick={() => { setShowAdd(false); setNewUrl(''); }} className="px-4 py-2 text-sm text-[#5C3D20] border border-[#E8D5B7] rounded-lg hover:bg-[#F5EFE4]">
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-[#C4452D] hover:bg-[#a83826] disabled:opacity-60 text-white text-sm font-semibold rounded-lg"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Save to Gallery
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin text-[#C4452D]" /></div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E8D5B7]">
          <Upload size={40} className="mx-auto text-[#C8A882] mb-4" />
          <p className="text-[#5C3D20] font-medium mb-1">No photos yet</p>
          <p className="text-sm text-[#8B6344]">Click "Add Photo" to upload your first gallery image</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map(img => (
            <div key={img.id} className={`bg-white rounded-2xl border overflow-hidden ${img.published ? 'border-[#E8D5B7]' : 'border-dashed border-[#C8A882] opacity-70'}`}>
              <div className="relative h-48 bg-[#F5EFE4]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => togglePublished(img)}
                    title={img.published ? 'Hide from gallery' : 'Show in gallery'}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                  >
                    {img.published ? <Eye size={13} /> : <EyeOff size={13} />}
                  </button>
                  <button
                    onClick={() => startEdit(img)}
                    className="bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="absolute bottom-2 left-2">
                  <span className="bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">#{img.order}</span>
                </div>
              </div>

              {editId === img.id ? (
                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B6344] uppercase tracking-wide mb-1">Alt Text</label>
                    <input
                      value={editData.altText}
                      onChange={e => setEditData(p => ({ ...p, altText: e.target.value }))}
                      className="w-full border border-[#E8D5B7] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C4452D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B6344] uppercase tracking-wide mb-1">Title</label>
                    <input
                      value={editData.title}
                      onChange={e => setEditData(p => ({ ...p, title: e.target.value }))}
                      className="w-full border border-[#E8D5B7] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C4452D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B6344] uppercase tracking-wide mb-1">SEO Keyword</label>
                    <input
                      value={editData.seoKeyword}
                      onChange={e => setEditData(p => ({ ...p, seoKeyword: e.target.value }))}
                      className="w-full border border-[#E8D5B7] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C4452D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B6344] uppercase tracking-wide mb-1">Caption</label>
                    <input
                      value={editData.caption}
                      onChange={e => setEditData(p => ({ ...p, caption: e.target.value }))}
                      className="w-full border border-[#E8D5B7] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C4452D]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#8B6344] uppercase tracking-wide mb-1">Order</label>
                    <input
                      type="number"
                      value={editData.order}
                      onChange={e => setEditData(p => ({ ...p, order: Number(e.target.value) }))}
                      className="w-full border border-[#E8D5B7] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#C4452D]"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => setEditId(null)} className="flex-1 text-xs py-1.5 border border-[#E8D5B7] rounded-lg text-[#5C3D20] hover:bg-[#F5EFE4]">
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(img.id)}
                      disabled={saving}
                      className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 bg-[#C4452D] text-white rounded-lg hover:bg-[#a83826] disabled:opacity-60"
                    >
                      {saving ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />} Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#3D2817] leading-snug mb-1 truncate">{img.title}</p>
                  {img.seoKeyword && (
                    <p className="text-[10px] text-[#C4452D] font-mono mb-1">🔍 {img.seoKeyword}</p>
                  )}
                  <p className="text-xs text-[#8B6344] leading-relaxed line-clamp-2">{img.altText}</p>
                  {img.caption && <p className="text-xs text-[#8B6344] mt-1 italic line-clamp-1">{img.caption}</p>}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${img.published ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {img.published ? 'Published' : 'Hidden'}
                    </span>
                    <div className="flex items-center gap-1 text-[10px] text-[#8B6344]">
                      <GripVertical size={11} /> order {img.order}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 bg-[#FDF7EE] rounded-xl border border-[#E8D5B7] p-4">
        <p className="text-xs text-[#5C3D20]">
          <strong>SEO tips:</strong> Alt text = describe the photo with keywords (e.g. "Bahia Palace zellige tiles courtyard Marrakech"). Title = short display name. SEO Keyword = the main keyword this photo targets for Google image search.
        </p>
      </div>
    </div>
  );
}
