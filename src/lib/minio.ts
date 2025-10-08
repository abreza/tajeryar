import { Client as MinioClient } from "minio";

export const minioClient = new MinioClient({
  endPoint: process.env.MINIO_ENDPOINT!,
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: process.env.MINIO_USE_SSL === "true",
  accessKey: process.env.MINIO_ACCESS_KEY!,
  secretKey: process.env.MINIO_SECRET_KEY!,
});

export const DEFAULT_BUCKET = process.env.MINIO_DEFAULT_BUCKET || "file";

export interface MinioUploadOptions {
  bucket?: string;
  path?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export interface MinioUploadResult {
  bucket: string;
  objectName: string;
  etag: string;
  presignedUrl?: string;
}

export async function uploadToMinio(
  file: File | Buffer,
  objectName: string,
  options: MinioUploadOptions = {}
): Promise<MinioUploadResult> {
  const bucket =
    options.bucket || process.env.MINIO_DEFAULT_BUCKET || "default";

  const bucketExists = await minioClient.bucketExists(bucket);
  if (!bucketExists) {
    await minioClient.makeBucket(
      bucket,
      process.env.MINIO_REGION || "us-east-1"
    );
  }

  let buffer: Buffer;
  let contentType = options.contentType;

  if (file instanceof File) {
    buffer = Buffer.from(await file.arrayBuffer());
    contentType = contentType || file.type;
  } else {
    buffer = file;
  }

  const metadata = {
    "Content-Type": contentType || "application/octet-stream",
    "Upload-Date": new Date().toISOString(),
    ...options.metadata,
  };

  const result = await minioClient.putObject(
    bucket,
    objectName,
    buffer,
    buffer.length,
    metadata
  );

  return {
    bucket,
    objectName,
    etag: result.etag!,
  };
}

export async function getPresignedUrl(
  bucket: string,
  objectName: string,
  expiry: number = 24 * 60 * 60
): Promise<string> {
  return await minioClient.presignedGetObject(bucket, objectName, expiry);
}

export async function deleteFromMinio(
  bucket: string,
  objectName: string
): Promise<void> {
  await minioClient.removeObject(bucket, objectName);
}

export async function listObjects(
  bucket: string,
  prefix: string = "",
  maxKeys: number = 1000
) {
  const objects: any[] = [];
  const objectsStream = minioClient.listObjects(bucket, prefix, false);

  let count = 0;
  for await (const obj of objectsStream) {
    if (count >= maxKeys) break;
    objects.push(obj);
    count++;
  }

  return objects;
}
