import { EditPost } from '@/components/EditPost';
import { getCompanies } from '@/lib/companies';
import { getPost } from '@/lib/posts';
import { getTags } from '@/lib/tags';
import { notFound } from 'next/navigation';

export default async function EditPostPage({ params }) {
  const companies = await getCompanies();
  const tags = await getTags();
  const post = await getPost(parseInt(params.id, 10));

  if (!post) {
    return notFound();
  }

  return <EditPost post={post} companies={companies} tags={tags} />;
}
