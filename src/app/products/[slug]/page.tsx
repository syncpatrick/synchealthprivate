import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProductHero } from "@/components/product-hero";
import { ProductWhy } from "@/components/product-why";
import { ProductQuality } from "@/components/product-quality";
import { HowItWorks } from "@/components/how-it-works";
import { Testimonials } from "@/components/testimonials";
import { Catalog } from "@/components/catalog";
import { Blog } from "@/components/blog";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import {
  blankProduct,
  productsBySlug,
  testimonials,
  catalog,
  blog,
  finalCta,
} from "@/lib/content";
import {
  getStoryContent,
  resolveVersion,
  resolveSiteHeader,
  resolveFooter,
} from "@/lib/storyblok";
import { mapProduct, mapTestimonials } from "@/lib/storyblok-map";
import { Reveal } from "@/components/reveal";
import { richToPlain } from "@/lib/richtext";

export const dynamic = "force-dynamic";

/**
 * The product behind a URL, or null when nothing claims that slug.
 *
 * Products live in the Storyblok "products" folder, so a story's own path is
 * already the public one and an editor never has to set a real path by hand.
 * The flat `product-<slug>` name is still accepted, for any story that has not
 * been moved into the folder.
 *
 * A slug with neither a story nor a content.ts entry is a typo or a product
 * that has been deleted, and used to render a complete BPC-157 page under the
 * wrong name. Local products never 404, so a Storyblok outage can't take the
 * built-in catalogue down with it.
 *
 * A product that only exists in Storyblok falls back to `blankProduct` rather
 * than to BPC-157, so a half-written page shows its own gaps instead of
 * quietly borrowing another compound's copy.
 *
 * The URL also wins over the story's own slug, because that value is the
 * cart's key for the line item, and two products sharing a key merge into one
 * basket line.
 *
 * The fetches are memoised per request, so calling this from both
 * generateMetadata and the page body costs one round trip each.
 */
async function resolveProduct(
  slug: string,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const { isEnabled } = await draftMode();
  const version = resolveVersion(await searchParams, isEnabled);
  const local = productsBySlug[slug];
  const story =
    (await getStoryContent(`product-${slug}`, version)) ??
    (await getStoryContent(`products/${slug}`, version));
  if (!story && !local) return null;
  return { ...mapProduct(story, local ?? blankProduct), slug };
}

/**
 * The reviews a product page shows when the product has none of its own.
 *
 * They live in their own "product-testimonials" story rather than being read
 * off the home page, so the home page and the product pages can say different
 * things and both stay editable without a developer.
 *
 * Three levels, most specific first: this product's own reviews, then this
 * story, then the copy in content.ts if Storyblok is unreachable.
 *
 * Only called when the product has no reviews of its own, so a product that
 * does never pays for the extra fetch.
 */
async function fallbackTestimonials(
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const { isEnabled } = await draftMode();
  const version = resolveVersion(await searchParams, isEnabled);
  return mapTestimonials(
    await getStoryContent("product-testimonials", version),
    testimonials,
  );
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProduct(slug, searchParams);
  // Nothing to describe: the page below 404s.
  if (!product) return {};
  return {
    title: `${product.name} — Sync.`,
    description: richToPlain(product.description),
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const [product, header, footer] = await Promise.all([
    resolveProduct(slug, searchParams),
    resolveSiteHeader(searchParams),
    resolveFooter(searchParams),
  ]);
  if (!product) notFound();
  const reviews =
    product.testimonials ?? (await fallbackTestimonials(searchParams));

  return (
    <main className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#f0f0e6_0%,#ffffff_100%)]">
      <div className="p-3">
        <SiteHeader content={header} />
      </div>
      {/* The hero is the first paint, so it is there rather than arriving.
          Everything below settles in as it is scrolled to, the same as the
          CMS-driven pages. */}
      <ProductHero content={product} />
      {/* A product still being written has no benefits or questions yet, and
          both sections are a heading over an empty column until it does. */}
      {product.why.features.length > 0 && (
        <Reveal>
          <ProductWhy content={product} />
        </Reveal>
      )}
      <Reveal>
        <HowItWorks content={product.howItWorks} variant="product" />
      </Reveal>
      <Reveal>
        <ProductQuality content={product} />
      </Reveal>
      <Reveal>
        <Testimonials content={reviews} />
      </Reveal>
      <Reveal>
        <Catalog content={catalog} />
      </Reveal>
      <Reveal>
        <Blog content={blog} />
      </Reveal>
      {product.faq.items.length > 0 && (
        <Reveal>
          <Faq content={product.faq} />
        </Reveal>
      )}
      <Reveal>
        <FinalCta content={finalCta} />
      </Reveal>
      <Footer content={footer} />
    </main>
  );
}
