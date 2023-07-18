import { CreatePost } from "@/components/CreatePost";
import { PrismaClient } from "@prisma/client";

const getCompanies = async () => {
  const client = new PrismaClient();
  return client.company.findMany();
};

const CreatePostPage = async () => {
  const companies = await getCompanies();

  return <CreatePost companies={companies} />;
};

export default CreatePostPage;

