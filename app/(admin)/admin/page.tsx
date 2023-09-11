import { Accordion } from '@/components/Accordion';
import { CompanyList } from '@/components/CompanyList';
import { PostList } from '@/components/PostList';
import client from '@/db';

const AdminFrontPage = async () => {
  const companies = await client.company.findMany({
    include: {
      _count: {
        select: {
          employerPosts: true,
        },
      },
    },
  });

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
