import { NextRequest, NextResponse } from "next/server";
import { minioClient, DEFAULT_BUCKET, getPresignedUrl } from "@/lib/minio";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bucket = searchParams.get("bucket") || DEFAULT_BUCKET;
    const objectName = searchParams.get("object");
    const download = searchParams.get("download") === "true";

    if (!objectName) {
      return NextResponse.json(
        { error: "نام آبجکت مشخص نشده است" },
        { status: 400 }
      );
    }

    const objectStat = await minioClient.statObject(bucket, objectName);
    const stream = await minioClient.getObject(bucket, objectName);

    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    const buffer = Buffer.concat(chunks);

    const meta = objectStat.metaData || {};
    const contentType = meta["content-type"] || "application/octet-stream";
    const originalName = meta["original-name"] || objectName;

    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Content-Length", buffer.length.toString());
    if (download) {
      headers.set(
        "Content-Disposition",
        `attachment; filename="${originalName}"`
      );
    }

    return new NextResponse(buffer, { headers });
  } catch (error) {
    console.error("Minio download error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "خطا در دانلود فایل از Minio",
        success: false,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { bucket, objectName, expirySeconds } = await request.json();

    if (!objectName) {
      return NextResponse.json(
        { error: "نام آبجکت مشخص نشده است" },
        { status: 400 }
      );
    }

    const bucketName = bucket || DEFAULT_BUCKET;
    const expiry = expirySeconds || 24 * 60 * 60;

    const presignedUrl = await getPresignedUrl(bucketName, objectName, expiry);

    return NextResponse.json({
      success: true,
      data: {
        presignedUrl,
        bucket: bucketName,
        objectName,
        expirySeconds: expiry,
        expiresAt: new Date(Date.now() + expiry * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error("Minio presigned URL error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "خطا در ایجاد لینک موقت",
        success: false,
      },
      { status: 500 }
    );
  }
}
