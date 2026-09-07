import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { ArticlePage } from "@/components/article-page";
import {
  articlesBySlug,
  blankArticle,
  journal,
} from "@/lib/content";
import {
  getStoryContent,
  resolveVersion,
  resolveSiteHeader,
  resolveFooter,
} from "@/lib/storyblok";
import {
  mapArticle,
  mapJournal,
  journalCardImage,
  img,
} from "@/lib/storyblok-map";
import { richToPlain } from "@/lib/richtext";

export const dynamic = "force-dynamic";

/**
 * The article behind a URL, or null when nothing claims that slug.
 *
 * Articles live in the Storyblok "Journal" folder. Creating a story there is
 * the whole job of publishing a blog: it gets a page here and a card on the
 * index with nothing else to fill in. The folder's slug is `articles` rather
 * than `journal`, because the journal index story already owns that slug, and
 * `/articles/<slug>` redirects here so the Visual Editor previews a new story
 * at its real URL. The flat `article-<slug>` name is still accepted, for any
 * story not yet moved.
 *
 * A slug with neither a story nor a local entry 404s. It used to render the one
 * finished article under whatever URL was asked for, so six index cards, the
 * featured slot and any typo all served the same piece under different titles.
 *
 * A story that exists but is half written falls back to `blankArticle` rather
 * than to the compounded peptides piece, so it shows its own gaps instead of
 * quietly borrowing another article's words.
 *
 * The fetches are memoised per request, so reading this from both
 * generateMetadata and the page body costs one round trip each.
 */
async function resolveArticle(
  slug: string,
  searchParams: Promise<Record<string, string | string[] | undefined>>,
) {
  const { isEnabled } = await draftMode();
  const version = resolveVersion(await searchParams, isEnabled);
  const local = articlesBySlug[slug];
  const story =
    (await getStoryContent(`articles/${slug}`, version)) ??
    (await getStoryContent(`article-${slug}`, version));
  if (!story && !local) return null;

  const mapped = mapArticle(story, local ?? blankArticle);

  // The hero and the index thumbnail must be the same picture. When the article
  // carries its own cover both read it, so they agree. When it doesn't, the
  // hero takes whatever the index is showing for this URL, resolved through the
  // same mapping the index uses so it sees the image after fallbacks rather
  // than only what is set on the blok.
  const ownCover = img(story?.cover);
  const index = mapJournal(await getStoryContent("journal", version), journal);
  const cover =
    ownCover || journalCardImage(index, `/journal/${slug}`) || mapped.cover;
  return { ...mapped, cover };
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await resolveArticle(slug, searchParams);
  // Nothing to describe: the page below 404s.
  if (!content) return {};
  return {
    title: `${content.title} — Sync.`,
    description: richToPlain(content.dek),
  };
}

export default async function ArticleRoute({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const [content, header, footer] = await Promise.all([
    resolveArticle(slug, searchParams),
    resolveSiteHeader(searchParams),
    resolveFooter(searchParams),
  ]);
  if (!content) notFound();

  return (
    <main className="min-h-screen overflow-clip bg-white">
      <div className="bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_620px)]">
        <div className="p-3">
          <SiteHeader content={header} />
        </div>
        <ArticlePage content={content} />
      </div>
      <Footer content={footer} />
    </main>
  );
}
