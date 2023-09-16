import { CompanyDetails } from '@/components/CompanyDetails';
import client from '@/db';
import minio from '@/minio';
import { notFound } from 'next/navigation';

export default async function CompanyDetailsPage({ params }) {
  const company = await client.company.findFirst({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      employerPosts: {
        include: {
          tags: true,
        },
      },
    },
  });

  if (!company) {
    return notFound();
  }

  try {
    await minio.statObject('logos', `${company.id}`);
    company.logoUrl = `${process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_URL}/logos/${company.id}`;
  } catch (err) {
  }

  return <CompanyDetails company={company} />;
}
