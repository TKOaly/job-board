import { EditCompany } from '@/components/EditCompany';
import { notFound } from 'next/navigation';
import { getLogoUploadUrl } from '@/actions';
import { getCompany } from '@/lib/companies';

export default async function EditPostPage({ params }) {
  const company = await getCompany(parseInt(params.id, 10));

  if (!company) {
    return notFound();
  }

  const logoUploadUrl = await getLogoUploadUrl(company);

  return <EditCompany company={company} logoUploadUrl={logoUploadUrl} />;
}
