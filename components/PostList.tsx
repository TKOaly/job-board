import { Company, Post, Tag } from '@prisma/client';
import { PostCard } from './PostCard';

export type Props = {
  posts: (Post & { employingCompany: Company | null; tags: Tag[] })[];
};

export const PostList = ({ posts }: Props) => {
  return (
    <div className="space-y-5">
      {posts.map(post => {
        const { employingCompany, ...rest } = post;
        return (
          <PostCard
            editable
            post={rest}
            company={post.employingCompany!}
            key={post.id}
          />
        );
      })}
    </div>
  );
};
