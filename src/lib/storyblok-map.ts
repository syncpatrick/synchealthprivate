/**
 * Maps a fetched Storyblok blok (loosely-typed) onto the typed content objects
 * the page components consume. Each mapper takes the story `content` (or null)
 * plus the local content.ts object as a fallback, so a missing story or a
 * partially-filled one still renders. Field technical names in Storyblok match
 * the content.ts keys.
 */
import {
  PDP_WHY_ICONS,
  TRUST_ICON,
  testimonials as siteTestimonials,
  siteHeader,
  type SiteHeaderContent,
} from "@/lib/content";
import { isRichDoc, richToPlain, type RichTextValue } from "@/lib/richtext";
import { isQuizIcon } from "@/components/quiz/quiz-icons";
import type {
  QuizContent,
  QuizIntroContent,
  QuizNameContent,
  QuizInterstitialContent,
  QuizChoiceContent,
  QuizMultiContent,
  QuizEducationContent,
  QuizCaptureContent,
  QuizEmailContent,
  QuizRevealContent,
  QuizRevealProtocol,
  QuizRevealPairs,
  QuizRevealChip,
} from "@/lib/quiz-content";
import type {
  LegalContent,
  JournalContent,
  JournalArticle,
  ArticleContent,
  ArticleProseBlock,
  CheckoutContent,
  CheckoutPayRow,
  CartPageContent,
  CartContent,
  ProductContent,
  ProductPlan,
  TestimonialsContent,
} from "@/lib/content";

type Blok = Record<string, unknown>;

const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number => (Number(v) ? Number(v) : 0);
const bool = (v: unknown): boolean => v === true || v === "true";
export const arr = (v: unknown): Blok[] => (Array.isArray(v) ? (v as Blok[]) : []);
/**
 * Rich text field → the editor's document. Falls back to the plain string the
 * field held before it could be formatted, which is what a story still returns
 * until someone re-saves it.
 *
 * A field an editor never typed into still comes back as a document, just an
 * empty one, and an object is truthy. So every `rich(x) || fallback` in this
 * file silently stopped falling back the moment the field existed, which is how
 * a new article rendered an empty medical disclaimer. An empty document is
 * reported as empty so those fallbacks work again.
 */
export const rich = (v: unknown): RichTextValue =>
  isRichDoc(v) ? (richToPlain(v) ? v : "") : str(v);
/** Storyblok asset field → URL string; plain string path passes through. */
export const img = (v: unknown): string =>
  v && typeof v === "object" && "filename" in v
    ? str((v as { filename?: unknown }).filename)
    : str(v);
/**
 * Multi-asset field → URL list. Also reads the shape these fields had before
 * they became asset pickers: a bloks list of `text_item`, each holding a path.
 * Published content stays in the old shape until an editor republishes the
 * story, so both have to keep working side by side.
 */
export const imgList = (v: unknown): string[] =>
  arr(v)
    .map((a) => img(a) || str(a.text))
    .filter(Boolean);

/* -------------------------------------------------------------------------- */
/*  Testimonials                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Shared by the home page, where testimonials are one section of the page body,
 * and by product pages, where a product can carry its own set.
 */
export function mapTestimonials(
  blok: Blok | null,
  fallback: TestimonialsContent,
): TestimonialsContent {
  if (!blok) return fallback;
  const items = arr(blok.testimonials);
  return {
    eyebrow: str(blok.eyebrow) || fallback.eyebrow,
    heading: str(blok.heading) || fallback.heading,
    ratingLabel: str(blok.ratingLabel) || fallback.ratingLabel,
    testimonials: items.length
      ? items.map((t) => ({
          highlight: str(t.highlight) || undefined,
          quote: str(t.quote),
          name: str(t.name),
          tag: str(t.tag),
          image: img(t.image),
        }))
      : fallback.testimonials,
  };
}

/* -------------------------------------------------------------------------- */
/*  Legal pages (Terms, Privacy)                                               */
/* -------------------------------------------------------------------------- */

/**
 * The anchor a clause is linked by, from the contents list and from any URL
 * someone has shared.
 *
 * The Anchor field is optional and blank on every clause of a page an editor
 * has just created, which used to leave the whole contents list pointing at
 * "#" and every clause sharing the same empty id. So a blank one is derived
 * from the title instead, and a page works without the editor knowing the
 * field exists.
 *
 * A value they did type is kept as it stands apart from its whitespace, since
 * these ids are already published and a link that works today has to keep
 * working. Spaces are the exception: an id containing one can't be reached by
 * a fragment at all, and two clauses on the privacy policy have them.
 */
const anchorId = (set: unknown, from: string, fallback: string): string => {
  const typed = str(set).trim().replace(/\s+/g, "-");
  if (typed) return typed;
  const derived = from
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return derived || fallback;
};

const clauseId = (c: Blok, index: number): string =>
  anchorId(c.id, str(c.title), `clause-${index + 1}`);

