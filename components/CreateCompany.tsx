'use client';

import { getLogoUploadUrl } from '@/actions';
import { Company } from '@prisma/client';
import { useRouter } from '@/app/i18n/client';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import CompanyEditor from './CompanyEditor';
import { Spinner } from './Spinner';

const validateCompany = async (company: Partial<Company>) => {
  const foundErrors: Record<string, string> = {};
  const addError = async (field: string, error: string) => {
    foundErrors[field] = error;
  };

  if (!company.name) {
    await addError('name', 'is required.');
  }

  if (company.website) {
    try {
      new URL(company.website);
    } catch (e) {
      await addError('website', 'must be a valid URL.');
    }
  }

  if (Object.keys(foundErrors).length > 0) {
    return foundErrors;
  }

  return null;
};

export const CreateCompany = () => {
  const { push } = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState<Partial<Company & { logo?: File }>>({
    partner: false,
  });

  const [touched, setTouched] = useState(false);
  useEffect(() => {
    setTouched(true);
  }, [company]);

  const handleSubmit = async () => {
    setTouched(false);
    setLoading(true);
    const errors = await validateCompany(company);

    if (errors) {
      setErrors(errors);
      setLoading(false);
      return;
    }
    setErrors(null);

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

    try {
      const json = await response.json();

      if (!response.ok) {
        setError(json.message ?? 'Unknown error occurred.');
        setLoading(false);

        return;
      }

      if (company.logo) {
        const url = await getLogoUploadUrl(json.payload);

        try {
          await fetch(url, {
            method: 'PUT',
            body: company.logo,
          });
        } catch (e) {
          setErrors({ logo: 'Failed to upload the company logo.' });
          setLoading(false);

          return;
        }
      }

      setError(null);
      setLoading(false);
      push(`/companies/${json.payload.id}`);
    } catch (e) {
      setError('The server did not accept the request.');
    }
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
      <CompanyEditor
        company={company}
        onChange={setCompany}
        errors={errors ?? {}}
      />
      <div className="flex items-center mt-5 gap-4">
        <Button
          disabled={loading || (!touched && errors !== null)}
          onClick={handleSubmit}
        >
          Publish
        </Button>
        {loading && <Spinner />}
      </div>
    </div>
  );
};
