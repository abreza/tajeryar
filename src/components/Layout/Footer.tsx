"use client";

import React from "react";
import {
  Box,
  Container,
  Grid,
  Stack,
  Typography,
  Link as JoyLink,
  Divider,
  IconButton,
} from "@mui/joy";
import {
  AccountBalance as AccountBalanceIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Telegram as TelegramIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
} from "@mui/icons-material";
import Link from "next/link";

const footerLinks = {
  product: [
    { label: "صفحه اصلی", href: "/" },
    { label: "درباره ما", href: "/about" },
    { label: "قیمت‌گذاری", href: "/pricing" },
  ],
  support: [
    { label: "راهنمای استفاده", href: "#" },
    { label: "سوالات متداول", href: "#" },
    { label: "تماس با ما", href: "#" },
  ],
  legal: [
    { label: "قوانین و مقررات", href: "#" },
    { label: "حریم خصوصی", href: "#" },
    { label: "شرایط استفاده", href: "#" },
  ],
};

const socialLinks = [
  { icon: <TelegramIcon />, href: "#", label: "تلگرام" },
  { icon: <InstagramIcon />, href: "#", label: "اینستاگرام" },
  { icon: <LinkedInIcon />, href: "#", label: "لینکدین" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.level1",
        borderTop: "1px solid",
        borderColor: "divider",
        pt: 6,
        pb: 3,
        mt: "auto",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1.5}>
                <AccountBalanceIcon
                  sx={{ fontSize: 36, color: "primary.500" }}
                />
                <Box>
                  <Typography level="h4" sx={{ fontWeight: 700 }}>
                    تاجر یار
                  </Typography>
                  <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
                    دستیار مالی هوشمند
                  </Typography>
                </Box>
              </Stack>

              <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                سامانه هوشمند مدیریت مالی و حسابداری برای تاجران با قابلیت تشخیص
                اتوماتیک فاکتورها و ثبت خودکار معاملات
              </Typography>

              <Stack direction="row" spacing={1}>
                {socialLinks.map((social) => (
                  <IconButton
                    key={social.label}
                    component="a"
                    href={social.href}
                    variant="soft"
                    color="neutral"
                    size="sm"
                    aria-label={social.label}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Stack>
            </Stack>
          </Grid>

          {/* Links Sections */}
          <Grid xs={12} sm={4} md={2}>
            <Stack spacing={1.5}>
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                محصول
              </Typography>
              {footerLinks.product.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <JoyLink
                    level="body-sm"
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.500" },
                    }}
                  >
                    {link.label}
                  </JoyLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} sm={4} md={2}>
            <Stack spacing={1.5}>
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                پشتیبانی
              </Typography>
              {footerLinks.support.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <JoyLink
                    level="body-sm"
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.500" },
                    }}
                  >
                    {link.label}
                  </JoyLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          <Grid xs={12} sm={4} md={2}>
            <Stack spacing={1.5}>
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                قانونی
              </Typography>
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ textDecoration: "none" }}
                >
                  <JoyLink
                    level="body-sm"
                    sx={{
                      color: "text.secondary",
                      "&:hover": { color: "primary.500" },
                    }}
                  >
                    {link.label}
                  </JoyLink>
                </Link>
              ))}
            </Stack>
          </Grid>

          {/* Contact Section */}
          <Grid xs={12} md={2}>
            <Stack spacing={1.5}>
              <Typography level="title-md" sx={{ fontWeight: 700 }}>
                تماس با ما
              </Typography>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <EmailIcon sx={{ fontSize: 18, color: "text.tertiary" }} />
                  <JoyLink
                    level="body-sm"
                    href="mailto:info@tajeryar.ir"
                    sx={{ color: "text.secondary" }}
                  >
                    info@tajeryar.ir
                  </JoyLink>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PhoneIcon sx={{ fontSize: 18, color: "text.tertiary" }} />
                  <Typography level="body-sm" sx={{ color: "text.secondary" }}>
                    ۰۲۱-۱۲۳۴۵۶۷۸
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            © {new Date().getFullYear()} تاجر یار. تمامی حقوق محفوظ است.
          </Typography>
          <Typography level="body-sm" sx={{ color: "text.tertiary" }}>
            ساخته شده با ❤️ برای تاجران ایرانی
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
