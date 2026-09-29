import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteUrl } from "@/constants/site";
import { JsonLd, ORGANIZATION_ID } from "@/lib/json-ld";
import {
  DEFAULT_PAGE_SIZE,
  getCategories,
  getFeaturedPost,
  getPopularPosts,
  getPostsGroupedByCategory,
  getPublishedPosts,
  getRecentPosts,
  type CategoryWithPosts,
} from "@/lib/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { ArticleHero } from "@/components/blog/article-hero";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { CategoryFilter } from "@/components/blog/category-filter";
import { CategorySection } from "@/components/blog/category-section";
import { Pagination } from "@/components/blog/pagination";
import { SearchBar } from "@/components/blog/search-bar";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
};

const DESCRIPTION =
  "Wawasan dan artikel seputar solusi mekanikal, elektrikal, dan data center dari SUME.";

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale !== "id") return {};
  return {
    title: "Blog",
    description: DESCRIPTION,
    alternates: { canonical: "/blog" },
    openGraph: {
      type: "website",
      url: `${siteUrl}/blog`,
      title: "Blog SUME",
      description: DESCRIPTION,
    },
  };
}

export default async function BlogIndexPage({
  params,
  searchParams,
}: BlogPageProps) {
  const { locale } = await params;
  if (locale !== "id") notFound();

  const sp = await searchParams;
  const query = sp.q || undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const isSearching = Boolean(query);

  // Default view groups recent posts per category; a search query switches to a
  // flat, paginated result list instead.
  const [categories, popular, latest, featured, grouped, searchListing] = await Promise.all([
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(6),
    isSearching ? Promise.resolve(null) : getFeaturedPost(),
    isSearching ? Promise.resolve([] as CategoryWithPosts[]) : getPostsGroupedByCategory(3),
    isSearching
      ? getPublishedPosts({ page, pageSize: DEFAULT_PAGE_SIZE, query })
      : Promise.resolve(null),
  ]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/blog#blog`,
    name: "Blog SUME",
    description: DESCRIPTION,
    url: `${siteUrl}/blog`,
    inLanguage: "id",
    publisher: { "@id": ORGANIZATION_ID },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <JsonLd data={blogJsonLd} />
      <header className="mb-8 flex flex-col gap-3">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Blog SUME
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          Artikel
        </h1>
        <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
          Informasi dan wawasan seputar solusi mekanikal, elektrikal, dan data
          center terkini.
        </p>
      </header>

      {featured ? (
        <div className="mb-10">
          <ArticleHero post={featured} />
        </div>
      ) : null}

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CategoryFilter categories={categories} />
            <SearchBar defaultQuery={query ?? ""} />
          </div>

          {isSearching && searchListing ? (
            <div className="flex flex-col gap-6">
              <p className="text-sm text-sume-muted">
                Menampilkan hasil untuk “{query}”.
              </p>
              {searchListing.posts.length === 0 ? (
                <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
                  Belum ada artikel yang cocok.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {searchListing.posts.map((post) => (
                    <ArticleCard key={post.id} post={post} />
                  ))}
                </div>
              )}
              <Pagination
                page={page}
                total={searchListing.total}
                pageSize={searchListing.pageSize}
                query={query}
              />
            </div>
          ) : grouped.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
              Belum ada artikel.
            </div>
          ) : (
            grouped.map(({ category, posts }) => (
              <CategorySection key={category.id} category={category} posts={posts} />
            ))
          )}
        </div>

        <BlogSidebar
          categories={categories}
          popular={popular}
          latest={latest}
          categoryPlacement="hidden"
        />
      </div>
    </main>
  );
}
