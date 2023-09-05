import { CompanyDetails } from "@/components/CompanyDetails";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";

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

  if (!company) {
    return notFound();
  }

  return (
    <CompanyDetails company={company} />
  );
}
