import { CompanyDetails } from "@/components/CompanyDetails";
import { PrismaClient } from "@prisma/client";

export default async function CompanyDetailsPage({ params }) {
  const client = new PrismaClient();

  const company = await client.company.findFirst({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      employerPosts: {
        include: {
          tags: true,
        },
      },
    },
  });

  return (
    <CompanyDetails company={company} />
  );
}
