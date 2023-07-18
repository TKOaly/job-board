import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import sanitize from "sanitize-html";
import PostDetails from "./PostDetails";

const getPost = async (id: number) => {
  const client = new PrismaClient();

  const result = await client.post.findUnique({
    where: { id },
    include: {
      employingCompany: true,
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
    <div>
      <PostDetails post={post} company={post.employingCompany} />
    </div>
  );
};

export default PostPage;
