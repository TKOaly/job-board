import { Accordion } from '@/components/Accordion';
import { CompanyList } from '@/components/CompanyList';
import { PostList } from '@/components/PostList';
import client from '@/db';
import { getCompanies } from '@/lib/companies';

const AdminFrontPage = async () => {
  const companies = await getCompanies();

  const openPosts = await client.post.findMany({
    where: {
      closesAt: { gte: new Date() },
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      employingCompany: true,
      tags: true,
    },
  });

  return (
    <>
      <Accordion title={`Open posts (${openPosts.length})`} open>
        <PostList posts={openPosts} />
      </Accordion>

      <Accordion title={`Companies (${companies.length})`} open>
        <CompanyList companies={companies} />
      </Accordion>
    </>
  );
};

export default AdminFrontPage;
