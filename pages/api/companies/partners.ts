import { getPartners } from "@/lib/companies";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  const partners = await getPartners();

  res.status(200).json(partners);
}
