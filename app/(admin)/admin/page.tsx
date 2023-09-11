import { Accordion } from '@/components/Accordion';
import Card from '@/components/Card';
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
      <Card>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="mt-5">Select an action from the above toolbar.</p>
      </Card>
      <Accordion title="Open posts">
        <PostList posts={openPosts} />
      </Accordion>
      <Accordion title="Companies">
        <CompanyList companies={companies} />
      </Accordion>
    </>
  );
};

export default AdminFrontPage;
