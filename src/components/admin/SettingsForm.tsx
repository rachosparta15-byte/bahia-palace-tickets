'use client';

import { useState, useTransition } from 'react';

interface SettingField {
  key: string;
  value: string;
  label: string;
  type?: string;
  placeholder?: string;
}

interface Props {
  grouped: Record<string, SettingField[]>;
}

const inputCls = 'w-full border border-[#E8D5B7] rounded-xl px-3 py-2.5 text-sm text-[#3D2817] bg-[#FAF3E7] focus:outline-none focus:ring-2 focus:ring-[#C4452D]/30 focus:border-[#C4452D]';

export function SettingsForm({ grouped }: Props) {
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(Object.values(grouped).flat().map(f => [f.key, f.value]))
  );
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  function set(key: string, value: string) {
    setValues(v => ({ ...v, [key]: value }));
    setSaved(false);
  }

  async function save() {
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    setSaved(true);
    startTransition(() => {});
  }

  return (
    <div>
      {Object.entries(grouped).map(([group, fields]) => (
        <div key={group} className="bg-white rounded-2xl border border-[#E8D5B7] p-6 mb-5">
          <h2 className="text-xs font-bold text-[#8B6344] uppercase tracking-widest mb-4">{group}</h2>
          <div className="space-y-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[#5C3D20] uppercase tracking-wide mb-1.5">{f.label}</label>
                <input
                  type={f.type ?? 'text'}
                  value={values[f.key] ?? ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={save}
          disabled={pending}
          className="px-6 py-2.5 bg-[#C4452D] text-white text-sm font-semibold rounded-xl hover:bg-[#A33824] transition-colors disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save all settings'}
        </button>
        {saved && <span className="text-sm text-emerald-600 font-medium">✓ Saved successfully!</span>}
      </div>
    </div>
  );
}
