import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "@/lib/mongodb/models";
import { TransactionSchema } from "@/lib/schemas/transactionSchema";
import { getPresignedUrl, deleteFromMinio } from "@/lib/minio";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await TransactionModel.findById(id);

    if (!document) {
      return NextResponse.json({ error: "معامله یافت نشد" }, { status: 404 });
    }

    const transaction = TransactionModel.toTransaction(document);

    let audioUrl = undefined;
    if (document.audioObjectName) {
      try {
        audioUrl = await getPresignedUrl(
          process.env.MINIO_DEFAULT_BUCKET || "file",
          document.audioObjectName,
          24 * 60 * 60
        );
      } catch (error) {
        console.error("Error generating presigned URL:", error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        audioUrl,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction:", error);
    return NextResponse.json(
      {
        error: "خطا در دریافت معامله",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.transaction) {
      TransactionSchema.partial().parse(body.transaction);
    }

    const updates = body.transaction || body;

    const document = await TransactionModel.update(id, updates);

    if (!document) {
      return NextResponse.json({ error: "معامله یافت نشد" }, { status: 404 });
    }

    const transaction = TransactionModel.toTransaction(document);

    let audioUrl = undefined;
    if (document.audioObjectName) {
      try {
        audioUrl = await getPresignedUrl(
          process.env.MINIO_DEFAULT_BUCKET || "file",
          document.audioObjectName,
          24 * 60 * 60
        );
      } catch (error) {
        console.error("Error generating presigned URL:", error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...transaction,
        audioUrl,
      },
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json(
      {
        error: "خطا در بروزرسانی معامله",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await TransactionModel.findById(id);

    if (!document) {
      return NextResponse.json({ error: "معامله یافت نشد" }, { status: 404 });
    }

    if (document.audioObjectName) {
      try {
        await deleteFromMinio(
          process.env.MINIO_DEFAULT_BUCKET || "file",
          document.audioObjectName
        );
      } catch (error) {
        console.error("Error deleting audio from MinIO:", error);
      }
    }

    const deleted = await TransactionModel.delete(id);

    if (!deleted) {
      return NextResponse.json({ error: "خطا در حذف معامله" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "معامله با موفقیت حذف شد",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      {
        error: "خطا در حذف معامله",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
