import prisma from '@/lib/db';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ReviewForm } from '@/components/admin/ReviewForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/admin/reviews" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to reviews
      </Link>
      <h1 className="text-2xl font-bold text-[#3D2817] mb-8" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
        Edit Review
      </h1>
      <ReviewForm
        mode="edit"
        initial={{
          id:         review.id,
          authorName: review.authorName,
          authorImg:  review.authorImg  ?? '',
          country:    review.country    ?? '',
          rating:     review.rating,
          body:       review.body,
          locale:     review.locale,
          published:  review.published,
          order:      review.order,
        }}
      />
    </div>
  );
}
