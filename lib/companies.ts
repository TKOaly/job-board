import db from '@/lib/db';
import { Company as DbCompany } from '@/lib/db/schema';
import * as s from '@/lib/db/schema';
import minio from '@/minio';
import { asc, count, desc, eq, getTableColumns } from 'drizzle-orm';
import { MultiLangStringSet } from './multilang';

export type Company = DbCompany & {
  employerPostCount: number, 
  logoUrl: string | null,
};

type QueryCompany = DbCompany & { employerPostCount: number }

const formatCompany = async (company: QueryCompany): Promise<Company> => {
  let logoUrl: string | undefined = undefined;

  try {
    await minio.statObject('jobboard-logos', `${company.id}`);

    let prefix = process.env.MINIO_PUBLIC_URL;

    if (!prefix) {
      prefix = process.env.MINIO_URL;
    }

    if (prefix) {
      logoUrl = `${prefix}/jobboard-logos/${company.id}`;
    }
  } catch (err) {}

  return {
    ...company,
    logoUrl: logoUrl ?? null,
    employerPostCount: company.employerPostCount,
  };
};

export const getCompanies = async (
  partnersFirst = true,
): Promise<Array<Company>> => {
  const order = partnersFirst
      ? [desc(s.company.partner), asc(s.company.name)]
      : [asc(s.company.name)];

  const companies = await db
    .select({
      ...getTableColumns(s.company),
      employerPostCount: count(s.post.id),
    })
    .from(s.company)
    .leftJoin(s.post, eq(s.company.id, s.post.employingCompanyId))
    .groupBy(s.company.id)
    .orderBy(...order);

  return Promise.all(companies.map(formatCompany));
};

export const getCompany = async (id: number): Promise<Company | null> => {
  const [company] = await db
    .select({
      ...getTableColumns(s.company),
      employerPostCount: count(s.post.id),
    })
    .from(s.company)
    .leftJoin(s.post, eq(s.company.id, s.post.employingCompanyId))
    .where(eq(s.company.id, id))
    .groupBy(s.company.id)
    .limit(1);

  return company && formatCompany(company);
};

export const getPartners = async () => {
  const companies = await db
    .select({
      ...getTableColumns(s.company),
      employerPostCount: count(s.post.id),
    })
    .from(s.company)
    .leftJoin(s.post, eq(s.company.id, s.post.employingCompanyId))
    .where(eq(s.company.partner, true));

  return Promise.all(companies.map(formatCompany));
};

export type NewCompany = {
  name: MultiLangStringSet,
  partner: boolean,
  website?: string,
}

export const createCompany = async (details: NewCompany) => {
  const [company] = await db.insert(s.company).values({ ...details, updatedAt: new Date() }).returning();
  return company;
};

export type UpdateCompany = {
  id: number,
  name?: MultiLangStringSet,
  partner?: boolean,
  website?: string,
}

export const updateCompany = async ({ id, ...details }: UpdateCompany) => {
  const [company] = await db.update(s.company).set({ ...details, updatedAt: new Date() }).where(eq(s.company.id, id)).returning();
  return company;
};
