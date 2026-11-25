import { NextRequest, NextResponse } from 'next/server';
import type { Readable } from 'stream';
import minio from '@/minio';

const BUCKET_NAME = 'jobboard-logos';

const toWebStream = (stream: Readable): ReadableStream<Uint8Array> =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      stream.on('data', (chunk: Buffer | string) => {
        const bytes = typeof chunk === 'string' ? Buffer.from(chunk) : chunk;
        controller.enqueue(new Uint8Array(bytes));
      });
      stream.on('end', () => controller.close());
      stream.on('error', err => controller.error(err));
    },
    cancel() {
      stream.destroy();
    },
  });

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  if (!/^\d+$/.test(params.id)) {
    return new NextResponse(null, { status: 400 });
  }

  let stat;
  try {
    stat = await minio.statObject(BUCKET_NAME, params.id);
  } catch (err) {
    return new NextResponse(null, { status: 404 });
  }

  const headers = {
    'Cache-Control': 'public, no-cache',
    ETag: `"${stat.etag}"`,
    'Content-Type':
      (stat.metaData?.['content-type'] as string | undefined) ??
      'application/octet-stream',
  };

  if (req.headers.get('if-none-match') === headers.ETag) {
    return new NextResponse(null, { status: 304, headers });
  }

  const object = await minio.getObject(BUCKET_NAME, params.id);

  return new NextResponse(toWebStream(object), {
    headers: { ...headers, 'Content-Length': String(stat.size) },
  });
}
