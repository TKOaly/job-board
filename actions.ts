'use server';

import { Company } from "@prisma/client";
import minio from "./minio";

const BUCKET_NAME = 'jobboard-logos';

export async function getLogoUploadUrl(company: Company): Promise<string> {
  const logoUploadUrl = new URL(await minio.presignedPutObject(BUCKET_NAME, company.id.toString(), 60 * 30));

  if (process.env.MINIO_PUBLIC_URL) {
    const publicUrl = new URL(process.env.MINIO_PUBLIC_URL);

    logoUploadUrl.host = publicUrl.host;
    logoUploadUrl.protocol = publicUrl.protocol;
  }

  return logoUploadUrl.toString();
}