export function mapLegal(
  content: Blok | null,
  fallback: LegalContent,
): LegalContent {
  if (!content) return fallback;
  const clauses = arr(content.clauses);
  return {
    eyebrow: str(content.eyebrow) || fallback.eyebrow,
    title: str(content.title) || fallback.title,
    lastUpdated: str(content.lastUpdated) || fallback.lastUpdated,
    intro: rich(content.intro) || fallback.intro,
    contentsLabel: str(content.contentsLabel) || fallback.contentsLabel,
    clauses: clauses.length
      ? clauses.map((c, i) => ({
          number: str(c.number),
          title: str(c.title),
          id: clauseId(c, i),
          body: rich(c.body),
        }))
      : fallback.clauses,
  };
}

/* -------------------------------------------------------------------------- */
/*  Journal index                                                             */
/* -------------------------------------------------------------------------- */

const mapArticleCard = (a: Blok): JournalArticle => ({
  category: str(a.category),
  title: str(a.title),
  excerpt: str(a.excerpt),
  meta: str(a.meta),
  image: img(a.image),
  href: str(a.href),
});

/** Map a published `article_page` story → a Journal index card, so newly
    created articles appear on /journal automatically. */
export function mapArticleStoryCard(story: {
  slug?: string;
  content?: Blok | null;
}): JournalArticle {
  const c = (story.content ?? {}) as Blok;
  const slug = str(story.slug).replace(/^article-/, "");
  return {
    category: str(c.category),
    title: str(c.title),
    excerpt: str(c.dek),
    meta: str(c.metaLine) || str(c.publishedValue),
    image: img(c.cover) || "/images/journal/featured.png",
    href: `/journal/${slug}`,
  };
}

/** Hero image of each published article, keyed by the journal URL that points
    at it. Lets an index card take its thumbnail straight from the article, so
    publishing a blog is the only step and nobody has to upload a second copy
    onto the journal story. Articles with no cover are left out of the map, so
    those cards keep whatever image they were given. */
export function articleCoversByHref(
  stories: { slug?: string; content?: Blok | null }[],
): Map<string, string> {
  const covers = new Map<string, string>();
  for (const story of stories) {
    const cover = img(((story.content ?? {}) as Blok).cover);
    if (!cover) continue;
    covers.set(`/journal/${str(story.slug).replace(/^article-/, "")}`, cover);
  }
  return covers;
}

/** The picture the journal index actually shows for a given article URL.

    Takes mapped content rather than the raw story, so it sees the image after
    fallbacks have been applied. Reading the raw blok missed the common case
    where a card has no image of its own and the index is displaying the
    built-in one, which left the hero and the thumbnail disagreeing. */
export function journalCardImage(content: JournalContent, href: string): string {
  if (content.featured.href === href) return content.featured.image;
  return content.articles.find((card) => card.href === href)?.image ?? "";
}

export function mapJournal(
  content: Blok | null,
  fallback: JournalContent,
): JournalContent {
  if (!content) return fallback;
  const tabs = arr(content.tabs);
  const featured = arr(content.featured)[0];
  const articles = arr(content.articles);
  const nl = arr(content.newsletter)[0];
  return {
    eyebrow: str(content.eyebrow) || fallback.eyebrow,
    heading: str(content.heading) || fallback.heading,
    subtext: str(content.subtext) || fallback.subtext,
    tabs: tabs.length ? tabs.map((t) => str(t.text)) : fallback.tabs,
    featured: featured
      ? {
          eyebrow: str(featured.eyebrow),
          title: str(featured.title),
          excerpt: str(featured.excerpt),
          meta: str(featured.meta),
          image: img(featured.image) || fallback.featured.image,
          href: str(featured.href),
          readMoreLabel: str(featured.readMoreLabel),
        }
      : fallback.featured,
    articles: articles.length
      ? articles.map(mapArticleCard)
      : fallback.articles,
    loadMoreLabel: str(content.loadMoreLabel) || fallback.loadMoreLabel,
    newsletter: nl
      ? {
          eyebrow: str(nl.eyebrow),
          heading: str(nl.heading),
          subtext: str(nl.subtext),
          placeholder: str(nl.placeholder),
          ctaLabel: str(nl.ctaLabel),
        }
      : fallback.newsletter,
  };
}

/* -------------------------------------------------------------------------- */
/*  Article detail                                                            */
/* -------------------------------------------------------------------------- */

function mapProse(b: Blok, index: number): ArticleProseBlock {
  const text = rich(b.text);
  // A block with a picture in it is a picture. The type dropdown used to
  // decide on its own and defaulted to something else, so an image uploaded
  // into a block nobody re-typed rendered as an empty paragraph and simply
  // did not appear.
  const kind = img(b.image) && !richToPlain(text) ? "image" : str(b.type);
  switch (kind) {
    case "lead":
      return { type: "lead", text };
    case "h2": {
      // The anchor is derived from the heading unless one was typed, so the
      // contents list works without anyone filling in a second field.
      const heading = richToPlain(text);
      return { type: "h2", text: heading, id: anchorId(b.id, heading, `section-${index + 1}`) };
    }
    case "quote":
      return { type: "quote", text };
    case "image":
      return {
        type: "image",
        image: img(b.image),
        ...(str(b.caption) ? { caption: str(b.caption) } : {}),
      };
    default:
      return { type: "p", text };
  }
}

