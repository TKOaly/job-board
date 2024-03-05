'use client';

import { Company, Post, Tag } from '@prisma/client';
import { Button } from '@/components/Button';
import { useEffect, useState } from 'react';
import { formatISO } from 'date-fns';
import PostEditor from './PostEditor';
import { useRouter } from '@/app/i18n/client';
import { Spinner } from './Spinner';
import { validatePost } from '@/lib/client/post';

export type Props = {
  companies: Company[];
  tags: Tag[];
};

export const CreatePost = ({ companies, tags }: Props) => {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(false);

  const [post, setPost] = useState<Partial<Post & { tags: Tag[] }>>({});
  const [postTouched, setPostTouched] = useState(false);
  useEffect(() => {
    setPostTouched(true);
  }, [post]);

  const { push } = useRouter();

  const handleSubmit = async (post: Partial<Post & { tags: Tag[] }>) => {
    setLoading(true);
    setPostTouched(false);
    const foundErrors = await validatePost(post);

    if (foundErrors) {
      setErrors(foundErrors);
      setLoading(false);
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
      <div className="mt-5 flex items-center space-x-2">
        <Button
          disabled={loading || (!postTouched && errors !== null)}
          onClick={() => handleSubmit(post)}
        >
          Publish
        </Button>
        {loading && <Spinner />}
      </div>
    </div>
  );
};
