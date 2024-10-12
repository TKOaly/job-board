import { relations } from 'drizzle-orm/relations';
import { post, postToTag, tag, company } from './schema';

export const postToTagRelations = relations(postToTag, ({ one }) => ({
  post: one(post, {
    fields: [postToTag.postId],
    references: [post.id],
  }),
  tag: one(tag, {
    fields: [postToTag.tagId],
    references: [tag.id],
  }),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  tags: many(postToTag),
  recruitingCompany: one(company, {
    fields: [post.recruitingCompanyId],
    references: [company.id],
  }),
  employingCompany: one(company, {
    fields: [post.employingCompanyId],
    references: [company.id],
  }),
}));

export const tagRelations = relations(tag, ({ many }) => ({
  postToTags: many(postToTag),
}));

export const companyRelations = relations(company, ({ many }) => ({
  recruitingPosts: many(post, {
    relationName: 'recruitingPosts',
  }),
  employingPosts: many(post, {
    relationName: 'employingPosts',
  }),
  posts: many(post, {
    relationName: 'posts',
  }),
}));
