import { updateCompany } from '@/lib/companies';
import { config } from '@/next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

const querySchema = z.object({
  id: z.string(),
});

const bodySchema = z
  .object({
    name: z.record(z.enum(['fi', 'en', 'xx']), z.string()),
    partner: z.boolean(),
    website: z.string().url().optional(),
  })
  .partial();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res, config);

  if (req.method === 'PUT') {
    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const { id } = querySchema.parse(req.query);
    const body = bodySchema.parse(req.body);

    const newCompany = await updateCompany({
      id: parseInt(id, 10),
      ...body,
    });

    res.status(200).json({
      result: 'success',
      payload: newCompany,
    });
  }
}
