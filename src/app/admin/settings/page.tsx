import prisma from '@/lib/db';
import { SettingsForm } from '@/components/admin/SettingsForm';

export const dynamic = 'force-dynamic';

const SETTING_META: Record<string, { label: string; group: string; type?: string; placeholder?: string }> = {
  whatsapp_number:     { label: 'WhatsApp Number',           group: 'Contact',  type: 'tel',  placeholder: '+212600000000' },
  contact_phone:       { label: 'Phone Number',              group: 'Contact',  type: 'tel',  placeholder: '+212600000000' },
  contact_email:       { label: 'Contact Email',             group: 'Contact',  type: 'email' },
  contact_address:     { label: 'Address',                   group: 'Contact',  placeholder: 'Rue Riad Zitoun el Jedid...' },
  opening_hours:       { label: 'Opening Hours',             group: 'Info',     placeholder: '09:00 – 17:00 (daily)' },
  last_entry:          { label: 'Last Entry Time',           group: 'Info',     placeholder: '16:30' },
  adult_price_display: { label: 'Adult Price Display ($)',   group: 'Pricing',  type: 'number' },
  child_price_display: { label: 'Child Price Display ($)',   group: 'Pricing',  type: 'number' },
  free_cancel_hours:   { label: 'Free Cancellation (hours)', group: 'Pricing',  type: 'number' },
  facebook_url:        { label: 'Facebook URL',              group: 'Social',   type: 'url' },
  instagram_url:       { label: 'Instagram URL',             group: 'Social',   type: 'url' },
  tripadvisor_url:     { label: 'TripAdvisor URL',           group: 'Social',   type: 'url' },
};

export default async function SettingsPage() {
  // auto-seed
  const count = await prisma.siteSetting.count();
  if (count === 0) {
    const defaults = [
      { key: 'whatsapp_number',    value: '' },
      { key: 'contact_phone',      value: '' },
      { key: 'contact_email',      value: 'contact@bahia-palace.com' },
      { key: 'contact_address',    value: 'Rue Riad Zitoun el Jedid, Marrakech Medina' },
      { key: 'opening_hours',      value: '09:00 – 17:00 (daily)' },
      { key: 'last_entry',         value: '16:30' },
      { key: 'adult_price_display', value: '10' },
      { key: 'child_price_display', value: '0' },
      { key: 'free_cancel_hours',  value: '24' },
      { key: 'facebook_url',       value: '' },
      { key: 'instagram_url',      value: '' },
      { key: 'tripadvisor_url',    value: '' },
    ];
    for (const s of defaults) {
      await prisma.siteSetting.upsert({ where: { key: s.key }, update: {}, create: { key: s.key, value: s.value } });
    }
  }

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
  const map: Record<string, string> = Object.fromEntries(settings.map(s => [s.key, s.value]));

  // group
  const grouped: Record<string, Array<{ key: string; value: string; label: string; type?: string; placeholder?: string }>> = {};
  for (const [key, meta] of Object.entries(SETTING_META)) {
    if (!grouped[meta.group]) grouped[meta.group] = [];
    grouped[meta.group].push({ key, value: map[key] ?? '', label: meta.label, type: meta.type, placeholder: meta.placeholder });
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#3D2817]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
          Site Settings
        </h1>
        <p className="text-sm text-[#8B6344] mt-1">Global configuration — contact info, prices, social links.</p>
      </div>
      <SettingsForm grouped={grouped} />
    </div>
  );
}
