import { parseISO } from 'date-fns';
import { createPost } from '@/lib/posts';
import { z } from 'zod';
import { getServerSession } from 'next-auth/next';
import { config } from '@/next-auth';

const schema = z.object({
  title: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  body: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
  company: z.number().int().positive(),
  opensAt: z.string().datetime({ offset: true }),
  closesAt: z.string().datetime({ offset: true }),
  applicationLink: z.string().url().optional(),
  tags: z.array(z.number()),
});

export default async function handler(req, res) {
  const body = schema.parse(req.body);

  const session = await getServerSession(req, res, config);

  if (!session?.user?.admin) {
    res.status(403).json({
      result: 'error',
      message: 'Unauthorized.',
    });

    return;
  }

  const post = await createPost({
    title: body.title,
    body: body.body,
    employingCompanyId: body.company,
    opensAt: parseISO(body.opensAt),
    closesAt: parseISO(body.closesAt),
    applicationLink: body.applicationLink,
    tags: body.tags,
  });

  res.status(200).json({
    result: 'success',
    payload: post,
  });
}
