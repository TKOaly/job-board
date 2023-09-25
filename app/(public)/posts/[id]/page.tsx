import client from '@/db';
import { getCompany } from '@/lib/companies';
import { getPost } from '@/lib/posts';
import { Metadata } from 'next';
import Head from 'next/head';
import { notFound } from 'next/navigation';
import PostDetails from './PostDetails';
import { stripHtml } from 'string-strip-html';

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(parseInt(params.id, 10));

  if (!post) return {};

  const company = await getCompany(post.employingCompanyId);

  const description = stripHtml(post.body).result.substring(0, 64) + ' ...';

  return {
    title: `${post.title} - Job Board - TKO-äly` ,
    openGraph: {
      title: post.title,
      description,
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
  const id = parseInt(params.id, 10)
  const post = await getPost(id);

  if (!post) {
    notFound();
  }

  const company = await getCompany(post?.employingCompanyId);

  if (!company) {
    notFound();
  }

  return (
    <>
      <div className="mb-4">
        <PostDetails post={post} company={company} />
      </div>
    </>
  );
};

export default PostPage;
