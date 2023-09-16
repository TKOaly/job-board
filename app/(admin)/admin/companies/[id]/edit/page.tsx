import client from '@/db';
import { EditCompany } from '@/components/EditCompany';
import { notFound } from 'next/navigation';
import minio from '@/minio';
import { getLogoUploadUrl } from '@/actions';

export default async function EditPostPage({ params }) {
  const company = await client.company.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  });

  if (!company) {
    return notFound();
  }

  const logoUploadUrl = await getLogoUploadUrl(company);

  return <EditCompany company={company} logoUploadUrl={logoUploadUrl} />;
}
