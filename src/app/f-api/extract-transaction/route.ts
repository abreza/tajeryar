import { NextResponse } from "next/server";
import {
  TransactionSchema,
  TRANSACTION_EXTRACTION_PROMPT,
} from "@/lib/schemas/transactionSchema";
import { v4 as uuidv4 } from "uuid";
import { generateText } from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 60;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  try {
    const { transcription } = await req.json();

    if (!transcription || typeof transcription !== "string") {
      return NextResponse.json(
        { error: "متن تبدیل صدا ارسال نشده است" },
        { status: 400 }
      );
    }

    console.log("📝 Transcription received:", transcription);

    const result = await generateText({
      model: openrouter("openai/gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content: TRANSACTION_EXTRACTION_PROMPT,
        },
        {
          role: "user",
          content: `متن ضبط شده:
"${transcription}"

لطفا اطلاعات معامله را استخراج کن و به صورت JSON برگردان. فقط JSON را برگردان، بدون توضیح اضافی.`,
        },
      ],
      temperature: 0.1,
    });

    const contentText = result.text;
    console.log("🤖 AI Response:", contentText);

    let jsonText = contentText.trim();

    if (jsonText.startsWith("```")) {
      jsonText = jsonText
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
    }

    let extractedData;
    try {
      extractedData = JSON.parse(jsonText);
      console.log("✅ Parsed JSON:", extractedData);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", parseError);
      console.error("Response text:", jsonText);

      try {
        const fixedJson = jsonText
          .replace(/,(\s*[}\]])/g, "$1")
          .replace(/\n/g, " ")
          .trim();
        extractedData = JSON.parse(fixedJson);
        console.log("✅ Parsed JSON after fix:", extractedData);
      } catch (secondError) {
        throw new Error("خطا در تفسیر پاسخ هوش مصنوعی");
      }
    }

    const transactionData = {
      ...extractedData,
      id: uuidv4(),
      status: "pending",
      createdAt: new Date().toISOString(),
      transcriptionText: transcription,
    };

    if (Array.isArray(transactionData.items)) {
      transactionData.items = transactionData.items.map((item: any) => ({
        ...item,
        id: uuidv4(),
      }));
    }

    console.log("📦 Transaction data before validation:", transactionData);

    try {
      const validatedTransaction = TransactionSchema.parse(transactionData);
      console.log("✅ Validated transaction:", validatedTransaction);

      return NextResponse.json({
        success: true,
        transaction: validatedTransaction,
      });
    } catch (validationError: any) {
      console.error("❌ Validation Error:", validationError);

      return NextResponse.json(
        {
          error: "اطلاعات استخراج شده معتبر نیست",
          validationErrors: validationError.errors,
          extractedData: transactionData,
          hint: "لطفا داده‌ها را در جدول ویرایش کنید",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error("❌ Extract Transaction Error:", error);

    if (error?.name === "AI_APICallError") {
      return NextResponse.json(
        {
          error: "خطا در ارتباط با سرویس هوش مصنوعی",
          details: error.message,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        error: error?.message || "خطا در استخراج اطلاعات معامله",
      },
      { status: 500 }
    );
  }
}
