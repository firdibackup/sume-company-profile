import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHeader } from "@/components/sections/page-header";
import { PartnerBrands } from "@/components/sections/partner-brands";
import { SafeHtml } from "@/lib/safe-html";
import { OverlaySection } from "@/components/ui/overlay-section";
import { YouTubeEmbed } from "@/components/ui/youtube-embed";
import { solutionPillars } from "@/constants/solutions";
import { siteUrl } from "@/constants/site";
import { languageAlternates } from "@/i18n/metadata";
import { JsonLd, ORGANIZATION_ID } from "@/lib/json-ld";
import type { Locale } from "@/i18n/routing";

// Each pillar renders one or more capability groups. Most pillars have a single
// untitled group (title: null → no sub-heading); the cooling pillar splits its
// capabilities into "Air Cooling" and "Liquid Cooling" sub-groups.
const PILLAR_KEYS = [
  {
    tagnum: "pillar1Tagnum",
    eyebrow: "pillar1Eyebrow",
    title: "pillar1Title",
    lead: "pillar1Lead",
    groups: [
      {
        title: null,
        caps: [
          { title: "pillar1Cap1Title", body: "pillar1Cap1Body" },
          { title: "pillar1Cap2Title", body: "pillar1Cap2Body" },
          { title: "pillar1Cap3Title", body: "pillar1Cap3Body" },
          { title: "pillar1Cap4Title", body: "pillar1Cap4Body" },
        ],
      },
    ],
  },
  {
    tagnum: "pillar2Tagnum",
    eyebrow: "pillar2Eyebrow",
    title: "pillar2Title",
    lead: "pillar2Lead",
    groups: [
      {
        title: "pillar2GroupAirTitle",
        caps: [
          { title: "pillar2Cap1Title", body: "pillar2Cap1Body" },
          { title: "pillar2Cap2Title", body: "pillar2Cap2Body" },
          { title: "pillar2Cap3Title", body: "pillar2Cap3Body" },
        ],
      },
      {
        title: "pillar2GroupLiquidTitle",
        caps: [
          { title: "pillar2Cap4Title", body: "pillar2Cap4Body" },
          { title: "pillar2Cap5Title", body: "pillar2Cap5Body" },
          { title: "pillar2Cap6Title", body: "pillar2Cap6Body" },
          { title: "pillar2Cap7Title", body: "pillar2Cap7Body" },
        ],
      },
    ],
  },
  {
    tagnum: "pillar3Tagnum",
    eyebrow: "pillar3Eyebrow",
    title: "pillar3Title",
    lead: "pillar3Lead",
    groups: [
      {
        title: null,
        caps: [
          { title: "pillar3Cap1Title", body: "pillar3Cap1Body" },
          { title: "pillar3Cap2Title", body: "pillar3Cap2Body" },
          { title: "pillar3Cap3Title", body: "pillar3Cap3Body" },
        ],
      },
    ],
  },
] as const;

const AFTERSALES_POINT_KEYS = [
  { bold: "aftersalesPoint1Bold", rest: "aftersalesPoint1Rest" },
  { bold: "aftersalesPoint2Bold", rest: "aftersalesPoint2Rest" },
  { bold: "aftersalesPoint3Bold", rest: "aftersalesPoint3Rest" },
  { bold: "aftersalesPoint4Bold", rest: "aftersalesPoint4Rest" },
  { bold: "aftersalesPoint5Bold", rest: "aftersalesPoint5Rest" },
  { bold: "aftersalesPoint6Bold", rest: "aftersalesPoint6Rest" },
] as const;

type PageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "SolutionsPage",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: languageAlternates("/solutions")[locale],
      languages: languageAlternates("/solutions"),
    },
  };
}

