import { Accordion } from '@/components/Accordion';
import { CompanyList } from '@/components/CompanyList';
import { PostList } from '@/components/PostList';
import db from '@/lib/db';
import { getCompanies, getCompany } from '@/lib/companies';

const AdminFrontPage = async () => {
  const companies = await getCompanies();

  const openPosts = await db.query.post.findMany({
    where: (post, { between, sql }) => between(sql`NOW()`, post.opensAt, post.closesAt),
    orderBy: (post, { desc }) => desc(post.createdAt),
    with: {
      employingCompany: true,
      tags: {
        with: {
          tag: true,
        },
      },
    },
  })

  const postsWithCompanies = await Promise.all(
    openPosts.map(async post => ({
      ...post,
      company: post.employingCompany, 
    })),
  );

  return (
    <>
      <Accordion title={`Open posts (${openPosts.length})`} open>
        <PostList posts={postsWithCompanies} />
      </Accordion>

      <Accordion title={`Companies (${companies.length})`} open>
        <CompanyList companies={companies} />
      </Accordion>
    </>
  );
};

export default AdminFrontPage;
