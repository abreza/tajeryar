import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { DEFAULT_BUCKET, uploadToMinio, getPresignedUrl } from "@/lib/minio";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const bucket = (formData.get("bucket") as string) || DEFAULT_BUCKET;
    const customPath = (formData.get("path") as string) || "";

    if (!file) {
      return NextResponse.json(
        { error: "فایل ارسال نشده است" },
        { status: 400 }
      );
    }

    const fileExtension = file.name.includes(".")
      ? file.name.split(".").pop()!
      : "";
    const uniqueFileName = fileExtension
      ? `${uuidv4()}.${fileExtension}`
      : uuidv4();
    const objectName = customPath
      ? `${customPath}/${uniqueFileName}`
      : uniqueFileName;

    const metadata = {
      "Original-Name": file.name,
      "Upload-Date": new Date().toISOString(),
    };

    await uploadToMinio(file, objectName, {
      bucket,
      contentType: file.type,
      metadata,
    });

    const presignedUrl = await getPresignedUrl(
      bucket,
      objectName,
      7 * 24 * 60 * 60
    );

    return NextResponse.json({
      success: true,
      data: {
        bucket,
        objectName,
        originalName: file.name,
        size: file.size,
        contentType: file.type,
        presignedUrl,
        uploadDate: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Minio upload error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "خطا در آپلود فایل به Minio",
        success: false,
      },
      { status: 500 }
    );
  }
}
