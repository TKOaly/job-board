import db from '@/lib/db';
import * as s from '@/lib/db/schema';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { config } from '@/next-auth';
import { z } from 'zod';
import { parseISO } from 'date-fns';
import { eq } from 'drizzle-orm';

const querySchema = z.object({
  id: z.string(),
});

const updateSchema = z.object({
  title: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  body: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  employingCompanyId: z.number().int().positive(),
  opensAt: z.string().datetime({ offset: true }),
  closesAt: z.string().datetime({ offset: true }),
  applicationLink: z.string().url().optional().nullable(),
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

    await db.delete(s.post).where(eq(s.post.id, parseInt(id, 10)));

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
    const postId = parseInt(id, 10);

    const body = updateSchema.parse(req.body);

    if (body.tags.length > 0) {
      await db.insert(s.postToTag)
        .values(body.tags.map(id => ({ tagId: id, postId })))
        .onConflictDoNothing();
    }

    // TODO: Remove tags!

    const [updatedPost] = await db.update(s.post)
      .set({
        employingCompanyId: body.employingCompanyId,
        title: body.title,
        body: body.body,
        opensAt: parseISO(body.opensAt),
        closesAt: parseISO(body.closesAt),
        applicationLink: body.applicationLink,
      })
      .where(eq(s.post.id, postId))
      .returning();

    res.status(200).json({
      result: 'success',
      payload: updatedPost,
    });
  }
}
