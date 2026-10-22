import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { company, footerOffices, solutionsOverview } from "@/constants/site";

const companyLinks = [
  { key: "about", href: "/about" },
  { key: "projects", href: "/our-project" },
  { key: "contact", href: "/contact" },
] as const;

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("Footer");
  const th = useTranslations("Home");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-sume-navy pt-20 font-body text-white/[0.66]">
      <div className="sume-wrap">
        <div className="grid gap-10 border-b border-white/[0.12] pb-16 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <Image
              src="/images/home/sume-logo.png"
              alt="SUME Group"
              width={1745}
              height={431}
              className="mb-5 h-7 w-auto brightness-0 invert"
            />
            <p className="max-w-[30ch] text-[15px] leading-[1.55] text-white/60">
              {t("tagline")}
            </p>
          </div>

          <FooterColumn title={t("solutions")}>
            {solutionsOverview.map((solution) => (
              <FooterLink
                key={solution.anchor}
                href={`/solutions#${solution.anchor}`}
              >
                {th(solution.titleKey)}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("company")}>
            {companyLinks.map((link) => (
              <FooterLink key={link.key} href={link.href}>
                {t(link.key)}
              </FooterLink>
            ))}
            {/* Blog is Indonesian-only, so it only appears on the ID surface. */}
            {locale === "id" ? <FooterLink href="/blog">Blog</FooterLink> : null}
          </FooterColumn>

          <FooterColumn title={t("offices")}>
            {footerOffices[locale].map((office) => (
              <FooterLink key={office} href="/contact">
                {office}
              </FooterLink>
            ))}
          </FooterColumn>

          <FooterColumn title={t("contact")}>
            <FooterLink href={`mailto:${company.email}`}>
              {company.email}
            </FooterLink>
            <FooterLink href={`tel:${company.phone.replace(/[^+\d]/g, "")}`}>
              {company.phone}
            </FooterLink>
          </FooterColumn>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-5 py-6">
          <p className="text-[13.5px] text-white/50">
            {t("copyright", {
              year: String(year),
              brand: company.brand,
              legal: "",
            })}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-[13.5px] text-white/[0.62] hover:text-white">
              {t("privacy")}
            </a>
            <a href="#" className="text-[13.5px] text-white/[0.62] hover:text-white">
              {t("terms")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="mb-5 font-head text-[13px] font-semibold uppercase tracking-[0.12em] text-white">
        {title}
      </h2>
      <ul className="grid gap-3">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-[15px] text-white/[0.64] transition hover:text-white"
      >
        {children}
      </Link>
    </li>
  );
}
