'use client';

import { getLogoUploadUrl } from '@/actions';
import { Company } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from './Button';
import CompanyEditor from './CompanyEditor';

export const CreateCompany = () => {
  const { push } = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [company, setCompany] = useState<Partial<Company>>({
    partner: false,
  });

  const handleSubmit = async () => {
    if (company.name && company.name.length <= 1) {
      setError('Name must be 1 characters or longer.');
      return;
    }

    const response = await fetch('/api/companies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: company.name,
        website: company.website,
        partner: company.partner,
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message ?? 'Unknown error occurred.');
      return;
    }

    if (company.logo) {
      const url = await getLogoUploadUrl(json.payload);

      await fetch(url, {
        method: 'PUT',
        body: company.logo,
      });
    }

    setError(null);
    push(`/companies/${json.payload.id}`);

  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Company</h1>
      {error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to create company</h4>
          <p>{error}</p>
        </div>
      )}
      <CompanyEditor company={company} onChange={setCompany} />
      <div className="mt-5">
        <Button onClick={handleSubmit}>Publish</Button>
      </div>
    </div>
  );
};
