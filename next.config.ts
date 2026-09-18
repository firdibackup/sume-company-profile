import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.graphassets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ap-south-1.graphassets.com",
        pathname: "/**",
      },
      {
        // Supabase Storage public objects (blog thumbnails, article images,
        // author photos, category icons in the `blog-assets` bucket).
        protocol: "https",
        hostname: "egrneczouptvozcytfia.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Self-hosted Supabase instance (HTTP, non-standard port). Serves the
        // same `blog-assets` public objects as the hosted project above.
        protocol: "http",
        hostname: "202.159.30.243",
        port: "18000",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

// Wires up next-intl. Picks up `./src/i18n/request.ts` automatically.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
