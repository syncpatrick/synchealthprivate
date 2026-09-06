import { categorySlug } from "@/lib/category-slug";

/** Mega-menu / mobile-menu link groups (Figma 190:2797 / 304:1096). */
export type NavGroup = {
  label: string;
  /** Only set on leaf rows; a group with children expands instead of linking. */
  href?: string;
  children?: { label: string; href: string }[];
  /**
   * Where "See more" points once `children` outgrows MENU_CATEGORY_LIMIT.
   * Carried in the data rather than derived from the label, so a group that is
   * not a protocol category (Learn) can never link into the formulary.
   */
  moreHref?: string;
};

/**
 * How many compounds a category lists before the menu stops and offers the
 * full set instead. Past this the panel gets tall enough to cover the page
 * behind it, and a menu is for finding your way, not for browsing a catalogue.
 */
export const MENU_CATEGORY_LIMIT = 3;

export const LEARN_LINKS = [
  { label: "Journal", href: "/journal" },
  { label: "About us", href: "/about" },
];

/**
 * The compounds under each protocol category. Both menus read this, so the
 * desktop mega-menu and the mobile drawer can't drift apart. Kept as literals
 * (rather than derived from `content.ts`) so the client bundle doesn't pull in
 * the whole content module for a nav menu. Each one gets a "See more" target
 * pointing at itself in the formulary.
 *
 * Ordered finished-copy first within each category: only the first
 * MENU_CATEGORY_LIMIT show, so the pages still awaiting copy sit behind
 * "See more" rather than leading the menu.
 */
export const PROTOCOL_CATEGORIES: NavGroup[] = [
  {
    label: "Recovery",
    children: [
      { label: "BPC-157", href: "/products/bpc-157" },
      { label: "DSIP", href: "/products/dsip" },
      { label: "REPAIR", href: "/products/repair" },
      { label: "TB-500", href: "/products/tb-500" },
      { label: "REBUILD", href: "/products/rebuild" },
    ],
  },
  {
    label: "Performance",
    children: [
      { label: "Sermorelin", href: "/products/sermorelin" },
      { label: "PERFORM", href: "/products/perform" },
    ],
  },
  {
    label: "Metabolic",
    children: [
      { label: "MOTS-C", href: "/products/mots-c" },
      { label: "DEFINE", href: "/products/define" },
      { label: "Tesamorelin", href: "/products/tesamorelin" },
    ],
  },
  {
    label: "Weight",
    children: [
      { label: "Compounded Semaglutide", href: "/products/semaglutide" },
      { label: "Compounded Tirzepatide", href: "/products/tirzepatide" },
    ],
  },
  {
    label: "Skin & Longevity",
    children: [
      { label: "NAD+", href: "/products/nad" },
      { label: "GHK-Cu", href: "/products/ghk-cu" },
      { label: "RESTORE", href: "/products/restore" },
    ],
  },
  {
    label: "Hormonal Health",
    children: [
      { label: "PT-141", href: "/products/pt-141" },
      { label: "Kisspeptin", href: "/products/kisspeptin" },
    ],
  },
  {
    label: "Cognitive",
    children: [
      { label: "Semax", href: "/products/semax" },
      { label: "Selank", href: "/products/selank" },
      { label: "SEMAX/SELANK", href: "/products/semax-selank" },
    ],
  },
].map((c) => ({ ...c, moreHref: `/start?category=${categorySlug(c.label)}` }));

/** Mobile menu rows: every category, plus Learn. */
export const MOBILE_MENU_LINKS = [
  ...PROTOCOL_CATEGORIES.map((c) => ({
    label: c.label,
    children: c.children ?? [],
    moreHref: c.moreHref,
  })),
  { label: "Learn", children: LEARN_LINKS, moreHref: undefined },
];

/** Copy for the promo card pinned to the bottom of the mobile menu. */
export const MOBILE_MENU_PROMO = {
  heading: "Stop guessing.\nStart your protocol.",
};

/** Resolve a top-level nav label to its mega-menu group, if any. */
export function menuForLabel(
  label: string,
  options?: {
    categories?: NavGroup[];
    eyebrow?: string;
  },
): {
  eyebrow: string;
  groups: NavGroup[];
} | null {
  if (label === "Protocols") {
    const groups = options?.categories?.length
      ? options.categories.map((c) => ({
          ...c,
          moreHref: c.moreHref || `/start?category=${categorySlug(c.label)}`,
        }))
      : PROTOCOL_CATEGORIES;
    return { eyebrow: options?.eyebrow || "Resources", groups };
  }
  if (label === "Learn") return { eyebrow: "Learn", groups: LEARN_LINKS };
  return null;
}
