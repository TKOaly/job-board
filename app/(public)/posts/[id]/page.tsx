import client from "@/db";
import { notFound } from "next/navigation";
import PostDetails from "./PostDetails";

const getPost = async (id: number) => {
  const result = await client.post.findUnique({
    where: { id },
    include: {
      employingCompany: true,
      tags: true,
    },
  });

  return result;
};

const PostPage = async ({ params }) => {
  const post = await getPost(parseInt(params.id, 10));

  if (!post) {
    notFound();
  }
  
  return (
    <div className="mx-4 mb-4">
      <PostDetails post={post} company={post.employingCompany!} />
    </div>
  );
};

export default PostPage;
