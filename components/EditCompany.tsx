'use client';

import { Company } from '@prisma/client';
import { Button } from '@/components/Button';
import { useState } from 'react';
import CompanyEditor from './CompanyEditor';
import { useRouter } from '@/app/i18n/client';
import { validateCompany } from '@/lib/client/company';
import { Spinner } from './Spinner';

export type Props = {
  company: Company & { logo?: File };
  logoUploadUrl: string;
};

export const EditCompany = ({
  logoUploadUrl,
  company: originalCompany,
}: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const { push } = useRouter();
  const [company, setCompany] = useState(originalCompany);

  const handleSubmit = async () => {
    setLoading(true);
    const foundErrors = await validateCompany(company);

    if (foundErrors) {
      setErrors(foundErrors);
      setLoading(false);
      return;
    }
    setErrors(null);

    if (company.logo) {
      try {
        await fetch(logoUploadUrl, {
          method: 'PUT',
          body: company.logo,
        });
      } catch (e) {
        console.log(e);
        setErrors({ logo: 'Failed to upload logo.' });
        setLoading(false);
        return;
      }
    }

    const response = await fetch(`/api/companies/${company.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: company.name,
        website: company.website ?? undefined,
        partner: company.partner,
      }),
    });

    try {
      const json = await response.json();

      if (!response.ok) {
        setError(json.message ?? 'Unknown error occurred.');
        setLoading(false);
      } else {
        setError(null);
        push(`/companies/${json.payload.id}`);
      }
    } catch (e) {
      setError('Unknown error occurred.');
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Company</h1>
      {error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to save company</h4>
          <p>{error}</p>
        </div>
      )}
      <CompanyEditor
        company={company}
        onChange={newCompany => setCompany({ ...company, ...newCompany })}
        errors={errors ?? {}}
      />
      <div className="flex items-center mt-5 gap-4">
        <Button disabled={loading} onClick={handleSubmit}>
          Publish
        </Button>
        {loading && <Spinner />}
      </div>
    </div>
  );
};
