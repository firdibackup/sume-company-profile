import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { siteUrl } from "@/constants/site";
import { JsonLd, ORGANIZATION_ID } from "@/lib/json-ld";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import {
  getCategories,
  getPopularPosts,
  getPostBySlug,
  getRecentPosts,
  getRelatedPosts,
} from "@/lib/blog";
import { getDraftPreviewBySlug } from "@/lib/blog-preview";
import { formatDate, isMeaningfulUpdate, splitHtmlBlocks } from "@/lib/blog-utils";
import { SafeHtml } from "@/lib/safe-html";
import { ArticleCard } from "@/components/blog/article-card";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Breadcrumb } from "@/components/blog/breadcrumb";
import { ShareButtons } from "@/components/blog/share-buttons";
import { ViewTracker } from "@/components/blog/view-tracker";

type DetailPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

const DESCRIPTION_FALLBACK =
  "Wawasan seputar solusi mekanikal, elektrikal, dan data center dari SUME.";

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (locale !== "id") return {};

  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = post.meta_title || post.title;
  const description = post.meta_description || post.excerpt || DESCRIPTION_FALLBACK;
  const url = `${siteUrl}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.published_at ?? undefined,
      // Only advertise a modified time when it's a later day than publish, so a
      // same-day save doesn't surface an "Updated" date in search results.
      modifiedTime: isMeaningfulUpdate(post.published_at, post.updated_at)
        ? post.updated_at
        : undefined,
      authors: post.author ? [post.author.name] : undefined,
      images: post.thumbnail ? [{ url: post.thumbnail }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

export default async function ArticleDetailPage({ params }: DetailPageProps) {
  const { locale, slug } = await params;
  if (locale !== "id") notFound();
  setRequestLocale(locale as Locale);

  // Drafts (and not-yet-live scheduled posts) are hidden from the public by RLS,
  // so getPostBySlug returns null. Let a signed-in admin preview them at the real
  // URL instead of 404-ing; getDraftPreviewBySlug returns null for everyone else.
  let post = await getPostBySlug(slug);
  let isPreview = false;
  if (!post) {
    post = await getDraftPreviewBySlug(slug);
    isPreview = post !== null;
  }
  if (!post) notFound();

  const [related, categories, popular, latest] = await Promise.all([
    getRelatedPosts(post.id, post.category_id, 3),
    getCategories(),
    getPopularPosts(30, 5),
    getRecentPosts(5, post.id),
  ]);

  const shareUrl = `${siteUrl}/blog/${post.slug}`;
  // Same-day saves aren't a meaningful update — don't surface them on the page
  // or in structured data.
  const showUpdated = isMeaningfulUpdate(post.published_at, post.updated_at);

  // Article structured data (JSON-LD) so search engines pick up the correct
  // published / updated dates. dateModified only advances past datePublished when
  // the post was genuinely updated on a later day.
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.meta_description || DESCRIPTION_FALLBACK,
    ...(post.thumbnail
      ? { image: [post.thumbnail.startsWith("http") ? post.thumbnail : `${siteUrl}${post.thumbnail}`] }
      : {}),
    datePublished: post.published_at ?? undefined,
    dateModified: showUpdated ? post.updated_at : (post.published_at ?? undefined),
    ...(post.author
      ? {
          author: {
            "@type": "Person",
            name: post.author.name,
            url: `${siteUrl}/blog/author/${post.author.slug}`,
          },
        }
      : {}),
    publisher: { "@id": ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
    url: shareUrl,
    inLanguage: "id",
  };

  const contentClass =
    "mt-8 text-[16px] leading-[1.8] text-sume-body [&_h2]:mt-8 [&_h2]:text-sume-ink [&_h3]:mt-6 [&_h3]:text-sume-ink [&_h4]:mt-6 [&_h4]:text-sume-ink";

  // "Baca juga" (internal links) sits in the middle of the article: split the body
  // into top-level blocks and drop the card between the two halves. Short articles
  // (<2 blocks) fall back to showing it right after the body.
  const readAlso =
    post.internal_links.length > 0 ? (
      <section className="mt-8 rounded-[4px] border border-sume-line bg-sume-mist/40 p-5">
        <h2 className="font-head text-sm font-bold uppercase tracking-wide text-sume-ink">
          Baca juga
        </h2>
        <ul className="mt-3 flex flex-col gap-2">
          {post.internal_links.map((link, i) =>
            link.url.startsWith("/") ? (
              <li key={`${link.url}-${i}`}>
                <Link
                  href={link.url}
                  className="text-[15px] font-semibold text-sume-blue hover:underline"
                >
                  {link.label}
                </Link>
              </li>
            ) : (
              <li key={`${link.url}-${i}`}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[15px] font-semibold text-sume-blue hover:underline"
                >
                  {link.label} ↗
                </a>
              </li>
            ),
          )}
        </ul>
      </section>
    ) : null;
  const contentBlocks = post.internal_links.length > 0 ? splitHtmlBlocks(post.content) : [];
  const splitAt = contentBlocks.length >= 2 ? Math.ceil(contentBlocks.length / 2) : 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8 lg:py-12">
      {!isPreview ? <JsonLd data={articleJsonLd} /> : null}
      {isPreview ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-amber-300 bg-amber-50 px-4 py-2.5 text-[13px] text-amber-900">
          <span className="font-semibold">
            Mode pratinjau · Artikel ini belum tayang dan hanya terlihat oleh admin.
          </span>
          <a
            href={`/admin/blog/${post.id}/edit`}
            className="font-semibold underline hover:no-underline"
          >
            Kembali ke editor
          </a>
        </div>
      ) : (
        <ViewTracker slug={post.slug} />
      )}

      <Breadcrumb
        items={[
          { label: "Beranda", href: "/" },
          { label: "Blog", href: "/blog" },
          ...(post.category
            ? [{ label: post.category.name, href: `/blog/category/${post.category.slug}` }]
            : []),
          { label: post.title },
        ]}
      />

      <div className="mt-[1.8rem] grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <article className="min-w-0">
          <header className="flex flex-col gap-[1.2rem]">
            {post.category ? (
              <Link
                href={`/blog/category/${post.category.slug}`}
                className="font-head text-[12px] font-semibold uppercase tracking-[0.16em] text-sume-blue hover:underline"
              >
                {post.category.name}
              </Link>
            ) : null}
            <h1 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-sume-ink sm:text-4xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-sume-muted">
              {post.author ? (
                <Link
                  href={`/blog/author/${post.author.slug}`}
                  className="font-semibold text-sume-navy hover:text-sume-blue"
                >
                  {post.author.name}
                </Link>
              ) : null}
              {post.published_at ? (
                <>
                  <span aria-hidden>·</span>
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                </>
              ) : null}
              <span aria-hidden>·</span>
              <span>{post.reading_time} mnt baca</span>
              {showUpdated ? (
                <>
                  <span aria-hidden>·</span>
                  <span className="italic">Diperbarui {formatDate(post.updated_at)}</span>
                </>
              ) : null}
            </div>
          </header>

          {post.thumbnail ? (
            <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[6px] border border-sume-line bg-sume-mist">
              <Image
                src={post.thumbnail}
                alt={post.title}
                fill
                priority
                sizes="(min-width:1024px) 66vw, 100vw"
                className="object-cover"
              />
            </div>
          ) : null}

          {splitAt ? (
            <>
              <SafeHtml
                html={contentBlocks.slice(0, splitAt).join("")}
                className={contentClass}
              />
              {readAlso}
              <SafeHtml
                html={contentBlocks.slice(splitAt).join("")}
                className={contentClass}
              />
            </>
          ) : (
            <>
              <SafeHtml html={post.content} className={contentClass} />
              {readAlso}
            </>
          )}

          {post.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-sume-line pt-6">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/blog/tag/${tag.slug}`}
                  className="rounded-full border border-sume-line px-3 py-1 text-[13px] font-semibold text-sume-body transition hover:border-sume-blue hover:text-sume-blue"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          ) : null}

          {post.references.length > 0 ? (
            <section className="mt-8 border-t border-sume-line pt-6">
              <h2 className="font-head text-sm font-bold uppercase tracking-wide text-sume-ink">
                Referensi
              </h2>
              <ol className="mt-3 flex list-decimal flex-col gap-2 pl-5 text-[14px] text-sume-body marker:text-sume-muted">
                {post.references.map((ref) => (
                  <li key={ref.id}>
                    <a
                      href={ref.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sume-blue hover:underline"
                    >
                      {ref.title}
                    </a>
                    {ref.accessed_at ? (
                      <span className="text-sume-muted"> — diakses {formatDate(ref.accessed_at)}</span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </section>
          ) : null}

          <div className="mt-8 border-t border-sume-line pt-6">
            <ShareButtons url={shareUrl} title={post.title} />
          </div>
        </article>

        <BlogSidebar categories={categories} popular={popular} latest={latest} categoryPlacement="top" />
      </div>

      {related.length > 0 ? (
        <section className="mt-14 border-t border-sume-line pt-10">
          <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight text-sume-ink">
            Berita Lainnya
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ArticleCard key={item.id} post={item} />
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
