import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ClosingCta } from "@/components/sections/closing-cta";
import { DataCenterTeaser } from "@/components/sections/data-center-teaser";
import { Hero } from "@/components/sections/hero";
import { PartnerBrands } from "@/components/sections/partner-brands";
import { PositioningStrip } from "@/components/sections/positioning-strip";
import { SolutionsOverview } from "@/components/sections/solutions-overview";
import { TrustedBy } from "@/components/sections/trusted-by";
import { WhySume } from "@/components/sections/why-sume";
import { languageAlternates } from "@/i18n/metadata";
import type { Locale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: languageAlternates("/")[locale],
      languages: languageAlternates("/"),
    },
  };
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <main className="font-body">
      <Hero />
      <PositioningStrip />
      <PartnerBrands />
      <SolutionsOverview />
      <DataCenterTeaser />
      <WhySume />
      <TrustedBy />
      <ClosingCta />
    </main>
  );
}
