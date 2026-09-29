import NextLink from "next/link";
import type { ComponentProps } from "react";
import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation APIs that are aware of the
// routing configuration above. Always import `Link`, `useRouter`, etc. from
// here (not from `next/link` / `next/navigation`) so locale prefixes are
// applied automatically and the active language sticks across navigation.
const nav = createNavigation(routing);

export const { redirect, usePathname, useRouter, getPathname } = nav;

// The blog is Indonesian-only and served unprefixed at /blog (see proxy.ts),
// so links into it skip the locale prefix — otherwise ID pages would link to
// /id/blog and bounce through a redirect.
export function Link({ locale, ...props }: ComponentProps<typeof nav.Link>) {
  if (typeof props.href === "string" && /^\/blog(?=[/?#]|$)/.test(props.href)) {
    return <NextLink {...props} href={props.href} />;
  }
  return <nav.Link locale={locale} {...props} />;
}
