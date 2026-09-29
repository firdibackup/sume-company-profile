import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation APIs that are aware of the
// routing configuration above. Always import `Link`, `useRouter`, etc. from
// here (not from `next/link` / `next/navigation`) so locale prefixes are
// applied automatically and the active language sticks across navigation.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
