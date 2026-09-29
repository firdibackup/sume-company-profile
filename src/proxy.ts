import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { refreshSession } from "@/lib/supabase/proxy";

const handleI18nRouting = createMiddleware(routing);

const isCmsPath = (pathname: string) =>
  pathname === "/login" ||
  pathname === "/admin" ||
  pathname.startsWith("/admin/") ||
  pathname.startsWith("/login/");

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CMS routes (`/login`, `/admin/**`) are not localized. Keep the Supabase
  // session fresh and gate `/admin` on being signed in. The admin role itself
  // is re-checked in the admin layout and every server action.
  if (isCmsPath(pathname)) {
    const response = NextResponse.next({ request });
    const { claims } = await refreshSession(request, response);

    // Gate /admin on being signed in. The admin *role* is verified in the
    // admin layout (and every server action); a signed-in non-admin landing on
    // /login is handled there, so we don't bounce /login here and risk a loop.
    if (!claims && pathname !== "/login") {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = `?redirect=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }

    return response;
  }

  // The blog is Indonesian-only and lives unprefixed at /blog even though
  // English is the default locale. Runs before next-intl routing.
  // Prefixed variants (/en/blog…, /id/blog…) redirect to the canonical /blog…
  const prefixedBlog = pathname.match(/^\/(?:en|id)(\/blog(?:\/.*)?)$/);
  if (prefixedBlog) {
    const url = request.nextUrl.clone();
    url.pathname = prefixedBlog[1];
    return NextResponse.redirect(url, 308);
  }

  // …and /blog… renders the `id` locale, passing the locale header the same
  // way next-intl's own rewrite does.
  if (pathname === "/blog" || pathname.startsWith("/blog/")) {
    const url = request.nextUrl.clone();
    url.pathname = `/id${pathname}`;
    const headers = new Headers(request.headers);
    headers.set("X-NEXT-INTL-LOCALE", "id");
    const response = NextResponse.rewrite(url, { request: { headers } });
    await refreshSession(request, response);
    return response;
  }

  // Marketing site: run next-intl, then attach refreshed auth cookies to its
  // response so the session survives across the localized pages too.
  const response = handleI18nRouting(request);
  await refreshSession(request, response);
  return response;
}

export const config = {
  // Match all pathnames except:
  // - API routes (`/api`)
  // - Next.js internals (`/_next`, `/_vercel`)
  // - files with an extension (`/favicon.ico`, `/sitemap.xml`, images, …)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
