import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { StoryblokStory } from "@storyblok/react/rsc";
import type { ISbStoryData } from "@storyblok/react/rsc";
import {
  getStoryblok,
  isStoryblokConfigured,
  resolveSiteHeader,
} from "@/lib/storyblok";
import { AboutFallback } from "@/components/about-fallback";
import { aboutHero } from "@/lib/content";
import { richToPlain } from "@/lib/richtext";

// Draft content (Visual Editor / preview) must render fresh on every request.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About — Sync.",
  description: richToPlain(aboutHero.body),
};

async function fetchStory(
  version: "draft" | "published",
): Promise<ISbStoryData | null> {
  try {
    const client = getStoryblok();
    // cv bust → published edits appear live (see getStoryContent).
    const { data } = await client.get("cdn/stories/about", {
      version,
      cv: Date.now(),
    });
    return data?.story ?? null;
  } catch (err) {
    console.error('[storyblok] failed to load about story:', err);
    return null;
  }
}

export default async function AboutRoute({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [sp, header] = await Promise.all([
    searchParams,
    resolveSiteHeader(searchParams),
  ]);

  // Falls back to the local content whenever Storyblok is unconfigured or the
  // story is missing, so the page never renders blank.
  if (!isStoryblokConfigured()) return <AboutFallback header={header} />;

  const { isEnabled } = await draftMode();
  const version: "draft" | "published" =
    sp._storyblok || isEnabled ? "draft" : "published";

  const story = await fetchStory(version);
  if (!story) return <AboutFallback header={header} />;
  return <StoryblokStory story={story} />;
}
