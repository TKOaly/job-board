import { PrismaClient } from "@prisma/client";
import { EditCompany } from "@/components/EditCompany";

export default async function EditPostPage({ params }) {
  const client = new PrismaClient();

  const company = await client.company.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  })

  return (
    <EditCompany
      company={company}
    />
  );
}
