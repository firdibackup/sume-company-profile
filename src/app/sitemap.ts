import type { MetadataRoute } from "next";
import { siteUrl } from "@/constants/site";
import { routing } from "@/i18n/routing";

type Route = {
  path: string;
  changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;
  priority: number;
};

// Static marketing pages only — blog URLs live in their own sitemap
// (src/app/blog/sitemap.ts → /blog/sitemap.xml); both are listed in robots.txt.
const routes: Route[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/solutions", changeFrequency: "monthly", priority: 0.9 },
  { path: "/data-center", changeFrequency: "monthly", priority: 0.9 },
  { path: "/our-project", changeFrequency: "weekly", priority: 0.8 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/regional", changeFrequency: "monthly", priority: 0.6 },
];

/** Builds an absolute URL for a locale-prefixed path. */
function localizedUrl(locale: string, path: string) {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
  const suffix = path === "/" ? "" : path;
  return `${siteUrl}${prefix}${suffix}`;
}

// No lastModified: these pages have no real edit date, and a build-time stamp
// that changes every deploy teaches Google to distrust this site's <lastmod>.
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.flatMap(({ path, changeFrequency, priority }) => {
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [locale, localizedUrl(locale, path)]),
    );

    return routing.locales.map((locale) => ({
      url: localizedUrl(locale, path),
      changeFrequency,
      priority,
      alternates: { languages },
    }));
  });
}
