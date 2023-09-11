import { config } from '@/next-auth';
import client from '@/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const createSchema = z.object({
  name: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, config);

  if (req.method === 'POST') {
    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const body = createSchema.parse(req.body);

    const newTag = await client.tag.create({
      data: {
        name: body.name,
      },
    });

    res.status(200).json({
      result: 'success',
      payload: newTag,
    });
  }
}
