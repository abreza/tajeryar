import localFont from "next/font/local";
import ThemeRegistry from "@/core/theme/ThemeRegistry";
import "react-toastify/dist/ReactToastify.css";
import StoreProvider from "./StoreProvider";
import { ToastContainer } from "react-toastify";
import ThemeProviderWrapper from "../core/theme/ThemeProviderWrapper";
import Script from "next/script";
import { JSX } from "react";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { Box } from "@mui/joy";

const iranyekanFont = localFont({
  src: "../../assets/fonts/iransansxv.woff2",
  display: "swap",
  variable: "--iransansxv",
});

export const metadata = {
  title: "تاجر یار - دستیار هوشمند مالی",
  description:
    "دستیار هوشمند مالی و حسابداری برای تاجران با قابلیت تشخیص خودکار فاکتورها و ثبت اتوماتیک معاملات",
  keywords: "حسابداری, مالی, تاجر, فاکتور, هوش مصنوعی, ثبت معامله",
};

export default function RootLayout({ children }: { children: JSX.Element }) {
  const orgLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "تاجر یار",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "FinancialManagement",
    operatingSystem: "Web Browser, PWA",
    url: "https://tajeryar.ir",
    logo: "https://tajeryar.ir/favicon/android-icon-192x192.png",
    description:
      "دستیار هوشمند مالی و حسابداری برای تاجران با قابلیت تشخیص خودکار فاکتورها و ثبت اتوماتیک معاملات",
    softwareVersion: "1.0",
    datePublished: "2025-01-01",
    dateModified: "2025-10-08",
    author: {
      "@type": "Organization",
      name: "تاجر یار",
      url: "https://tajeryar.ir",
    },
    publisher: {
      "@type": "Organization",
      name: "تاجر یار",
      url: "https://tajeryar.ir",
      logo: "https://tajeryar.ir/favicon/android-icon-192x192.png",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IRR",
      description: "دسترسی رایگان با امکانات پریمیوم",
    },
    featureList: [
      "تشخیص خودکار فاکتورها از عکس",
      "تبدیل صدا به متن برای ثبت معاملات",
      "ثبت اتوماتیک خرید و فروش",
      "صورت‌حساب هوشمند",
      "گزارش‌گیری تحلیلی",
      "پیگیری بدهکاران و طلبکاران",
      "نمودارهای مالی و تحلیلی",
      "مدیریت موجودی انبار",
    ],
  };

  const siteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "تاجر یار - دستیار هوشمند مالی",
    alternateName: "TajerYar Smart Financial Assistant",
    url: "https://tajeryar.ir",
    description:
      "سامانه هوشمند مدیریت مالی و حسابداری برای تاجران با قابلیت تشخیص اتوماتیک فاکتورها",
    inLanguage: "fa-IR",
    isAccessibleForFree: true,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tajeryar.ir/transactions?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    mainEntity: {
      "@type": "WebApplication",
      name: "دستیار هوشمند تاجر یار",
      description:
        "دستیار هوش مصنوعی برای ثبت خودکار معاملات، صدور صورت‌حساب و گزارش‌گیری مالی",
    },
  };

  return (
    <html
      lang="fa"
      dir="rtl"
      className={iranyekanFont.className}
      suppressHydrationWarning
    >
      <head>
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/favicon/ms-icon-144x144.png"
        />
        <meta
          name="format-detection"
          content="telephone=no, date=no, email=no, address=no"
        />
        <meta name="theme-color" content="#1976d2" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="تاجر یار" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="تاجر یار" />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TAJERYAR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <Script id="gtm" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TAJERYAR');
          `}
        </Script>

        <Script
          id="org-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(orgLd)}
        </Script>
        <Script
          id="site-jsonld"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify(siteLd)}
        </Script>

        <ThemeRegistry>
          <ThemeProviderWrapper>
            <ToastContainer />
            <StoreProvider>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                <Header />
                <Box component="main" sx={{ flex: 1 }}>
                  {children}
                </Box>
                <Footer />
              </Box>
            </StoreProvider>
          </ThemeProviderWrapper>
        </ThemeRegistry>
      </body>
    </html>
  );
}
