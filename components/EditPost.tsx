'use client';

import { Company, Post, Tag } from '@prisma/client';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { formatISO, isBefore } from 'date-fns';
import PostEditor from './PostEditor';
import { useRouter } from '@/app/i18n/client';

export type Props = {
  post: Post & { tags: Tag[] };
  companies: Company[];
  tags: Tag[];
};

export const EditPost = ({ companies, post: originalPost, tags }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const { push } = useRouter();
  const [post, setPost] = useState(originalPost);

  const handleSubmit = async () => {
    if (post.title && post.title.length <= 3) {
      setError('Title must be 4 characters or longer.');
      return;
    }

    if (
      post.closesAt &&
      post.opensAt &&
      isBefore(post.closesAt, post.opensAt)
    ) {
      setError('Post cannot close before it opens.');
      return;
    }

    if (post.employingCompanyId === null) {
      setError('Company is required.');
      return;
    }

    const response = await fetch(`/api/posts/${post.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: post.title,
        closesAt: post.closesAt ? formatISO(post.closesAt) : null,
        opensAt: post.opensAt ? formatISO(post.opensAt) : null,
        employingCompanyId: post.employingCompanyId,
        body: post.body,
        applicationLink: post.applicationLink,
        tags: post.tags.map(t => t.id),
      }),
    });

    const json = await response.json();

    if (!response.ok) {
      setError(json.message ?? 'Unknown error occurred.');
    } else {
      setError(null);
      push(`/posts/${json.payload.id}`);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Edit Post</h1>
      {error && (
        <div className="rounded-md shadow py-2 px-3 border-l-[7px] border border-l-red-500 mt-5">
          <h4 className="font-bold mb-1">Failed to create post</h4>
          <p>{error}</p>
        </div>
      )}
      <PostEditor
        post={post}
        onChange={newPost => setPost({ ...post, ...newPost })}
        companies={companies}
        tags={tags}
      />
      <div className="mt-5">
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
};
