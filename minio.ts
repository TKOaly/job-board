import * as Minio from 'minio';

const createMinioSingleton = () => {
  const minioUrl = new URL(process.env.MINIO_URL!);

  return new Minio.Client({
    endPoint: minioUrl.hostname,
    port: parseInt(minioUrl.port, 10),
    useSSL: minioUrl.protocol === 'https',
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
