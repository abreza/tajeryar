import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "@/lib/mongodb/models";
import { TransactionSchema } from "@/lib/schemas/transactionSchema";
import { getPresignedUrl } from "@/lib/minio";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      startDate: searchParams.get("startDate") || undefined,
      endDate: searchParams.get("endDate") || undefined,
      limit: parseInt(searchParams.get("limit") || "100"),
      skip: parseInt(searchParams.get("skip") || "0"),
    };

    const documents = await TransactionModel.findAll(filters);

    const transactionsWithUrls = await Promise.all(
      documents.map(async (doc) => {
        const transaction = TransactionModel.toTransaction(doc);
        let audioUrl = undefined;

        if (doc.audioObjectName) {
          try {
            audioUrl = await getPresignedUrl(
              process.env.MINIO_DEFAULT_BUCKET || "file",
              doc.audioObjectName,
              24 * 60 * 60
            );
          } catch (error) {
            console.error("Error generating presigned URL:", error);
          }
        }

        return {
          ...transaction,
          audioUrl,
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: transactionsWithUrls,
      count: transactionsWithUrls.length,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      {
        error: "خطا در دریافت لیست معاملات",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validatedData = TransactionSchema.parse(body.transaction);

    const document = await TransactionModel.create(
      validatedData,
      body.audioObjectName
    );

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
    console.error("Error creating transaction:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          error: "داده‌های ارسالی نامعتبر است",
          details: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "خطا در ایجاد معامله",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
