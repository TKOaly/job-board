import { faker } from '@faker-js/faker';
import { PrismaClient, Tag } from '@prisma/client';
import chalk from 'chalk';

const prisma = new PrismaClient();

const randomCompany = () => {
  return {
    name: faker.company.name(),
    bussinessId: faker.string.nanoid(),
    website: `https://${faker.internet.domainName()}`,
    partner: Math.random() > 0.8,
  };
};

const randomTag = () => ({ name: faker.company.buzzNoun() });

const randomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min) + min);
const randomFrom = (array: Array<any>) => array[randomInt(array.length)];

const randomPostFactory = (
  companyIds: Array<number>,
  tags: Tag[],
  { openChance = 0.1, recruiterChance = 0.1 },
) => {
  return () => {
    const closed = Math.random() > openChance;

    const closesAt = closed
      ? faker.date.past({
          years: 2,
        })
      : faker.date.future();

    const opensAt = faker.date.between({
      from: '2020-01-01T00:00:00.000Z',
      to: closed ? closesAt : new Date(),
    });

    const recruitingCompanyId =
      Math.random() < recruiterChance ? randomFrom(companyIds) : null;

    const tagAmount = randomInt(Math.ceil(Math.sqrt(tags.length)));
    const postTags = tags
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)
      .slice(0, tagAmount);

    return {
      title: faker.person.jobTitle(),
      body: faker.lorem.paragraphs(3),
      closesAt,
      opensAt,
      recruitingCompanyId,
      employingCompanyId: randomFrom(companyIds),
      displayRecruitingCompany: recruitingCompanyId !== null,
      tags: {
        connect: postTags,
      },
    };
  };
};

async function main({ companies = 50, tags = 15, posts = 250 }) {
  console.info(chalk.greenBright`◌  Creating companies...`);
  const _companies = new Array(companies).fill(0).map(randomCompany);
  console.info(chalk.green.italic`   Inserting companies...`);

  // Store company IDs for post creation
  const companyIds: Array<number> = [];
  for (const company of _companies) {
    const { id } = await prisma.company.create({
      data: company,
    });
    companyIds.push(id);
  }

  console.info(
    chalk.green.italic(
      `   Created ${companyIds.length}/${companies} companies!`,
    ),
  );
  console.debug(
    chalk.gray.italic(
      `   Company IDs range from ${Math.min(...companyIds)} to ${Math.max(
        ...companyIds,
      )}`,
    ),
  );
  console.info();

  console.info(chalk.greenBright`◌  Creating tags...`);
  const _tags = new Array(tags).fill(0).map(randomTag);

  const { count: tagCount } = await prisma.tag.createMany({
    data: _tags,
    skipDuplicates: true,
  });
  console.info(chalk.green.italic(`   Created ${tagCount}/${tags} tags!`));

  // Get tag IDs from database for post creation
  const retrievedTags = await prisma.tag.findMany({});
  const tagIds = retrievedTags.map(tag => tag.id);
  console.debug(
    chalk.gray.italic(
      `   Tag IDs range from ${Math.min(...tagIds)} to ${Math.max(...tagIds)}`,
    ),
  );
  console.info();

  console.info(chalk.greenBright`◌  Creating posts...`);
  const _posts = new Array(posts)
    .fill(0)
    .map(randomPostFactory(companyIds, retrievedTags, {}));

  const postIds: Array<number> = [];
  for (const post of _posts) {
    const { id } = await prisma.post.create({
      data: post,
    });
    postIds.push(id);
  }
  console.info(
    chalk.green.italic(`   Created ${postIds.length}/${posts} posts!`),
  );
  console.debug(
    chalk.gray.italic(
      `   Post IDs range from ${Math.min(...postIds)} to ${Math.max(
        ...postIds,
      )}`,
    ),
  );
  console.info();
}

main({});
