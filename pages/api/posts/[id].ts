import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { config } from '@/next-auth';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string(),
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, config);

  if (req.method === 'DELETE') {
    console.log(session);

    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const client = new PrismaClient();

    const { id } = querySchema.parse(req.query);

    await client.post.delete({
      where: {
        id: parseInt(id, 10),
      }
    });

    res
      .status(200)
      .json({
        result: 'success',
      });
  }
}
