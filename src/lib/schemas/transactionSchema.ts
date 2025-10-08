import { z } from "zod";

export const TransactionItemSchema = z.object({
  id: z.string().uuid().optional(),
  itemName: z.string().min(1, "نام کالا الزامی است"),
  quantity: z.number().positive("تعداد باید مثبت باشد"),
  unitPrice: z.number().positive("قیمت واحد باید مثبت باشد"),
  totalPrice: z.number().positive("قیمت کل باید مثبت باشد"),
  unit: z.string().default("عدد"),
});

export const TransactionSchema = z.object({
  id: z.string().uuid().optional(),
  type: z.enum(["buy", "sell"], {
    message: "نوع معامله باید خرید یا فروش باشد",
  }),
  counterparty: z.string().min(1, "نام طرف معامله الزامی است"),
  date: z
    .string()
    .regex(/^\d{4}\/\d{2}\/\d{2}$/, "فرمت تاریخ باید YYYY/MM/DD باشد"),
  items: z.array(TransactionItemSchema).min(1, "حداقل یک قلم کالا الزامی است"),
  totalAmount: z.number().positive("مبلغ کل باید مثبت باشد"),
  description: z.string().optional(),
  status: z.enum(["pending", "confirmed", "rejected"]).default("pending"),
  createdAt: z.string().datetime().optional(),
  audioUrl: z.string().url().optional(),
  transcriptionText: z.string().optional(),
});

export type TransactionItem = z.infer<typeof TransactionItemSchema>;
export type Transaction = z.infer<typeof TransactionSchema>;

// System prompt for LLM to extract structured data
export const TRANSACTION_EXTRACTION_PROMPT = `
تو یک دستیار هوشمند برای استخراج اطلاعات معاملات از متن فارسی هستی.

وظیفه تو:
1. متن صوتی ضبط شده معامله را تحلیل کن
2. اطلاعات زیر را استخراج کن:
   - نوع معامله: "buy" (خرید) یا "sell" (فروش)
   - طرف معامله: نام فروشنده یا خریدار
   - تاریخ: به فرمت YYYY/MM/DD (اگر مشخص نبود، تاریخ امروز)
   - لیست اقلام: هر قلم شامل:
     * نام کالا
     * تعداد (عدد)
     * واحد (مثل: عدد، کیلو، گرم، متر)
     * قیمت واحد (عدد)
     * قیمت کل (عدد)
   - مبلغ کل معامله (مجموع قیمت تمام اقلام)
   - توضیحات اضافی (اگر هست)

قوانین مهم:
- تمام اعداد فارسی را به انگلیسی تبدیل کن
- برای قیمت‌ها، فقط عدد را بنویس (بدون ریال، تومان و...)
- اگر اطلاعاتی مشخص نبود، از مقادیر منطقی استفاده کن
- تاریخ را حتما به فرمت YYYY/MM/DD بنویس

پاسخ را به صورت JSON با ساختار زیر برگردان:

\`\`\`json
{
  "type": "buy" | "sell",
  "counterparty": "نام طرف معامله",
  "date": "YYYY/MM/DD",
  "items": [
    {
      "itemName": "نام کالا",
      "quantity": 10,
      "unit": "عدد",
      "unitPrice": 50000,
      "totalPrice": 500000
    }
  ],
  "totalAmount": 500000,
  "description": "توضیحات اختیاری",
  "status": "pending"
}
\`\`\`

مثال:
ورودی: "امروز از آقای احمدی 5 کیلو طلای 18 عیار به قیمت هر گرم 2 میلیون و 500 هزار تومان خریدم"

خروجی:
\`\`\`json
{
  "type": "buy",
  "counterparty": "آقای احمدی",
  "date": "2025/10/08",
  "items": [
    {
      "itemName": "طلای 18 عیار",
      "quantity": 5,
      "unit": "کیلو",
      "unitPrice": 2500000,
      "totalPrice": 12500000
    }
  ],
  "totalAmount": 12500000,
  "description": "",
  "status": "pending"
}
\`\`\`
`;
