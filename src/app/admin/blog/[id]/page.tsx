import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="p-8 max-w-4xl">
      <Link href="/admin/blog" className="inline-flex items-center gap-2 text-sm text-[#5C3D20] hover:text-[#3D2817] mb-6">
        <ArrowLeft size={14} />
        Back to articles
      </Link>
      <h1
        className="text-2xl font-bold text-[#3D2817] mb-8"
        style={{ fontFamily: 'Cormorant Garamond, serif' }}
      >
        Edit Article
      </h1>
      <div className="bg-white rounded-2xl border border-[#E8D5B7] p-8">
        <BlogPostForm
          mode="edit"
          initial={{
            id:        post.id,
            title:     post.title,
            slug:      post.slug,
            locale:    post.locale,
            category:  post.category,
            excerpt:   post.excerpt ?? '',
            content:   post.content ?? '',
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
