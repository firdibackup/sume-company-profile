import { notFound } from "next/navigation";

// Disabled: a real 404 lets Google drop the URL. The previous 200 "temporarily
// disabled" page was a soft 404. To restore, bring back the imports and
// generateMetadata from git history (before this commit) plus the body below.
export default function RegionalPage() {
  notFound();
}

/*
  Previous implementation kept below for reference while this page is disabled.

  import { CtaBand } from "@/components/sections/cta-band";
  import { PageHeader, PageHeaderStats } from "@/components/sections/page-header";
  import { RegionalMap } from "@/components/regional-map";
  import { regionalStats } from "@/constants/regional";

  export default async function RegionalPage({ params }: PageProps) {
    const { locale } = await params;
    const loc = locale as Locale;
    setRequestLocale(loc);
    const t = await getTranslations("RegionalPage");

    return (
      <main>
        <PageHeader
          eyebrow={t("headerEyebrow")}
          title={t("headerTitle")}
          description={t("headerDescription")}
        >
          <PageHeaderStats stats={regionalStats[loc]} />
        </PageHeader>

        <section className="bg-white py-24">
          <div className="sume-wrap">
            <div className="mb-12 flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
              <div>
                <h2 className="sume-eyebrow mb-3.5 block">
                  {t("officesEyebrow")}
                </h2>
                <span className="max-w-[18ch] block font-head text-[clamp(28px,3vw,40px)] font-semibold leading-[1.1] tracking-[-0.02em] text-sume-navy">
                  {t("officesHeading")}
                </span>
              </div>
              <p className="max-w-[38ch] text-[17px] text-sume-body">
                {t("officesBody")}
              </p>
            </div>

            <RegionalMap />
          </div>
        </section>

        <CtaBand title={t("ctaTitle")} description={t("ctaBody")}>
          <Link href="/contact" className="sume-btn sume-btn-white">
            {t("ctaButton")}
          </Link>
        </CtaBand>
      </main>
    );
  }
*/
