import { NextRequest, NextResponse } from "next/server";
import { minioClient, DEFAULT_BUCKET } from "@/lib/minio";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket") || DEFAULT_BUCKET;
    const prefix = searchParams.get("prefix") || "";
    const maxKeys = parseInt(searchParams.get("maxKeys") || "1000", 10);

    const bucketExists = await minioClient.bucketExists(bucket);
    if (!bucketExists) {
      return NextResponse.json(
        { error: `باکت '${bucket}' وجود ندارد` },
        { status: 404 }
      );
    }

    const objects: any[] = [];
    const stream = minioClient.listObjects(bucket, prefix, false);

    let count = 0;
    for await (const obj of stream) {
      if (count >= maxKeys) break;

      try {
        const stat = await minioClient.statObject(bucket, obj.name);
        const meta = stat.metaData || {};
        objects.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          etag: obj.etag,
          contentType: meta["content-type"] || "unknown",
          originalName: meta["original-name"] || obj.name,
          uploadDate: meta["upload-date"] || stat.lastModified,
        });
      } catch {
        objects.push({
          name: obj.name,
          size: obj.size,
          lastModified: obj.lastModified,
          etag: obj.etag,
          contentType: "unknown",
          originalName: obj.name,
        });
      }
      count++;
    }

    return NextResponse.json({
      success: true,
      data: {
        bucket,
        prefix,
        objects,
        count: objects.length,
        truncated: count >= maxKeys,
      },
    });
  } catch (error) {
    console.error("Minio list error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "خطا در لیست کردن فایل‌ها",
        success: false,
      },
      { status: 500 }
    );
  }
}
