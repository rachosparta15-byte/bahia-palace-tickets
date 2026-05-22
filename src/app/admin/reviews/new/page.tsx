import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReviewForm } from '@/components/admin/ReviewForm';

export default function NewReviewPage() {
  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to reviews
      </Link>
      <h1 className="text-2xl font-bold text-[#3D2817] mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Add Review
      </h1>
      <ReviewForm mode="new" />
    </div>
  );
}
