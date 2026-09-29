import type { Metadata } from "next";
import {
  IBM_Plex_Sans,
  Inter,
  Manrope,
  Plus_Jakarta_Sans,
  Source_Sans_3,
} from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { siteUrl } from "@/constants/site";
import { type Locale, routing } from "@/i18n/routing";
import { languageAlternates } from "@/i18n/metadata";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import "../globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Enterprise design direction: IBM Plex Sans (headings) + Source Sans 3 (body)
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

const ogLocales: Record<string, string> = { id: "id_ID", en: "en_US" };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "Meta",
  });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: "%s | SUME Group",
    },
    description,
    applicationName: "SUME Group",
    keywords: [
      "SUME Group",
      "PT SUME",
      "mechanical and electrical",
      "M&E contractor",
      "data center infrastructure",
      "precision cooling",
      "HVAC",
      "power and energy",
      "facility monitoring",
      "Jakarta",
      "Indonesia",
    ],
    alternates: {
      canonical: languageAlternates("/")[locale],
      languages: languageAlternates("/"),
    },
    openGraph: {
      type: "website",
      locale: ogLocales[locale] ?? "en_US",
      url: languageAlternates("/")[locale],
      siteName: "SUME Group",
      title,
      description,
      images: [
        {
          url: "/images/home/city-building.png",
          width: 1200,
          height: 630,
          alt: t("ogImageAlt"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/images/home/city-building.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification: {
      google: "uOlYPiMfXqDmjjZHpeofAiLf05Ex3UOZ7GuoQGDJZ_U",
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
  };
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering for this locale.
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    // suppressHydrationWarning: browser extensions (e.g. Bitdefender's `bis_*`
    // attributes) mutate <html>/<body> before hydration; this silences the
    // resulting one-level attribute mismatch without hiding real ones deeper.
    <html
      lang={locale}
      className={`${plusJakarta.variable} ${manrope.variable} ${inter.variable} ${ibmPlexSans.variable} ${sourceSans.variable} antialiased`}
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/* Site-wide structured data; page-level schema references these @ids. */}
        <JsonLd data={[organizationJsonLd(), websiteJsonLd(locale)]} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
