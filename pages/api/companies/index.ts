import { config } from "@/next-auth";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";

const createSchema = z.object({
  name: z.string(),
  website: z.string().url().optional(),
  partner: z.boolean().default(false),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, config);
  const client = new PrismaClient();

  if (req.method === 'POST') {
    if (!session?.user?.admin) {
      res.status(403).json({
        result: 'error',
        message: 'Unauthorized.',
      });

      return;
    }

    const body = createSchema.parse(req.body);

    const newCompany = await client.company.create({
      data: {
        name: body.name,
        partner: body.partner,
        website: body.website,
      },
    });

    res
      .status(200)
      .json({
        result: 'success',
        payload: newCompany,
      });
  }
}
