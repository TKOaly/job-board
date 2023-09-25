import client from '@/db';
import { getCompany } from '@/lib/companies';
import { getPost } from '@/lib/posts';
import { Metadata } from 'next';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import PostDetails from './PostDetails';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(parseInt(params.id, 10));

  if (!post) return {};

  const company = await getCompany(post.employingCompanyId);

  return {
    title: `${post.title} - Job Board - TKO-äly` ,
    openGraph: {
      title: post.title,
      images: company?.logoUrl
        ? [
            {
              url: company.logoUrl
            }
          ]
        : undefined,
    },
  };
}

const PostPage = async ({ params }) => {
  const post = await getPost(parseInt(params.id, 10));

  if (!post) {
    notFound();
  }

  return (
    <div className="mx-4 mb-4">
      <PostDetails post={post} company={post.employingCompany!} />
    </div>
  );
};

export default PostPage;
