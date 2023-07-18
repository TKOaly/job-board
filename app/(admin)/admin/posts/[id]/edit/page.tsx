import { EditPost } from "@/components/EditPost";
import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/navigation";

export default async function EditPostPage({ params }) {
  const client = new PrismaClient();

  const companies = await client.company.findMany();
  const post = await client.post.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
  })

  return (
    <EditPost
      post={post}
      companies={companies}
    />
  );
}
