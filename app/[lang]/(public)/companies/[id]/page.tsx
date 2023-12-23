import { CompanyDetails } from '@/components/CompanyDetails';
import client from '@/db';
import { getCompany } from '@/lib/companies';
import { getMultiLangStringValue } from '@/lib/multilang';
import { getCompanyPosts } from '@/lib/posts';
import minio from '@/minio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const company = await getCompany(id);

  if (!company) return {};

  return {
    title: getMultiLangStringValue(company.name as any),
    openGraph: {
      title: `Job postings: ${company.name}`,
      images: company?.logoUrl
        ? [
            { url: company.logoUrl }
          ]
        : undefined,
    },
  };
}

export default async function CompanyDetailsPage({ params }) {
  const id = parseInt(params.id, 10);

  const company = await getCompany(id);
  const posts = await getCompanyPosts(id)

  if (!company) {
    return notFound();
  }

  return <CompanyDetails company={company} posts={posts} />;
}
