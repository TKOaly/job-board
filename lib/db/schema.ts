import {
  pgTable,
  timestamp,
  text,
  integer,
  uniqueIndex,
  index,
  foreignKey,
  serial,
  jsonb,
  boolean,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { citext } from './types';
import { MultiLangStringSet } from '../multilang';

export const postToTag = pgTable(
  '_PostToTag',
  {
    postId: integer('A').notNull(),
    tagId: integer('B').notNull(),
  },
  table => {
    return {
      abUnique: uniqueIndex('_PostToTag_AB_unique').using(
        'btree',
        table.postId.asc().nullsLast(),
        table.tagId.asc().nullsLast(),
      ),
      bIdx: index().using('btree', table.tagId.asc().nullsLast()),
      postToTagAFkey: foreignKey({
        columns: [table.postId],
        foreignColumns: [post.id],
        name: '_PostToTag_A_fkey',
      })
        .onUpdate('cascade')
        .onDelete('cascade'),
      postToTagBFkey: foreignKey({
        columns: [table.tagId],
        foreignColumns: [tag.id],
        name: '_PostToTag_B_fkey',
      })
        .onUpdate('cascade')
        .onDelete('cascade'),
    };
  },
);

export const tag = pgTable(
  'Tag',
  {
    id: serial().primaryKey().notNull(),
    name: citext('name').notNull(),
  },
  table => {
    return {
      nameKey: uniqueIndex('Tag_name_key').using(
        'btree',
        table.name.asc().nullsLast(),
      ),
    };
  },
);

export type Tag = typeof tag.$inferSelect;

export const company = pgTable(
  'Company',
  {
    id: serial().primaryKey().notNull(),
    name: jsonb().$type<MultiLangStringSet>().notNull(),
    bussinessId: text(),
    website: text(),
    partner: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
    logoUrl: text(),
  },
  table => {
    return {
      bussinessIdKey: uniqueIndex('Company_bussinessId_key').using(
        'btree',
        table.bussinessId.asc().nullsLast(),
      ),
    };
  },
);

export type Company = typeof company.$inferSelect

export const post = pgTable(
  'Post',
  {
    id: serial().primaryKey().notNull(),
    createdAt: timestamp({ precision: 3, mode: 'date' })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: 'date' }).notNull(),
    title: jsonb().$type<MultiLangStringSet>().notNull(),
    body: jsonb().$type<MultiLangStringSet>().notNull(),
    opensAt: timestamp({ precision: 3, mode: 'date' }),
    closesAt: timestamp({ precision: 3, mode: 'date' }),
    recruitingCompanyId: integer(),
    employingCompanyId: integer().notNull(),
    displayRecruitingCompany: boolean().default(false).notNull(),
    applicationLink: text(),
  },
  table => {
    return {
      postRecruitingCompanyIdFkey: foreignKey({
        columns: [table.recruitingCompanyId],
        foreignColumns: [company.id],
        name: 'Post_recruitingCompanyId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('set null'),
      postEmployingCompanyIdFkey: foreignKey({
        columns: [table.employingCompanyId],
        foreignColumns: [company.id],
        name: 'Post_employingCompanyId_fkey',
      })
        .onUpdate('cascade')
        .onDelete('restrict'),
    };
  },
);

export type Post = typeof post.$inferSelect
export type PostWithTags = Post & { tags: { tag: Tag }[] };
export type PostWithTagsAndCompany = Post & { tags: { tag: Tag }[], employingCompany: Company };
