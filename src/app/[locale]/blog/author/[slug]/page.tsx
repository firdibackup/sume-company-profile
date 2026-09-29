import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/constants/site";
import { JsonLd, ORGANIZATION_ID } from "@/lib/json-ld";
import type { Locale } from "@/i18n/routing";
import {
  DEFAULT_PAGE_SIZE,
  getAuthorBySlug,
  getCategories,
  getPopularPosts,
  getPostsByAuthor,
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

  const author = await getAuthorBySlug(slug);
  if (!author) return {};

  const description = author.bio || `Artikel yang ditulis oleh ${author.name}.`;
  return {
    title: `${author.name} — Penulis`,
    description,
    alternates: { canonical: `/blog/author/${author.slug}` },
    openGraph: {
      type: "profile",
      url: `${siteUrl}/blog/author/${author.slug}`,
      title: `${author.name} — Penulis Blog SUME`,
      description,
      images: author.photo ? [{ url: author.photo }] : undefined,
    },
  };
}

export default async function AuthorPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== "id") notFound();
  setRequestLocale(locale as Locale);

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [listing, categories, popular, latest] = await Promise.all([
    getPostsByAuthor(author.slug, page, DEFAULT_PAGE_SIZE),
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(6),
  ]);

  const profileJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${siteUrl}/blog/author/${author.slug}`,
    inLanguage: "id",
    mainEntity: {
      "@type": "Person",
      name: author.name,
      url: `${siteUrl}/blog/author/${author.slug}`,
      ...(author.bio ? { description: author.bio } : {}),
      ...(author.photo
        ? { image: author.photo.startsWith("http") ? author.photo : `${siteUrl}${author.photo}` }
        : {}),
      ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
      worksFor: { "@id": ORGANIZATION_ID },
    },
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-10 lg:px-8 lg:py-14">
      <JsonLd data={profileJsonLd} />
      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: author.name },
        ]}
      />

      <header className="mb-8 mt-6 flex flex-col items-start gap-5 sm:flex-row">
        {author.photo ? (
          <span className="relative size-20 shrink-0 overflow-hidden rounded-full bg-sume-mist">
            <Image
              src={author.photo}
              alt={author.name}
              fill
              sizes="80px"
              className="object-cover"
            />
          </span>
        ) : null}
        <div className="flex flex-col gap-2">
          <span className="font-head text-[12px] font-semibold uppercase tracking-[0.18em] text-sume-blue">
            Penulis
          </span>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-sume-ink sm:text-4xl">
            {author.name}
          </h1>
          {author.bio ? (
            <p className="max-w-2xl text-[15px] leading-relaxed text-sume-body">{author.bio}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-sume-muted">
            <span>{listing.total} artikel</span>
            {author.linkedin ? (
              <>
                <span aria-hidden>·</span>
                <a
                  href={author.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sume-blue hover:underline"
                >
                  LinkedIn ↗
                </a>
              </>
            ) : null}
          </div>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-6">
          {listing.posts.length === 0 ? (
            <div className="rounded-[4px] border border-dashed border-sume-line bg-white p-10 text-center text-sume-muted">
              Belum ada artikel dari penulis ini.
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
            basePath={`/blog/author/${author.slug}`}
          />
        </div>

        <BlogSidebar categories={categories} popular={popular} latest={latest} />
      </div>
    </main>
  );
}
