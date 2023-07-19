import Card from "@/components/Card";
import { CompanyList } from "@/components/CompanyList";
import { PrismaClient } from "@prisma/client";

const AdminFrontPage = async () => {
  const client = new PrismaClient();
  const companies = await client.company.findMany({
    include: {
      _count: {
        select: {
          employerPosts: true,
        },
      },
    },
  });

  return (
    <>
      <Card>
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <p className="mt-5">
          Select an action from the above toolbar.
        </p>
      </Card>
      <h1 className="text-xl font-bold mt-10 mb-5">Companies</h1>
      <CompanyList companies={companies} />
    </>
  );
};

export default AdminFrontPage;
