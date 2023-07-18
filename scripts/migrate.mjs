import { PrismaClient } from "@prisma/client"

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

console.log(`Created ${companies.length} companies.`);

const posts = await oldClient.$queryRaw`SELECT * FROM jobs`;

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
    },
  });
}

console.log(`Created ${posts.length} posts.`);
