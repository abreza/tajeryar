import {
  streamText,
  convertToModelMessages,
  type UIMessage,
  stepCountIs,
  consumeStream,
} from "ai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

export const maxDuration = 300;

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

function createSystemPrompt(context?: any) {
  const basePrompt = [
    "تو دستیار هوشمند مالی تاجریار هستی.",
    "",
    "## توانایی‌های تو:",
    "1. **خواندن فاکتورها و رسیدها از عکس**: وقتی کاربر عکس فاکتور می‌فرسته، تو می‌تونی:",
    "   - متن روی فاکتور رو بخونی (OCR داخلی)",
    "   - اطلاعات مهم مثل: نام فروشنده/خریدار، تاریخ، اقلام، قیمت‌ها، مبلغ کل رو استخراج کنی",
    "",
    "2. **تحلیل معاملات ثبت شده**: کاربر می‌تونه معاملات رو به صورت صوتی ثبت کنه و تو می‌تونی:",
    "   - لیست معاملات تایید شده رو مشاهده کنی",
    "   - معاملات در انتظار تایید رو ببینی",
    "   - گزارش‌های تحلیلی و آماری بدی",
    "   - مقایسه و تحلیل روند فروش/خرید انجام بدی",
    "",
    "## راهنمای خواندن فاکتور از عکس:",
    "- وقتی عکس فاکتور رو دیدی، با دقت تمام متن‌ها رو بخون",
    "- اطلاعات زیر رو استخراج کن:",
    "  * نوع معامله: خرید یا فروش",
    "  * طرف معامله: نام فروشنده یا خریدار",
    "  * تاریخ (اگر مشخص نبود، از تاریخ امروز استفاده کن)",
    "  * لیست اقلام: نام کالا، تعداد، قیمت واحد",
    "  * مبلغ کل",
    "  * توضیحات اضافی (اگر هست)",
    "- بعد از استخراج، حتماً با ابزار createInvoiceTool فاکتور رو ثبت کن",
    "- اگر اطلاعاتی مشخص نبود، از کاربر بپرس",
    "",
  ];

  // Add transaction context if available
  if (context?.transactions && context.transactions.length > 0) {
    basePrompt.push("## معاملات تایید شده کاربر:");
    basePrompt.push(
      `تعداد کل معاملات تایید شده: ${context.transactions.length}`
    );
    basePrompt.push("");
    basePrompt.push("لیست معاملات:");
    context.transactions.forEach((t: any, index: number) => {
      basePrompt.push(
        `${index + 1}. ${t.type === "buy" ? "خرید" : "فروش"} از ${
          t.counterparty
        } - تاریخ: ${t.date} - مبلغ: ${t.totalAmount} تومان`
      );
      t.items?.forEach((item: any) => {
        basePrompt.push(
          `   - ${item.itemName}: ${item.quantity} ${item.unit} × ${item.unitPrice} = ${item.totalPrice} تومان`
        );
      });
    });
    basePrompt.push("");
  }

  if (context?.pendingTransactions && context.pendingTransactions.length > 0) {
    basePrompt.push("## معاملات در انتظار تایید:");
    basePrompt.push(
      `تعداد معاملات در انتظار: ${context.pendingTransactions.length}`
    );
    basePrompt.push("");
  }

  basePrompt.push(
    "## نکات مهم:",
    "- همیشه مودب و دوستانه باش",
    "- اگر عکس واضح نیست یا اطلاعات ناقصه، بپرس",
    "- بعد از ثبت فاکتور، خلاصه‌ای از اطلاعات ثبت شده رو نشون بده",
    "- برای اعداد فارسی، تبدیل به انگلیسی کن",
    "- برای تاریخ‌های شمسی، فرمت YYYY/MM/DD استفاده کن",
    "- وقتی از معاملات صحبت می‌کنی، از اطلاعات معاملات تایید شده استفاده کن",
    "- در گزارش‌ها، تحلیل دقیق و آماری ارائه بده",
    "",
    "پاسخ‌ها رو به فارسی بده و از ایموجی برای بهتر شدن تجربه استفاده کن 📊💰✅"
  );

  return basePrompt.join("\n");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      messages,
      transactions,
      pendingTransactions,
    }: {
      messages: UIMessage[];
      transactions?: any[];
      pendingTransactions?: any[];
    } = body;

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const context = {
      transactions,
      pendingTransactions,
    };

    const result = streamText({
      model: openrouter("openai/gpt-4o-mini"),
      system: createSystemPrompt(context),
      messages: convertToModelMessages(messages),
      stopWhen: stepCountIs(12),
      providerOptions: {
        openai: {
          reasoningEffort: "low",
        },
      },
    });

    return result.toUIMessageStreamResponse({
      onError: (error) => {
        console.error("API Route Error:", error);
        if (error == null) return "خطای نامشخصی رخ داد";
        if (typeof error === "string") return error;
        if (error instanceof Error) return error.message;
        return "خطا در پردازش درخواست";
      },
      consumeSseStream: consumeStream,
    });
  } catch (error) {
    console.error("API Route Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "خطای سرور",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
