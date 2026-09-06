/**
 * One-shot Storyblok provisioner for the Sync. site.
 *
 *   node scripts/storyblok-provision.mjs
 *
 * Requires (read from .env.local or the environment):
 *   STORYBLOK_OAUTH_TOKEN         personal access token (Management API)
 *   STORYBLOK_SPACE_ID            numeric space id
 *   NEXT_PUBLIC_STORYBLOK_REGION  eu | us | ap | ca | cn   (default: eu)
 *
 * Idempotent: re-running updates existing components and the Home story
 * rather than duplicating them.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import StoryblokClient from "storyblok-js-client";
import { components } from "./storyblok-schema.mjs";
import { seed } from "./storyblok-seed.mjs";
// Imported straight from the app's content model (Node strip-types) so seeded
// CMS content always mirrors content.ts — no duplication.
import {
  termsOfService,
  privacyPolicy,
  journal,
  article,
  checkout,
  cartPage,
  cart,
  allProducts,
  defaultProtocolCategories,
} from "../src/lib/content.ts";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");

/* --------------------------- env ---------------------------------------- */
function loadEnv() {
  for (const file of [".env", ".env.local"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  }
}
loadEnv();

const OAUTH =
  process.env.STORYBLOK_OAUTH_TOKEN ||
  process.env.STORYBLOK_PERSONAL_ACCESS_TOKEN;
const SPACE_ID = process.env.STORYBLOK_SPACE_ID;
const REGION = process.env.NEXT_PUBLIC_STORYBLOK_REGION || "eu";

if (!OAUTH || !SPACE_ID) {
  console.error(
    "\n✖ Missing credentials. Set the following in .env.local (or the env):\n" +
      "  STORYBLOK_OAUTH_TOKEN=<personal access token>\n" +
      "  STORYBLOK_SPACE_ID=<numeric space id>\n" +
      "  NEXT_PUBLIC_STORYBLOK_REGION=eu\n\n" +
      "Get the token at: https://app.storyblok.com/#/me/account?tab=token\n" +
      "Find the space id in: Space Settings → General.\n",
  );
  process.exit(1);
}

const Storyblok = new StoryblokClient({ oauthToken: OAUTH, region: REGION });
const base = `spaces/${SPACE_ID}`;

/* --------------------------- helpers ------------------------------------ */
const uid = () => crypto.randomUUID();
const blk = (component, fields) => ({ _uid: uid(), component, ...fields });
const mime = (f) =>
  f.endsWith(".svg")
    ? "image/svg+xml"
    : /\.jpe?g$/.test(f)
      ? "image/jpeg"
      : f.endsWith(".png")
        ? "image/png"
        : "application/octet-stream";

/* --------------------------- components --------------------------------- */
async function syncComponents() {
  const existing = (await Storyblok.get(`${base}/components`, { per_page: 100 }))
    .data.components;
  const byName = new Map(existing.map((c) => [c.name, c.id]));
  let created = 0;
  let updated = 0;
  for (const c of components) {
    if (byName.has(c.name)) {
      const id = byName.get(c.name);
      await Storyblok.put(`${base}/components/${id}`, {
        component: { ...c, id },
      });
      updated++;
    } else {
      await Storyblok.post(`${base}/components`, { component: c });
      created++;
    }
    process.stdout.write(`  · ${c.name}\n`);
  }
  console.log(`✔ Components synced (${created} created, ${updated} updated)\n`);
}

/* --------------------------- assets ------------------------------------- */
const assetCache = new Map();

async function uploadAsset(localPath) {
  if (assetCache.has(localPath)) return assetCache.get(localPath);
  const abs = path.join(PUBLIC_DIR, localPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) throw new Error(`Missing image file: ${abs}`);
  const buf = fs.readFileSync(abs);
  const filename = path.basename(localPath);

  const sign = (await Storyblok.post(`${base}/assets`, { filename })).data;

  const form = new FormData();
  for (const [k, v] of Object.entries(sign.fields)) form.append(k, v);
  form.append("file", new Blob([buf], { type: mime(filename) }), filename);

  const up = await fetch(sign.post_url, { method: "POST", body: form });
  if (![200, 201, 204].includes(up.status)) {
    throw new Error(`S3 upload failed for ${filename}: ${up.status}`);
  }
  await Storyblok.get(`${base}/assets/${sign.id}/finish_upload`);
  const res = (await Storyblok.get(`${base}/assets/${sign.id}`)).data;
  const asset = res.asset ?? res;
  const filenameUrl = asset.filename || sign.public_url || sign.pretty_url;

  const obj = {
    id: sign.id,
    filename: filenameUrl,
    fieldtype: "asset",
    alt: "",
    name: "",
    title: "",
    focus: "",
    copyright: "",
  };
  assetCache.set(localPath, obj);
  process.stdout.write(`  · ${filename}\n`);
  return obj;
}

/** Collect every unique image path in the seed. */
function collectImages() {
  const set = new Set();
  set.add(seed.hero.backgroundImage);
  seed.trustBar.logos.forEach((l) => set.add(l.image));
  set.add(seed.howItWorks.cardImage);
  seed.protocols.cards.forEach((c) => set.add(c.image));
  seed.quality.features.forEach((f) => set.add(f.icon));
  seed.catalog.products.forEach((p) => set.add(p.image));
  seed.compare.supporting.forEach((s) => set.add(s.icon));
  seed.testimonials.testimonials.forEach((t) => set.add(t.image));
  seed.blog.articles.forEach((a) => set.add(a.image));
  seed.footer.payments.forEach((p) => set.add(p.image));
  return [...set];
}

async function uploadAll() {
  const imgs = collectImages();
  for (const p of imgs) await uploadAsset(p);
  console.log(`✔ Uploaded ${imgs.length} images\n`);
}

/* --------------------------- story content ------------------------------ */
/** asset field getter: clones the uploaded asset and stamps alt text. */
const a = (p, alt = "") => ({ ...assetCache.get(p), alt });

function buildBody() {
  const s = seed;
  return [
    blk("hero", {
      headline: s.hero.headline,
      subheadline: s.hero.subheadline,
      ctaLabel: s.hero.ctaLabel,
      ctaHref: s.hero.ctaHref,
      backgroundImage: a(s.hero.backgroundImage, s.hero.backgroundAlt),
      backgroundAlt: s.hero.backgroundAlt,
      header: [
        blk("site_header", {
          tickerMessages: s.header.tickerMessages.map((t) =>
            blk("text_item", { text: t }),
          ),
          navLinks: s.header.navLinks.map((l) =>
            blk("nav_link", {
              label: l.label,
              href: l.href,
              hasDropdown: l.hasDropdown,
            }),
          ),
          resourcesEyebrow: "Resources",
          protocolCategories: defaultProtocolCategories.map((cat) =>
            blk("protocol_category", {
              label: cat.label,
              moreHref: cat.moreHref || "",
              children: cat.children.map((c) =>
                blk("nav_sub_link", { label: c.label, href: c.href }),
              ),
            }),
          ),
          loginLabel: s.header.loginLabel,
          loginHref: s.header.loginHref,
          ctaLabel: s.header.ctaLabel,
          ctaHref: s.header.ctaHref,
        }),
      ],
    }),

    blk("trust_bar", {
      eyebrow: s.trustBar.eyebrow,
      logos: s.trustBar.logos.map((l) =>
        blk("cert_logo", {
          image: a(l.image, l.alt),
          alt: l.alt,
          width: l.width,
          height: l.height,
        }),
      ),
    }),

    blk("how_it_works", {
      eyebrow: s.howItWorks.eyebrow,
      heading: s.howItWorks.heading,
      subtext: s.howItWorks.subtext,
      cardImage: a(s.howItWorks.cardImage),
      steps: s.howItWorks.steps.map((st) => blk("step", { ...st })),
      ctaLabel: s.howItWorks.ctaLabel,
      ctaHref: s.howItWorks.ctaHref,
    }),

    blk("protocols", {
      eyebrow: s.protocols.eyebrow,
      heading: s.protocols.heading,
      subtext: s.protocols.subtext,
      cards: s.protocols.cards.map((c) =>
        blk("protocol_card", {
          image: a(c.image),
          category: c.category,
          description: c.description,
          featured: c.featured,
          color: c.color ?? "",
          bgColor: c.bgColor ?? "",
        }),
      ),
      ctaLabel: s.protocols.ctaLabel,
      ctaHref: s.protocols.ctaHref,
    }),

    blk("quality", {
      eyebrow: s.quality.eyebrow,
      heading: s.quality.heading,
      supporting: s.quality.supporting,
      features: s.quality.features.map((f) =>
        blk("quality_feature", {
          icon: a(f.icon),
          title: f.title,
          description: f.description,
        }),
      ),
    }),

    blk("catalog", {
      eyebrow: s.catalog.eyebrow,
      heading: s.catalog.heading,
      toggleOptions: s.catalog.toggleOptions.map((t) =>
        blk("text_item", { text: t }),
      ),
      toggleActive: s.catalog.toggleActive,
      products: s.catalog.products.map((p) =>
        blk("catalog_product", {
          category: p.category,
          name: p.name,
          description: p.description,
          image: a(p.image),
          ctaLabel: p.ctaLabel,
          ctaHref: p.ctaHref,
          featured: p.featured,
          tier: p.tier,
        }),
      ),
      ctaLabel: s.catalog.ctaLabel,
      ctaHref: s.catalog.ctaHref,
    }),

    blk("compare", {
      eyebrow: s.compare.eyebrow,
      heading: s.compare.heading,
      subtext: s.compare.subtext,
      features: s.compare.features.map((t) => blk("text_item", { text: t })),
      sync: s.compare.sync.map((c) =>
        blk("compare_cell", { type: c.type, text: c.text || "" }),
      ),
      competitors: s.compare.competitors.map((col) =>
        blk("compare_column", {
          title: col.title,
          cells: col.cells.map((c) =>
            blk("compare_cell", { type: c.type, text: c.text || "" }),
          ),
        }),
      ),
      supporting: s.compare.supporting.map((sp) =>
        blk("compare_support", { icon: a(sp.icon), label: sp.label }),
      ),
    }),

    blk("testimonials", {
      eyebrow: s.testimonials.eyebrow,
      heading: s.testimonials.heading,
      ratingLabel: s.testimonials.ratingLabel,
      testimonials: s.testimonials.testimonials.map((t) =>
        blk("testimonial", {
          highlight: t.highlight,
          quote: t.quote,
          name: t.name,
          tag: t.tag,
          image: a(t.image),
        }),
      ),
    }),

    blk("blog", {
      eyebrow: s.blog.eyebrow,
      heading: s.blog.heading,
      subtext: s.blog.subtext,
      articles: s.blog.articles.map((ar) =>
        blk("article", {
          category: ar.category,
          title: ar.title,
          meta: ar.meta,
          image: a(ar.image),
          href: ar.href,
        }),
      ),
      ctaLabel: s.blog.ctaLabel,
      ctaHref: s.blog.ctaHref,
    }),

    blk("faq", {
      eyebrow: s.faq.eyebrow,
      heading: s.faq.heading,
      subtext: s.faq.subtext,
      ctaLabel: s.faq.ctaLabel,
      ctaHref: s.faq.ctaHref,
      items: s.faq.items.map((i) => blk("faq_item", { ...i })),
    }),

    blk("final_cta", {
      eyebrow: s.finalCta.eyebrow,
      heading: s.finalCta.heading,
      subtext: s.finalCta.subtext,
      ctaLabel: s.finalCta.ctaLabel,
      ctaHref: s.finalCta.ctaHref,
    }),

    blk("footer", {
      tagline: s.footer.tagline,
      socials: s.footer.socials.map((so) => blk("social_link", { ...so })),
      navColumns: s.footer.navColumns.map((col) =>
        blk("footer_column", {
          links: col.links.map((l) => blk("footer_link", { ...l })),
        }),
      ),
      newsletterText: s.footer.newsletterText,
      newsletterPlaceholder: s.footer.newsletterPlaceholder,
      newsletterCta: s.footer.newsletterCta,
      disclaimer: s.footer.disclaimer,
      payments: s.footer.payments.map((p) =>
        blk("payment_logo", { image: a(p.image, p.alt), alt: p.alt }),
      ),
    }),
  ];
}

/* --------------------------- story upsert ------------------------------- */
// Fetch the story list once and reuse it across upserts.
let _storyList = null;
async function upsertStory(name, slug, content, realPath) {
  if (!_storyList) {
    _storyList = (
      await Storyblok.get(`${base}/stories`, { per_page: 100 })
    ).data.stories;
  }
  const existing = _storyList.find((st) => st.slug === slug);
  // NB: pages are fetched by slug (cdn/stories/<slug>), not by startpage.
  // Storyblok rejects is_startpage on a root (parent_id 0) story, so we omit it.
  // `path` is the "Real path" override that tells the Visual Editor which
  // front-end URL to preview for this story, so the client sees the actual page
  // when editing. (`real_path` in the API is read-only/computed.)
  const story = { name, slug, content };
  if (realPath) story.path = realPath;
  if (existing) {
    await Storyblok.put(`${base}/stories/${existing.id}`, { story, publish: 1 });
    console.log(`  ✔ ${name} (/${slug}) updated & published`);
  } else {
    const res = await Storyblok.post(`${base}/stories`, { story, publish: 1 });
    _storyList.push({ id: res.data.story.id, slug });
    console.log(`  ✔ ${name} (/${slug}) created & published`);
  }
}

/* --------------------------- page builders ------------------------------ */
// Each builder maps a content.ts object → the matching root blok. Field names
// mirror content.ts so the app's storyblok-map readers line up.
function buildLegal(c) {
  return blk("legal_page", {
    eyebrow: c.eyebrow,
    title: c.title,
    lastUpdated: c.lastUpdated,
    intro: c.intro,
    contentsLabel: c.contentsLabel,
    clauses: c.clauses.map((cl) =>
      blk("legal_clause", {
        number: cl.number,
        title: cl.title,
        id: cl.id,
        body: cl.body,
      }),
    ),
  });
}

function buildJournal(c) {
  const article = (a) =>
    blk("journal_article", {
      category: a.category,
      title: a.title,
      excerpt: a.excerpt,
      meta: a.meta,
      image: a.image,
      href: a.href,
    });
  return blk("journal_page", {
    eyebrow: c.eyebrow,
    heading: c.heading,
    subtext: c.subtext,
    tabs: c.tabs.map((t) => blk("text_item", { text: t })),
    featured: [
      blk("journal_featured", {
        eyebrow: c.featured.eyebrow,
        title: c.featured.title,
        excerpt: c.featured.excerpt,
        meta: c.featured.meta,
        image: null, // asset field — client uploads; front-end falls back to local
        href: c.featured.href,
        readMoreLabel: c.featured.readMoreLabel,
      }),
    ],
    articles: c.articles.map(article),
    loadMoreLabel: c.loadMoreLabel,
    newsletter: [
      blk("journal_newsletter", {
        eyebrow: c.newsletter.eyebrow,
        heading: c.newsletter.heading,
        subtext: c.newsletter.subtext,
        placeholder: c.newsletter.placeholder,
        ctaLabel: c.newsletter.ctaLabel,
      }),
    ],
  });
}

const journalArticleBlok = (a) =>
  blk("journal_article", {
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    meta: a.meta,
    image: a.image,
    href: a.href,
  });

function buildArticle(c) {
  return blk("article_page", {
    journalLabel: c.journalLabel,
    category: c.category,
    title: c.title,
    dek: c.dek,
    authorLabel: c.author.label,
    authorName: c.author.name,
    authorAvatar: null, // asset field — client uploads; front-end falls back to local
    publishedLabel: c.published.label,
    publishedValue: c.published.value,
    readTimeLabel: c.readTime.label,
    readTimeValue: c.readTime.value,
    metaLine: c.metaLine,
    cover: null, // asset field — client uploads; front-end falls back to local
    tocLabel: c.tocLabel,
    toc: c.toc.map((t) => blk("article_toc", { label: t.label, id: t.id })),
    prose: c.prose.map((b) =>
      blk("article_prose", { type: b.type, text: b.text, id: b.id ?? "" }),
    ),
    disclaimerLabel: c.disclaimer.label,
    disclaimerText: c.disclaimer.text,
    reviewerLabel: c.reviewer.label,
    reviewerName: c.reviewer.name,
    reviewerNote: c.reviewer.note,
    reviewerAvatar: null, // asset field — client uploads; front-end falls back to local
    relatedEyebrow: c.related.eyebrow,
    relatedHeading: c.related.heading,
    relatedArticles: c.related.articles.map(journalArticleBlok),
  });
}

function buildCheckout(c) {
  const p = c.payment;
  return blk("checkout_page", {
    expressLabel: c.expressLabel,
    orLabel: c.orLabel,
    contact: [blk("checkout_contact", { ...c.contact })],
    delivery: [blk("checkout_delivery", { ...c.delivery })],
    shipping: [blk("checkout_shipping", { ...c.shipping })],
    consent: [
      blk("checkout_consent", {
        title: c.consent.title,
        subtitle: c.consent.subtitle,
        items: c.consent.items.map((i) =>
          blk("checkout_consent_item", { title: i.title, body: i.body }),
        ),
      }),
    ],
    payment: [
      blk("checkout_payment", {
        title: p.title,
        subtitle: p.subtitle,
        cardLabel: p.cardLabel,
        logos: p.logos.map((l) =>
          blk("checkout_card_logo", { src: l.src, alt: l.alt }),
        ),
        logosMore: p.logosMore,
        cardNumber: p.cardNumber,
        expiry: p.expiry,
        cvc: p.cvc,
        nameOnCard: p.nameOnCard,
        billingSame: p.billingSame,
        altRows: p.altRows.map((r) =>
          blk("checkout_pay_row", {
            id: r.id,
            label: r.label,
            logo: r.logo ?? "",
            logoW: r.logoW != null ? String(r.logoW) : "",
            boxed: !!r.boxed,
          }),
        ),
        saveTitle: p.saveTitle,
        saveBody: p.saveBody,
        saveDismiss: p.saveDismiss,
      }),
    ],
    discountPlaceholder: c.discountPlaceholder,
    applyLabel: c.applyLabel,
    summary: [blk("checkout_summary", { ...c.summary })],
    payNow: c.payNow,
    payDisclaimer: c.payDisclaimer,
    footerLinks: c.footerLinks.map((l) =>
      blk("footer_link", { label: l.label, href: l.href, muted: false }),
    ),
  });
}

function buildCartPage(c) {
  return blk("cart_page", { ...c });
}

function buildCartDrawer(c) {
  return blk("cart_drawer", {
    ...c,
    upsells: c.upsells.map((u) => blk("cart_upsell", { ...u })),
    paymentLogos: c.paymentLogos.map((l) =>
      blk("checkout_card_logo", { src: l.src, alt: l.alt }),
    ),
  });
}

const textItem = (t) => blk("text_item", { text: t });

function buildProduct(c) {
  return blk("product_page", {
    slug: c.slug,
    eyebrow: c.eyebrow,
    name: c.name,
    description: c.description,
    tagline: c.tagline,
    galleryMain: c.gallery.main,
    galleryThumbnails: c.gallery.thumbnails.map(textItem),
    trust: c.trust.map((t) =>
      blk("product_trust", { icon: t.icon, label: t.label }),
    ),
    methodLabel: c.methodLabel,
    methods: c.methods.map((m) =>
      blk("product_method", { image: m.image, alt: m.alt }),
    ),
    priceAmount: c.price.amount,
    pricePeriod: c.price.period,
    planLabel: c.planLabel,
    plans: c.plans.map((p) =>
      blk("product_plan", {
        label: p.label,
        price: p.price,
        period: p.period,
        badgeText: p.badge?.text ?? "",
        badgeVariant: p.badge?.variant ?? "",
        save: p.save ?? "",
      }),
    ),
    ctaLabel: c.cta.label,
    ctaHref: c.cta.href,
    ctaNote: c.cta.note,
    accordion: c.accordion.map((a) =>
      blk("product_accordion", { title: a.title, body: a.body ?? "" }),
    ),
    safetyLabel: c.safetyLabel,
    safetyHref: c.safetyHref,
    whyHeading: c.why.heading,
    whyFeatures: c.why.features.map((f) =>
      blk("product_why_feature", {
        icon: f.icon,
        title: f.title,
        description: f.description,
      }),
    ),
    qualityTest: [
      blk("product_quality", {
        heading: c.qualityTest.heading,
        collage: c.qualityTest.collage.map(textItem),
        lead: c.qualityTest.lead,
        body: c.qualityTest.body,
        tests: c.qualityTest.tests.map((t) =>
          blk("product_quality_test", {
            name: t.name,
            status: t.status,
            description: t.description,
          }),
        ),
      }),
    ],
    howItWorks: [
      blk("product_how_it_works", {
        eyebrow: c.howItWorks.eyebrow,
        heading: c.howItWorks.heading,
        subtext: c.howItWorks.subtext,
        cardImage: c.howItWorks.cardImage,
        steps: c.howItWorks.steps.map((s) =>
          blk("step", {
            number: s.number,
            title: s.title,
            description: s.description,
          }),
        ),
        ctaLabel: c.howItWorks.ctaLabel,
        ctaHref: c.howItWorks.ctaHref,
      }),
    ],
    faq: [
      blk("faq", {
        eyebrow: c.faq.eyebrow,
        heading: c.faq.heading,
        subtext: c.faq.subtext,
        ctaLabel: c.faq.ctaLabel,
        ctaHref: c.faq.ctaHref,
        items: c.faq.items.map((i) => blk("faq_item", { ...i })),
      }),
    ],
  });
}

async function seedHome() {
  await upsertStory("Home", "home", blk("page", { body: buildBody() }), "/");
}

async function seedPages() {
  await upsertStory("Terms of Service", "terms", buildLegal(termsOfService), "/terms");
  await upsertStory("Privacy Policy", "privacy", buildLegal(privacyPolicy), "/privacy");
  await upsertStory("Journal", "journal", buildJournal(journal), "/journal");
  await upsertStory(
    "Article — Compounded peptides",
    "article-compounded-peptides",
    buildArticle(article),
    "/journal/compounded-peptides",
  );
  await upsertStory("Checkout", "checkout", buildCheckout(checkout), "/checkout");
  await upsertStory("Cart", "cart", buildCartPage(cartPage), "/cart");
  await upsertStory("Cart drawer", "cart-drawer", buildCartDrawer(cart), "/");
  for (const p of allProducts) {
    await upsertStory(
      `Product — ${p.name}`,
      `product-${p.slug}`,
      buildProduct(p),
      `/products/${p.slug}`,
    );
  }
}

/* --------------------------- run ---------------------------------------- */
async function main() {
  console.log(`\nProvisioning Storyblok space ${SPACE_ID} (${REGION})…\n`);
  console.log("→ Syncing components");
  await syncComponents();
  // Home uses uploaded Storyblok assets; the other pages store image paths as
  // text, so SKIP_ASSETS skips both the upload and the Home reseed for fast
  // iteration on the page stories.
  if (process.env.SKIP_ASSETS) {
    console.log("→ Skipping images + Home reseed (SKIP_ASSETS set)");
  } else {
    console.log("→ Uploading images");
    await uploadAll();
    console.log("→ Seeding Home story");
    await seedHome();
  }
  console.log("→ Seeding pages");
  await seedPages();
  console.log("\n✅ Done. Open the Visual Editor to edit any page.\n");
}

main().catch((err) => {
  console.error("\n✖ Provisioning failed:\n", err?.message || err);
  if (err?.response) console.error(err.response);
  process.exit(1);
});
