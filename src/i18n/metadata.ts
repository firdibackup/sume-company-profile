import { routing } from "./routing";

/**
 * Builds `hreflang` alternates for a locale-agnostic path (e.g. `/about`).
 * The default locale (English) lives at the root, others under `/<locale>`.
 *
 * Returns root-relative URLs that Next.js resolves against `metadataBase`.
 */
export function languageAlternates(pathname: string) {
  const languages: Record<string, string> = {};

  for (const locale of routing.locales) {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    const path = pathname === "/" ? "" : pathname;
    languages[locale] = `${prefix}${path}` || "/";
  }

  return languages;
}
