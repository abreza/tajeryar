"use client";

import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Button,
  Chip,
  List,
  ListItem,
  ListItemDecorator,
  Switch,
} from "@mui/joy";
import {
  Check as CheckIcon,
  Star as StarIcon,
  Rocket as RocketIcon,
  Business as BusinessIcon,
} from "@mui/icons-material";

interface PricingPlan {
  name: string;
  description: string;
  monthlyPrice: string;
  yearlyPrice: string;
  icon: React.ReactNode;
  color: "primary" | "success" | "warning";
  features: string[];
  popular?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    name: "رایگان",
    description: "برای شروع و آشنایی با تاجر یار",
    monthlyPrice: "۰",
    yearlyPrice: "۰",
    icon: <StarIcon />,
    color: "primary",
    features: [
      "تا ۵۰ معامله در ماه",
      "ثبت صوتی معاملات",
      "تشخیص خودکار فاکتور",
      "گزارش‌گیری ساده",
      "دستیار هوشمند (محدود)",
      "پشتیبانی ایمیلی",
    ],
    cta: "شروع رایگان",
  },
  {
    name: "حرفه‌ای",
    description: "برای تاجران با حجم معاملات متوسط",
    monthlyPrice: "۴۹۰,۰۰۰",
    yearlyPrice: "۴,۷۰۰,۰۰۰",
    icon: <RocketIcon />,
    color: "success",
    popular: true,
    features: [
      "معاملات نامحدود",
      "تمام ویژگی‌های پلن رایگان",
      "گزارش‌گیری پیشرفته",
      "نمودارهای تحلیلی",
      "دستیار هوشمند کامل",
      "یکپارچه‌سازی با نرم‌افزارهای حسابداری",
      "پشتیبانی اولویت‌دار",
      "پشتیبان‌گیری خودکار",
    ],
    cta: "انتخاب پلن حرفه‌ای",
  },
  {
    name: "سازمانی",
    description: "برای کسب‌وکارهای بزرگ و شرکت‌ها",
    monthlyPrice: "تماس بگیرید",
    yearlyPrice: "تماس بگیرید",
    icon: <BusinessIcon />,
    color: "warning",
    features: [
      "تمام ویژگی‌های پلن حرفه‌ای",
      "کاربران نامحدود",
      "API اختصاصی",
      "امکانات سفارشی‌سازی",
      "مشاور اختصاصی",
      "آموزش تیم",
      "پشتیبانی ۲۴/۷",
      "SLA تضمین شده",
      "گزارش‌های اختصاصی",
    ],
    cta: "تماس با فروش",
  },
];

