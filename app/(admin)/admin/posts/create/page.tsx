import { CreatePost } from "@/components/CreatePost";
import { PrismaClient } from "@prisma/client";

const CreatePostPage = async () => {
  const client = new PrismaClient();
  const tags = await client.tag.findMany();
  const companies = await client.company.findMany();

  return <CreatePost companies={companies} tags={tags} />;
};

export default CreatePostPage;

