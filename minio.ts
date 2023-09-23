import * as Minio from 'minio';

const createMinioSingleton = () => {
  const minioUrl = new URL(process.env.MINIO_URL!);

  const endPoint = minioUrl.hostname;
  const port = parseInt(minioUrl.port, 10);
  const useSSL = minioUrl.protocol === 'https';

  console.log(`Connecting to MinIO: endPoint=${JSON.stringify(endPoint)} port=${JSON.stringify(port)} useSSL=${JSON.stringify(useSSL)}`);

  return new Minio.Client({
    endPoint,
    port,
    useSSL,
    accessKey: process.env.MINIO_ACCESS_KEY!,
    secretKey: process.env.MINIO_SECRET_KEY!,
  });
};

type MinioClientSingleton = ReturnType<typeof createMinioSingleton>;

const globalForMinio = globalThis as unknown as {
  minio: MinioClientSingleton | undefined;
};

const minio = globalForMinio.minio ?? createMinioSingleton();

export default minio;

if (process.env.NODE_ENV !== 'production') {
  globalForMinio.minio = minio;
}
