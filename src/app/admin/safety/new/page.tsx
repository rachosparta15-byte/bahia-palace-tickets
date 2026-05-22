import { SafetyTipForm } from '@/components/admin/SafetyTipForm';

export default function NewSafetyTipPage() {
  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#3D2817] mb-2" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        New Safety Tip
      </h1>
      <p className="text-sm text-[#8B6344] mb-8">Add a scam alert or visitor warning for Marrakech</p>
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-6">
        <SafetyTipForm mode="new" />
      </div>
    </div>
  );
}
