import { parseISO } from "date-fns";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const schema = z.object({
  title: z.string(),
  body: z.string(),
  company: z.number().int().positive(),
  opensAt: z.string().datetime({ offset: true }),
  closesAt: z.string().datetime({ offset: true }),
  tags: z.array(z.number()),
});

export default async function handler(req, res) {
  const client = new PrismaClient();

  const body = schema.parse(req.body);

  const post = await client.post.create({
    data: {
      title: body.title,
      body: body.body,
      employingCompanyId: body.company,
      opensAt: parseISO(body.opensAt),
      closesAt: parseISO(body.closesAt),
      tags: {
        connect: body.tags.map((id) => ({ id })),
      }
    },
  });
  
  res.status(200)
    .json({
      result: 'success',
      payload: post,
    });
}
