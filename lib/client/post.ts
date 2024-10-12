import { isBefore } from 'date-fns';
import type { PostWithTags } from '@/lib/db/schema';

export const validatePost = async (post: Partial<PostWithTags>) => {
  const foundErrors: Record<string, string> = {};
  const addError = async (field: string, error: string) => {
    foundErrors[field] = error;
  };

  if (!post.title) {
    await addError('title', 'is required.');
  } else {
    const languages = Object.keys(post.title);

    /*if (!languages.includes('fi')) {
      await addError('title', 'should be translated in Finnish.');
    }

    if (!languages.includes('en')) {
      await addError('title', 'should be translated in English.');
    }*/
  }

  if (!post.opensAt) {
    await addError('opensAt', 'is required.');
  }
  if (!post.closesAt) {
    await addError('closesAt', 'is required.');
  }

  if (post.closesAt && post.opensAt && isBefore(post.closesAt, post.opensAt)) {
    await addError('closesAt', 'cannot be before opens at.');
  }

  if (
    !Object.hasOwn(post, 'employingCompanyId') ||
    post.employingCompanyId === undefined ||
    post.employingCompanyId === null
  ) {
    await addError('employingCompanyId', 'is required.');
  }

  if (post.applicationLink) {
    try {
      new URL(post.applicationLink);
    } catch (e) {
      await addError('applicationLink', 'is not a valid URL.');
    }
  }

  if (!post.body) {
    await addError('body', 'is required.');
  } else {
    const languages = Object.keys(post.body);

    /*if (!languages.includes('fi')) {
      await addError('body', 'should be translated in Finnish.');
    }

    if (!languages.includes('en')) {
      await addError('body', 'should be translated in English.');
    }*/
  }

  if (Object.keys(foundErrors).length > 0) {
    return foundErrors;
  }

  return null;
};
