import { Company as PrismaCompany } from '@prisma/client';
import prisma from '@/db';
import minio from '@/minio';

export type Company = PrismaCompany & { logoUrl?: string, employerPostCount: number };

const formatCompany = async (company: PrismaCompany & { _count: { employerPosts: number } }): Promise<Company> => {
  let logoUrl: string | undefined = undefined;

  try {
    await minio.statObject('jobboard-logos', `${company.id}`);
    logoUrl = `${process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_URL}/jobboard-logos/${company.id}`;
  } catch (err) {
  }

  return {
    ...company,
    logoUrl,
    employerPostCount: company._count.employerPosts,
  };
}

export const getCompanies = async (): Promise<Array<Company>> => {
  const companies = await prisma.company.findMany({
    include: {
      _count: {
        select: {
          employerPosts: true,
        },
      },
    },
  });

  return Promise.all(companies.map(formatCompany));
};

export const getCompany = async (id: number): Promise<Company | null> => {
  const company = await prisma.company.findUnique({
    where: {
      id,
    },
    include: {
      _count: {
        select: {
          employerPosts: true,
        },
      },
    },
  });

  if (!company) {
    return null;
  }

  return await formatCompany(company);
};
