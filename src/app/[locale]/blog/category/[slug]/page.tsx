import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/constants/site";
import { JsonLd } from "@/lib/json-ld";
import type { Locale } from "@/i18n/routing";
import {
  DEFAULT_PAGE_SIZE,
  getCategories,
  getCategoryBySlug,
  getPopularPosts,
  getPostsByCategory,
  getRecentPosts,
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

  const category = await getCategoryBySlug(slug);
  if (!category) return {};

  const description = category.description || `Kumpulan artikel dalam kategori ${category.name}.`;
  return {
    title: `${category.name} — Blog`,
    description,
    alternates: { canonical: `/blog/category/${category.slug}` },
    openGraph: {
      type: "website",
      url: `${siteUrl}/blog/category/${category.slug}`,
      title: `${category.name} — Blog SUME`,
      description,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== "id") notFound();
  setRequestLocale(locale as Locale);

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [listing, categories, popular, latest] = await Promise.all([
    getPostsByCategory(category.slug, page, DEFAULT_PAGE_SIZE),
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(6),
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} — Blog SUME`,
    description: category.description || `Kumpulan artikel dalam kategori ${category.name}.`,
    url: `${siteUrl}/blog/category/${category.slug}`,
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
          { label: category.name },
        ]}
      />

      <header className="mb-8 mt-6 flex flex-col gap-3">
        <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
          Kategori
        </span>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
          {category.name}
        </h1>
        {category.description ? (
          <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">
            {category.description}
          </p>
        ) : null}
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          {listing.posts.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
              Belum ada artikel dalam kategori ini.
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
            basePath={`/blog/category/${category.slug}`}
          />
        </div>

        <BlogSidebar categories={categories} popular={popular} latest={latest} />
      </div>
    </main>
  );
}