/** Rough reading time from the words actually on the page. 200 wpm is the
    usual figure for this kind of writing. */
function readingTime(blocks: ArticleProseBlock[]): string {
  const words = blocks
    .map((b) => ("text" in b ? richToPlain(b.text) : ""))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return words ? `${Math.max(1, Math.round(words / 200))} min` : "";
}

export function mapArticle(
  content: Blok | null,
  fallback: ArticleContent,
): ArticleContent {
  if (!content) return fallback;
  const toc = arr(content.toc);
  const prose = arr(content.prose);
  const related = arr(content.relatedArticles);

  // The body is a list of sections, each a heading and the blocks under it.
  // The heading is what the contents list on the right shows, so there is one
  // place to write it rather than a heading block and a matching entry in a
  // separate list. `prose` is the older flat list, kept working for stories
  // written before sections existed.
  //
  // Everything below is derived from the body when the matching field is left
  // empty, so writing a blog is the body plus a handful of facts about it
  // rather than filling in twenty-five boxes.
  const sections = arr(content.sections);
  const blocks = sections.length
    ? sections.flatMap((sec, i) => {
        const heading = str(sec.heading);
        return [
          ...(heading
            ? [
                {
                  type: "h2" as const,
                  text: heading,
                  id: anchorId(sec.id, heading, `section-${i + 1}`),
                },
              ]
            : []),
          ...arr(sec.blocks).map(mapProse),
        ];
      })
    : prose.length
      ? prose.map(mapProse)
      : fallback.prose;
  const headings = blocks.filter(
    (b): b is Extract<ArticleProseBlock, { type: "h2" }> => b.type === "h2",
  );
  const readTimeValue =
    str(content.readTimeValue) || readingTime(blocks) || fallback.readTime.value;
  const publishedValue =
    str(content.publishedValue) || fallback.published.value;
  const metaLine =
    str(content.metaLine) ||
    [readTimeValue && `${readTimeValue} read`, publishedValue]
      .filter(Boolean)
      .join(" · ") ||
    fallback.metaLine;

  return {
    journalLabel: str(content.journalLabel) || fallback.journalLabel,
    category: str(content.category) || fallback.category,
    title: str(content.title) || fallback.title,
    dek: str(content.dek) || fallback.dek,
    author: {
      label: str(content.authorLabel) || fallback.author.label,
      name: str(content.authorName) || fallback.author.name,
      avatar: img(content.authorAvatar) || fallback.author.avatar,
    },
    published: {
      label: str(content.publishedLabel) || fallback.published.label,
      value: publishedValue,
    },
    readTime: {
      label: str(content.readTimeLabel) || fallback.readTime.label,
      value: readTimeValue,
    },
    metaLine,
    cover: img(content.cover) || fallback.cover,
    tocLabel: str(content.tocLabel) || fallback.tocLabel,
    // The contents list is the headings in the body. Keeping it as a second
    // list to fill in by hand meant two places to edit and ids that had to
    // match exactly or the links silently stopped jumping.
    toc: toc.length
      ? toc.map((t) => ({ label: str(t.label), id: str(t.id) }))
      : headings.length
        ? headings.map((h) => ({ label: h.text, id: h.id }))
        : fallback.toc,
    prose: blocks,
    disclaimer: {
      label: str(content.disclaimerLabel) || fallback.disclaimer.label,
      text: rich(content.disclaimerText) || fallback.disclaimer.text,
    },
    reviewer: {
      label: str(content.reviewerLabel) || fallback.reviewer.label,
      name: str(content.reviewerName) || fallback.reviewer.name,
      note: rich(content.reviewerNote) || fallback.reviewer.note,
      avatar: img(content.reviewerAvatar) || fallback.reviewer.avatar,
    },
    related: {
      eyebrow: str(content.relatedEyebrow) || fallback.related.eyebrow,
      heading: str(content.relatedHeading) || fallback.related.heading,
      articles: related.length
        ? related.map(mapArticleCard)
        : fallback.related.articles,
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Checkout                                                                   */
/* -------------------------------------------------------------------------- */

export function mapCheckout(
  content: Blok | null,
  fb: CheckoutContent,
): CheckoutContent {
  if (!content) return fb;
  const g = (name: string): Blok | undefined => arr(content[name])[0];
  const contact = g("contact");
  const delivery = g("delivery");
  const shipping = g("shipping");
  const consent = g("consent");
  const payment = g("payment");
  const summary = g("summary");
  const footerLinks = arr(content.footerLinks);

  return {
    expressLabel: str(content.expressLabel) || fb.expressLabel,
    orLabel: str(content.orLabel) || fb.orLabel,
    contact: contact
      ? {
          title: str(contact.title),
          signInLabel: str(contact.signInLabel),
          signInHref: str(contact.signInHref),
          emailPlaceholder: str(contact.emailPlaceholder),
          optInLabel: str(contact.optInLabel),
        }
      : fb.contact,
    delivery: delivery
      ? {
          title: str(delivery.title),
          countryLabel: str(delivery.countryLabel),
          countryValue: str(delivery.countryValue),
          firstName: str(delivery.firstName),
          lastName: str(delivery.lastName),
          company: str(delivery.company),
          address: str(delivery.address),
          address2: str(delivery.address2),
          zip: str(delivery.zip),
          city: str(delivery.city),
          phone: str(delivery.phone),
        }
      : fb.delivery,
    shipping: shipping
      ? { title: str(shipping.title), empty: str(shipping.empty) }
      : fb.shipping,
    consent: consent
      ? {
          title: str(consent.title),
          subtitle: str(consent.subtitle),
          items: arr(consent.items).length
            ? arr(consent.items).map((i) => ({
                title: str(i.title),
                body: rich(i.body),
              }))
            : fb.consent.items,
        }
      : fb.consent,
    payment: payment
      ? {
          title: str(payment.title),
          subtitle: str(payment.subtitle),
          cardLabel: str(payment.cardLabel),
          logos: arr(payment.logos).length
            ? arr(payment.logos).map((l) => ({
                src: img(l.src),
                alt: str(l.alt),
              }))
            : fb.payment.logos,
          logosMore: str(payment.logosMore),
          cardNumber: str(payment.cardNumber),
          expiry: str(payment.expiry),
          cvc: str(payment.cvc),
          nameOnCard: str(payment.nameOnCard),
          billingSame: str(payment.billingSame),
          altRows: arr(payment.altRows).length
            ? arr(payment.altRows).map((r): CheckoutPayRow => ({
                id: str(r.id),
                label: str(r.label),
                logo: str(r.logo) || undefined,
                logoW: str(r.logoW) ? num(r.logoW) : undefined,
                boxed: bool(r.boxed) || undefined,
              }))
            : fb.payment.altRows,
          saveTitle: str(payment.saveTitle),
          saveBody: str(payment.saveBody),
          saveDismiss: str(payment.saveDismiss),
        }
      : fb.payment,
    discountPlaceholder:
      str(content.discountPlaceholder) || fb.discountPlaceholder,
    applyLabel: str(content.applyLabel) || fb.applyLabel,
    summary: summary
      ? {
          barLabel: str(summary.barLabel),
          subscriptionLabel: str(summary.subscriptionLabel),
          subtotalLabel: str(summary.subtotalLabel),
          reviewLabel: str(summary.reviewLabel),
          reviewValue: str(summary.reviewValue),
          shippingLabel: str(summary.shippingLabel),
          shippingValue: str(summary.shippingValue),
          totalLabel: str(summary.totalLabel),
          totalNote: str(summary.totalNote),
          taxNote: str(summary.taxNote),
        }
      : fb.summary,
    payNow: str(content.payNow) || fb.payNow,
    payDisclaimer: rich(content.payDisclaimer) || fb.payDisclaimer,
    footerLinks: footerLinks.length
      ? footerLinks.map((l) => ({ label: str(l.label), href: str(l.href) }))
      : fb.footerLinks,
  };
}

/* -------------------------------------------------------------------------- */
/*  Cart (page + drawer)                                                       */
/* -------------------------------------------------------------------------- */

export function mapCartPage(
  content: Blok | null,
  fb: CartPageContent,
): CartPageContent {
  if (!content) return fb;
  const s = (k: keyof CartPageContent) => str(content[k]) || fb[k];
  return {
    eyebrow: s("eyebrow"),
    heading: s("heading"),
    subtext: s("subtext"),
    summaryTitle: s("summaryTitle"),
    subtotalLabel: s("subtotalLabel"),
    shippingLabel: s("shippingLabel"),
    shippingValue: s("shippingValue"),
    taxLabel: s("taxLabel"),
    taxValue: s("taxValue"),
    dueLabel: s("dueLabel"),
    checkoutLabel: s("checkoutLabel"),
    trustLine: s("trustLine"),
    emptyLabel: s("emptyLabel"),
    emptyCtaLabel: s("emptyCtaLabel"),
    emptyCtaHref: s("emptyCtaHref"),
    stackedEyebrow: s("stackedEyebrow"),
    stackedHeading: s("stackedHeading"),
  };
}

export function mapCartDrawer(
  content: Blok | null,
  fb: CartContent,
): CartContent {
  if (!content) return fb;
  const upsells = arr(content.upsells);
  const logos = arr(content.paymentLogos);
  return {
    title: str(content.title) || fb.title,
    emptyLabel: str(content.emptyLabel) || fb.emptyLabel,
    upsellTitle: str(content.upsellTitle) || fb.upsellTitle,
    pairedTitle: str(content.pairedTitle) || fb.pairedTitle,
    upsells: upsells.length
      ? upsells.map((u) => ({
          category: str(u.category),
          name: str(u.name),
          description: str(u.description),
          image: img(u.image),
          price: str(u.price),
          href: str(u.href),
        }))
      : fb.upsells,
    subscriptionLabel: str(content.subscriptionLabel) || fb.subscriptionLabel,
    removeLabel: str(content.removeLabel) || fb.removeLabel,
    switchPlanLabel: str(content.switchPlanLabel) || fb.switchPlanLabel,
    shippingLabel: str(content.shippingLabel) || fb.shippingLabel,
    shippingValue: str(content.shippingValue) || fb.shippingValue,
    paymentLabel: str(content.paymentLabel) || fb.paymentLabel,
    paymentLogos: logos.length
      ? logos.map((l) => ({ src: img(l.src), alt: str(l.alt) }))
      : fb.paymentLogos,
    paymentMore: str(content.paymentMore) || fb.paymentMore,
    goodieLabel: str(content.goodieLabel) || fb.goodieLabel,
    goodieHighlight: str(content.goodieHighlight) || fb.goodieHighlight,
    goodieText: str(content.goodieText) || fb.goodieText,
    subtotalLabel: str(content.subtotalLabel) || fb.subtotalLabel,
    viewCartLabel: str(content.viewCartLabel) || fb.viewCartLabel,
    checkoutLabel: str(content.checkoutLabel) || fb.checkoutLabel,
    noteLabel: str(content.noteLabel) || fb.noteLabel,
    note: str(content.note) || fb.note,
  };
}

/* -------------------------------------------------------------------------- */
/*  Product                                                                    */
/* -------------------------------------------------------------------------- */

export function mapProduct(
  content: Blok | null,
  fb: ProductContent,
): ProductContent {
  if (!content) return fb;
  const q = arr(content.qualityTest)[0];
  const h = arr(content.howItWorks)[0];
  const plans = arr(content.plans);
  const trust = arr(content.trust);
  const methods = arr(content.methods);
  const accordion = arr(content.accordion);
  const whyFeatures = arr(content.whyFeatures);
  const ownTestimonials = arr(content.testimonials)[0];
  const thumbs = imgList(content.galleryThumbnails);
  const collage = imgList(q?.collage);
  const fq = arr(content.faq)[0];

  return {
    slug: str(content.slug) || fb.slug,
    // Only set when this product carries its own reviews. Left absent the page
    // falls back to the site-wide set, so 20 products don't each need filling
    // in before any of them show anything.
    ...(ownTestimonials
      ? { testimonials: mapTestimonials(ownTestimonials, siteTestimonials) }
      : {}),
    eyebrow: str(content.eyebrow) || fb.eyebrow,
    name: str(content.name) || fb.name,
    description: rich(content.description) || fb.description,
    tagline: str(content.tagline) || fb.tagline,
    gallery: {
      main: img(content.galleryMain) || fb.gallery.main,
      thumbnails: thumbs.length ? thumbs : fb.gallery.thumbnails,
    },
    // A trust line added in the CMS with no icon still gets the tick, rather
    // than an empty box where the icon should be.
    trust: trust.length
      ? trust.map((t) => ({
          icon: img(t.icon) || TRUST_ICON,
          label: str(t.label),
        }))
      : fb.trust,
    methodLabel: str(content.methodLabel) || fb.methodLabel,
    methods: methods.length
      ? methods.map((m) => ({ image: img(m.image), alt: str(m.alt) }))
      : fb.methods,
    price: {
      amount: str(content.priceAmount) || fb.price.amount,
      period: str(content.pricePeriod) || fb.price.period,
    },
    planLabel: str(content.planLabel) || fb.planLabel,
    plans: plans.length
      ? plans.map((p): ProductPlan => {
          const badgeText = str(p.badgeText);
          const badgeVariant = str(p.badgeVariant);
          const save = str(p.save);
          return {
            label: str(p.label),
            price: str(p.price),
            period: str(p.period),
            ...(badgeText
              ? {
                  badge: {
                    text: badgeText,
                    variant: badgeVariant === "best" ? "best" : "recommended",
                  },
                }
              : {}),
            ...(save ? { save } : {}),
          };
        })
      : fb.plans,
    cta: {
      label: str(content.ctaLabel) || fb.cta.label,
      href: str(content.ctaHref) || fb.cta.href,
      note: str(content.ctaNote) || fb.cta.note,
      // Left undefined when unset so the component keeps its default classes
      // rather than painting an empty string over them.
      color: str(content.ctaColor) || fb.cta.color,
      textColor: str(content.ctaTextColor) || fb.cta.textColor,
    },
    accordion: accordion.length
      ? accordion.map((a) => ({
          title: str(a.title),
          ...(rich(a.body) ? { body: rich(a.body) } : {}),
        }))
      : fb.accordion,
    safetyLabel: str(content.safetyLabel) || fb.safetyLabel,
    safetyHref: str(content.safetyHref) || fb.safetyHref,
    why: {
      // Falls back to "Why <compound>" so a product written from scratch reads
      // correctly without anyone typing the name a second time. An explicit
      // heading still wins, which is what a duplicated story carries.
      heading:
        str(content.whyHeading) ||
        fb.why.heading ||
        (str(content.name) ? `Why ${str(content.name)}` : ""),
      features: whyFeatures.length
        ? whyFeatures.map((f, i) => ({
            // Same idea as the trust row: cycle the house icons when the
            // editor has not picked one, which is what the compounds written
            // in this file do anyway.
            icon:
              img(f.icon) || PDP_WHY_ICONS[i % PDP_WHY_ICONS.length] || "",
            title: str(f.title),
            description: str(f.description),
          }))
        : fb.why.features,
    },
    qualityTest: q
      ? {
          heading: str(q.heading),
          collage: collage.length ? collage : fb.qualityTest.collage,
          lead: str(q.lead),
          body: str(q.body),
          tests: arr(q.tests).length
            ? arr(q.tests).map((t) => ({
                name: str(t.name),
                status: str(t.status),
                description: str(t.description),
              }))
            : fb.qualityTest.tests,
        }
      : fb.qualityTest,
    howItWorks: h
      ? {
          eyebrow: str(h.eyebrow),
          heading: str(h.heading),
          subtext: str(h.subtext),
          cardImage: img(h.cardImage),
          steps: arr(h.steps).length
            ? arr(h.steps).map((s) => ({
                number: str(s.number),
                title: str(s.title),
                description: str(s.description),
                image: img(s.image),
              }))
            : fb.howItWorks.steps,
          ctaLabel: str(h.ctaLabel),
          ctaHref: str(h.ctaHref),
        }
      : fb.howItWorks,
    faq: fq
      ? {
          eyebrow: str(fq.eyebrow) || fb.faq.eyebrow,
          heading: str(fq.heading) || fb.faq.heading,
          subtext: str(fq.subtext) || fb.faq.subtext,
          ctaLabel: str(fq.ctaLabel) || fb.faq.ctaLabel,
          ctaHref: str(fq.ctaHref) || fb.faq.ctaHref,
          items: arr(fq.items).length
            ? arr(fq.items).map((i) => ({
                question: str(i.question),
                answer: rich(i.answer),
              }))
            : fb.faq.items,
        }
      : fb.faq,
  };
}

/**
 * Quiz — the opening screen.
 *
 * Paragraphs are a `text_item` list rather than one textarea because the gap
 * between them is the design's, not whatever the editor happened to type. An
 * empty list falls back whole: two paragraphs where one was deleted by
 * accident would leave the screen looking unfinished rather than edited.
 */
function mapQuizIntro(
  content: Blok | null,
  fb: QuizIntroContent,
): QuizIntroContent {
  if (!content) return fb;
  const paragraphs = arr(content.paragraphs)
    .map((p) => str(p.text))
    .filter(Boolean);
  return {
    heading: str(content.heading) || fb.heading,
    paragraphs: paragraphs.length ? paragraphs : fb.paragraphs,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
    footnote: str(content.footnote) || fb.footnote,
  };
}

function mapQuizName(content: Blok | null, fb: QuizNameContent): QuizNameContent {
  if (!content) return fb;
  return {
    progressLabel: str(content.progressLabel) || fb.progressLabel,
    heading: str(content.heading) || fb.heading,
    fieldLabel: str(content.fieldLabel) || fb.fieldLabel,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
  };
}

function mapQuizInterstitial(
  content: Blok | null,
  fb: QuizInterstitialContent,
): QuizInterstitialContent {
  if (!content) return fb;
  return {
    heading: str(content.heading) || fb.heading,
    body: str(content.body) || fb.body,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
  };
}

/**
 * A pick-one step. The options fall back whole rather than per item: a list
 * half-filled by an editor would render a question you cannot answer.
 */
function mapQuizChoice(
  content: Blok | null,
  fb: QuizChoiceContent,
): QuizChoiceContent {
  if (!content) return fb;
  const options = arr(content.options)
    .map((o) => {
      const icon = str(o.icon);
      return {
        value: str(o.value),
        label: str(o.label),
        description: str(o.description) || undefined,
        icon: isQuizIcon(icon) ? icon : undefined,
      };
    })
    .filter((o) => o.value && o.label);
  return {
    progressLabel: str(content.progressLabel) || fb.progressLabel,
    heading: str(content.heading) || fb.heading,
    subheading: str(content.subheading) || fb.subheading,
    recognition: (() => {
      const r = arr(content.recognition)[0];
      if (!r) return fb.recognition;
      return {
        eyebrow: str(r.eyebrow) || fb.recognition?.eyebrow || "",
        body: str(r.body) || fb.recognition?.body || "",
        // The rule that decides whether it shows is design, not copy, so it
        // stays in code rather than becoming a field an editor can break.
        when: fb.recognition?.when,
      };
    })(),
    options: options.length ? options : fb.options,
    helper: str(content.helper) || fb.helper,
    // Presentation, not copy: it stays with the design rather than becoming a
    // switch an editor can flip by accident.
    dense: fb.dense,
    headingSize: fb.headingSize,
  };
}

/** A pick-many step: the same options, plus the count line and the button. */
function mapQuizMulti(
  content: Blok | null,
  fb: QuizMultiContent,
): QuizMultiContent {
  if (!content) return fb;
  const base = mapQuizChoice(content, { ...fb, helper: "" });
  return {
    progressLabel: base.progressLabel,
    heading: base.heading,
    subheading: base.subheading,
    options: base.options,
    countLabel: str(content.countLabel) || fb.countLabel,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
    recognition: base.recognition ?? fb.recognition,
    dense: fb.dense,
    headingSize: fb.headingSize,
  };
}

function mapQuizEducation(
  content: Blok | null,
  fb: QuizEducationContent,
): QuizEducationContent {
  if (!content) return fb;
  return {
    pillLabel: str(content.pillLabel) || fb.pillLabel,
    eyebrow: str(content.eyebrow) || fb.eyebrow,
    heading: str(content.heading) || fb.heading,
    lead: str(content.lead) || fb.lead,
    body: str(content.body) || fb.body,
    footnote: str(content.footnote) || fb.footnote,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
  };
}

function mapQuizCapture(
  content: Blok | null,
  fb: QuizCaptureContent,
): QuizCaptureContent {
  if (!content) return fb;
  return {
    progressLabel: str(content.progressLabel) || fb.progressLabel,
    heading: str(content.heading) || fb.heading,
    subheading: str(content.subheading) || fb.subheading,
    placeholder: str(content.placeholder) || fb.placeholder,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
  };
}

function mapQuizEmail(
  content: Blok | null,
  fb: QuizEmailContent,
): QuizEmailContent {
  if (!content) return fb;
  return {
    progressLabel: str(content.progressLabel) || fb.progressLabel,
    heading: str(content.heading) || fb.heading,
    subheading: str(content.subheading) || fb.subheading,
    fieldLabel: str(content.fieldLabel) || fb.fieldLabel,
    placeholder: str(content.placeholder) || fb.placeholder,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
    privacyNote: str(content.privacyNote) || fb.privacyNote,
  };
}

function mapQuizRevealProtocol(
  content: Blok | null,
  fb: QuizRevealProtocol,
): QuizRevealProtocol {
  if (!content) return fb;
  const chips = arr(content.chips);
  return {
    kicker: str(content.kicker) || fb.kicker,
    name: str(content.name) || fb.name,
    subtitle: str(content.subtitle) || fb.subtitle,
    // An icon names a shape in quiz-reveal-icons; the fallback keeps the
    // pairing when the CMS supplies labels but no icon.
    chips: chips.length
      ? chips.map((chip, i): QuizRevealChip => ({
          icon: fb.chips[i]?.icon ?? fb.chips[0].icon,
          label: str(chip.label) || fb.chips[i]?.label || "",
        }))
      : fb.chips,
    body: str(content.body) || fb.body,
    priceLabel: str(content.priceLabel) || fb.priceLabel,
    price: str(content.price) || fb.price,
    cadence: str(content.cadence) || fb.cadence,
  };
}

function mapQuizRevealPairs(
  content: Blok | null,
  fb: QuizRevealPairs,
): QuizRevealPairs {
  if (!content) return fb;
  return {
    kicker: str(content.kicker) || fb.kicker,
    name: str(content.name) || fb.name,
    price: str(content.price) || fb.price,
    body: str(content.body) || fb.body,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
  };
}

/**
 * One engine shape.
 *
 * Whether a shape has a supporting protocol or a pairs-well-with card is not
 * a CMS decision — it is what makes it that shape — so those sections come
 * from the fallback and only their copy is editable.
 */
function mapQuizReveal(
  content: Blok | null,
  fb: QuizRevealContent,
): QuizRevealContent {
  if (!content) return fb;
  return {
    eyebrow: str(content.eyebrow) || fb.eyebrow,
    heading: str(content.heading) || fb.heading,
    body: str(content.body) || fb.body,
    baseLabel: str(content.baseLabel) || fb.baseLabel,
    base: mapQuizRevealProtocol(arr(content.base)[0] ?? null, fb.base),
    supportingLabel: str(content.supportingLabel) || fb.supportingLabel,
    supporting: fb.supporting
      ? mapQuizRevealProtocol(arr(content.supporting)[0] ?? null, fb.supporting)
      : undefined,
    removeSupportingLabel:
      str(content.removeSupportingLabel) || fb.removeSupportingLabel,
    pairs: fb.pairs
      ? mapQuizRevealPairs(arr(content.pairs)[0] ?? null, fb.pairs)
      : undefined,
    planHeading: str(content.planHeading) || fb.planHeading,
    plan: {
      name: str(content.planName) || fb.plan.name,
      price: str(content.planPrice) || fb.plan.price,
      cadence: str(content.planCadence) || fb.plan.cadence,
    },
    lockedLine: str(content.lockedLine) || fb.lockedLine,
    dayNinety: str(content.dayNinety) || fb.dayNinety,
    swapLabel: str(content.swapLabel) || fb.swapLabel,
    startOverLabel: str(content.startOverLabel) || fb.startOverLabel,
    disclaimer: str(content.disclaimer) || fb.disclaimer,
    ctaLabel: str(content.ctaLabel) || fb.ctaLabel,
    condensedKicker: str(content.condensedKicker) || fb.condensedKicker,
    condensedTitle: str(content.condensedTitle) || fb.condensedTitle,
    closeLabel: str(content.closeLabel) || fb.closeLabel,
  };
}

/**
 * The whole quiz. One story holds every step, because the flow renders from a
 * single fetch — see QuizFlow for why it is not a route per step.
 */
export function mapQuiz(content: Blok | null, fb: QuizContent): QuizContent {
  if (!content) return fb;
  return {
    totalSteps: num(content.totalSteps) || fb.totalSteps,
    intro: mapQuizIntro(arr(content.intro)[0] ?? content, fb.intro),
    name: mapQuizName(arr(content.name)[0] ?? null, fb.name),
    interstitial: mapQuizInterstitial(
      arr(content.interstitial)[0] ?? null,
      fb.interstitial,
    ),
    sex: mapQuizChoice(arr(content.sex)[0] ?? null, fb.sex),
    goal: mapQuizChoice(arr(content.goal)[0] ?? null, fb.goal),
    depth: mapQuizChoice(arr(content.depth)[0] ?? null, fb.depth),
    secondary: mapQuizMulti(arr(content.secondary)[0] ?? null, fb.secondary),
    branchDiscriminator: mapQuizMulti(
      arr(content.branchDiscriminator)[0] ?? null,
      fb.branchDiscriminator,
    ),
    branchQualifier: mapQuizChoice(
      arr(content.branchQualifier)[0] ?? null,
      fb.branchQualifier,
    ),
    branchEducation: mapQuizEducation(
      arr(content.branchEducation)[0] ?? null,
      fb.branchEducation,
    ),
    sleep: mapQuizChoice(arr(content.sleep)[0] ?? null, fb.sleep),
    stress: mapQuizChoice(arr(content.stress)[0] ?? null, fb.stress),
    capture: mapQuizCapture(arr(content.capture)[0] ?? null, fb.capture),
    email: mapQuizEmail(arr(content.email)[0] ?? null, fb.email),
    reveal: {
      shape1: mapQuizReveal(arr(content.revealShape1)[0] ?? null, fb.reveal.shape1),
      shape2: mapQuizReveal(arr(content.revealShape2)[0] ?? null, fb.reveal.shape2),
      shape3: mapQuizReveal(arr(content.revealShape3)[0] ?? null, fb.reveal.shape3),
    },
  };
}

export function mapHeader(
  blok?: Blok | null,
  fallback: SiteHeaderContent = siteHeader,
): SiteHeaderContent {
  if (!blok) return fallback;
  const rawCats = arr(blok.protocolCategories);
  const ticker = arr(blok.tickerMessages);
  const navLinks = arr(blok.navLinks);
  return {
    tickerMessages: ticker.length ? ticker.map((t) => str(t.text)) : fallback.tickerMessages,
    navLinks: navLinks.length
      ? navLinks.map((l) => ({
          label: str(l.label),
          href: str(l.href),
          hasDropdown: bool(l.hasDropdown),
        }))
      : fallback.navLinks,
    resourcesEyebrow: str(blok.resourcesEyebrow) || fallback.resourcesEyebrow,
    protocolCategories: rawCats.length
      ? rawCats.map((cat) => ({
          label: str(cat.label),
          moreHref: str(cat.moreHref) || undefined,
          children: arr(cat.children).map((c) => ({
            label: str(c.label),
            href: str(c.href),
          })),
        }))
      : fallback.protocolCategories,
    loginLabel: str(blok.loginLabel) || fallback.loginLabel,
    loginHref: str(blok.loginHref) || fallback.loginHref,
    ctaLabel: str(blok.ctaLabel) || fallback.ctaLabel,
    ctaHref: str(blok.ctaHref) || fallback.ctaHref,
  };
}
