'use client';

import { Company, PostWithTags, Tag } from '@/lib/db/schema';
import { Button } from '@/components/Button';
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { useRouter } from '@/app/i18n/client';
import { validatePost } from '@/lib/client/post';
import { Spinner } from './Spinner';
import PostEditor from './PostEditor';

export type Props = {
  post: PostWithTags;
  companies: Company[];
  tags: Tag[];
};

export const EditPost = ({ companies, post: originalPost, tags }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [post, setPost] = useState(originalPost);

  const handleSubmit = async () => {
    setLoading(true);
    const foundErrors = await validatePost(post);

    if (foundErrors) {
      setErrors(foundErrors);
      setLoading(false);
      return;
    }
    setErrors(null);

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
        tags: post.tags.map(t => t.tag.id),
      }),
    });

    try {
      const json = await response.json();

      if (!response.ok) {
        setError(json.message ?? 'Unknown error occurred.');
        setLoading(false);
      } else {
        setError(null);
        push(`/posts/${json.payload.id}`);
      }
    } catch (e) {
      setError('The server did not accept the request.');
      setLoading(false);
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
        errors={errors ?? {}}
      />
      <div className="mt-5 flex items-center space-x-2">
        <Button disabled={loading} onClick={handleSubmit}>
          Save
        </Button>
        {loading && <Spinner />}
      </div>
    </div>
  );
};
