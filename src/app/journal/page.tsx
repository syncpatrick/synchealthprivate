import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { JournalPage } from "@/components/journal-page";
import { journal, footer } from "@/lib/content";
import {
  getStoryContent,
  getStories,
  resolveVersion,
  resolveSiteHeader,
} from "@/lib/storyblok";
import {
  mapJournal,
  mapArticleStoryCard,
  articleCoversByHref,
} from "@/lib/storyblok-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal — Sync.",
  description:
    "Physician-informed, hype-free writing on the compounds we prescribe and the research behind them.",
};

export default async function JournalRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const { isEnabled } = await draftMode();
  const version = resolveVersion(sp, isEnabled);

  const base = mapJournal(await getStoryContent("journal", version), journal);

  // The article grid lists every `article_page` story, so a blog created in
  // Storyblok appears here automatically (newest first). Falls back to the
  // journal story's curated cards when no article stories exist.
  const stories = await getStories(
    {
      content_type: "article_page",
      per_page: 100,
      sort_by: "first_published_at:desc",
    },
    version,
  );
  // Every published article, newest first. Creating a story in the journal
  // folder is the whole job of publishing a blog: it appears here with nothing
  // else to edit.
  //
  // The cards authored on the journal story are the fallback for when there are
  // no article stories at all, rather than the primary list. They used to win,
  // which is why the grid showed six titles that all led to the one article
  // that had been written.
  const fromStories = stories.map(mapArticleStoryCard).filter((a) => a.title);

  // Thumbnails follow the article's own hero image. Publishing a blog with a
  // cover is the whole job: the card it links to picks the image up, so the
  // same file never has to be uploaded twice. Cards pointing at an article
  // that has no cover yet keep the image set on them.
  const covers = articleCoversByHref(stories);
  const withCover = <T extends { href: string; image: string }>(card: T): T => {
    const cover = covers.get(card.href);
    return cover ? { ...card, image: cover } : card;
  };

  const listed = fromStories.length ? fromStories : base.articles;

  // The featured slot is chosen on the journal story. When it points at an
  // article nobody has written, the newest one stands in, rather than leading
  // the most prominent card on the page to a 404.
  const live = new Set(fromStories.map((a) => a.href));
  const lead = fromStories[0];
  const featured =
    !lead || live.has(base.featured.href)
      ? base.featured
      : {
          ...base.featured,
          title: lead.title,
          excerpt: lead.excerpt,
          meta: lead.meta,
          image: lead.image,
          href: lead.href,
        };

  const content = {
    ...base,
    featured: withCover(featured),
    articles: listed.map(withCover),
  };

  const header = await resolveSiteHeader(searchParams);

  return (
    <main className="min-h-screen overflow-clip bg-white">
      {/* Cream → white wash behind the header + journal index (Figma gradient). */}
      <div className="bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_620px)]">
        <div className="p-3">
          <SiteHeader content={header} />
        </div>
        <JournalPage content={content} />
      </div>
      <Footer content={footer} />
    </main>
  );
}
