import db from '@/lib/db';
import * as s from '@/lib/db/schema';

export type NewTag = {
  name: string,
};

export const createTag = async (tag: NewTag) => {
  const [inserted] = await db.insert(s.tag).values(tag).returning();

  return inserted;
};

export const getTags = () => db.query.tag.findMany();
