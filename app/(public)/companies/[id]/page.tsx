import { CompanyDetails } from '@/components/CompanyDetails';
import client from '@/db';
import { getCompany } from '@/lib/companies';
import { getCompanyPosts } from '@/lib/posts';
import minio from '@/minio';
import { notFound } from 'next/navigation';

export default async function CompanyDetailsPage({ params }) {
  const id = parseInt(params.id, 10);

  const company = await getCompany(id);
  const posts = await getCompanyPosts(id)

  if (!company) {
    return notFound();
  }

  return <CompanyDetails company={company} posts={posts} />;
}
