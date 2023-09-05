import { EditPost } from "@/components/EditPost";
import { PrismaClient } from "@prisma/client";
import { notFound, useRouter } from "next/navigation";

export default async function EditPostPage({ params }) {
  const client = new PrismaClient();

  const companies = await client.company.findMany();
  const tags = await client.tag.findMany();
  const post = await client.post.findUnique({
    where: {
      id: parseInt(params.id, 10),
    },
    include: {
      tags: true,
    },
  })

  if (!post) {
    return notFound();
  }

  return (
    <EditPost
      post={post}
      companies={companies}
      tags={tags}
    />
  );
}
