import { getCompanies } from '@/lib/companies';
import { getPosts } from '@/lib/posts';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: Array<{ url: string; lastModified: Date }> = [];

  const companies = await getCompanies();

  pages.push(
    ...companies.map(company => ({
      url: `${process.env.PUBLIC_URL}/companies/${company.id}`,
      lastModified: company.updatedAt,
    })),
  );

  const posts = await getPosts();

  pages.push(
    ...posts.map(post => ({
      url: `${process.env.PUBLIC_URL}/posts/${post.id}`,
      lastModified: post.updatedAt,
    })),
  );

  return pages;
}
