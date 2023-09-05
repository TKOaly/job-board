import client from "@/db";
import { EditCompany } from "@/components/EditCompany";
import { notFound } from "next/navigation";

export default async function EditPostPage({ params }) {
  const company = await client.company.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  })

  if (!company) {
    return notFound();
  }

  return (
    <EditCompany
      company={company}
    />
  );
}
