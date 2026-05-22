'use client';

import { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUploader({ value, onChange, label = 'Photo' }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res  = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json() as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? 'Upload failed');
      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
      // reset so same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">{label}</label>

      {/* Preview */}
      {value && (
        <div className="relative mb-3 h-44 rounded-xl overflow-hidden bg-[#F5EFE4] border border-[#E8D5B7]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
            title="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Upload button */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-[#C8A882] rounded-xl text-sm text-[#5C3D20] hover:border-[#C4452D] hover:text-[#C4452D] hover:bg-[#FDF7EE] transition-colors disabled:opacity-60 w-full justify-center"
      >
        {loading
          ? <><Loader2 size={16} className="animate-spin" /> Uploading…</>
          : <><Upload size={16} /> {value ? 'Change photo' : 'Upload from PC'}</>
        }
      </button>


{error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
