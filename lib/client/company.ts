import { Company } from '@prisma/client';

export const validateCompany = async (company: Partial<Company>) => {
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
