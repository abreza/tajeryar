import {
  ChatbotConfig,
  ChatMessage,
} from "@/components/organism/chatbot/types";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MicIcon from "@mui/icons-material/Mic";

export const chatConfig: ChatbotConfig = {
  id: "tajer-yar-assistant",
  title: "دستیار هوشمند تاجر یار",
  collapsedTitle: "تاجر یار - دستیار مالی شما",
  apiEndpoint: "/f-api/tajer-yar",
  placeholder: "درباره خرید، فروش، صورت‌حساب یا گزارش‌تان سوال بپرسید…",
  supportsFeedback: true,
  supportsReasoning: true,
  initialMessages: [
    {
      id: "initial-1",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "سلام! من دستیار هوشمند تاجر یار هستم. 📊\n\nمن می‌تونم:\n✅ عکس فاکتورها و رسیدهای شما رو بخونم\n✅ صوت‌های خرید و فروش رو تبدیل به متن کنم\n✅ به صورت اتوماتیک صورت‌حساب براتون تهیه کنم\n✅ گزارش‌های مالی دقیق و جامع ارائه بدم\n✅ معاملات ثبت شده شما رو تحلیل کنم\n\nچطور می‌تونم کمکتون کنم؟",
        },
      ],
      timestamp: new Date(),
    },
  ] as ChatMessage[],
  quickPrompts: [
    {
      title: "ثبت صوتی معامله",
      icon: <MicIcon fontSize="small" />,
      color: "primary",
      prompts: [
        "چطور صوتی معامله ثبت کنم؟",
        "راهنمای ضبط صوت معامله",
        "نمونه متن برای ثبت خرید",
        "نمونه متن برای ثبت فروش",
      ],
    },
    {
      title: "مدیریت خرید و فروش",
      icon: <ReceiptLongIcon fontSize="small" />,
      color: "success",
      prompts: [
        "چطور فاکتور ثبت کنم؟",
        "عکس فاکتورم رو می‌خونی؟",
        "لیست خریدهای امروزم",
        "فروش‌های این هفته چقدره؟",
        "چطور صورت‌حساب بگیرم؟",
      ],
    },
    {
      title: "گزارش‌گیری و تحلیل",
      icon: <TrendingUpIcon fontSize="small" />,
      color: "warning",
      prompts: [
        "گزارش کامل این ماه",
        "سود خالصم چقدر بوده؟",
        "بیشترین فروش به چه کسی بوده؟",
        "چه کسی بدهکار داره؟",
        "مقایسه این ماه با ماه قبل",
        "نمودار فروش بده",
      ],
    },
  ],
};
