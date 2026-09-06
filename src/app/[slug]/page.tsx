import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LegalPage } from "@/components/legal-page";
import {
  footer,
  privacyPolicy,
  termsOfService,
  shippingPolicy,
  refundPolicy,
  type LegalContent,
} from "@/lib/content";
import {
  getStoryContent,
  resolveVersion,
  resolveSiteHeader,
} from "@/lib/storyblok";
import { mapLegal } from "@/lib/storyblok-map";
import { richToPlain } from "@/lib/richtext";

export const dynamic = "force-dynamic";

/**
 * Legal pages the site ships its own copy of, keyed by story slug. These four
 * were written in code before they were in the CMS, so they still render if
 * Storyblok is unreachable. A page the client creates later lives only in
 * Storyblok and has no entry here, which is fine: it has nothing to fall back
 * to because it never existed in code.
 */
const BUILT_IN: Record<string, LegalContent> = {
  "privacy-policy": privacyPolicy,
  terms: termsOfService,
  shipping: shippingPolicy,
  "refund-policy": refundPolicy,
};

/** What a story that fills in only some of its fields is merged onto. */
const BLANK: LegalContent = {
  eyebrow: "",
  title: "",
  lastUpdated: "",
  intro: "",
  contentsLabel: "Contents",
  clauses: [],
};

/**
 * The legal page behind a URL, or null when nothing claims that slug.
 *
 * Every legal page is one route rather than a file each, so a page the client
 * creates in Storyblok is live at its own slug with no code change. That is
 * what this replaced: four hard-coded routes, and a 404 for the four pages
 * they had already written.
 *
 * The component check matters because this route sits at the root of the site
 * and would otherwise happily render the header, the footer or the cart drawer
 * as a page of their own.
 *
 * Memoised per request, so reading it from both generateMetadata and the body
 * costs one round trip.
 */
async function resolveLegal(
  slug: string,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const { isEnabled } = await draftMode();
  const version = resolveVersion(await searchParams, isEnabled);
  const story = await getStoryContent(slug, version);
  const local = BUILT_IN[slug];
  if (story && story.component !== "legal_page") return null;
  if (!story && !local) return null;
  return mapLegal(story, local ?? BLANK);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await resolveLegal(slug, searchParams);
  // Nothing to describe: the page below 404s.
  if (!content) return {};
  return {
    title: `${content.title} — Sync.`,
    description: richToPlain(content.intro),
  };
}

export default async function LegalRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const [content, header] = await Promise.all([
    resolveLegal(slug, searchParams),
    resolveSiteHeader(searchParams),
  ]);
  if (!content) notFound();

  return (
    <main className="min-h-screen overflow-clip bg-white">
      <div className="bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_620px)]">
        <div className="p-3">
          <SiteHeader content={header} />
        </div>
        <LegalPage content={content} />
      </div>
      <Footer content={footer} />
    </main>
  );
}
