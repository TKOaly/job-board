import { Button } from '@/components/Button';
import { PostList } from '@/components/PostList';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@/app/i18n';
import db from '@/lib/db';
import { count } from 'drizzle-orm';
import { post } from '@/lib/db/schema';

type GetPostsOpts = {
  page?: number;
};

const getPosts = async ({ page = 1 }: GetPostsOpts) => {
  let offset = ((page ?? 1) - 1) * 10;

  const posts = await db.query.post.findMany({
    with: {
      employingCompany: true,
      tags: true,
    },
    orderBy: (post, { desc }) => desc(post.createdAt),
    limit: 10,
    offset,
  });

  return posts;
};

const AllPostsPage = async ({ params }) => {
  const { lang } = params;
  const page: number = parseInt(params.page?.[0] ?? '1', 10);
  const posts = await getPosts({ page });
  const [{ total }] = await db.select({ total: count().as('total') }).from(post);

  return (
    <>
      <h2 className="text-xl font-bold mt-10 mb-5">
        All posts ({(page - 1) * 10 + posts.length}/{total.toString()})
      </h2>

      <PostList posts={posts.map(post => ({ ...post, company: post.employingCompany }))} />

      <div className="flex justify-center mt-5 gap-5 mb-10">
        {page > 1 && (
          <Link href={`/admin/posts/${page - 1}`} lang={lang}>
            <Button secondary>
              <ChevronLeftIcon className="w-5 h-5 -mx-1" />
              Edellinen
            </Button>
          </Link>
        )}
        {posts.length === 10 && (
          <Link href={`/admin/posts/${page + 1}`} lang={lang}>
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
