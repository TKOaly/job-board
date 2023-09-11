import { CompanyDetails } from '@/components/CompanyDetails';
import client from '@/db';
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

  return <CompanyDetails company={company} />;
}
