import { EditPost } from '@/components/EditPost';
import client from '@/db';
import { getCompanies } from '@/lib/companies';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }) {
  const companies = await getCompanies();
  const tags = await client.tag.findMany();
  const post = await client.post.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      tags: true,
    },
  });

  if (!post) {
    return notFound();
  }

  return <EditPost post={post} companies={companies} tags={tags} />;
}
