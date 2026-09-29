import type { MetadataRoute } from "next";
import { siteUrl } from "@/constants/site";
import { getSitemapData, type SitemapEntry } from "@/lib/blog";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

// The blog is Indonesian-only and served unprefixed (see src/proxy.ts), so URLs carry no
// locale prefix and no hreflang alternates — matching each page's canonical.
function section(
  basePath: string,
  entries: SitemapEntry[],
  changeFrequency: ChangeFrequency,
  priority: number,
): MetadataRoute.Sitemap {
  return entries.map(({ slug, lastModified }) => ({
    url: `${siteUrl}${basePath}/${slug}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

// Blog URLs live in their own sitemap (/blog/sitemap.xml, listed in robots.txt
// alongside the main /sitemap.xml) so the article list can grow without
// crowding the static-page sitemap. One file holds up to 50,000 URLs (Google's
// limit); shard with generateSitemaps() only if the blog ever approaches that.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blog = await getSitemapData();

  // The blog index effectively changed when its newest entry did; fall back to
  // the generation date while there are no posts yet.
  const blogLastModified = blog.posts.reduce<string | null>(
    (max, post) =>
      !max || new Date(post.lastModified) > new Date(max)
        ? post.lastModified
        : max,
    null,
  );

  return [
    {
      url: `${siteUrl}/blog`,
      lastModified: blogLastModified ?? new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...section("/blog", blog.posts, "monthly", 0.7),
    ...section("/blog/category", blog.categories, "weekly", 0.6),
    ...section("/blog/tag", blog.tags, "weekly", 0.5),
    ...section("/blog/author", blog.authors, "monthly", 0.4),
  ];
}
