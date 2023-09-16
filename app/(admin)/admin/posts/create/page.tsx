import { CreatePost } from '@/components/CreatePost';
import client from '@/db';
import { getCompanies } from '@/lib/companies';

const CreatePostPage = async () => {
  const tags = await client.tag.findMany();
  const companies = await getCompanies();

  return <CreatePost companies={companies} tags={tags} />;
};

export default CreatePostPage;