export default async function SolutionsPage({ params }: PageProps) {
  const { locale } = await params;
  const loc = locale as Locale;
  setRequestLocale(loc);
  const t = await getTranslations("SolutionsPage");

  // One Service node per solution pillar, provided by the site-wide Organization.
  const servicesJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("metaTitle"),
    url: `${siteUrl}${languageAlternates("/solutions")[loc]}`,
    itemListElement: PILLAR_KEYS.map((keys, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        // Eyebrow is the service name ("Kelistrikan & Energi"); title is a headline.
        name: t(keys.eyebrow),
        description: t(keys.lead),
        url: `${siteUrl}${languageAlternates("/solutions")[loc]}#${solutionPillars[index].id}`,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: "Indonesia",
      },
    })),
  };

  return (
    <main>
      <JsonLd data={servicesJsonLd} />
      <PageHeader
        eyebrow={t("headerEyebrow")}
        title={t("headerTitle")}
        description={t("headerDescription")}
      />

      {/* ── Pillars ──────────────────────────────────────────────── */}
      {solutionPillars.map((pillar, index) => {
        const keys = PILLAR_KEYS[index as 0 | 1 | 2];
        return (
          <section
            key={pillar.id}
            id={pillar.id}
            className={`scroll-mt-20 border-b border-sume-line py-26 ${
              index % 2 === 1 ? "bg-sume-mist" : "bg-white"
            }`}
          >
            <div className="sume-wrap grid items-center gap-12 lg:grid-cols-2 lg:gap-[72px]">
              <div
                className={`flex flex-col gap-6 w-full ${pillar.flip ? "lg:order-2" : ""}`}
              >
                <div className="sume-chamfer relative aspect-[4/3] w-full overflow-hidden">
                  <span className="absolute left-[18px] top-[18px] z-[2] rounded-[2px] bg-sume-navy/[0.78] px-[13px] py-[7px] font-head text-[12px] font-semibold tracking-[0.16em] text-white">
                    {t(keys.tagnum)}
                  </span>
                  <Image
                    src={pillar.image}
                    alt={t(keys.eyebrow)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>

                {pillar.id === "power" && (
                  <div className="w-full overflow-hidden border border-sume-line flex bg-white">
                    <img
                      src="/power-aftersales-service.webp"
                      alt="Power Aftersales Service"
                      className="w-full h-auto"
                    />
                  </div>
                )}
              </div>

              <div>
                <h2 className="sume-eyebrow mb-4 block">{t(keys.eyebrow)}</h2>
                <span className="mb-[18px] block font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                  {t(keys.title)}
                </span>
                <p className="mb-[34px] max-w-[46ch] text-[17.5px] leading-[1.6] text-sume-body">
                  {t(keys.lead)}
                </p>

                <div className="flex flex-col gap-7">
                  {keys.groups.map((group) => (
                    <div key={group.title ?? "default"}>
                      {group.title ? (
                        <h3 className="mb-3 flex items-center gap-2.5 font-head text-[12.5px] font-semibold uppercase tracking-[0.16em] text-sume-blue">
                          <span className="h-px w-7 bg-sume-blue/40" />
                          {t(group.title)}
                        </h3>
                      ) : null}
                      <ul className="flex flex-col">
                        {group.caps.map((cap, capIndex) => (
                          <li
                            key={cap.title}
                            className={`flex gap-[18px] border-t border-sume-line py-5 ${
                              capIndex === group.caps.length - 1
                                ? "border-b border-sume-line"
                                : ""
                            }`}
                          >
                            <span className="mt-[9px] h-2 w-2 flex-none rounded-full bg-sume-blue" />
                            <div>
                              <h3 className="mb-[5px] font-head text-[17px] font-semibold text-sume-navy">
                                {t(cap.title)}
                              </h3>
                              <p className="text-[15px] leading-[1.55] text-sume-body">
                                {t(cap.body)}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {pillar.id === "power" ? (
                  <div className="mt-[34px] border border-l-[3px] border-sume-line border-l-sume-blue bg-white p-7 sm:px-[30px]">
                    <h3 className="mb-1.5 font-head text-[18px] font-semibold text-sume-navy">
                      {t("aftersalesTitle")}
                    </h3>
                    <p className="mb-5 max-w-[50ch] text-[14.5px] leading-[1.55] text-sume-body">
                      {t("aftersalesBody")}
                    </p>
                    <ul className="grid gap-3.5">
                      {AFTERSALES_POINT_KEYS.map((point) => {
                        const bold = t(point.bold);
                        const rest = t(point.rest);
                        // Skip points left blank in the CMS so a stray
                        // checkmark with no text isn't rendered.
                        if (!bold.trim() && !rest.trim()) return null;
                        return (
                          <li
                            key={point.bold}
                            className="flex gap-[13px] text-[14.5px] leading-[1.5] text-sume-body"
                          >
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mt-0.5 h-[18px] w-[18px] flex-none stroke-sume-blue"
                            >
                              <polyline points="20,6 9,17 4,12" />
                            </svg>
                            <span>
                              {bold ? (
                                <b className="font-semibold text-sume-navy">
                                  {bold}
                                </b>
                              ) : null}
                              {rest}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ) : null}

                {pillar.id === "cooling" ? (
                  <Link
                    href="/midea-datacenter"
                    className="mt-[34px] inline-flex items-center gap-2 font-head text-[15px] font-semibold text-sume-blue transition-all hover:gap-3"
                  >
                    {t("pillar2CatalogCta")}
                    <ArrowRight className="h-[18px] w-[18px]" />
                  </Link>
                ) : null}
              </div>
            </div>
          </section>
        );
      })}

      {/* ── Yuchai Industrial Plant Video ────────────────────────── */}
      <section
        id="yuchai-plant"
        className="scroll-mt-20 border-b border-sume-line bg-sume-navy py-26"
      >
        <div className="sume-wrap grid items-center gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-16">
          <div>
            <h2 className="sume-eyebrow mb-4 block text-[#7fb4ff]">
              {t("yuchaiEyebrow")}
            </h2>
            <span className="mb-[18px] block  font-head text-[clamp(28px,3vw,42px)] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
              {t("yuchaiHeading")}
            </span>
            <p className="mb-7 max-w-[46ch] text-[17.5px] leading-[1.6] text-white/[0.7]">
              {t("yuchaiBody")}
            </p>
            <Link
              href="/solutions#power"
              className="inline-flex items-center gap-2 font-head text-[15px] font-semibold text-[#7fb4ff] transition hover:text-white"
            >
              {t("yuchaiCta")}
              <ArrowRight className="h-[18px] w-[18px]" />
            </Link>
          </div>

          <YouTubeEmbed
            id="zUhNpLl-DxE"
            title="Yuchai Industrial Plant"
            poster="/yuchai-plant-poster.jpg"
          />
        </div>
      </section>

      {/* ── Integrated M&E ───────────────────────────────────────── */}
      <OverlaySection
        id="integrated"
        className="scroll-mt-20 border-b border-sume-line bg-white py-30"
        image="/images/home/pattern-3.png"
        imageClassName="object-cover object-right"
        overlayClassName="bg-[linear-gradient(90deg,#fff_0%,rgba(255,255,255,0.92)_38%,rgba(248,251,255,0.55)_70%,rgba(248,251,255,0.1)_100%)]"
      >
        <div className="max-w-[620px]">
          <h2 className="sume-eyebrow mb-4 block">{t("integratedEyebrow")}</h2>
          <span className="mb-5 block font-head text-[clamp(30px,3.4vw,46px)] font-semibold leading-[1.12] tracking-[-0.02em] text-sume-navy">
            {t("integratedHeading")}
          </span>
          <SafeHtml
            html={t.raw("integratedBody")}
            className="max-w-[44ch] text-[18px] leading-[1.6] text-sume-body [&_strong]:font-semibold [&_strong]:text-sume-navy"
          />
        </div>
      </OverlaySection>

      {/* ── Capabilities & Brands ────────────────────────────────── */}
      <PartnerBrands />

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <CtaBand title={t("ctaTitle")} description={t("ctaBody")}>
        <Link href="/contact" className="sume-btn sume-btn-white">
          {t("ctaButton")}
          <ArrowRight className="h-[18px] w-[18px]" />
        </Link>
      </CtaBand>
    </main>
  );
}