const faqs = [
  {
    question: "آیا می‌توانم پلن خود را تغییر دهم؟",
    answer:
      "بله، شما می‌توانید در هر زمان پلن خود را ارتقا یا کاهش دهید. تفاوت مبلغ به صورت تناسبی محاسبه می‌شود.",
  },
  {
    question: "روش پرداخت چگونه است؟",
    answer:
      "ما از تمام کارت‌های بانکی ایرانی پشتیبانی می‌کنیم. همچنین امکان پرداخت فصلی و سالانه با تخفیف وجود دارد.",
  },
  {
    question: "آیا دوره آزمایشی رایگان دارید؟",
    answer:
      "بله، پلن رایگان ما به شما امکان می‌دهد تاجر یار را به طور کامل آزمایش کنید. همچنین برای پلن حرفه‌ای ۱۴ روز تضمین بازگشت وجه داریم.",
  },
  {
    question: "اگر سوالی داشتم چطور می‌توانم با شما تماس بگیرم؟",
    answer:
      "تیم پشتیبانی ما از طریق ایمیل، تلگرام و تلفن در دسترس هستند. کاربران پلن حرفه‌ای و سازمانی از پشتیبانی اولویت‌دار بهره‌مند می‌شوند.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <Box sx={{ bgcolor: "background.body", minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography level="h1" sx={{ fontWeight: 800, color: "white" }}>
              قیمت‌گذاری شفاف و منصفانه
            </Typography>
            <Typography
              level="h4"
              sx={{
                maxWidth: 700,
                color: "rgba(255,255,255,0.95)",
                fontWeight: 400,
              }}
            >
              پلنی را انتخاب کنید که مناسب نیازهای کسب‌وکار شماست
            </Typography>

            {/* Billing Toggle */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography
                level="body-lg"
                sx={{
                  color: "white",
                  fontWeight: isYearly ? 400 : 700,
                }}
              >
                ماهانه
              </Typography>
              <Switch
                checked={isYearly}
                onChange={(e) => setIsYearly(e.target.checked)}
                sx={{
                  "--Switch-trackBackground": "rgba(255,255,255,0.3)",
                }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography
                  level="body-lg"
                  sx={{
                    color: "white",
                    fontWeight: isYearly ? 700 : 400,
                  }}
                >
                  سالانه
                </Typography>
                <Chip
                  size="sm"
                  color="success"
                  variant="solid"
                  sx={{ bgcolor: "rgba(76, 175, 80, 0.9)" }}
                >
                  ۲۰٪ تخفیف
                </Chip>
              </Stack>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Pricing Cards */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {plans.map((plan, index) => (
            <Grid xs={12} md={4} key={index}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  transition: "all 0.3s ease",
                  border: plan.popular ? "2px solid" : undefined,
                  borderColor: plan.popular ? "success.500" : undefined,
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: "xl",
                  },
                }}
              >
                {plan.popular && (
                  <Chip
                    color="success"
                    variant="solid"
                    size="sm"
                    sx={{
                      position: "absolute",
                      top: -12,
                      left: "50%",
                      transform: "translateX(-50%)",
                    }}
                  >
                    محبوب‌ترین
                  </Chip>
                )}

                <CardContent sx={{ flex: 1 }}>
                  <Stack spacing={3}>
                    {/* Plan Header */}
                    <Stack spacing={2}>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "lg",
                          bgcolor: `${plan.color}.softBg`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: `${plan.color}.solidColor`,
                        }}
                      >
                        {plan.icon}
                      </Box>

                      <Box>
                        <Typography level="h3" sx={{ fontWeight: 700 }}>
                          {plan.name}
                        </Typography>
                        <Typography
                          level="body-sm"
                          sx={{ color: "text.tertiary" }}
                        >
                          {plan.description}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Price */}
                    <Box>
                      <Stack
                        direction="row"
                        alignItems="baseline"
                        spacing={0.5}
                      >
                        <Typography level="h1" sx={{ fontWeight: 800 }}>
                          {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </Typography>
                        {plan.monthlyPrice !== "تماس بگیرید" && (
                          <Typography
                            level="body-md"
                            sx={{ color: "text.secondary" }}
                          >
                            تومان / {isYearly ? "سال" : "ماه"}
                          </Typography>
                        )}
                      </Stack>
                      {isYearly && plan.monthlyPrice !== "تماس بگیرید" && (
                        <Typography
                          level="body-sm"
                          sx={{ color: "text.tertiary", mt: 0.5 }}
                        >
                          معادل{" "}
                          {(
                            parseInt(plan.yearlyPrice.replace(/,/g, "")) / 12
                          ).toLocaleString("fa-IR")}{" "}
                          تومان در ماه
                        </Typography>
                      )}
                    </Box>

                    {/* Features */}
                    <List sx={{ "--List-gap": "0.75rem" }}>
                      {plan.features.map((feature, i) => (
                        <ListItem key={i}>
                          <ListItemDecorator>
                            <CheckIcon
                              sx={{ color: `${plan.color}.500`, fontSize: 20 }}
                            />
                          </ListItemDecorator>
                          <Typography level="body-sm">{feature}</Typography>
                        </ListItem>
                      ))}
                    </List>

                    {/* CTA */}
                    <Button
                      fullWidth
                      variant={plan.popular ? "solid" : "outlined"}
                      color={plan.color}
                      size="lg"
                      sx={{ mt: "auto" }}
                    >
                      {plan.cta}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* FAQs Section */}
      <Box sx={{ bgcolor: "background.level1", py: 8 }}>
        <Container maxWidth="md">
          <Stack spacing={4}>
            <Typography
              level="h2"
              sx={{ fontWeight: 700, textAlign: "center" }}
            >
              سوالات متداول 💬
            </Typography>

            <Stack spacing={3}>
              {faqs.map((faq, index) => (
                <Card key={index} variant="outlined">
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                        {faq.question}
                      </Typography>
                      <Typography
                        level="body-md"
                        sx={{ color: "text.secondary", lineHeight: 1.8 }}
                      >
                        {faq.answer}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card
          variant="soft"
          color="primary"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            p: 6,
          }}
        >
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography level="h2" sx={{ fontWeight: 700, color: "white" }}>
              هنوز سوالی دارید؟
            </Typography>
            <Typography
              level="body-lg"
              sx={{ color: "rgba(255,255,255,0.9)", maxWidth: 600 }}
            >
              تیم ما آماده است تا به تمام سوالات شما پاسخ دهد و بهترین پلن را
              برای کسب‌وکارتان پیشنهاد دهد.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="solid"
                sx={{
                  bgcolor: "white",
                  color: "primary.500",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                }}
              >
                تماس با ما
              </Button>
              <Button
                variant="outlined"
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                مشاهده راهنما
              </Button>
            </Stack>
          </Stack>
        </Card>
      </Container>
    </Box>
  );
}
