import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // All locales the site supports.
  locales: ["id", "en"],

  // English is the default — served at the root path (e.g. sumeid.com).
  // Exception: the blog is Indonesian-only at /blog (see src/proxy.ts).
  defaultLocale: "en",

  // Omit the prefix for the default locale (`/about`) but keep it for the
  // others (`/id/about`). This makes English live at `/` and Indonesian at `/id`.
  localePrefix: "as-needed",

  // The root path is always English — never auto-redirect based on the
  // browser's Accept-Language header or a cookie. Visitors switch via the navbar.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
