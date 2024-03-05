'use client';

import { Company, Post, Tag } from '@prisma/client';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { formatISO, isBefore } from 'date-fns';
import PostEditor from './PostEditor';
import { useRouter } from '@/app/i18n/client';

export type Props = {
  companies: Company[];
  tags: Tag[];
};

const validatePost = async (post: Partial<Post & { tags: Tag[] }>) => {
  const foundErrors: Record<string, string> = {};
  const addError = async (field: string, error: string) => {
    foundErrors[field] = error;
  };

  if (!post.title) {
    await addError('title', 'is required.');
  } else {
    const languages = Object.keys(post.title);

    if (!languages.includes('fi')) {
      await addError('title', 'should be translated in Finnish.');
    }

    if (!languages.includes('en')) {
      await addError('title', 'should be translated in English.');
    }
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

    if (!languages.includes('fi')) {
      await addError('body', 'should be translated in Finnish.');
    }

    if (!languages.includes('en')) {
      await addError('body', 'should be translated in English.');
    }
  }

  if (Object.keys(foundErrors).length > 0) {
    return foundErrors;
  }

  return null;
};

export const CreatePost = ({ companies, tags }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);

  const [post, setPost] = useState<Partial<Post & { tags: Tag[] }>>({});
  const [postTouched, setPostTouched] = useState(false);
  useEffect(() => {
    setPostTouched(true);
  }, [post]);

  const { push } = useRouter();

  const handleSubmit = async (post: Partial<Post & { tags: Tag[] }>) => {
    setPostTouched(false);
    const foundErrors = await validatePost(post);

    if (foundErrors) {
      setErrors(foundErrors);
      return;
    }
    setErrors(null);

    const response = await fetch('/api/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        closesAt: post.closesAt ? formatISO(post.closesAt) : null,
        opensAt: post.opensAt ? formatISO(post.opensAt) : null,
        company: post.employingCompanyId,
        applicationLink: post.applicationLink,
        body: post.body,
        tags: (post.tags ?? []).map(tag => tag.id),
      }),
    });

    try {
      const json = await response.json();

      if (!response.ok) {
        setError(json.message ?? 'Unknown error occurred.');
      } else {
        setError(null);
        push(`/posts/${json.payload.id}`);
      }
    } catch (e) {
      setError('The server did not accept the request.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Create Post</h1>
      {error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to create post</h4>
          <p>{error}</p>
        </div>
      )}
      <PostEditor
        post={post}
        onChange={setPost}
        companies={companies}
        tags={tags}
        errors={errors ?? {}}
      />
      <div className="mt-5">
        <Button
          disabled={!postTouched && errors !== null}
          onClick={() => handleSubmit(post)}
        >
          Publish
        </Button>
      </div>
    </div>
  );
};
