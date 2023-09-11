import { MetadataRoute } from 'next';
import prisma from '../db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: Array<{ url: string; lastModified: Date }> = [];

  const companies = await prisma.company.findMany();

  pages.push(
    ...companies.map(company => ({
      url: `${process.env.PUBLIC_URL}/companies/${company.id}`,
      lastModified: company.updatedAt,
    })),
  );

  const posts = await prisma.post.findMany();

  pages.push(
    ...posts.map(post => ({
      url: `${process.env.PUBLIC_URL}/posts/${post.id}`,
      lastModified: post.updatedAt,
    })),
  );

  return pages;
}
