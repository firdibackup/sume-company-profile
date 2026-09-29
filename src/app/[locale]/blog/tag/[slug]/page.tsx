import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/constants/site";
import { JsonLd } from "@/lib/json-ld";
import type { Locale } from "@/i18n/routing";
import {
  DEFAULT_PAGE_SIZE,
  getCategories,
  getPopularPosts,
  getPostsByTag,
  getRecentPosts,
  getTagBySlug,
} from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { Pagination } from "@/components/blog/pagination";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "id") return {};

  const tag = await getTagBySlug(slug);
  if (!tag) return {};

  const description = `Kumpulan artikel dengan tag ${tag.name}.`;
  return {
    title: `#${tag.name} — Blog`,
    description,
    alternates: { canonical: `/blog/tag/${tag.slug}` },
    openGraph: {
      type: "website",
      url: `${siteUrl}/blog/tag/${tag.slug}`,
      title: `#${tag.name} — Blog SUME`,
      description,
    },
  };
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== "id") notFound();
  setRequestLocale(locale as Locale);

  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [listing, categories, popular, latest] = await Promise.all([
    getPostsByTag(tag.slug, page, DEFAULT_PAGE_SIZE),
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(6),
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `#${tag.name} — Blog SUME`,
    description: `Kumpulan artikel dengan tag ${tag.name}.`,
    url: `${siteUrl}/blog/tag/${tag.slug}`,
    inLanguage: "id",
    isPartOf: { "@id": `${siteUrl}/blog#blog` },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <JsonLd data={collectionJsonLd} />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: `#${tag.name}` },
        ]}
      />

      <header className="mb-8 mt-6 flex flex-col gap-3">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Tag
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          #{tag.name}
        </h1>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          {listing.posts.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
              Belum ada artikel dengan tag ini.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {listing.posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          )}

          <Pagination
            page={page}
            total={listing.total}
            pageSize={listing.pageSize}
            basePath={`/blog/tag/${tag.slug}`}
          />
        </div>

        <BlogSidebar categories={categories} popular={popular} latest={latest} />
      </div>
    </main>
  );
}
