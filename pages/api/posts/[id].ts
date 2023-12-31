import client from '@/db';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { config } from '@/next-auth';
import { z } from 'zod';
import { parseISO } from 'date-fns';

const querySchema = z.object({
  id: z.string(),
});

const updateSchema = z.object({
  title: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  body: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  employingCompanyId: z.number().int().positive(),
  opensAt: z.string().datetime({ offset: true }),
  closesAt: z.string().datetime({ offset: true }),
  applicationLink: z.string().url().optional(),
  tags: z.array(z.number()),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, config);

  if (req.method === 'DELETE') {
    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const { id } = querySchema.parse(req.query);

    await client.post.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    res.status(200).json({
      result: 'success',
    });
  } else if (req.method === 'PUT') {
    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const { id } = querySchema.parse(req.query);
    const body = updateSchema.parse(req.body);

    const updatedPost = await client.post.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        title: body.title,
        body: body.body,
        employingCompanyId: body.employingCompanyId,
        opensAt: parseISO(body.opensAt),
        closesAt: parseISO(body.closesAt),
        applicationLink: body.applicationLink,
        tags: {
          connect: body.tags.map(id => ({ id })),
        },
      },
    });

    res.status(200).json({
      result: 'success',
      payload: updatedPost,
    });
  }
}
