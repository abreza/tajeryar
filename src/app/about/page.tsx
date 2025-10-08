"use client";

import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Avatar,
} from "@mui/joy";
import {
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  Security as SecurityIcon,
  TrendingUp as TrendingUpIcon,
  MicNone as MicNoneIcon,
  PhotoCamera as PhotoCameraIcon,
} from "@mui/icons-material";
import Link from "next/link";

const features = [
  {
    icon: <MicNoneIcon />,
    title: "ثبت صوتی معاملات",
    description:
      "با ضبط صدای خود، معاملات را سریع و آسان ثبت کنید. هوش مصنوعی ما صدای شما را به متن تبدیل می‌کند.",
    color: "primary" as const,
  },
  {
    icon: <PhotoCameraIcon />,
    title: "تشخیص خودکار فاکتور",
    description:
      "عکس فاکتورهای کاغذی را بگیرید و ما به صورت خودکار اطلاعات را استخراج می‌کنیم.",
    color: "success" as const,
  },
  {
    icon: <PsychologyIcon />,
    title: "دستیار هوشمند",
    description:
      "چت‌بات هوشمند ما آماده پاسخ به سوالات شما درباره معاملات و گزارش‌های مالی است.",
    color: "warning" as const,
  },
  {
    icon: <SpeedIcon />,
    title: "سرعت بالا",
    description:
      "صرفه‌جویی در وقت شما با ثبت خودکار و سریع معاملات، بدون نیاز به تایپ دستی.",
    color: "danger" as const,
  },
  {
    icon: <TrendingUpIcon />,
    title: "گزارش‌گیری پیشرفته",
    description:
      "مشاهده گزارش‌های جامع از خرید و فروش، سود و زیان، و تحلیل روند کسب‌وکار.",
    color: "primary" as const,
  },
  {
    icon: <SecurityIcon />,
    title: "امنیت بالا",
    description:
      "اطلاعات مالی شما با بالاترین استانداردهای امنیتی محافظت می‌شود.",
    color: "success" as const,
  },
];

const stats = [
  { number: "۱۰۰+", label: "کاربر فعال" },
  { number: "۱۰۰۰+", label: "معامله ثبت شده" },
  { number: "۹۸٪", label: "رضایت کاربران" },
  { number: "۲۴/۷", label: "پشتیبانی" },
];

export default function AboutPage() {
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
              درباره تاجر یار
            </Typography>
            <Typography
              level="h4"
              sx={{
                maxWidth: 800,
                color: "rgba(255,255,255,0.95)",
                fontWeight: 400,
              }}
            >
              دستیار هوشمند مالی برای تاجران ایرانی
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Mission Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Card variant="outlined" sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Typography
              level="h2"
              sx={{ fontWeight: 700, textAlign: "center" }}
            >
              ماموریت ما 🎯
            </Typography>
            <Typography
              level="body-lg"
              sx={{ textAlign: "justify", lineHeight: 2 }}
            >
              تاجر یار با هدف ساده‌سازی فرآیند مدیریت مالی برای تاجران طراحی شده
              است. ما می‌دانیم که در بازارهای سنتی ایران، بسیاری از معاملات به
              صورت کلامی و بر اساس اعتبار انجام می‌شود. این روش هرچند کارآمد
              است، اما در پایان روز نیاز به وقت زیادی برای ثبت و محاسبه دارد.
            </Typography>
            <Typography
              level="body-lg"
              sx={{ textAlign: "justify", lineHeight: 2 }}
            >
              با استفاده از هوش مصنوعی و فناوری‌های پیشرفته، تاجر یار این فرآیند
              را خودکار می‌کند. شما فقط کافی است صدای خود را ضبط کنید یا عکس
              فاکتور بگیرید، و بقیه کار را به ما بسپارید. ما اطلاعات را استخراج،
              تحلیل و گزارش‌های مفید به شما ارائه می‌دهیم.
            </Typography>
          </Stack>
        </Card>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: "background.level1", py: 8 }}>
        <Container maxWidth="lg">
          <Stack spacing={5}>
            <Typography
              level="h2"
              sx={{ fontWeight: 700, textAlign: "center" }}
            >
              ویژگی‌های تاجر یار ✨
            </Typography>

            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid xs={12} md={6} key={index}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "lg",
                      },
                    }}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Avatar variant="soft" color={feature.color} size="lg">
                          {feature.icon}
                        </Avatar>
                        <Typography level="title-lg" sx={{ fontWeight: 700 }}>
                          {feature.title}
                        </Typography>
                        <Typography
                          level="body-md"
                          sx={{ color: "text.secondary", lineHeight: 1.8 }}
                        >
                          {feature.description}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid xs={6} md={3} key={index}>
              <Card
                variant="soft"
                color="primary"
                sx={{ textAlign: "center", p: 3 }}
              >
                <Typography
                  level="h1"
                  sx={{ fontWeight: 800, color: "primary.solidColor" }}
                >
                  {stat.number}
                </Typography>
                <Typography level="body-md" sx={{ mt: 1, fontWeight: 600 }}>
                  {stat.label}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
        }}
      >
        <Container maxWidth="md">
          <Stack spacing={3} alignItems="center" textAlign="center">
            <Typography level="h2" sx={{ fontWeight: 700, color: "white" }}>
              آماده شروع هستید؟
            </Typography>
            <Typography level="body-lg" sx={{ color: "rgba(255,255,255,0.9)" }}>
              همین امروز تاجر یار را امتحان کنید و مدیریت مالی خود را ساده کنید
            </Typography>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Box
                component="button"
                sx={{
                  bgcolor: "white",
                  color: "primary.500",
                  px: 4,
                  py: 1.5,
                  borderRadius: "lg",
                  border: "none",
                  fontSize: "1rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  },
                }}
              >
                شروع رایگان
              </Box>
            </Link>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
