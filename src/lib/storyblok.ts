import { cache } from "react";
import { draftMode } from "next/headers";
import { storyblokInit, apiPlugin } from "@storyblok/react/rsc";
import { storyblokComponents } from "@/components/storyblok";
import {
  siteHeader,
  type SiteHeaderContent,
  footer as siteFooter,
  type FooterContent,
} from "@/lib/content";
import { mapHeader, mapFooter } from "@/lib/storyblok-map";

const region = process.env.NEXT_PUBLIC_STORYBLOK_REGION || "eu";

/**
 * Server-side Storyblok init. Registers every blok component so
 * <StoryblokStory> / <StoryblokServerComponent> can resolve them, and returns
 * an accessor for the API client. Uses the preview token so it can read both
 * draft (Visual Editor) and published content.
 */
export const getStoryblok = storyblokInit({
  accessToken: process.env.STORYBLOK_PREVIEW_TOKEN,
  use: [apiPlugin],
  // `type: "none"` disables the in-memory response cache so published edits
  // appear without a server restart (pages are force-dynamic anyway).
  apiOptions: { region, cache: { clear: "auto", type: "none" } },
  components: storyblokComponents,
});

export const isStoryblokConfigured = () => {
  const token = process.env.STORYBLOK_PREVIEW_TOKEN;
  return Boolean(token && token !== "paste_storyblok_preview_token_here");
};

/** Resolve which content version to serve: draft inside the Visual Editor
    (`?_storyblok` param) or when Next draft mode is on, else published. */
export function resolveVersion(
  searchParams: Record<string, string | string[] | undefined> | undefined,
  draftEnabled: boolean,
): "draft" | "published" {
  return searchParams?._storyblok || draftEnabled ? "draft" : "published";
}

/**
 * Fetch a single story's `content` blok by slug, or null when Storyblok is
 * unconfigured or the fetch fails. Every page uses this and falls back to the
 * local content.ts object, so the site renders even if the CMS is unreachable.
 *
 * Memoised per request, so a route that needs the same story twice — the
 * product page reads it in generateMetadata and again while rendering — pays
 * for one round trip rather than two.
 */
export const getStoryContent = cache(async function getStoryContent(
  slug: string,
  version: "draft" | "published",
): Promise<Record<string, unknown> | null> {
  if (!isStoryblokConfigured()) return null;
  try {
    const client = getStoryblok();
    // `cv: Date.now()` busts the CDN cache-version so published edits go live
    // immediately (pages are force-dynamic, so freshness over edge caching).
    const { data } = await client.get(`cdn/stories/${slug}`, {
      version,
      cv: Date.now(),
    });
    return (data?.story?.content ?? null) as Record<string, unknown> | null;
  } catch (err) {
    console.error(`[storyblok] failed to load story "${slug}":`, err);
    return null;
  }
});

/**
 * Fetch a list of stories (e.g. every `article_page` for the Journal index).
 * Returns [] when Storyblok is unconfigured or the fetch fails.
 */
export async function getStories(
  params: Record<string, unknown>,
  version: "draft" | "published",
): Promise<Array<{ slug?: string; content?: Record<string, unknown> | null }>> {
  if (!isStoryblokConfigured()) return [];
  try {
    const client = getStoryblok();
    const { data } = await client.get("cdn/stories", {
      version,
      cv: Date.now(),
      ...params,
    });
    return (data?.stories ?? []) as Array<{
      slug?: string;
      content?: Record<string, unknown> | null;
    }>;
  } catch (err) {
    console.error("[storyblok] failed to load stories:", err);
    return [];
  }
}

/**
 * Resolve the site header configuration. Fetches the header from Storyblok's
 * `home` story so that header updates made in Storyblok (such as protocol
 * categories and compound links) reflect across all pages.
 * Falls back to the static siteHeader if Storyblok is not configured or unavailable.
 */
export async function resolveSiteHeader(
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>,
): Promise<SiteHeaderContent> {
  if (!isStoryblokConfigured()) return siteHeader;
  try {
    const { isEnabled } = await draftMode();
    const sp = searchParams ? await searchParams : undefined;
    const version = resolveVersion(sp, isEnabled);
    const homeContent = await getStoryContent("home", version);
    if (!homeContent) return siteHeader;
    const body = Array.isArray(homeContent.body)
      ? (homeContent.body as Record<string, unknown>[])
      : [];
    const hero = body.find((b) => b?.component === "hero");
    const headerBlok =
      (Array.isArray(hero?.header) && (hero.header[0] as Record<string, unknown>)) ||
      body.find((b) => b?.component === "site_header") ||
      null;
    return mapHeader(headerBlok, siteHeader);
  } catch (err) {
    console.error("[storyblok] failed to resolve site header:", err);
    return siteHeader;
  }
}

/**
  * Resolve the site footer configuration. Fetches the footer from Storyblok's
  * `site-footer` story (or falls back to the `home` story footer blok) so that
  * footer updates made in Storyblok reflect across all pages.
  * Falls back to the static siteFooter if Storyblok is not configured or unavailable.
  */
export async function resolveFooter(
  searchParams?:
    | Promise<Record<string, string | string[] | undefined>>
    | Record<string, string | string[] | undefined>,
): Promise<FooterContent> {
  if (!isStoryblokConfigured()) return siteFooter;
  try {
    const { isEnabled } = await draftMode();
    const sp = searchParams ? await searchParams : undefined;
    const version = resolveVersion(sp, isEnabled);

    // 1. Check for dedicated site-footer story first (if it exists)
    const footerStory = await getStoryContent("site-footer", version);
    if (footerStory) {
      const blok =
        footerStory.component === "footer"
          ? (footerStory as Record<string, unknown>)
          : Array.isArray(footerStory.body)
            ? (footerStory.body as Record<string, unknown>[]).find((b) => b?.component === "footer")
            : null;
      if (blok) return mapFooter(blok, siteFooter);
    }

    // 2. Fall back to the home story's footer blok
    const homeContent = await getStoryContent("home", version);
    if (homeContent) {
      const body = Array.isArray(homeContent.body)
        ? (homeContent.body as Record<string, unknown>[])
        : [];
      const footerBlok = body.find((b) => b?.component === "footer") || null;
      if (footerBlok) return mapFooter(footerBlok, siteFooter);
    }

    return siteFooter;
  } catch (err) {
    console.error("[storyblok] failed to resolve footer:", err);
    return siteFooter;
  }
}

