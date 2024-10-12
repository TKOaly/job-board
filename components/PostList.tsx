import { Post, Tag } from '@/lib/db/schema';
import { Company } from '@/lib/companies';
import { PostPreview } from './PostPreview';

export type Props = {
  posts: (Post & { company: Company; tags: Tag[] })[];
};

export const PostList = ({ posts }: Props) => {
  return (
    <div className="space-y-5">
      {posts.map(post => {
        const { company, ...rest } = post;
        return (
          <PostPreview
            editable
            post={rest}
            company={post.company}
            key={post.id}
          />
        );
      })}
    </div>
  );
};
