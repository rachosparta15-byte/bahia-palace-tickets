import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to articles
      </Link>
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-8"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        New Article
      </h1>
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-8">
        <BlogPostForm mode="new" />
      </div>
    </div>
  );
}
