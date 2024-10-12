import { CreatePost } from '@/components/CreatePost';
import db from '@/lib/db';
import { getCompanies } from '@/lib/companies';

const CreatePostPage = async () => {
  const tags = await db.query.tag.findMany();
  const companies = await getCompanies();

  return <CreatePost companies={companies} tags={tags} />;
};

export default CreatePostPage;
