import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_BUCKET, deleteFromMinio, minioClient } from "@/lib/minio";

export const runtime = "nodejs";

export async function DELETE(request: NextRequest) {
  try {
    const { bucket, objectName, objectNames } = await request.json();

    if (!objectName && (!objectNames || !Array.isArray(objectNames))) {
      return NextResponse.json(
        { error: "نام آبجکت یا لیست آبجکت‌ها مشخص نشده است" },
        { status: 400 }
      );
    }

    const bucketName = bucket || DEFAULT_BUCKET;

    if (objectName) {
      await deleteFromMinio(bucketName, objectName);
      return NextResponse.json({
        success: true,
        data: {
          bucket: bucketName,
          objectName,
          deletedAt: new Date().toISOString(),
        },
      });
    }

    const deleteResults = await minioClient.removeObjects(
      bucketName,
      objectNames
    );

    const results: any[] = [];
    for await (const result of deleteResults) {
      results.push(result);
    }

    return NextResponse.json({
      success: true,
      data: {
        bucket: bucketName,
        results,
        deletedCount: results.length,
        deletedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Minio delete error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "خطا در حذف فایل",
        success: false,
      },
      { status: 500 }
    );
  }
}
