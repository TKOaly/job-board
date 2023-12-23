import { Button } from '@/components/Button';
import { PostList } from '@/components/PostList';
import client from '@/db';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

type GetPostsOpts = {
  page?: number;
};

const getPosts = async ({ page = 1 }: GetPostsOpts) => {
  let skip = ((page ?? 1) - 1) * 10;

  const posts = await client.post.findMany({
    include: {
      employingCompany: true,
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
    skip,
  });

  return posts;
};

const AllPostsPage = async ({ params }) => {
  const page: number = parseInt(params.page?.[0] ?? '1', 10);
  const posts = await getPosts({ page });
  const total = await client.post.count({});

  return (
    <>
      <h2 className="text-xl font-bold mt-10 mb-5">
        All posts ({(page - 1) * 10 + posts.length}/{total.toString()})
      </h2>

      <PostList posts={posts} />

      <div className="flex justify-center mt-5 gap-5 mb-10">
        {page > 1 && (
          <Link href={`/admin/posts/${page - 1}`}>
            <Button secondary>
              <ChevronLeftIcon className="w-5 h-5 -mx-1" />
              Edellinen
            </Button>
          </Link>
        )}
        {posts.length === 10 && (
          <Link href={`/admin/posts/${page + 1}`}>
            <Button secondary>
              Seuraava <ChevronRightIcon className="w-5 h-5 -ml-1" />
            </Button>
          </Link>
        )}
      </div>
    </>
  );
};

export default AllPostsPage;
