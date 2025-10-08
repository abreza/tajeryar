import { NextRequest, NextResponse } from "next/server";
import { TransactionModel } from "@/lib/mongodb/models";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const stats = await TransactionModel.getStats();

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      {
        error: "خطا در دریافت آمار",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
