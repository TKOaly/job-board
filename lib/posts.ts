import db from './db';
import type { Post, PostWithTags, PostWithTagsAndCompany } from './db/schema';
import * as s from './db/schema';
import { and, asc, desc, eq, or, sql, SQLWrapper } from 'drizzle-orm';
import { MultiLangStringSet } from './multilang';

export const getCompanyPosts = async (id: number): Promise<PostWithTags[]> => {
  return db.query.post.findMany({
    where: (post) => eq(post.employingCompanyId, id),
    with: {
      tags: { with: { tag: true } },
    },
  });
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

const countFilter = (filter: any) => sql`count(*) filter (where ${filter})`.mapWith(Number);

export const getPostCounts = async (params: {
  search: string;
}): Promise<PostCounts> => {
  const fields = {
    closed: countFilter(sql`${s.post.closesAt} <= NOW()`),
    open: countFilter(sql`NOW() BETWEEN ${s.post.opensAt} AND ${s.post.closesAt}`),
    upcoming: countFilter(sql`${s.post.opensAt} > NOW()`),
  };

  const select = db.select(fields).from(s.post).limit(1);

  if (!params.search) {
    const [counts] = await select;

    return counts;
  }

  const where = or(
    sql`to_tsvector('simple', ${s.post.title}) @@ to_tsquery('simple', ${params.search ?? ''})`,
    sql`to_tsvector('simple', ${s.post.body}) @@ to_tsquery('simple', ${params.search ?? ''})`,
  );

  const stmt = select.where(where);
  console.log(stmt.toSQL());
  const [counts] = await stmt;
  return counts;
};

export const getPaginatedSearchResults = async (
  params: SearchOpts,
): Promise<Array<PostWithTagsAndCompany>> => {
  const { search, page, type } = params;
  let offset = ((page ?? 1) - 1) * 10;

  let conditions: (SQLWrapper | undefined)[] = [];

  if (search) {
    conditions.push(or(
      sql`to_tsvector('simple', ${s.post.title}) @@ to_tsquery('simple', ${params.search ?? ''})`,
      sql`to_tsvector('simple', ${s.post.body}) @@ to_tsquery('simple', ${params.search ?? ''})`,
    ));
  }

  if (type === 'open') {
    conditions.push(sql`${s.post.closesAt} >= NOW()`);
  } else if (type === 'closed') {
    conditions.push(sql`${s.post.closesAt} < NOW()`);
  }

  return db.query.post.findMany({
    with: {
      tags: { with: { tag: true } },
      employingCompany: true,
    },
    limit: 10,
    offset,
    where: and(...conditions),
    orderBy: type === 'open'
      ? [asc(s.post.closesAt), desc(s.post.createdAt)]
      : [desc(s.post.closesAt), desc(s.post.createdAt)],
  });
};

export const getPost = async (id: number): Promise<PostWithTags | null> => {
  const post = await db.query.post.findFirst({
    with: {
      recruitingCompany: true,
      tags: { with: { tag: true } },
    },
    where: eq(s.post.id, id),
  });

  return post ?? null;
};

export const getPosts = async (): Promise<PostWithTags[]> => {
  return db.query.post.findMany({
    with: {
      recruitingCompany: true,
      tags: { with: { tag: true } },
    },
  });
};

export type NewPost = {
  title: MultiLangStringSet,
  body: MultiLangStringSet,
  tags: number[],
  opensAt?: Date,
  closesAt?: Date,
  employingCompanyId: number,
  recruitingCompanyId?: number,
  applicationLink?: string,
};

export const createPost = async (details: NewPost) => {
  const [post] = await db
    .insert(s.post)
    .values({
      ...details,
      updatedAt: new Date(),
    })
    .returning();

  await db.insert(s.postToTag).values(details.tags.map(tagId => ({ tagId, postId: post.id })));

  return post;
}
