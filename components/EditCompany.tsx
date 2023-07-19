'use client';

import { Company, Post } from "@prisma/client";
import { Button } from "@/components/Button";
import { useState } from "react";
import CompanyEditor from "./CompanyEditor";
import { useRouter } from "next/navigation";

export type Props = {
  company: Company,
};

export const EditCompany = ({ company: originalCompany }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();
  const [company, setCompany] = useState(originalCompany);

  const handleSubmit = async () => {
    if (company.name && company.name.length <= 1) {
      setError('Name must be 1 characters or longer.');
      return;
    }

    const response = await fetch(`/api/companies/${company.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: company.name,
        website: company.website,
        partner: company.partner,
      })
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message ?? 'Unknown error occurred.');
    } else {
      setError(null);
      push(`/companies/${json.payload.id}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Company</h1>
      { error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to save company</h4>
          <p>{error}</p>
        </div>
      )}
      <CompanyEditor company={company} onChange={setCompany} />
      <div className="mt-5">
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};
