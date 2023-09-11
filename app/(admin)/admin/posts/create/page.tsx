import { CreatePost } from '@/components/CreatePost';
import client from '@/db';

const CreatePostPage = async () => {
  const tags = await client.tag.findMany();
  const companies = await client.company.findMany();

  return <CreatePost companies={companies} tags={tags} />;
};

export default CreatePostPage;
