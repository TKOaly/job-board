import prisma from '@/db';
import tsquery from 'pg-tsquery';
import { Post as PrismaPost, Tag } from '@prisma/client';
import { startOfDay, subDays, subHours, subMinutes } from 'date-fns';

export type Post = PrismaPost & { tags: Tag[] };

const formatPost = async (
  post: PrismaPost & { tags: Tag[] },
): Promise<Post> => {
  return post;
};

export const getCompanyPosts = async (id: number): Promise<Post[]> => {
  const posts = await prisma.post.findMany({
    where: {
      employingCompanyId: id,
    },
    include: {
      tags: true,
    },
  });

  return await Promise.all(posts.map(formatPost));
};

export type SearchOpts = {
  type: 'open' | 'closed';
  page?: number;
  search?: string;
};

export type PostCounts = {
  upcoming: number;
  closed: number;
  open: number;
};

export const getPostCounts = async (params: {
  search: string;
}): Promise<PostCounts> => {
  const { search: textSearch } = params;

  const search = textSearch ? tsquery()(textSearch) : undefined;

  let where: NonNullable<Parameters<typeof prisma.post.findMany>[0]>['where'] =
    {
      title: {
        search,
      },
      body: {
        search,
      },
    };

  const open = await prisma.post.count({
    where: {
      ...where,
      opensAt: { lte: new Date() },
      closesAt: { gte: subHours(startOfDay(new Date()), 2) },
    },
  });

  const closed = await prisma.post.count({
    where: {
      ...where,
      OR: [
        { opensAt: { gt: new Date() } },
        { closesAt: { lt: subHours(startOfDay(new Date()), 2) } },
      ],
    },
  });

  const upcoming = await prisma.post.count({
    where: {
      ...where,
      opensAt: { gt: new Date() },
    },
  });

  return { upcoming, open, closed };
};

export const getPaginatedSearchResults = async (
  params: SearchOpts,
): Promise<Array<Post>> => {
  const { search: textSearch, page, type } = params;

  const search = textSearch ? tsquery()(textSearch) : undefined;

  let where: NonNullable<Parameters<typeof prisma.post.findMany>[0]>['where'] =
    {
      title: {
        search,
      },
      body: {
        search,
      },
    };

  if (type === 'open') {
    where = {
      ...where,
      closesAt: { gte: subHours(startOfDay(new Date()), 2) },
    };
  } else if (type === 'closed') {
    where = {
      ...where,
      closesAt: { lt: subHours(startOfDay(new Date()), 2) },
    };
  }

  let skip = ((page ?? 1) - 1) * 10;

  const posts = await prisma.post.findMany({
    where,
    include: {
      tags: true,
    },
    orderBy:
      type === 'open'
        ? // Show open listings with partner companies first, then by how soon they close
          [
            { employingCompany: { partner: 'desc' } },
            { closesAt: 'asc' },
            { createdAt: 'desc' },
          ]
        : // Show closed listings with the most recently closed first
          [{ closesAt: 'desc' }, { createdAt: 'desc' }],
    take: 10,
    skip,
  });

  return await Promise.all(posts.map(formatPost));
};

export const getPost = async (id: number): Promise<Post | null> => {
  const result = await prisma.post.findUnique({
    where: { id },
    include: {
      employingCompany: true,
      tags: true,
    },
  });

  return result && formatPost(result);
};
