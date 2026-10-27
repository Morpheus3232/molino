import { getL, initLocale, metaL } from "@/lib/i18n/server";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL, siteUrl, localeAlternates, localeUrl } from "@/lib/seo";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/data/blog-content";
import BlogArticleContent from "./BlogArticleContent";

type Props = { params: Promise<{ slug: string }> };

// Solo los slugs pre-generados en generateStaticParams son válidos. Cualquier
// otro slug resuelve a 404 real en el router (evita los soft-404 donde la
// página renderizaba "Artículo no encontrado" con HTTP 200 en vez de 404).
export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const L = await metaL(params);
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: L("Artículo no encontrado", "Article not found") };
  }

  const path = `/blog/${post.slug}`;
  const url = localeUrl(path, L.locale);
  const title = L.t(post.title);
  const description = L.t(post.metaDescription);
  // og:image (y, por fallback, la de X) la genera opengraph-image.tsx:
  // la foto de portada con el título encima.

  return {
    title,
    description,
    alternates: localeAlternates(path, L.locale),
    openGraph: {
      title,
      description,
      type: "article",
      url,
      publishedTime: post.date,
      authors: [L.t(post.author)],
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogArticlePage({ params }: Props) {
  await initLocale(params);
  const L = await getL();
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const url = siteUrl(`/blog/${post.slug}`);
  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L("Inicio", "Home"), item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: siteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Molino", url: SITE_URL },
    image: siteUrl(post.image),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    articleSection: post.category,
    ...(post.faq?.length
      ? {
          faqPage: {
            "@type": "FAQPage",
            mainEntity: post.faq.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      <BlogArticleContent post={post} />
    </>
  );
}
