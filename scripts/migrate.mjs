import { PrismaClient } from '@prisma/client';

const oldUrl = new URL(process.env.DATABASE_URL);
oldUrl.searchParams.set('schema', 'public_old');

const oldClient = new PrismaClient({
  datasources: {
    db: {
      url: oldUrl.toString(),
    },
  },
});

const newClient = new PrismaClient();

const companies = await oldClient.$queryRaw`SELECT * FROM companies;`;

for (const company of companies) {
  const newCompany = await newClient.company.create({
    data: {
      name: company.name,
      id: company.id,
      website: company.website,
      partner: company.sponsored,
      createdAt: company.created_at,
      updatedAt: company.updated_at,
      logoUrl: company.logo,
    },
  });
}

const tags = await oldClient.$queryRaw`SELECT * FROM tags`;

await newClient.tag.createMany({
  data: tags.map(t => ({ name: t.name })),
  skipDuplicates: true,
});

const companyIdStart = Math.max(...companies.map(c => c.id)) + 1;

await newClient.$queryRaw`SELECT setval('"Company_id_seq"', ${companyIdStart})`;

console.log(`Created ${companies.length} companies.`);

const posts = await oldClient.$queryRaw`
  SELECT
    jobs.*,
    (SELECT ARRAY_AGG(tags.name) FROM tags INNER JOIN job_tags ON job_tags.tag_id = tags.id WHERE job_tags.job_id = jobs.id) tags
  FROM jobs`;

for (const post of posts) {
  const newPost = await newClient.post.create({
    data: {
      id: post.id,
      title: post.title,
      body: post.description,
      opensAt: post.begin,
      closesAt: post.end,
      createdAt: post.created_at,
      updatedAt: post.updated_at,
      employingCompanyId: post.company_id,
      tags: {
        connect: post.tags
          ? [...new Set(post.tags.map(t => t.toLowerCase()))].map(name => ({
              name,
            }))
          : [],
      },
    },
  });
}

console.log(`Created ${posts.length} posts.`);
