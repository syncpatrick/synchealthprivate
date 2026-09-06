/**
 * Local content model — mirrors the Storyblok schema we'll create.
 * Each type maps 1:1 to a Storyblok blok so wiring the CMS later is a drop-in.
 */

import type { RichTextValue } from "@/lib/richtext";

export type NavLink = {
  label: string;
  href: string;
  hasDropdown?: boolean;
};

export type NavSubLink = {
  label: string;
  href: string;
};

export type ProtocolCategory = {
  label: string;
  moreHref?: string;
  children: NavSubLink[];
};

export type SiteHeaderContent = {
  /** Alternating messages shown in the top ticker bar. */
  tickerMessages: string[];
  navLinks: NavLink[];
  resourcesEyebrow?: string;
  protocolCategories?: ProtocolCategory[];
  loginLabel: string;
  loginHref: string;
  ctaLabel: string;
  ctaHref: string;
};

export type Step = {
  number: string;
  title: string;
  description: string;
  /** Per-step portrait. Falls back to the section's `cardImage` when unset,
      which is how the section behaved before steps had their own images. */
  image?: string;
};

export type HowItWorksContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  steps: Step[];
  cardImage: string;
  ctaLabel: string;
  ctaHref: string;
};

export type ProtocolCard = {
  image: string;
  description: string;
  category: string;
  /** Recovery is the highlighted/active category (filled pill). */
  featured?: boolean;
  /** Dot / pill-fill colour (hex). Falls back to a per-category default. */
  color?: string;
  /** Card image-background top tint (hex), fades to cream. */
  bgColor?: string;
};

export type ProtocolsContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  cards: ProtocolCard[];
  ctaLabel: string;
  ctaHref: string;
};

export type QualityFeature = {
  icon: string;
  title: string;
  description: string;
};

export type QualityContent = {
  eyebrow: string;
  heading: string;
  supporting: string;
  features: QualityFeature[];
};

export type CatalogProduct = {
  category: string;
  name: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  /** First product uses a filled button; the rest are outlined. */
  featured?: boolean;
  /** Which toggle tab shows this product ("Single" / "Advanced"). Untagged
      products show under every tab. */
  tier?: string;
};

export type CatalogContent = {
  eyebrow: string;
  heading: string;
  toggle: { options: string[]; active: string };
  products: CatalogProduct[];
  ctaLabel: string;
  ctaHref: string;
};

export type CompareCell =
  | { type: "check" | "cross" | "yes" }
  | { type: "text"; text: string };

export type CompareContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  features: string[];
  sync: CompareCell[];
  competitors: { title: string; cells: CompareCell[] }[];
  supporting: { icon: string; label: string }[];
};

export type Testimonial = {
  /** Optional leading sentence rendered in the brand color. */
  highlight?: string;
  quote: string;
  name: string;
  tag: string;
  image: string;
};

export type TestimonialsContent = {
  eyebrow: string;
  heading: string;
  ratingLabel: string;
  testimonials: Testimonial[];
};

export type Article = {
  category: string;
  title: string;
  meta: string;
  image: string;
  href: string;
};

export type BlogContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  articles: Article[];
  ctaLabel: string;
  ctaHref: string;
};

/** Article card on the Journal index. Adds an `excerpt` over the home `Article`. */
export type JournalArticle = {
  category: string;
  title: string;
  excerpt: string;
  meta: string;
  image: string;
  href: string;
};

export type JournalContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  tabs: string[];
  featured: {
    eyebrow: string;
    title: string;
    excerpt: string;
    meta: string;
    image: string;
    href: string;
    readMoreLabel: string;
  };
  articles: JournalArticle[];
  loadMoreLabel: string;
  newsletter: {
    eyebrow: string;
    heading: string;
    subtext: string;
    placeholder: string;
    ctaLabel: string;
  };
};

/** A block in the article prose. `h2` carries an `id` for TOC anchoring. */
export type ArticleProseBlock =
  | { type: "lead"; text: RichTextValue }
  // Headings stay plain: the text doubles as the anchor label in the contents.
  | { type: "h2"; text: string; id: string }
  | { type: "p"; text: RichTextValue }
  | { type: "quote"; text: RichTextValue }
  | { type: "image"; image: string; caption?: string };

export type ArticleContent = {
  journalLabel: string;
  category: string;
  title: string;
  dek: string;
  author: { label: string; name: string; avatar: string };
  published: { label: string; value: string };
  readTime: { label: string; value: string };
  /** Single coral meta line used on mobile in place of the author columns. */
  metaLine: string;
  cover: string;
  tocLabel: string;
  toc: { label: string; id: string }[];
  prose: ArticleProseBlock[];
  disclaimer: { label: string; text: RichTextValue };
  reviewer: { label: string; name: string; note: RichTextValue; avatar: string };
  related: { eyebrow: string; heading: string; articles: JournalArticle[] };
};

export type LegalClause = {
  number: string;
  title: string;
  id: string;
  body: RichTextValue;
};

export type LegalContent = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: RichTextValue;
  contentsLabel: string;
  clauses: LegalClause[];
};

export type FaqItem = {
  question: string;
  answer: RichTextValue;
};

export type FaqContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
  items: FaqItem[];
};

export type FaqCategoryItem = FaqItem & {
  /** Tab this question sits under. The tab row is derived from these. */
  category: string;
};

/** Standalone FAQ browser (Figma 1108:8039) — tabs over a full-width accordion. */
export type FaqPageContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  /** Label for the leading "show everything" tab. */
  allLabel: string;
  items: FaqCategoryItem[];
};

/** A way to reach us. Resolves to either a mailto link or a CTA button. */
export type ContactChannel = {
  eyebrow: string;
  description: string;
  email?: string;
  cta?: { label: string; href: string };
};

export type ContactContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  form: {
    eyebrow: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitLabel: string;
    disclaimer: RichTextValue;
    successHeading: string;
    successBody: string;
    /** Shown when the send fails — points at a channel that always works. */
    errorBody: string;
  };
  channels: ContactChannel[];
  emergency: {
    eyebrow: string;
    body: RichTextValue;
  };
};

export type FinalCtaContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  ctaLabel: string;
  ctaHref: string;
};

export type FooterLink = {
  label: string;
  href: string;
  /** Column-two links render in a muted tone. */
  muted?: boolean;
};

export type SocialLink = {
  name: "instagram" | "linkedin" | "facebook" | "youtube";
  href: string;
};

export type PaymentLogo = {
  src: string;
  alt: string;
};

export type FooterContent = {
  tagline: string;
  socials: SocialLink[];
  navColumns: { links: FooterLink[] }[];
  newsletter: {
    text: string;
    placeholder: string;
    ctaLabel: string;
  };
  disclaimer: RichTextValue;
  payments: PaymentLogo[];
};

export type HeroContent = {
  headline: string;
  /** Optional — Storyblok stories seeded before the field exists omit it. */
  subheadline?: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: {
    src: string;
    alt: string;
  };
};

export type CertLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type TrustBarContent = {
  eyebrow: string;
  logos: CertLogo[];
};

/* --- Product detail page (PDP) --------------------------------------- */

export type ProductTrust = {
  icon: string;
  label: string;
};

export type ProductMethod = {
  image: string;
  alt: string;
};

export type ProductPlan = {
  label: string;
  /** Per-month price, e.g. "$225.00". */
  price: string;
  /** Suffix rendered smaller/muted, e.g. "/month". */
  period: string;
  /** Optional corner badge, e.g. "Recommended" / "Best Value". */
  badge?: { text: string; variant: "recommended" | "best" };
  /** Optional inline savings pill, e.g. "Save 15%". */
  save?: string;
};

export type ProductAccordionItem = {
  title: string;
  body?: RichTextValue;
};

export type ProductWhyFeature = {
  icon: string;
  title: string;
  description: string;
};

export type ProductQualityTest = {
  name: string;
  /** Status pill label, e.g. "Passed". */
  status: string;
  description: string;
};

export type ProductQualityContent = {
  heading: string;
  /** Three overlapping photo cards: left, elevated middle, right. */
  collage: string[];
  /** Emphasised intro line (larger, medium weight). */
  lead: string;
  body: string;
  tests: ProductQualityTest[];
};

export type ProductContent = {
  slug: string;
  eyebrow: string;
  name: string;
  /** The paragraph under the product name. Also the meta description, which is
      why every render site flattens it rather than passing the document on. */
  description: RichTextValue;
  /** Short one-line tagline (used in cart line items, upsells). */
  tagline: string;
  gallery: {
    main: string;
    /** First entry is the active/coloured thumb; the rest are muted. */
    thumbnails: string[];
  };
  trust: ProductTrust[];
  methodLabel: string;
  methods: ProductMethod[];
  price: { amount: string; period: string };
  planLabel: string;
  plans: ProductPlan[];
  /** `color` / `textColor` are optional hex overrides for the buy button,
      set per product in Storyblok; blank keeps the Figma ink-on-white. */
  cta: {
    label: string;
    href: string;
    note: string;
    color?: string;
    textColor?: string;
  };
  accordion: ProductAccordionItem[];
  safetyLabel: string;
  safetyHref: string;
  why: { heading: string; features: ProductWhyFeature[] };
  qualityTest: ProductQualityContent;
  howItWorks: HowItWorksContent;
  faq: FaqContent;
  /** Reviews for this compound. Absent until the product is given its own, at
      which point they replace the set every other product shows. */
  testimonials?: TestimonialsContent;
};

export const defaultProtocolCategories: ProtocolCategory[] = [
  {
    label: "Recovery",
    moreHref: "/start?category=recovery",
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
    moreHref: "/start?category=performance",
    children: [
      { label: "Sermorelin", href: "/products/sermorelin" },
      { label: "PERFORM", href: "/products/perform" },
    ],
  },
  {
    label: "Metabolic",
    moreHref: "/start?category=metabolic",
    children: [
      { label: "MOTS-C", href: "/products/mots-c" },
      { label: "DEFINE", href: "/products/define" },
      { label: "Tesamorelin", href: "/products/tesamorelin" },
    ],
  },
  {
    label: "Weight",
    moreHref: "/start?category=weight",
    children: [
      { label: "Compounded Semaglutide", href: "/products/semaglutide" },
      { label: "Compounded Tirzepatide", href: "/products/tirzepatide" },
    ],
  },
  {
    label: "Skin & Longevity",
    moreHref: "/start?category=skin-longevity",
    children: [
      { label: "NAD+", href: "/products/nad" },
      { label: "GHK-Cu", href: "/products/ghk-cu" },
      { label: "RESTORE", href: "/products/restore" },
    ],
  },
  {
    label: "Hormonal Health",
    moreHref: "/start?category=hormonal-health",
    children: [
      { label: "PT-141", href: "/products/pt-141" },
      { label: "Kisspeptin", href: "/products/kisspeptin" },
    ],
  },
  {
    label: "Cognitive",
    moreHref: "/start?category=cognitive",
    children: [
      { label: "Semax", href: "/products/semax" },
      { label: "Selank", href: "/products/selank" },
      { label: "SEMAX/SELANK", href: "/products/semax-selank" },
    ],
  },
];

/** Default content for the home page (stands in for the Storyblok story). */
export const siteHeader: SiteHeaderContent = {
  tickerMessages: [
    "Free delivery on orders over $50.",
    "Most protocol reviews completed within 1–2 hours.",
  ],
  navLinks: [
    { label: "Protocols", href: "/products/bpc-157", hasDropdown: true },
    { label: "Learn", href: "/journal", hasDropdown: true },
  ],
  resourcesEyebrow: "Resources",
  protocolCategories: defaultProtocolCategories,
  loginLabel: "Login",
  loginHref: "/login",
  ctaLabel: "Start Your Protocol",
  ctaHref: "/start",
};

export const trustBar: TrustBarContent = {
  eyebrow: "Trusted & certified",
  logos: [
    {
      src: "/images/certs/hipaa.png",
      alt: "HIPAA — We Protect Your Privacy",
      width: 149,
      height: 64,
    },
    { src: "/images/certs/cert2.png", alt: "Certified", width: 60, height: 56 },
    { src: "/images/certs/fda.png", alt: "FDA registered", width: 60, height: 56 },
    {
      src: "/images/certs/legitscript.svg",
      alt: "LegitScript Certified",
      width: 169,
      height: 52,
    },
  ],
};

export const howItWorks: HowItWorksContent = {
  eyebrow: "How it works",
  heading: "Three steps to in-sync.",
  subtext:
    "From goal to doorstep in a few days — with a clinician reviewing every protocol along the way.",
  cardImage: "/images/step-portrait.png",
  steps: [
    {
      number: "01",
      title: "Take the assessment",
      description:
        "Not a form. We ask what you've run before, what it did, and what you're training for — an intake a clinician can actually reason from.",
    },
    {
      number: "02",
      title: "A clinician builds your protocol",
      description:
        "Your compound, your dose, your cycle, decided by a licensed provider for your body. Sometimes the answer is less than you came for.",
    },
    {
      number: "03",
      title: "It ships — and evolves",
      description:
        "Compounded, tested, at your door. Then your clinician checks in — and cycle two isn't cycle one. Most platforms stop at checkout.",
    },
  ],
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
};

export const protocols: ProtocolsContent = {
  eyebrow: "Explore protocols",
  heading: "Start with a goal.",
  subtext:
    "Whether you know exactly what you want or need help finding the right protocol, browse by what you're working toward.",
  cards: [
    {
      image: "/images/protocols/recovery.png",
      description:
        "A short intake maps your goals, lifestyle and history to a protocol matched to you — never a one-size-fits-all stack.",
      category: "Recovery",
      featured: true,
      color: "#DC5B24",
      bgColor: "#F6C6A0",
    },
    {
      image: "/images/step-glow.png",
      description:
        "A physician personally reviews every intake and prescribes only what's right for you, before anything ships.",
      category: "Performance",
      color: "#037FBD",
      bgColor: "#B9DBF0",
    },
    {
      image: "/images/protocols/metabolic.png",
      description:
        "Pre-sorted daily packs arrive at your door. Check-ins every 3–6 months evolve your protocol as your body changes.",
      category: "Metabolic",
      color: "#E68A2B",
      bgColor: "#F6D3A6",
    },
    {
      image: "/images/step-glow.png",
      description:
        "Tailored workout routines that align with your fitness level and personal goals, helping you reach your desired results.",
      category: "Skin & Longevity",
      color: "#45B562",
      bgColor: "#C6E7AC",
    },
    {
      image: "/images/step-glow.png",
      description:
        "Tailored workout routines that align with your fitness level and personal goals, helping you reach your desired results.",
      category: "Hormonal Health",
      color: "#F05DA0",
      bgColor: "#F8B4D3",
    },
  ],
  ctaLabel: "Shop all",
  ctaHref: "/start",
};

export const quality: QualityContent = {
  eyebrow: "Why patients choose Sync",
  heading: "Bringing quality care home, 100% online.",
  supporting:
    "No clinics, no waiting rooms, no pharmacy lines, just clinician-backed protocols, verified and delivered to your door.",
  features: [
    {
      icon: "/images/quality/trusted.svg",
      title: "Trusted by doctors",
      description:
        "Verified medications aligned with your health needs, sourced from US-licensed pharmacies.",
    },
    {
      icon: "/images/quality/clinical.svg",
      title: "Clinical experts",
      description:
        "Every intake reviewed by a licensed provider before anything is prescribed.",
    },
    {
      icon: "/images/quality/delivery.svg",
      title: "Fast & discreet delivery",
      description: "Confidential shipping straight to your door.",
    },
    {
      icon: "/images/quality/safe.svg",
      title: "Safe, quality medications",
      description:
        "Sourced from US-based, licensed pharmacies for consistent quality.",
    },
  ],
};

export const catalog: CatalogContent = {
  eyebrow: "Our formulatory",
  heading: "The architecture of in sync.",
  toggle: { options: ["Single", "Advanced"], active: "Single" },
  // "Single" = single-compound protocols; "Advanced" = metabolic / hormonal.
  // Descriptions mirror each product's PDP tagline.
  products: [
    {
      category: "Recovery",
      name: "BPC-157",
      description: "Tissue repair, joint and gut support.",
      image: "/images/catalog/vial-recovery.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/bpc-157",
      featured: true,
      tier: "Single",
    },
    {
      category: "Performance",
      name: "Sermorelin",
      description: "Growth-hormone support, recovery and sleep.",
      image: "/images/catalog/vial-bpc157.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/sermorelin",
      tier: "Single",
    },
    {
      category: "Skin",
      name: "GHK-Cu",
      description: "Skin, hair and collagen renewal.",
      image: "/images/catalog/vial-recovery.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/ghk-cu",
      tier: "Single",
    },
    {
      category: "Longevity",
      name: "NAD+",
      description: "Cellular energy, focus and healthy aging.",
      image: "/images/catalog/vial-bpc157.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/nad",
      tier: "Single",
    },
    {
      category: "Weight",
      name: "Compounded Tirzepatide",
      description: "Dual-action weight management, once weekly.",
      image: "/images/catalog/vial-recovery.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/tirzepatide",
      featured: true,
      tier: "Advanced",
    },
    {
      category: "Weight",
      name: "Compounded Semaglutide",
      description: "Appetite, weight and metabolic support.",
      image: "/images/catalog/vial-bpc157.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/semaglutide",
      tier: "Advanced",
    },
    {
      category: "Metabolic",
      name: "MOTS-C",
      description: "Metabolic health and cellular energy.",
      image: "/images/catalog/vial-recovery.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/mots-c",
      tier: "Advanced",
    },
    {
      category: "Hormonal",
      name: "PT-141",
      description: "Sexual desire and arousal support.",
      image: "/images/catalog/vial-bpc157.png",
      ctaLabel: "Start your protocol",
      ctaHref: "/products/pt-141",
      tier: "Advanced",
    },
  ],
  ctaLabel: "Shop all",
  ctaHref: "/start",
};

export const compare: CompareContent = {
  eyebrow: "Why Sync",
  heading: "Why pay more than the vial you found?",
  subtext:
    "Not research-grade — compounded to prescription, batch-tested, clinician-prescribed, with someone accountable on the other end.",
  features: [
    "Clinician-designed for your body",
    "Compounded at licensed US pharmacy",
    "Purity / batch testing",
    "Dose personalized to you",
    "Adjusted every cycle",
    "Care team to message",
    "Approval speed",
  ],
  sync: [
    { type: "check" },
    { type: "check" },
    { type: "check" },
    { type: "check" },
    { type: "check" },
    { type: "check" },
    { type: "text", text: "< 24 hrs" },
  ],
  competitors: [
    {
      title: "Grey market",
      cells: [
        { type: "cross" },
        { type: "cross" },
        { type: "cross" },
        { type: "text", text: "You guess" },
        { type: "cross" },
        { type: "cross" },
        { type: "text", text: "—" },
      ],
    },
    {
      title: "Generic telehealth",
      cells: [
        { type: "cross" },
        { type: "yes" },
        { type: "text", text: "Varies" },
        { type: "cross" },
        { type: "text", text: "Rarely" },
        { type: "text", text: "Limited" },
        { type: "text", text: "Varies" },
      ],
    },
  ],
  supporting: [
    { icon: "/images/compare/sup-research.svg", label: "Not research-grade" },
    { icon: "/images/compare/sup-batch.svg", label: "Batch-tested" },
    { icon: "/images/compare/sup-clinician.svg", label: "Clinician-prescribed" },
  ],
};

export const testimonials: TestimonialsContent = {
  eyebrow: "Real people. Real results.",
  heading: "The support people keep coming back to.",
  ratingLabel: "Excellent",
  testimonials: [
    {
      quote:
        "“I was peptide-curious for a long time but always scared of dosing myself. SYNC gave me a personalized protocol with the security of medical supervision.”",
      name: "Nic K.",
      tag: "Verified member",
      image: "/images/testimonials/nic-k.png",
    },
    {
      highlight: "“Recovery sped up and I started looking leaner within weeks.",
      quote:
        " It feels like I unlocked another level — and the daily packs make it effortless.”",
      name: "K. L.",
      tag: "Recovery protocol",
      image: "/images/testimonials/k-l.png",
    },
    {
      quote:
        "“My doctor struggled to explain my fatigue. My SYNC protocol helped me feel like my old self again in about 14 weeks.”",
      name: "Chase H.",
      tag: "Longevity protocol",
      image: "/images/testimonials/chase-h.png",
    },
  ],
};

export const blog: BlogContent = {
  eyebrow: "Learn",
  heading: "From the SYNC journal.",
  subtext:
    "Physician-informed articles on the compounds, protocols and the research behind them.",
  articles: [
    {
      category: "Science",
      title:
        "The science behind compounded peptides & why sourcing matters.",
      meta: "6 min read · Apr 2026",
      image: "/images/blog/science.png",
      href: "/journal/compounded-peptides",
    },
    {
      category: "Weight",
      title: "GLP-1s, explained without the hype: what to actually expect.",
      meta: "8 min read · Mar 2026",
      image: "/images/blog/weight.png",
      href: "/journal/glp-1s-explained",
    },
    {
      category: "Routine",
      title:
        "Building a wellness routine that actually sticks past week three.",
      meta: "5 min read · Mar 2026",
      image: "/images/blog/routine.png",
      href: "/journal/wellness-routine",
    },
  ],
  ctaLabel: "View all articles",
  ctaHref: "/journal",
};

/** /journal index — Figma 957-14210. Article cards are presentational; images
    were pulled from Figma into /images/journal. */
export const journal: JournalContent = {
  eyebrow: "The Journal",
  heading: "Physician-informed. Hype-free.",
  subtext:
    "What the research actually says about the compounds we prescribe — including where the evidence is thin. Written with our clinical team and reviewed before it goes up.",
  tabs: ["All", "Science", "Weight", "Recovery", "Hormonal", "Routine", "Safety"],
  featured: {
    eyebrow: "Featured · Science",
    title: "GLP-1s, explained without the hype: what to actually expect.",
    excerpt:
      "Appetite changes in week one. Meaningful body composition change takes far longer, and the first month is mostly about tolerating the dose. We walk through the realistic timeline, the side effects nobody warns you about, and the point at which a clinician should be adjusting rather than escalating.",
    meta: "8 min read · Mar 2026",
    image: "/images/journal/featured.png",
    href: "/journal/glp-1s-explained",
    readMoreLabel: "Read more",
  },
  articles: [
    {
      category: "Science",
      title: "The science behind compounded peptides & why sourcing matters.",
      excerpt:
        "Purity claims are easy to print on a label and hard to verify. Here is what third-party testing actually measures.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/science.png",
      href: "/journal/compounded-peptides",
    },
    {
      category: "Routine",
      title: "Building a wellness routine that actually sticks past week three.",
      excerpt:
        "Adherence beats optimisation. The protocol you follow is better than the perfect one you abandon.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/featured.png",
      href: "/journal/wellness-routine",
    },
    {
      category: "Routine",
      title:
        "BPC-157 and soft tissue: what the research supports, and what it doesn’t.",
      excerpt:
        "Strong preclinical signal, limited human trials. An honest read of where the evidence currently sits.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/bpc.png",
      href: "/journal/bpc-157-soft-tissue",
    },
    {
      category: "Safety",
      title: "Why “research grade” is a marketing term, not a standard.",
      excerpt:
        "Not-for-human-consumption labelling exists for a reason. What it means when you inject it anyway.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/featured.png",
      href: "/journal/research-grade",
    },
    {
      category: "Hormonal",
      title:
        "Sermorelin vs. direct HGH: why your clinician may prefer the slower route.",
      excerpt:
        "Stimulating your own production behaves differently from replacing it. The difference matters more than the timeline.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/science.png",
      href: "/journal/sermorelin-vs-hgh",
    },
    {
      category: "Weight",
      title: "Dose escalation: the week most people get wrong.",
      excerpt:
        "Faster is not better, and the side effects that make people quit are usually a titration problem.",
      meta: "8 min read · Mar 2026",
      image: "/images/journal/weight.png",
      href: "/journal/dose-escalation",
    },
  ],
  loadMoreLabel: "Load more articles",
  newsletter: {
    eyebrow: "The Sync Dispatch",
    heading: "One email a month. No hype.",
    subtext:
      "New research, protocol notes from our clinical team, and the occasional correction when we get something wrong. Unsubscribe in one click.",
    placeholder: "Enter email",
    ctaLabel: "Subscribe",
  },
};

/** /journal/[slug] article detail — Figma 957-15469. Presentational; the
    [slug] route renders this one article for now (like /products/[slug]). */
export const article: ArticleContent = {
  journalLabel: "The Journal",
  category: "Science",
  title:
    "The science behind compounded peptides and why sourcing matters more than the molecule.",
  dek: "Two vials can contain the same peptide and be completely different products. The difference is everything that happened before it reached you.",
  author: {
    label: "Written by",
    name: "Jane Doe",
    avatar: "/images/journal/avatar.png",
  },
  published: { label: "Published on", value: "22 July 2026" },
  readTime: { label: "Reading time", value: "6 min" },
  metaLine: "Clinically reviewed · 6 min read · April 2026",
  cover: "/images/journal/science.png",
  tocLabel: "In this article",
  toc: [
    { label: "What a peptide actually is", id: "peptide-basics" },
    { label: "Why the source changes the product", id: "why-source" },
    { label: "What third-party testing measures", id: "testing" },
    { label: "Compounded vs. research-grade", id: "compounded-vs-research" },
    { label: "What this means for your protocol", id: "your-protocol" },
  ],
  prose: [
    {
      type: "lead",
      text: "A peptide is a short chain of amino acids — the same building blocks that make up proteins, just fewer of them. That definition is where most explanations stop, and it is also where most of the confusion begins. Because if the molecule is simple and well characterised, why does it matter enormously where you get it?",
    },
    { type: "h2", text: "What a peptide actually is", id: "peptide-basics" },
    {
      type: "p",
      text: "Chains of roughly two to fifty amino acids are generally called peptides; beyond that, you are talking about a protein. Your body makes thousands of them and uses them as signals — instructions that tell tissue to repair, glands to release something, or appetite to rise or fall. Insulin is a peptide. So is the GLP-1 your gut releases after you eat.",
    },
    {
      type: "p",
      text: "Therapeutic peptides work by borrowing that vocabulary. Rather than introducing something foreign, most of the compounds prescribed through platforms like SYNC are either identical to a signal your body already uses or a close analogue designed to last longer before it breaks down. That is why they tend to be dose-sensitive and why the same compound can behave differently in two people.",
    },
    { type: "h2", text: "Why the source changes the product", id: "why-source" },
    {
      type: "p",
      text: "Here is the part that gets skipped. The peptide sequence tells you what a molecule is supposed to be. It tells you nothing about what is actually in the vial you are holding. Synthesis is a chemical process with failure modes: truncated sequences where a chain stopped early, deletion sequences missing an amino acid in the middle, residual solvents from purification, bacterial endotoxins from a non-sterile fill.",
    },
    {
      type: "quote",
      text: "A purity number on a label is a claim. A certificate of analysis from a lab that has no stake in selling you the vial is evidence. Those are not the same thing.",
    },
    {
      type: "h2",
      text: "What third-party testing actually measures",
      id: "testing",
    },
    {
      type: "p",
      text: "Four assays do most of the work. Potency confirms the vial contains the stated amount of active compound within a defined tolerance. Purity identifies how much of the content is the intended sequence versus synthesis by-products. Sterility confirms nothing is growing in it. Endotoxin testing looks for bacterial fragments that can trigger fever and systemic reactions even when the product is technically sterile.",
    },
    {
      type: "p",
      text: "None of these are exotic. They are standard for anything intended for injection into a human being. What is notable is how much of the peptide market skips them entirely — which is legal, because those products are sold labelled for research use and not for human consumption. The label is not decoration. It is the reason no testing was required.",
    },
    {
      type: "h2",
      text: "Compounded versus research-grade",
      id: "compounded-vs-research",
    },
    {
      type: "p",
      text: "A compounded medication is prepared for a named patient by a licensed pharmacy against a valid prescription, under cGMP conditions, with the pharmacy accountable to a state board. A research chemical is sold to anyone, for stated laboratory use, with no such accountability. The molecule may be nominally identical. The chain of custody, the testing burden and the recourse if something is wrong are not.",
    },
    {
      type: "p",
      text: "It is worth being precise about what compounding is not: compounded medications are not FDA-approved, and the FDA does not evaluate them for safety or efficacy the way it does a commercial drug. What you get instead is a licensed pharmacy, a prescribing clinician who is legally responsible for the decision, and batch testing you can actually look at.",
    },
    {
      type: "h2",
      text: "What this means for your protocol",
      id: "your-protocol",
    },
    {
      type: "p",
      text: "Practically: ask where it was compounded, ask whether the batch was third-party tested, and ask to see the results. A provider who cannot answer those three questions is not offering you a different price point — they are offering you a different risk profile, and usually without saying so.",
    },
  ],
  disclaimer: {
    label: "Medical disclaimer",
    text: "This article is general education, not medical advice, and it is not a recommendation to take any compound mentioned. Peptide therapy is not appropriate for everyone, and some compounds are contraindicated with common medications and conditions. Talk to a licensed clinician about your own situation before starting anything.",
  },
  // No default name on purpose. "Clinically reviewed by" is a claim, and the
  // card is hidden until an article names the clinician who actually made it.
  reviewer: {
    label: "Clinically reviewed by",
    name: "",
    note: "",
    avatar: "/images/journal/avatar.png",
  },
  related: {
    eyebrow: "Keep reading",
    heading: "Related from the journal.",
    articles: journal.articles.slice(0, 3),
  },
};

/**
 * Articles the site ships its own copy of, keyed by slug the way products are,
 * so the one finished piece still renders if Storyblok is unreachable.
 */
export const articlesBySlug: Record<string, ArticleContent> = {
  "compounded-peptides": article,
};

/**
 * A blog before anyone has written it.
 *
 * Keeps the furniture the template needs, the section labels, the author and
 * reviewer blocks, the disclaimer, and empties everything that is one article's
 * own words. Without it a story with an empty body rendered the compounded
 * peptides piece under whatever title it had been given.
 */
export const blankArticle: ArticleContent = {
  ...article,
  category: "",
  title: "",
  dek: "",
  metaLine: "",
  cover: "",
  toc: [],
  prose: [],
};

/** /terms — Figma 957-11899. Long-form legal doc: header + sticky TOC +
    numbered clauses. Clause bodies are plain text; emails are auto-linked. */
export const termsOfService: LegalContent = {
  eyebrow: "Legal",
  title: "Terms of Service",
  lastUpdated: "Last updated · 1 August 2026",
  intro:
    "These terms govern your use of Sync health and the services offered through it. Please read them — particularly the sections on the telehealth relationship, compounded medications, and dispute resolution.",
  contentsLabel: "Contents",
  clauses: [
    {
      number: "01",
      title: "Who we are",
      id: "who-we-are",
      body: "SYNC Health Inc. operates this website and the technology platform behind it. We are not a pharmacy and we are not a medical practice. Clinical decisions are made by independent, licensed US clinicians, and medications are prepared by independent licensed compounding pharmacies. When you use SYNC, you are entering into a relationship with those providers, facilitated by us.",
    },
    {
      number: "02",
      title: "Who can use SYNC",
      id: "who-can-use",
      body: "You must be at least 18 years old and physically located in a US state where our affiliated clinicians are licensed at the time of your consultation. You may not create an account on behalf of someone else, and you may not use another person’s account.",
    },
    {
      number: "03",
      title: "The telehealth relationship",
      id: "telehealth-relationship",
      body: "Submitting an intake is a request for a clinical consultation — it is not an order, and it does not guarantee that any medication will be prescribed. The reviewing clinician exercises independent medical judgement and may decline to prescribe, prescribe something different from what you expected, or request further information. Their decision is final.",
    },
    {
      number: "04",
      title: "This site is not medical advice",
      id: "not-medical-advice",
      body: "Articles, product descriptions, protocol categories and educational content on this site are general information. They are not a diagnosis, not a treatment recommendation, and not a substitute for a consultation. Never disregard professional medical advice because of something you read here.",
    },
    {
      number: "05",
      title: "Compounded medications",
      id: "compounded-medications",
      body: "Medications dispensed through SYNC are compounded for an individual patient by a licensed pharmacy. Compounded medications are not FDA-approved, and the FDA does not evaluate them for safety, efficacy or quality. The pharmacies we work with are FDA-registered and operate under cGMP standards, and batches are third-party tested — but that is a different thing from FDA approval and we do not represent it otherwise.",
    },
    {
      number: "06",
      title: "Accurate information",
      id: "accurate-information",
      body: "Your clinician can only be as safe as the information you give them. You agree that the medical history, medications, allergies and conditions you disclose are accurate and complete, and that you will update them when they change. Withholding information can make a protocol unsafe.",
    },
    {
      number: "07",
      title: "Orders, authorisation and billing",
      id: "orders-billing",
      body: "When you submit an order, your payment method is authorized but not charged. Funds are captured only if and when a clinician approves your protocol. If no prescription is issued, the authorization is released in full. Prices are shown in USD and may change, though changes never apply to a cycle already paid for.",
    },
    {
      number: "08",
      title: "Plans, renewals and cancellation",
      id: "plans-cancellation",
      body: "Multi-month plans renew automatically at the interval shown at checkout until cancelled. You may cancel or pause from your dashboard at any time before the next cycle is processed. Cancelling stops future cycles; it does not retroactively refund a cycle already dispensed.",
    },
    {
      number: "09",
      title: "Things you agree not to do",
      id: "prohibited-conduct",
      body: "Do not resell, share, or transfer any medication dispensed to you. Do not use SYNC to obtain medication for another person. Do not scrape, reverse-engineer or interfere with the platform. Accounts used for any of these are closed without refund of the current cycle.",
    },
    {
      number: "10",
      title: "Intellectual property",
      id: "intellectual-property",
      body: "The SYNC name, logo, site design, written content and photography belong to SYNC Health Inc. You may not reproduce them commercially without written permission.",
    },
    {
      number: "11",
      title: "Disclaimers and limitation of liability",
      id: "disclaimers-liability",
      body: "The platform is provided on an “as is” basis. To the fullest extent permitted by law, SYNC Health Inc. disclaims implied warranties and limits its aggregate liability to the amount you paid us in the twelve months preceding the claim. Nothing here limits liability that cannot be limited under applicable law, and nothing here limits the independent professional liability of your treating clinician or the dispensing pharmacy.",
    },
    {
      number: "12",
      title: "Disputes",
      id: "disputes",
      body: "This section should set out governing law, venue, and whether disputes are resolved by binding arbitration with a class-action waiver, together with any opt-out window. The wording, the opt-out mechanics and the enforceability of the waiver vary by state and must be drafted by your attorney rather than adapted from a template.",
    },
    {
      number: "13",
      title: "Changes to these terms",
      id: "changes",
      body: "We may update these terms. If a change is material, we will notify you by email or in-app before it takes effect. Continuing to use SYNC after that point means you accept the updated terms.",
    },
    {
      number: "14",
      title: "Contact",
      id: "contact",
      body: "Questions about these terms can go to legal@sync.health, or to SYNC Health Inc. at the mailing address listed in the footer.",
    },
  ],
};

/** /privacy — Figma 957-12009. Same LegalPage layout as Terms. */
export const privacyPolicy: LegalContent = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  lastUpdated: "Last updated · 1 August 2026",
  intro:
    "What we collect, why we collect it, who sees it, and what we will never do with it. Your health information is handled under HIPAA and is not a product we sell.",
  contentsLabel: "Contents",
  clauses: [
    {
      number: "01",
      title: "What this covers",
      id: "what-this-covers",
      body: "This policy covers sync.health, the patient dashboard, and our email and SMS communications. Your clinician and the dispensing pharmacy are separate covered entities with their own notices of privacy practices, which you receive when your care begins.",
    },
    {
      number: "02",
      title: "Information you give us",
      id: "information-you-give",
      body: "Account details such as your name, email, phone and shipping address. Intake information including your medical history, current medications, allergies, goals and prior compound use. Messages you send to your clinician or our care team.",
    },
    {
      number: "03",
      title: "Information collected automatically",
      id: "information-automatic",
      body: "Device type, browser, IP address, referring page and how you move through the site. We use this to understand what is broken and what is confusing, not to build advertising profiles.",
    },
    {
      number: "04",
      title: "Payment information",
      id: "payment-information",
      body: "Card details are entered directly into hosted fields operated by our payment processor. SYNC never receives, sees or stores your full card number. We retain only the last four digits, card brand and authorisation status so we can show you your order history.",
    },
    {
      number: "05",
      title: "How we use your information",
      id: "how-we-use",
      body: "To route your intake to a clinician licensed in your state, to let that clinician make a prescribing decision, to have a pharmacy fill and ship what is prescribed, to support you afterwards, and to run the business — fraud prevention, accounting and legal obligations.",
    },
    {
      number: "06",
      title: "HIPAA and protected health information",
      id: "hipaa",
      body: "Your intake, clinical messages and prescription records are protected health information. They are stored in HIPAA-compliant systems and are accessible only to you, your treating clinician, the dispensing pharmacy, and the small number of SYNC staff who need access to support your care.",
    },
    {
      number: "07",
      title: "Who we share with, and why",
      id: "who-we-share",
      body: "Treating clinicians and the pharmacies filling your prescription. The independent lab performing batch testing. Infrastructure, payment and shipping vendors bound by business associate agreements. Authorities where legally compelled. That is the list.",
    },
    {
      number: "08",
      title: "What we do not do",
      id: "what-we-dont-do",
      body: "We do not sell your health information. We do not share your intake, diagnoses, prescriptions or protocol details with advertisers, data brokers or social platforms. We do not use protected health information to target advertising to you.",
    },
    {
      number: "09",
      title: "Cookies and analytics",
      id: "cookies-analytics",
      body: "We use essential cookies to keep you logged in and analytics cookies to measure site performance. You can refuse non-essential cookies through the banner without losing access to any part of the service.",
    },
    {
      number: "10",
      title: "Your rights",
      id: "your-rights",
      body: "You can request a copy of your data, ask us to correct it, or ask us to delete your account. Residents of California, Colorado, Connecticut, Virginia and other states with comprehensive privacy laws have additional rights, including the right to opt out of sale or sharing — which is straightforward for us, because we do neither.",
    },
    {
      number: "11",
      title: "Retention",
      id: "retention",
      body: "Medical records are retained for the period required by the laws of the state in which your clinician is licensed, which is typically several years and is not something we or you can shorten. Non-clinical account data is deleted on request.",
    },
    {
      number: "12",
      title: "Security",
      id: "security",
      body: "Data is encrypted in transit and at rest, access is role-limited and logged, and we run regular reviews. No system is perfectly secure, and we will notify you promptly if a breach affects your information.",
    },
    {
      number: "13",
      title: "Children",
      id: "children",
      body: "SYNC is for adults 18 and over. We do not knowingly collect information from minors, and we delete it if we discover it.",
    },
    {
      number: "14",
      title: "Changes and contact",
      id: "changes-contact",
      body: "We will post updates here and email you if a change is material. Questions, requests and complaints go to privacy@sync.health.",
    },
  ],
};

export const faq: FaqContent = {
  eyebrow: "FAQ",
  heading: "Questions?\nAnswered.",
  subtext:
    "Everything you need to know about protocols, safety and getting started.",
  ctaLabel: "Contact our care team",
  ctaHref: "/contact",
  items: [
    {
      question: "Are SYNC’s peptides safe and legal?",
      answer:
        "Every protocol is prescribed by a licensed U.S. provider and compounded at accredited 503A/503B pharmacies. Compounded medications are not FDA-approved; your provider reviews whether treatment is appropriate for you before anything ships.",
    },
    {
      question: "Do I need a prescription?",
      answer:
        "Yes. Nothing ships without a prescription. You complete an online assessment, and a licensed provider reviews it and prescribes only what’s appropriate for you — no prior prescription needed to start.",
    },
    {
      question: "How does the online assessment work?",
      answer:
        "It’s a short intake about your goals, history and what you’ve tried before. A clinician reviews your answers, may follow up with questions, and builds a protocol matched to you — usually within 1–2 hours.",
    },
    {
      question: "Can I change or cancel my plan?",
      answer:
        "Anytime. You can pause, adjust or cancel from your account, and your care team can re-tune your protocol between cycles as your body and goals change.",
    },
    {
      question: "Where are the medications made?",
      answer:
        "All compounds are made at licensed, accredited U.S. 503A/503B pharmacies, batch-tested for purity and potency before they’re dispensed to you.",
    },
    {
      question: "How soon will I see results?",
      answer:
        "It depends on the protocol and your goals — some people notice changes within a few weeks, while longevity and metabolic protocols typically build over 8–14 weeks. Your clinician sets expectations up front.",
    },
  ],
};

export const contact: ContactContent = {
  eyebrow: "Contact",
  heading: "Talk to an Expert.",
  subtext:
    "Our care team answers messages seven days a week. Clinical questions about an active protocol go straight to the provider who wrote it — not to a queue.",
  form: {
    eyebrow: "Send us a message",
    nameLabel: "Full name",
    namePlaceholder: "Marcus Reid",
    emailLabel: "Email address",
    emailPlaceholder: "marcus.reid@gmail.com",
    messageLabel: "Message",
    messagePlaceholder:
      "I started my recovery protocol three weeks ago and wanted to check whether the timing of my dose matters relative to training…",
    submitLabel: "Send message",
    disclaimer:
      "Please don’t include sensitive medical details in this form. For anything about an active prescription, message your clinician from your patient dashboard — that channel is HIPAA-secured.",
    successHeading: "Message sent.",
    successBody:
      "Our care team answers seven days a week — expect a reply within one business day.",
    errorBody:
      "We couldn’t send that just now. Email hello@beinsync.co and we’ll pick it up from there.",
  },
  channels: [
    {
      eyebrow: "Care team",
      description: "General questions, orders, shipping and billing.",
      email: "hello@beinsync.co",
    },
    {
      eyebrow: "Clinical",
      description:
        "Questions about an active protocol, dosing or side effects.",
      cta: { label: "Chat with clinician", href: "/login" },
    },
    {
      eyebrow: "Press & partnerships",
      description: "Media requests and collaboration enquiries.",
      email: "press@sync.health",
    },
  ],
  emergency: {
    eyebrow: "Medical emergency",
    body: "SYNC is not an emergency service and we cannot respond to urgent medical situations. If you are experiencing a severe reaction, difficulty breathing, chest pain or any medical emergency, call 911 or go to your nearest emergency room.",
  },
};

/** Items are authored grouped by category — that order becomes the tab order. */
export const faqPage: FaqPageContent = {
  eyebrow: "FAQ",
  heading: "Questions?\nAnswered.",
  subtext:
    "Everything you need to know about protocols, safety and getting started.",
  allLabel: "All",
  items: [
    {
      category: "Getting started",
      question: "What is SYNC?",
      answer:
        "SYNC is a US telehealth platform that builds personalised peptide protocols. Every protocol is prescribed by a licensed US clinician, compounded at a licensed US pharmacy, and adjusted around how your body responds.",
    },
    {
      category: "Getting started",
      question: "How does the assessment work?",
      answer:
        "It’s a short intake about your goals, history and what you’ve tried before. A clinician reviews your answers, may follow up with questions, and builds a protocol matched to you — usually within 1–2 hours.",
    },
    {
      category: "Prescriptions",
      question: "Do I need a prescription?",
      answer:
        "Yes. Nothing ships without a prescription. You complete an online assessment, and a licensed provider reviews it and prescribes only what’s appropriate for you — no prior prescription needed to start.",
    },
    {
      category: "Prescriptions",
      question: "What happens if a protocol isn’t right for me?",
      answer:
        "Then it isn’t prescribed. If the clinician reviewing your intake decides a compound isn’t appropriate — or that something else fits you better — they’ll tell you and propose the alternative. You’re not charged until a protocol is approved.",
    },
    {
      category: "Shipping",
      question: "How fast is shipping?",
      answer:
        "Most protocols are reviewed within 1–2 hours and leave the compounding pharmacy within two business days. Delivery is free on orders over $50, and temperature-controlled wherever the compound requires it.",
    },
    {
      category: "Shipping",
      question: "What’s in the box?",
      answer:
        "Your prescribed vial, sterile syringes, bacteriostatic water for reconstitution, alcohol swabs and a sharps disposal option — plus full reconstitution and injection instructions. Everything ships discreetly in unbranded packaging.",
    },
    {
      category: "Billing",
      question: "Can I change or cancel?",
      answer:
        "Anytime, from your account. If your goals change, message us and we’ll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
    },
    {
      category: "Billing",
      question: "Do you take insurance?",
      answer:
        "No — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we’ll email you when it goes live.",
    },
    {
      category: "Safety",
      question: "Where are the medications made?",
      answer:
        "All compounds are made at licensed, accredited U.S. 503A/503B pharmacies, batch-tested for purity and potency before they’re dispensed to you.",
    },
    {
      category: "Safety",
      question: "Are SYNC’s peptides safe and legal?",
      answer:
        "Every protocol is prescribed by a licensed U.S. provider and compounded at accredited 503A/503B pharmacies. Compounded medications are not FDA-approved; your provider reviews whether treatment is appropriate for you before anything ships.",
    },
  ],
};

/** Closing CTA on the contact page (Figma 1108:8094). */
export const contactCta: FinalCtaContent = {
  eyebrow: "Still have a question?",
  heading: "Ask before you order.",
  subtext:
    "Our care team would rather talk you out of the wrong protocol than sell you one. Message us and a human will answer.",
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
};

export const finalCta: FinalCtaContent = {
  eyebrow: "Your protocol, your body",
  heading: "Stop guessing.\nStart your protocol.",
  subtext:
    "Five-minute assessment.\nA licensed clinician builds it.\nNo charge until your protocol is approved.",
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
};

export const footer: FooterContent = {
  tagline:
    "Personalized, physician-supervised protocols for people who are intentional about their health.",
  socials: [
    { name: "instagram", href: "https://instagram.com" },
    { name: "linkedin", href: "https://linkedin.com" },
    { name: "facebook", href: "https://facebook.com" },
    { name: "youtube", href: "https://youtube.com" },
  ],
  navColumns: [
    {
      links: [
        { label: "About us", href: "/about" },
        { label: "Blog", href: "/journal" },
        { label: "How it works", href: "/how-it-works" },
        { label: "FAQs", href: "/faqs" },
        { label: "Contact", href: "/contact" },
        { label: "Patient login", href: "/login" },
      ],
    },
    {
      links: [
        { label: "Shipping & Delivery", href: "/shipping", muted: true },
        { label: "Refund Policy", href: "/refund-policy", muted: true },
        { label: "Privacy Policy", href: "/privacy-policy", muted: true },
        { label: "Telehealth consent", href: "/consent-to-telehealth", muted: true },
        { label: "Terms & Conditions", href: "/terms", muted: true },
        { label: "Press kit", href: "/press", muted: true },
      ],
    },
  ],
  newsletter: {
    text: "Clinician-guided wellness plans and updates. No spam.",
    placeholder: "Enter email",
    ctaLabel: "Subscribe",
  },
  disclaimer:
    "Compounded medications offered through SYNC are produced in FDA-registered facilities but are not FDA-approved and have not been evaluated by the FDA for safety, efficacy or quality. These statements have not been evaluated by the Food and Drug Administration and are not intended to diagnose, treat, cure or prevent any disease.",
  payments: [
    { src: "/images/footer/pay-paypal.svg", alt: "PayPal" },
    { src: "/images/footer/pay-mastercard.svg", alt: "Mastercard" },
    { src: "/images/footer/pay-maestro.svg", alt: "Maestro" },
    { src: "/images/footer/pay-visa.svg", alt: "Visa" },
    { src: "/images/footer/pay-amex.svg", alt: "American Express" },
    { src: "/images/footer/pay-klarna.svg", alt: "Klarna" },
    { src: "/images/footer/pay-jcb.svg", alt: "JCB" },
    { src: "/images/footer/pay-venmo.svg", alt: "Venmo" },
    { src: "/images/footer/pay-applepay.svg", alt: "Apple Pay" },
    { src: "/images/footer/pay-gpay.svg", alt: "Google Pay" },
  ],
};

export const hero: HeroContent = {
  headline: "We're simplifying the path to the Good Life",
  subheadline:
    "Clinician-reviewed peptide protocols, compounded in US pharmacies and delivered to your door.",
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
  backgroundImage: {
    src: "/images/hero-bg.jpg",
    alt: "",
  },
};

/* --- About page (Figma 1115:10081) ------------------------------------
   Sections unique to /about are typed here; the ones it shares with the
   home page (how-it-works, compare, quality, testimonials, protocols,
   journal, closing CTA) reuse those components with about-specific copy. */

export type AboutHeroContent = {
  eyebrow: string;
  heading: string;
  body: RichTextValue;
  image: { src: string; alt: string };
};

export type FounderNote = {
  name: string;
  role: string;
  quote: string;
  photo: string;
};

export type FounderNotesContent = {
  eyebrow: string;
  heading: string;
  notes: FounderNote[];
};

export type TimelineStep = { year: string; title: string; body: RichTextValue };

export type TimelineContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  steps: TimelineStep[];
};

export type Principle = { number: string; title: string; body: RichTextValue };

export type PrinciplesContent = {
  eyebrow: string;
  heading: string;
  image: { src: string; alt: string };
  principles: Principle[];
};

export type CoverageContent = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  map: { src: string; alt: string };
  /** Marker positions as percentages of the map box. */
  markers: { x: number; y: number }[];
};

export type TeamMember = {
  name: string;
  role: string;
  /** Grouping pill under the name, e.g. "Management". */
  tag: string;
  photo: string;
};

export type TeamContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  members: TeamMember[];
};

export type CareersContent = {
  eyebrow: string;
  heading: string;
  body: RichTextValue;
  ctaLabel: string;
  ctaHref: string;
  /** Pre-composed artwork — the staggered grid and its edge fade are baked in. */
  collage: { src: string; alt: string };
};

export const aboutHero: AboutHeroContent = {
  eyebrow: "About Sync",
  heading: "We built the system we couldn’t find.",
  body: "Peptides were everywhere and nowhere. Research chemicals sold with a wink. Forums doing the job of physicians. Telehealth platforms that were really just order forms with a doctor’s signature at the end. We wanted the version where a clinician actually decides so we built it.",
  image: {
    src: "/images/about/hero.jpg",
    alt: "A Sync. member with her monthly protocol",
  },
};

export const founderNotes: FounderNotesContent = {
  eyebrow: "Founder’s note",
  heading: "A note from the founder",
  notes: [
    {
      name: "Amelia",
      role: "Co-Founder @SYNC Health",
      photo: "/images/about/founder-amelia.jpg",
      quote:
        "Peptides were everywhere and nowhere — research chemicals, forum advice, telehealth forms that auto-generated prescriptions. We built SYNC because we wanted a clinician to actually read your history, look at your labs, and decide. Everything is compounded individually, third-party tested, and revisited every cycle. The version of you that started is not the version of you three months in.",
    },
    {
      name: "Patrick",
      role: "Co-Founder @SYNC Health",
      photo: "/images/about/founder-patrick.jpg",
      quote:
        "I watched patients cycle through vendors and template scripts with no one tracking how they responded. Medicine isn’t a transaction — it’s a conversation that evolves. At SYNC, a licensed provider reviews your history and goals, your protocol is compounded specifically for you and tested before it ships, and we revisit it every cycle.",
    },
  ],
};

export const aboutHowItWorks: HowItWorksContent = {
  eyebrow: "How it works",
  heading: "The path to your protocol.",
  subtext:
    "From your intake to your door, every protocol is built by a licensed US clinician around who you are and where you’re headed.",
  cardImage: "/images/step-portrait.png",
  steps: [
    {
      number: "01",
      title: "Take the assessment.",
      description:
        "Your goals, your body, your history — everything your clinician needs to build a protocol around you.",
    },
    {
      number: "02",
      title: "Clinician-built protocol.",
      description:
        "A licensed US clinician reviews your intake, decides if a protocol is right for you, and prescribes the compound, dose and cycle for your body. Approved within 24 hours.",
    },
    {
      number: "03",
      title: "Delivered. Then evolved.",
      description:
        "Compounded at a licensed US pharmacy and shipped to you discreetly. Monthly check-ins keep your clinician involved, your dosing on track, and your protocol aligned with where you’re headed.",
    },
  ],
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
};

export const timeline: TimelineContent = {
  eyebrow: "The road here",
  heading: "Four years, one argument.",
  subtext:
    "We started because the honest version of this category did not exist. Every step since has been about moving the decision further away from the customer and closer to a clinician.",
  steps: [
    {
      year: "2022",
      title: "The problem, named",
      body: "Two years of watching people run compounds off forum threads. We start mapping what a clinician-led version would actually require — licensing, pharmacy, testing, all of it.",
    },
    {
      year: "2023",
      title: "Clinicians first",
      body: "We build the intake before we build the store. First providers licensed across multiple states join, and the rule is set: a protocol is a clinical decision or it is nothing.",
    },
    {
      year: "2024",
      title: "Pharmacy and proof",
      body: "Partnership with an FDA-registered compounding pharmacy operating under cGMP. Independent third-party batch testing becomes non-negotiable on every lot we dispense.",
    },
    {
      year: "2026",
      title: "Protocols that adapt",
      body: "Cycle-based check-ins ship. Your clinician sees what actually happened and adjusts compound, dose or cadence — the part most platforms never built.",
    },
  ],
};

export const aboutCompare: CompareContent = {
  ...compare,
  eyebrow: "Side by side",
  heading: "A higher standard of care.",
  subtext: "Because the compound is only as good as the care around it.",
  features: [
    "A clinician chooses the compound, dose and cycle for your body",
    "Every batch third-party tested for purity, potency and sterility",
    "Protocol adjusted every cycle",
    "Intake covers what you’ve run and how it went",
    "A clinician you can message",
    "Approved within 24 hours",
  ],
  sync: Array.from({ length: 6 }, () => ({ type: "check" as const })),
  competitors: [
    {
      title: "Grey market",
      cells: [
        { type: "text", text: "You decide" },
        { type: "text", text: "Unregulated" },
        { type: "cross" },
        { type: "cross" },
        { type: "cross" },
        { type: "cross" },
      ],
    },
    {
      title: "Generic telehealth",
      cells: [
        { type: "text", text: "Template" },
        { type: "text", text: "Varies" },
        { type: "cross" },
        { type: "text", text: "Basic form" },
        { type: "text", text: "Support queue" },
        { type: "text", text: "2-5 days" },
      ],
    },
  ],
};

export const principles: PrinciplesContent = {
  eyebrow: "What we hold to",
  heading: "Four rules we don’t bend.",
  image: {
    src: "/images/about/hero.jpg",
    alt: "A Sync. member with her monthly protocol",
  },
  principles: [
    {
      number: "01",
      title: "A clinician decides, not a cart",
      body: "You can tell us what you are interested in. You cannot tell us what to prescribe. The person with the license makes the call, and sometimes that call is no.",
    },
    {
      number: "02",
      title: "Compounded, never sourced",
      body: "Every vial is prepared for you by a licensed US compounding pharmacy. We do not resell research chemicals, and we do not import from unregulated suppliers.",
    },
    {
      number: "03",
      title: "Tested, then tested again",
      body: "Purity, potency, sterility and endotoxins — verified by an independent lab on every batch, with results your clinician can pull up.",
    },
    {
      number: "04",
      title: "The protocol is allowed to change",
      body: "Cycle two should not look like cycle one. We check in, read what happened, and adjust. A protocol that never changes was never personalised.",
    },
  ],
};

export const coverage: CoverageContent = {
  eyebrow: "Why Sync?",
  heading: "Science backed, nationwide coverage",
  paragraphs: [
    "Practicing telemedicine across all 50 states, we make it easy for you to start your journey online. Whether you begin with a lab test or a therapy, you’ll receive personalized care with access to a dedicated coach for one-on-one guidance. We’re here to support you every step of the way.",
    "And the best part? We believe in transparency. No hidden fees, just clear, honest pricing. We’re here for you, welcome to SYNC Health.",
  ],
  map: { src: "/images/about/coverage-map.png", alt: "Map of the United States" },
  // Percentages of the 1296×600 map box the Figma positions them in.
  markers: [
    { x: 19.98, y: 18.95 },
    { x: 22.98, y: 46.95 },
    { x: 24.97, y: 26.95 },
    { x: 28.97, y: 40.95 },
    { x: 30.97, y: 15.95 },
    { x: 30.97, y: 57.95 },
    { x: 27.98, y: 72.95 },
    { x: 45.97, y: 40.95 },
    { x: 46.97, y: 65.95 },
    { x: 46.97, y: 19.95 },
    { x: 48.97, y: 20.95 },
    { x: 51.97, y: 51.95 },
    { x: 54.97, y: 61.95 },
    { x: 61.97, y: 54.95 },
    { x: 63.97, y: 29.95 },
    { x: 69.97, y: 24.95 },
    { x: 69.97, y: 44.95 },
    { x: 69.97, y: 64.95 },
    { x: 76.97, y: 25.95 },
  ],
};

export const team: TeamContent = {
  eyebrow: "Clinical team, advisors, investors",
  heading: "The people accountable for the decision.",
  subtext:
    "Prescribing providers are licensed in the states they serve. Advisors have no prescribing authority and no say in any individual protocol.",
  members: [
    {
      name: "Amelie Jane",
      role: "Chief Executive Officer",
      tag: "Management",
      photo: "/images/about/team/amelie-jane.jpg",
    },
    {
      name: "Ronald Martinez",
      role: "Chief Technology Officer",
      tag: "Management",
      photo: "/images/about/team/ronald-martinez.jpg",
    },
    {
      name: "Charles Lee",
      role: "Pharmacy Liaison",
      tag: "Advisor",
      photo: "/images/about/team/charles-lee.jpg",
    },
    {
      name: "Barbara Wilson",
      role: "Scientific Advisor",
      tag: "Peptide pharmacology",
      photo: "/images/about/team/barbara-wilson.jpg",
    },
    {
      name: "Deborah Rodriguez",
      role: "Medical Assistant",
      tag: "Assistant",
      photo: "/images/about/team/deborah-rodriguez.jpg",
    },
    {
      name: "Mary Anderson",
      role: "Nursing Assistant",
      tag: "Assistant",
      photo: "/images/about/team/mary-anderson.jpg",
    },
    {
      name: "Karen",
      role: "Sales Manager",
      tag: "Team",
      photo: "/images/about/team/karen.jpg",
    },
    {
      name: "Carol Mitchell",
      role: "Marketing Coordinator",
      tag: "Team",
      photo: "/images/about/team/carol-mitchell.jpg",
    },
  ],
};

export const aboutQuality: QualityContent = {
  eyebrow: "Why patients choose Sync",
  heading: "Clinical care that stays with you.",
  supporting:
    "The people, the pharmacy, and the process behind every protocol.",
  // The icon filenames don't describe what they draw: clinical.svg is the
  // clipboard, safe.svg the pen, trusted.svg the shield-check. Paired here to
  // the glyphs the Figma shows, not to the names.
  features: [
    {
      icon: "/images/quality/clinical.svg",
      title: "Physician-supervised care",
      description:
        "A licensed US physician reviews your intake, prescribes your protocol, and stays with you through it.",
    },
    {
      icon: "/images/quality/safe.svg",
      title: "Compounded, not sourced",
      description:
        "Sourced from US-based, licensed pharmacies for consistent quality.",
    },
    {
      icon: "/images/quality/trusted.svg",
      title: "Tested every batch",
      description:
        "Every batch is tested by an independent lab for purity, potency and sterility.",
    },
    {
      icon: "/images/quality/delivery.svg",
      title: "Approved in 24 hours",
      description:
        "Reviewed the same day. Delivered discreetly to your door, tracked and temperature-controlled where the compound requires it.",
    },
  ],
};

export const careers: CareersContent = {
  eyebrow: "Work with Sync",
  heading: "We are hiring people who would rather be right than fast.",
  body: "Remote-first, flexible hours, and a bar for evidence that occasionally slows us down on purpose. Clinical, engineering, operations and content.",
  ctaLabel: "Job openings",
  ctaHref: "/contact",
  collage: { src: "/images/about/careers-collage.png", alt: "" },
};

export const aboutTestimonials: TestimonialsContent = {
  ...testimonials,
  eyebrow: "From the community",
  heading: "The ones who stopped guessing.",
};

export const aboutProtocols: ProtocolsContent = {
  ...protocols,
  eyebrow: "Explore protocols",
  heading: "Optimise for what matters most.",
  subtext: "Every goal is personal. Every protocol is built around yours.",
};

export const aboutBlog: BlogContent = {
  ...blog,
  eyebrow: "The journal",
  heading: "The SYNC journal.",
  ctaLabel: "Read the journal",
};

export const aboutCta: FinalCtaContent = {
  eyebrow: "Personalised protocol, tailored",
  heading: "Your version of in SYNC starts here.",
  subtext:
    "Take the intake, get a clinician’s read, and start a protocol built around your body — or find out it isn’t the right moment. Both answers are free.",
  ctaLabel: "Start your protocol",
  ctaHref: "/start",
};

export const bpc157Product: ProductContent = {
  slug: "bpc-157",
  eyebrow: "Recovery",
  name: "BPC-157",
  description:
    "BPC-157 is a synthetic peptide based on a protective compound the body produces in the gut. It's studied for how it works with the body's own repair process across the tissue that takes the most load — tendon, ligament, muscle and the gut lining.",
  tagline: "Tissue repair, joint and gut support.",
  gallery: {
    main: "/images/pdp/hero-main.png",
    thumbnails: [
      "/images/pdp/thumb-color.png",
      "/images/pdp/thumb-color.png",
      "/images/pdp/thumb-color.png",
      "/images/pdp/thumb-color.png",
      "/images/pdp/thumb-color.png",
      "/images/pdp/thumb-color.png",
    ],
  },
  trust: [
    { icon: "/images/pdp/check.svg", label: "Physician-supervised" },
    { icon: "/images/pdp/check.svg", label: "Licensed US compounding pharmacy" },
    { icon: "/images/pdp/check.svg", label: "Third-party tested" },
    { icon: "/images/pdp/check.svg", label: "Prescription-only" },
  ],
  methodLabel: "Injection method",
  methods: [
    { image: "/images/pdp/method-1.png", alt: "Subcutaneous injection" },
    { image: "/images/pdp/method-2.png", alt: "Nasal spray" },
    { image: "/images/pdp/method-3.png", alt: "Oral capsules" },
  ],
  price: { amount: "$225.00", period: "/month" },
  planLabel: "Select a plan",
  plans: [
    { label: "Monthly", price: "$225.00", period: "/month" },
    {
      label: "3-Month",
      price: "$189.00",
      period: "/month",
      badge: { text: "Clinically recommended", variant: "recommended" },
      save: "Save $108",
    },
    {
      label: "6-Month",
      price: "$166.00",
      period: "/month",
      badge: { text: "Best Value", variant: "best" },
      save: "Save $354",
    },
  ],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "BPC-157 is a synthetic peptide modelled on a sequence found in a protein the body produces to protect and repair the gut. As a compounded protocol, it's studied for its role in cellular signalling — the messaging that tells tissue where and when to repair, form new blood supply, and reduces inflammation. It's one of the most researched peptides in recovery, which is why most protocols start here.",
    },
    {
      title: "How it's used",
      body: "BPC-157 is typically administered as a daily subcutaneous injection over a defined cycle — usually run in blocks rather than continuously. Your clinician sets your exact dose, timing, and cycle length from your intake, and it may be adjusted at your first monthly check-in based on how you're responding. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade BPC-157, compounded to your prescription at a licensed US 503A/503B pharmacy. Supplied as a lyophilised (freeze-dried) powder for reconstitution with bacteriostatic water, refrigerated after mixing, and used within the stability window your clinician confirms.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/bpc-157",
  why: {
    heading: "Why BPC-157",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Connective tissue repair",
        description: "Supports the repair of tendon, ligament and muscle.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Gut integrity",
        description: "Supports the gut lining and digestive health.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Inflammation support",
        description:
          "Helps reduce the inflammation that follows training or injury.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Joint comfort",
        description: "Supports everyday mobility and joint movement.",
      },
    ],
  },
  qualityTest: {
    heading: "Tested every batch. Independently.",
    collage: [
      "/images/pdp/quality-a.png",
      "/images/pdp/quality-b.png",
      "/images/pdp/quality-a.png",
    ],
    lead: "Every SYNC protocol is compounded at a licensed US 503A/503B pharmacy and third-party tested — every batch, against four pharmacopoeia standards.",
    body: "If a batch doesn't pass all four, it doesn't ship.",
    tests: [
      {
        name: "Potency",
        status: "Passed",
        description:
          "Confirms the vial contains what the label says — active ingredient within ±10% of prescribed concentration.",
      },
      {
        name: "Sterility",
        status: "Passed",
        description:
          "Tested against USP 797 to confirm the compound is free from bacterial or fungal contamination.",
      },
      {
        name: "pH balance",
        status: "Passed",
        description:
          "Balanced to minimise irritation at the injection site and remain compatible with the body.",
      },
      {
        name: "Endotoxins",
        status: "Passed",
        description:
          "Tested against USP 85 to confirm bacterial endotoxin levels are within safe limits — protecting against fever and adverse reactions.",
      },
    ],
  },
  howItWorks: howItWorks,
  faq: {
    eyebrow: "FAQ",
    heading: "Everything worth asking.",
    subtext: "Protocols, prescriptions, and what happens after you order.",
    ctaLabel: "Contact our care team",
    ctaHref: "/contact",
    items: [
      {
        question: "Is BPC-157 FDA-approved?",
        answer:
          "No compounded medication is FDA-approved, including BPC-157. It's prepared to your prescription at a licensed US 503A/503B compounding pharmacy, which operates under FDA-registered oversight and state pharmacy law. In July 2026 a federal advisory committee recommended BPC-157 be added to the compoundable substances list — a formal recognition, though not a final ruling. Your clinician reviews whether treatment is appropriate for you before anything ships.",
      },
      {
        question: "Who is BPC-157 prescribed for, and who is it not right for?",
        answer:
          "BPC-157 may be considered for adults where, following a comprehensive clinical assessment, a prescribing practitioner determines it is appropriate as part of an individualised treatment plan. Not everyone will be suitable for treatment. Your clinician will review your medical history, current medications, and individual circumstances before making a prescribing decision. If BPC-157 is not considered appropriate for you, your clinician will explain why and discuss alternative options where appropriate.",
      },
      {
        question: "Do I need bloodwork before starting?",
        answer:
          "Not typically for BPC-157. Your intake and health history are usually enough for your clinician to build a protocol. If they want bloodwork to inform your specific case, they'll ask — but it's not a routine gate to starting. We're also introducing bloodwork tracking soon to help you and your clinician measure how your protocol is progressing over time.",
      },
      {
        question: "Can I stack BPC-157 with other compounds or supplements?",
        answer:
          "Yes, in many cases. BPC-157 is often run alongside other recovery peptides or as part of a broader protocol — that's why our Advanced blends exist. If you're already running something else (peptide, hormone, or medication), share it in your intake. Your clinician builds the protocol around what you're on, not against it.",
      },
      {
        question: "How will I know it's working?",
        answer:
          "Everyone responds differently, and it depends on what your body is working through. Most people notice something in the first month — a joint that settles, gut symptoms easing, better sleep — but months two and three are usually where the real changes land. Your clinician checks in monthly and adjusts if you're not seeing what you should be.",
      },
      {
        question: "What happens if I need to pause, change, or cancel?",
        answer:
          "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What's included when it ships?",
        answer:
          "Your prescribed vial, sterile syringes, bacteriostatic water for reconstitution, alcohol swabs, and a sharps disposal option. Full reconstitution and injection instructions are included in the box and reviewed in your care portal. Everything ships discreetly and temperature-controlled where required.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer:
          "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Do you take insurance, HSA, or FSA?",
        answer:
          "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

/* --- Remaining compound PDPs (copy from the client's review doc) -----------
   Locked/shared sections (trust, quality panel, locked FAQ answers) are
   factored into constants; each compound supplies only its variable copy.
   NOTE: pricing and vial imagery are PLACEHOLDERS — the doc marks both
   "pending" for every compound, and they are CMS-editable. */

const PDP_GALLERY: ProductContent["gallery"] = {
  main: "/images/pdp/hero-main.png",
  thumbnails: [
    "/images/pdp/thumb-color.png",
    "/images/pdp/thumb-color.png",
    "/images/pdp/thumb-color.png",
    "/images/pdp/thumb-color.png",
    "/images/pdp/thumb-color.png",
    "/images/pdp/thumb-color.png",
  ],
};

/** Stands in when an editor adds a trust line and leaves the icon empty. */
export const TRUST_ICON = "/images/pdp/check.svg";

const PDP_TRUST: ProductTrust[] = [
  { icon: TRUST_ICON, label: "Physician-supervised" },
  { icon: TRUST_ICON, label: "Licensed US compounding pharmacy" },
  { icon: TRUST_ICON, label: "Third-party tested" },
  { icon: TRUST_ICON, label: "Prescription-only" },
];

const PDP_METHODS: ProductMethod[] = [
  { image: "/images/pdp/method-1.png", alt: "Subcutaneous injection" },
  { image: "/images/pdp/method-2.png", alt: "Nasal spray" },
  { image: "/images/pdp/method-3.png", alt: "Oral capsules" },
];

// Placeholder pricing — every compound below is "$[TBC]" in the doc.
const PDP_PRICE = { amount: "$225.00", period: "/month" };
const PDP_PLANS: ProductPlan[] = [
  { label: "Monthly", price: "$225.00", period: "/month" },
  {
    label: "3-Month",
    price: "$189.00",
    period: "/month",
    badge: { text: "Clinically recommended", variant: "recommended" },
    save: "Save $108",
  },
  {
    label: "6-Month",
    price: "$166.00",
    period: "/month",
    badge: { text: "Best Value", variant: "best" },
    save: "Save $354",
  },
];

const PDP_CTA = {
  label: "Start your protocol",
  href: "/start",
  note: "Charged only after your protocol is approved. Cancel anytime.",
};

// LOCKED — reused verbatim as the fourth accordion on every PDP.
const PDP_QUALITY_ACCORDION: ProductAccordionItem = {
  title: "How SYNC ensures quality",
  body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
};

// LOCKED — the quality panel is identical across every PDP.
const PDP_QUALITY: ProductQualityContent = {
  heading: "Tested every batch. Independently.",
  collage: [
    "/images/pdp/quality-a.png",
    "/images/pdp/quality-b.png",
    "/images/pdp/quality-a.png",
  ],
  lead: "Every SYNC protocol is compounded at a licensed US 503A/503B pharmacy and third-party tested — every batch, against four pharmacopoeia standards.",
  body: "If a batch doesn't pass all four, it doesn't ship.",
  tests: [
    {
      name: "Potency",
      status: "Passed",
      description:
        "Confirms the vial contains what the label says — active ingredient within ±10% of prescribed concentration.",
    },
    {
      name: "Sterility",
      status: "Passed",
      description:
        "Tested against USP 797 to confirm the compound is free from bacterial or fungal contamination.",
    },
    {
      name: "pH balance",
      status: "Passed",
      description:
        "Balanced to minimise irritation at the injection site and remain compatible with the body.",
    },
    {
      name: "Endotoxins",
      status: "Passed",
      description:
        "Tested against USP 85 to confirm bacterial endotoxin levels are within safe limits — protecting against fever and adverse reactions.",
    },
  ],
};

/** Cycled through the benefit cards when an editor leaves an icon empty. */
export const PDP_WHY_ICONS = [
  "/images/pdp/icon-cellular.svg",
  "/images/pdp/icon-tissue.svg",
  "/images/pdp/icon-optimized.svg",
  "/images/pdp/icon-research.svg",
];

// LOCKED FAQ answers reused verbatim across PDPs.
const FAQ_PAUSE: FaqItem = {
  question: "What happens if I need to pause, change, or cancel?",
  answer:
    "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
};
const FAQ_RUNOUT: FaqItem = {
  question: "What if I run out mid-cycle?",
  answer:
    "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
};
const FAQ_INSURANCE: FaqItem = {
  question: "Do you take insurance, HSA, or FSA?",
  answer:
    "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
};

/** Build a full ProductContent from a compound's variable copy, folding in the
    shared/locked sections and placeholder pricing/imagery. */
function makeProduct(p: {
  slug: string;
  eyebrow: string;
  name: string;
  description: string;
  tagline: string;
  methodLabel?: string;
  accordion: ProductAccordionItem[];
  benefits: { title: string; description: string }[];
  faqItems: FaqItem[];
}): ProductContent {
  return {
    slug: p.slug,
    eyebrow: p.eyebrow,
    name: p.name,
    description: p.description,
    tagline: p.tagline,
    gallery: PDP_GALLERY,
    trust: PDP_TRUST,
    methodLabel: p.methodLabel ?? "Injection method",
    methods: PDP_METHODS,
    price: PDP_PRICE,
    planLabel: "Select a plan",
    plans: PDP_PLANS,
    cta: PDP_CTA,
    accordion: [...p.accordion, PDP_QUALITY_ACCORDION],
    safetyLabel: "Important Safety Information",
    safetyHref: `/important-safety-information/${p.slug}`,
    why: {
      heading: `Why ${p.name}`,
      features: p.benefits.map((b, i) => ({
        icon: PDP_WHY_ICONS[i % PDP_WHY_ICONS.length],
        title: b.title,
        description: b.description,
      })),
    },
    qualityTest: PDP_QUALITY,
    howItWorks,
    faq: {
      eyebrow: "FAQ",
      heading: "Everything worth asking.",
      subtext: "Protocols, prescriptions, and what happens after you order.",
      ctaLabel: "Contact our care team",
      ctaHref: "/contact",
      items: p.faqItems,
    },
  };
}

/**
 * What a product created in Storyblok falls back to, field by field, for
 * anything its editor has not filled in yet.
 *
 * The shared furniture is here in full, because it reads the same on every
 * compound and nobody should have to retype it: the trust badges, the
 * injection methods, the quality panel, how it works, the FAQ header, the
 * safety link. Everything specific to a compound is left empty, and the route
 * drops the sections that would otherwise render as a heading with nothing
 * under it. Compounds defined in this file keep falling back to their own
 * object, so nothing about them changes.
 *
 * No price and no plans on purpose: the product hero reads that as "not
 * priceable yet" and points the button at the intake instead of the cart,
 * which is the honest state for a product still being written.
 */
export const blankProduct: ProductContent = {
  slug: "",
  eyebrow: "",
  name: "",
  description: "",
  tagline: "",
  gallery: PDP_GALLERY,
  trust: PDP_TRUST,
  methodLabel: "Injection method",
  methods: PDP_METHODS,
  price: { amount: "", period: "" },
  planLabel: "Select a plan",
  plans: [],
  cta: PDP_CTA,
  accordion: [],
  safetyLabel: "Important Safety Information",
  // No default destination: there is no safety page behind that path, and a
  // product created in the CMS should show no link rather than a dead one.
  // Fill the field on the story once a real page exists.
  safetyHref: "",
  why: { heading: "", features: [] },
  qualityTest: PDP_QUALITY,
  howItWorks,
  faq: {
    eyebrow: "FAQ",
    heading: "Everything worth asking.",
    subtext: "Protocols, prescriptions, and what happens after you order.",
    ctaLabel: "Contact our care team",
    ctaHref: "/contact",
    items: [],
  },
};

export const sermorelinProduct: ProductContent = makeProduct({
  slug: "sermorelin",
  eyebrow: "Performance",
  name: "Sermorelin",
  description:
    "Sermorelin is a peptide modelled on GHRH — the brain's signal to release growth hormone — prompting the body to produce its own rather than replacing it. In protocol, it's used to support what changes as GH output declines through midlife: sleep quality, training recovery, and body composition.",
  tagline: "Sleep, recovery and lean composition.",
  accordion: [
    {
      title: "What it is",
      body: "Sermorelin is a synthetic version of GHRH (growth hormone releasing hormone), the signal the brain sends to the pituitary to prompt GH release. Rather than adding hormone from outside, it works upstream: signalling the body to produce its own, in the natural pulsatile rhythm the endocrine system is built for. That's why it's the peptide most often chosen when the goal is supporting the system, not overriding it.",
    },
    {
      title: "How it's used",
      body: "Sermorelin is typically administered as a subcutaneous injection before bed — timing that aligns with the body's natural overnight GH release. Your clinician sets your exact dose, cycle length, and any titration schedule based on your intake, and it's often prescribed in longer cycles than shorter-acting peptides. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade Sermorelin acetate, compounded to your prescription at a licensed US 503A/503B pharmacy. Supplied as a lyophilised powder for reconstitution with bacteriostatic water, refrigerated after mixing, and used within the stability window your clinician confirms.",
    },
  ],
  benefits: [
    { title: "Improves sleep quality", description: "Supports deeper, more restorative sleep." },
    { title: "Speeds recovery", description: "Supports faster recovery between sessions and after training." },
    { title: "Supports lean composition", description: "Supports lean body composition and healthy body weight." },
    { title: "Restores energy", description: "Supports everyday energy, drive, and vitality." },
  ],
  faqItems: [
    {
      question: "How is Sermorelin different from HGH?",
      answer:
        "HGH is a direct injection of synthetic growth hormone into the body. Sermorelin doesn't add hormone — it signals your pituitary to release its own, in the natural pulsatile rhythm your endocrine system is built for. That means the response is gradual rather than dramatic, and the body retains its own feedback control over how much GH it releases. It's the reason clinicians often reach for Sermorelin as the more considered option for supporting GH — particularly when the goal is long-term rather than a short performance push.",
    },
    {
      question: "Is Sermorelin FDA-approved?",
      answer:
        "Sermorelin was previously FDA-approved as a branded medication (Geref) and remains widely used today in compounded form under physician supervision. No compounded medication carries FDA approval — but every SYNC protocol is prepared at a licensed US 503A/503B pharmacy under FDA-registered oversight and state pharmacy law. Your clinician reviews whether treatment is appropriate for you before anything ships.",
    },
    {
      question: "Who is Sermorelin prescribed for — and can I take it if I'm on other therapies or medication?",
      answer:
        "Sermorelin is typically prescribed for adults noticing the sleep, recovery, and body composition shifts that come with declining GH output — usually from the mid-30s onward, in men and women. It's commonly run alongside other hormone therapies, peptide protocols, or ongoing medication — share what you're currently on in your intake and your clinician builds around it, not against it. It's not appropriate for pregnancy, active cancer, acute critical illness, or generally for anyone under 25 with naturally normal GH ranges. Sometimes your clinician's call is that Sermorelin isn't right for you — if so, they'll tell you why and no charge is made.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "Most people tolerate Sermorelin well. The most common reactions are transient — mild redness or swelling at the injection site, occasional flushing, or a warm sensation that passes within an hour. Some people notice mild water retention or tingling in the hands during the first weeks, which typically settles as your body adjusts. Rare reactions are covered in your Important Safety Information, and your clinician reviews your full profile before prescribing. Anything concerning while on protocol — you message us and we adjust.",
    },
    {
      question: "How will I know it's working, and when?",
      answer:
        "Sermorelin works gradually — it's supporting your body's own GH production, not adding it, so the response builds over cycles rather than in the first week. Most people notice sleep quality changes in the first three to four weeks. Recovery and body composition changes tend to land in months two and three. Some cycles need dose adjustments, which your clinician makes at monthly check-ins.",
    },
    FAQ_PAUSE,
    FAQ_RUNOUT,
    FAQ_INSURANCE,
  ],
});

export const nadProduct: ProductContent = makeProduct({
  slug: "nad",
  eyebrow: "Skin & Longevity",
  name: "NAD+",
  description:
    "NAD+ is a coenzyme every cell in the body needs to convert food into usable energy. As levels decline with age, NAD+ protocols are used to support the systems most affected — cellular energy, mental clarity, recovery, and the biological processes tied to healthy aging.",
  tagline: "Cellular energy, focus and healthy aging.",
  accordion: [
    {
      title: "What it is",
      body: "NAD+ (nicotinamide adenine dinucleotide) is one of the most fundamental molecules in human biology — present in every cell, and central to how energy is produced, DNA is repaired, and cellular stress is managed. It's not stored or supplemented like a vitamin; the body produces it continuously, and levels fall as production slows with age. Injected NAD+ is studied for how it supports the pathways most affected as those levels decline.",
    },
    {
      title: "How it's used",
      body: "NAD+ is typically administered as a subcutaneous injection, most often in the morning, over cycles set by your clinician. Your dose and schedule are built around your intake — some protocols start lower and titrate up over the first weeks.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade NAD+, compounded to your prescription at a licensed US 503A/503B pharmacy. Supplied as a sterile solution or lyophilised powder, refrigerated, and used within the stability window your clinician confirms.",
    },
  ],
  benefits: [
    { title: "Restores energy", description: "Supports cellular energy production and reduces fatigue." },
    { title: "Sharpens focus", description: "Supports mental clarity, cognitive performance, and focus." },
    { title: "Speeds recovery", description: "Supports recovery from physical and mental stress." },
    { title: "Supports healthy aging", description: "Supports DNA repair and cellular regeneration — central pathways for long-term resilience." },
  ],
  faqItems: [
    {
      question: "What does NAD+ actually do?",
      answer:
        "NAD+ is a coenzyme every cell in your body uses to convert food into energy, repair DNA, and manage cellular stress. As levels decline with age, those processes slow — which is why energy, focus, and recovery tend to shift. Supplementing NAD+ is used to restore what your cells rely on to function.",
    },
    {
      question: "Can NAD+ actually slow down aging?",
      answer:
        "NAD+ plays a role in some of the biological processes tied to aging — DNA repair, mitochondrial function, and cellular resilience. Research supports its role in maintaining those systems, but \"reversing\" aging is overstated by the wider market. What's honest: NAD+ is used to support the systems most affected by aging, and most people notice that as sustained energy, clearer focus, and better recovery — not dramatic transformation.",
    },
    {
      question: "Is subcutaneous NAD+ injection as effective as IV?",
      answer:
        "IV NAD+ is delivered directly into the bloodstream — fast, but sessions can take 60–90 minutes and often come with intense flushing or chest pressure. Subcutaneous NAD+ delivers more gradually, with a gentler side effect profile and consistent, at-home cycles. For most people looking to sustain NAD+ levels over time, subcutaneous is the more practical route.",
    },
    {
      question: "Is NAD+ FDA-approved?",
      answer:
        "NAD+ itself is a naturally occurring coenzyme, not a drug. The compounded NAD+ used in injections is prepared to your prescription at a licensed US 503A/503B pharmacy under FDA-registered oversight. Compounded medications don't carry FDA approval — your clinician reviews whether it's appropriate for you before anything ships.",
    },
    {
      question: "Who is NAD+ prescribed for — and can I take it with other therapies?",
      answer:
        "NAD+ is typically prescribed for adults noticing energy, focus, or recovery shifts — usually from midlife onward, in men and women. It's commonly run alongside peptides, hormone therapies, or other protocols; share whatever you're currently on in your intake. It's not appropriate during pregnancy, active cancer, or certain chemotherapy regimens without specialist input.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "Most people tolerate subcutaneous NAD+ well. Common reactions during injection are transient — flushing, warmth, mild chest pressure, or tingling that passes within a few minutes. Injecting slowly and staying hydrated reduces most of these. Rare reactions are covered in your Important Safety Information.",
    },
    {
      question: "How will I know it's working, and when?",
      answer:
        "NAD+ works cumulatively. Most people notice energy and mental clarity changes within three to four weeks; recovery and longer-term effects build over months two and three. Your clinician checks in monthly and adjusts if you're not seeing what you should be.",
    },
    FAQ_PAUSE,
  ],
});

export const pt141Product: ProductContent = makeProduct({
  slug: "pt-141",
  eyebrow: "Hormonal Health",
  name: "PT-141",
  description:
    "PT-141 is a peptide studied for how it supports sexual desire — acting on the brain's pathways for arousal and emotional response, independent of hormonal systems. It's used in protocols for men and women where desire has quieted despite everything else being in place.",
  tagline: "Sexual desire and arousal support.",
  accordion: [
    {
      title: "What it is",
      body: "PT-141, also known as bremelanotide, is a synthetic melanocortin peptide — a class of compounds that acts on receptors in the brain involved in sexual response. Rather than affecting blood flow or hormone levels, it works in the central nervous system, on the pathways that shape sexual desire itself. It's used in men and women whose desire has quieted, particularly when other approaches haven't been the answer.",
    },
    {
      title: "How it's used",
      body: "PT-141 is typically administered as a subcutaneous injection taken as needed, roughly 30 to 60 minutes before intimacy — not on a daily cycle like most SYNC protocols. Your clinician sets your dose and how often it can be used based on your intake, and adjusts if you're not seeing what you should be.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade PT-141 (bremelanotide), compounded to your prescription at a licensed US 503A/503B pharmacy. Supplied as a sterile solution, refrigerated, and used within the stability window your clinician confirms.",
    },
  ],
  benefits: [
    { title: "Restored desire", description: "Supports sexual desire and the wanting to be intimate." },
    { title: "Faster responsiveness", description: "Supports the body's arousal response and time to arousal." },
    { title: "Non-hormonal support", description: "Acts on the nervous system rather than hormones or blood flow." },
    { title: "Emotional connection", description: "Supports the psychological side of intimacy and confidence with your partner." },
  ],
  faqItems: [
    {
      question: "How is PT-141 different from Viagra or Cialis?",
      answer:
        "Viagra and Cialis work on blood flow — they help the physical mechanics of arousal once desire is already there. PT-141 works differently: it acts on the central nervous system pathways involved in desire itself. It's used when the mechanics aren't the issue — when the wanting has quieted. Some people use PT-141 alongside vascular support like Viagra, but they answer different problems.",
    },
    {
      question: "Is PT-141 FDA-approved?",
      answer:
        "A version of PT-141 (marketed as Vyleesi) is FDA-approved as a prescription treatment for hypoactive sexual desire — the compound itself has been through FDA review, human trials, and clinical use. Compounded PT-141, like all compounded medications, isn't itself FDA-approved and is prepared to your prescription at a licensed US 503A/503B pharmacy under FDA-registered oversight. Your clinician reviews whether treatment is appropriate for you before anything ships.",
    },
    {
      question: "Who is PT-141 prescribed for — and can I take it if I'm on other therapies?",
      answer:
        "PT-141 is prescribed for adults noticing that sexual desire has quieted despite otherwise being in good health — in both men and women, typically from the mid-30s onward. It's commonly prescribed alongside TRT, HRT, ED medications, or other protocols; share whatever you're currently on in your intake. It's not appropriate for pregnancy, uncontrolled high blood pressure, or a history of cardiovascular events. Sometimes your clinician's call is that PT-141 isn't right for you — if so, they'll tell you why and no charge is made.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "The most common reactions are transient — mild nausea, flushing, and occasional headache, usually within an hour or two of the injection. Some people notice gradual darkening of the skin, gums, or freckles with repeated use over time. This risk is reduced with less frequent use, which is why the clinical protocol limits monthly doses and why your clinician calibrates how often you use it. PT-141 can also cause a mild temporary rise in blood pressure, which is why your clinician reviews your cardiovascular history before prescribing. Anything concerning — you message us and we adjust.",
    },
    {
      question: "How fast does it work, and how long does the effect last?",
      answer:
        "PT-141 is typically taken 30 to 60 minutes before intimacy. Effects generally last several hours, though this varies by dose and individual response. It's not a daily medication — you use it when you plan to, not on a schedule. Your clinician sets how frequently it can be used based on your intake and how you respond.",
    },
    {
      question: "What if I'm not sure this is right for me?",
      answer:
        "Say so in your intake. If your clinician thinks another approach fits better — a different peptide, working on sleep or hormones first, or a period of watchful waiting — they'll tell you. Sometimes the honest call is that PT-141 isn't the answer, and if so, no charge is made.",
    },
    {
      question: "How will I know it's working?",
      answer:
        "The primary shift most people notice is desire returning — thinking about intimacy without needing a specific trigger, initiating more, feeling responsive. For most people this becomes clear within the first few uses. If it's not working after a fair trial, your clinician adjusts dose or reassesses whether PT-141 is the right compound.",
    },
    FAQ_PAUSE,
  ],
});

export const ghkCuProduct: ProductContent = makeProduct({
  slug: "ghk-cu",
  eyebrow: "Skin & Longevity",
  name: "GHK-Cu",
  description:
    "GHK-Cu is a naturally occurring copper peptide the body produces in abundance early in life and less over time. It's one of the most studied peptides for skin, hair, and tissue renewal — used to support collagen production, inflammation regulation, and the cellular repair processes that shape how the surface actually looks.",
  tagline: "Skin, hair and tissue renewal.",
  methodLabel: "Injection or topical",
  accordion: [
    {
      title: "What it is",
      body: "GHK-Cu is a small copper-binding peptide made up of three amino acids and a copper ion — a molecule the body already produces to signal repair and renewal in skin, hair, and connective tissue. It's studied for how it activates the cellular pathways behind collagen synthesis, wound healing, and the body's inflammatory response — and how those pathways slow as natural GHK-Cu levels decline with age. It's one of the most researched copper peptides in the world, which is why it's foundational to both skin/longevity and recovery protocols.",
    },
    {
      title: "How it's used",
      body: "GHK-Cu is used two ways depending on what your protocol is targeting. Subcutaneous injection is used when the goal is systemic — supporting hair, connective tissue, or overall skin renewal from the inside. Topical application is used when the goal is localised skin work — targeting specific areas for elasticity, texture, or scar/wound support. Your clinician confirms which route (or both) is right for you based on your intake, and sets the strength and cadence to match.",
    },
    {
      title: "What's in the vial",
      body: "Injection: Pharmaceutical-grade GHK-Cu, compounded to your prescription at a licensed US 503A/503B pharmacy, supplied as a lyophilised powder for reconstitution with bacteriostatic water. Topical: GHK-Cu formulated for skin application at compound-appropriate concentration, in a delivery base built for absorption. Both are refrigerated after preparation and used within the stability window your clinician confirms.",
    },
  ],
  benefits: [
    { title: "Firmer skin", description: "Supports collagen production, elasticity, and skin texture." },
    { title: "Healthier hair", description: "Supports follicle health and hair growth." },
    { title: "Tissue regeneration", description: "Supports wound healing and the body's response to inflammation." },
    { title: "Supports healthy aging", description: "Supports the cellular processes behind long-term skin and tissue resilience." },
  ],
  faqItems: [
    {
      question: "What's the difference between compounded GHK-Cu and an over-the-counter copper peptide serum?",
      answer:
        "OTC serums contain GHK-Cu at concentrations low enough to be sold cosmetically — usually well under what's used clinically, and formulated for gentle daily topical use. Compounded GHK-Cu is prepared to your prescription at pharmaceutical-grade concentration, either as a subcutaneous injection for systemic effects (hair, connective tissue, whole-skin renewal) or as a topical at a strength your clinician sets for your case. It's a different product doing a different job.",
    },
    {
      question: "Is GHK-Cu FDA-approved?",
      answer:
        "GHK-Cu is a naturally occurring copper peptide the body already produces — it's not itself a drug. As a compounded medication, it's prepared to your prescription at a licensed US 503A/503B pharmacy under FDA-registered oversight. Compounded medications aren't themselves FDA-approved, but GHK-Cu has decades of clinical research behind it and is widely used in prescribing dermatology and regenerative medicine. Your clinician reviews whether it's appropriate for you before anything ships.",
    },
    {
      question: "Who is GHK-Cu prescribed for — and can I use it with my existing skincare or other therapies?",
      answer:
        "GHK-Cu is prescribed for adults noticing the changes in skin, hair, or tissue that come with declining natural GHK-Cu levels — in men and women, typically from midlife onward. It's commonly used alongside standard skincare (including retinoids and vitamin C), hair treatments, and other peptide protocols — share whatever you're currently on in your intake. It's not appropriate for pregnancy, active cancer, or Wilson's disease. Sometimes your clinician's call is that GHK-Cu isn't right for you — if so, they'll tell you why and no charge is made.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "Most people tolerate GHK-Cu well. Topical application can cause mild redness, tingling, or dryness at the application site, which usually settles within the first weeks. Injection can cause mild soreness or bruising at the injection site. Very rarely, prolonged high-dose use has been associated with copper accumulation — which is why your clinician calibrates the dose and how often you use it, and reviews long-term protocols at each check-in. Anything concerning — you message us and we adjust.",
    },
    {
      question: "How long until I see results?",
      answer:
        "Skin changes tend to be the first — texture and tone often begin shifting between weeks four and six, with fuller changes building over months two and three. Hair timelines are longer — shed usually settles first, and visible growth builds from month three onward. Recovery and wound support tend to shift faster, often within weeks. Your clinician sets your protocol length based on what you're targeting.",
    },
    FAQ_PAUSE,
    {
      question: "What's included when it ships?",
      answer:
        "For injection protocols: your prescribed vial, sterile syringes, bacteriostatic water for reconstitution, alcohol swabs, and a sharps disposal option. For topical protocols: your prescribed formulation in a delivery base built for absorption. Full instructions are included and reviewed in your care portal. Everything ships discreetly and temperature-controlled where required.",
    },
    FAQ_INSURANCE,
  ],
});

export const semaglutideProduct: ProductContent = makeProduct({
  slug: "semaglutide",
  eyebrow: "Weight",
  name: "Compounded Semaglutide",
  description:
    "Compounded Semaglutide is a GLP-1 medication formulated to support weight management and metabolic health — mirroring a hormone the body produces to regulate hunger, fullness, and blood sugar. It's the most established GLP-1 in the category, used in protocol for people whose metabolic signalling has drifted, supporting the systems that shape appetite, eating patterns, and the mental noise around food.",
  tagline: "Appetite, weight and metabolic support.",
  accordion: [
    {
      title: "What it is",
      body: "Semaglutide is a GLP-1 receptor agonist — a synthetic version of a naturally occurring hormone (GLP-1) that the gut releases after eating to signal fullness, slow digestion, and regulate blood sugar. It works by mimicking that signalling for longer than the body's own GLP-1 does, which is why it changes both what appetite feels like and how the body handles food. It's the most studied GLP-1 medication in the world and remains one of the foundational compounds in modern weight management.",
    },
    {
      title: "How it's used",
      body: "Semaglutide is administered as a once-weekly subcutaneous injection, typically taken on the same day each week. Protocols usually start at a low dose and titrate up gradually over the first weeks — your clinician sets the starting dose, the pace of increase, and where your protocol ultimately settles. For some patients, that means a microdose that provides metabolic support without the fuller weight-loss effect; for others, it means titrating to a standard weight-management dose.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade Semaglutide, compounded to your prescription at a licensed US 503A/503B pharmacy. Supplied as a sterile solution, refrigerated, and used within the stability window your clinician confirms.",
    },
  ],
  benefits: [
    { title: "Appetite regulation", description: "Supports appetite control and a stronger sense of fullness." },
    { title: "Sustainable weight management", description: "Supports gradual weight loss and long-term weight maintenance." },
    { title: "Reduced cravings", description: "Supports a calmer mental relationship with hunger and eating." },
    { title: "Metabolic support", description: "Supports blood sugar regulation and insulin sensitivity." },
  ],
  faqItems: [
    {
      question: "How is Compounded Semaglutide different from Tirzepatide?",
      answer:
        "Both are GLP-1 medications for weight management. Semaglutide activates one receptor (GLP-1). Tirzepatide activates two (GLP-1 and GIP), which often produces stronger effects but also more pronounced side effects during titration. Semaglutide is the more established compound and often the starting point in a protocol. Your clinician recommends the right one based on your goals, medical history, and how your body is likely to respond.",
    },
    {
      question: "Is Compounded Semaglutide the same as Ozempic or Wegovy?",
      answer:
        "The active ingredient is the same — semaglutide. Compounded Semaglutide is prepared to your prescription at a licensed US 503A/503B pharmacy, which lets your clinician personalise your dose and titration in ways branded medications can't. Compounded medications aren't FDA-approved, but the underlying compound has been studied extensively and used in clinical practice for years.",
    },
    {
      question: "Who is Compounded Semaglutide prescribed for — and can I take it with other therapies?",
      answer:
        "Compounded Semaglutide is prescribed for adults working on weight management or metabolic health, in men and women. It's commonly paired with peptides that support recovery, metabolic function, and lean muscle preservation during weight loss — protocols like these help manage the side effect load and support better long-term outcomes. Share whatever you're currently on in your intake, including diabetes medications, thyroid medication, or previous GLP-1 use. It's not appropriate for pregnancy, personal or family history of medullary thyroid cancer, MEN syndrome type 2, or active pancreatitis.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "The most common side effects are gastrointestinal — nausea, mild vomiting, constipation, or heartburn — usually most pronounced in the first weeks and after each dose increase. They typically ease as your body adjusts. Slower titration reduces most of these, which is why your clinician sets the pace based on your intake. Rare but serious effects are covered in your Important Safety Information. Anything concerning while on protocol — you message us and we adjust.",
    },
    {
      question: "What happens when I stop taking Semaglutide?",
      answer:
        "Appetite regulation returns to baseline over time, and without other habits or supports in place, weight regain is common. This is why we treat Semaglutide as a tool inside a broader protocol — building habits during treatment, tapering deliberately, and staying in touch even after you stop. Long-term maintenance is a lot more likely with a structured off-ramp than without one.",
    },
    FAQ_PAUSE,
    FAQ_RUNOUT,
    FAQ_INSURANCE,
  ],
});

export const tirzepatideProduct: ProductContent = makeProduct({
  slug: "tirzepatide",
  eyebrow: "Weight",
  name: "Compounded Tirzepatide",
  description:
    "Compounded Tirzepatide is a dual-action medication that engages both GLP-1 and GIP — two of the body's own appetite and metabolic signalling pathways — to support fullness, glucose response, and how the body regulates energy. It's used in protocol for people whose clinical picture calls for dual-pathway support, whether from the outset or when a single-pathway approach hasn't matched the goal.",
  tagline: "Dual-pathway weight and metabolic support.",
  accordion: [
    {
      title: "What it is",
      body: "Tirzepatide is a synthetic peptide that acts on two of the body's own appetite and metabolic hormones — GLP-1 (glucagon-like peptide-1) and GIP (glucose-dependent insulinotropic polypeptide). Both are released after eating and work together to signal fullness, regulate blood sugar, and influence how the body stores and uses energy. Engaging both pathways at once is what distinguishes tirzepatide from GLP-1-only medications.",
    },
    {
      title: "How it's used",
      body: "Tirzepatide is administered as a once-weekly subcutaneous injection, typically taken on the same day each week. Protocols usually start at a low dose and titrate up gradually over the first weeks — your clinician sets the starting dose, the pace of increase, and where your protocol ultimately settles. For some patients, that means a microdose that provides metabolic support without the fuller weight-loss effect; for others, it means titrating to a standard weight-management dose.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade tirzepatide, compounded at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
  ],
  benefits: [
    { title: "Appetite regulation", description: "Supports fullness through both the GLP-1 and GIP pathways at once." },
    { title: "Weight management", description: "Supports gradual weight loss and long-term maintenance." },
    { title: "Steadier blood sugar", description: "Supports post-meal glucose response and insulin sensitivity." },
    { title: "Muscle preservation", description: "Supports fat loss with attention to preserving lean tissue." },
  ],
  faqItems: [
    {
      question: "How is Compounded Tirzepatide different from Semaglutide?",
      answer:
        "Both are GLP-1 medications for weight management. Semaglutide engages one receptor (GLP-1). Tirzepatide engages two (GLP-1 and GIP), which often produces stronger effects along with a more pronounced side effect curve during titration. Semaglutide is the more established compound and often the starting point in a protocol. Tirzepatide is chosen when the clinical picture calls for dual-pathway support from the outset, or when a single-pathway approach hasn't matched the goal. Your clinician recommends the right one based on your goals, medical history, and how your body is likely to respond.",
    },
    {
      question: "Is Compounded Tirzepatide the same as Mounjaro or Zepbound?",
      answer:
        "The active ingredient is the same — tirzepatide. Compounded Tirzepatide is prepared to your prescription at a licensed US 503A/503B pharmacy, which lets your clinician set the exact dose and titration pace for your body — including microdose starting points and step-up increments that aren't available in commercial fixed-dose pens. Compounded medications aren't FDA-approved. The underlying compound has been studied extensively and is prescribed daily in clinical practice.",
    },
    {
      question: "Who is Compounded Tirzepatide prescribed for — and can I take it with other therapies?",
      answer:
        "Compounded Tirzepatide is prescribed for adults working on weight management or metabolic health, in men and women. It's commonly paired with peptides that support recovery, metabolic function, and lean muscle preservation during weight loss — protocols like these help manage the side effect load and support better long-term outcomes. Share whatever you're currently on in your intake, including diabetes medications, thyroid medication, or previous GLP-1 use. It's not appropriate for pregnancy, personal or family history of medullary thyroid cancer, MEN syndrome type 2, or active pancreatitis.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "The most common side effects are gastrointestinal — nausea, mild vomiting, constipation, heartburn, or belching — usually most pronounced in the first weeks and after each dose increase. They typically ease as your body adjusts. Slower titration reduces most of these, which is why your clinician sets the pace based on your intake. Rare but serious effects are covered in your Important Safety Information. Anything concerning while on protocol — you message us and we adjust.",
    },
    {
      question: "What happens when I stop taking Tirzepatide?",
      answer:
        "Appetite regulation returns to baseline over time, and without other habits or supports in place, weight regain is common. Trial data suggests most people who stop without a plan regain a significant portion of their loss within a year. This is why we treat Tirzepatide as a tool inside a broader protocol — building habits during treatment, tapering deliberately, and staying in touch even after you stop. Long-term maintenance is a lot more likely with a structured off-ramp than without one.",
    },
    FAQ_PAUSE,
    FAQ_RUNOUT,
    FAQ_INSURANCE,
  ],
});

export const dsipProduct: ProductContent = makeProduct({
  slug: "dsip",
  eyebrow: "Recovery",
  name: "DSIP",
  description:
    "DSIP is a neuropeptide that acts on the pathways governing deep sleep — supporting slow-wave recovery, cortisol regulation, and nervous system reset. It's used in protocol for people who sleep enough hours but wake unrestored, and for those who want recovery support without sedation.",
  tagline: "Deep sleep and overnight recovery.",
  accordion: [
    {
      title: "What it is",
      body: "DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring neuropeptide first identified in the 1970s for its role in triggering slow-wave sleep — the deep, delta-wave phase where the body does most of its physical repair and neurological consolidation. It acts on the brain's sleep-regulation and stress-response pathways, and unlike sedatives, it doesn't force sleep — it signals for it.",
    },
    {
      title: "How it's used",
      body: "DSIP is administered as a subcutaneous injection, typically taken 30 to 60 minutes before bed. Most protocols run cyclically — several nights on, a night or two off — to preserve the body's response over time. Your clinician sets the timing, the cycle, and the length of protocol based on your intake.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade DSIP, compounded at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
  ],
  benefits: [
    { title: "Promotes deep sleep", description: "Signals slow-wave (delta) sleep and deeper overnight recovery." },
    { title: "Enhances recovery", description: "Supports muscle and tissue repair during deep sleep." },
    { title: "Regulates cortisol", description: "Supports steadier stress hormone rhythms through the night." },
    { title: "Calms the nervous system", description: "Supports the shift from stress state to rest and recovery." },
  ],
  faqItems: [
    {
      question: "How is DSIP different from melatonin or other OTC sleep aids?",
      answer:
        "Melatonin and most OTC sleep aids work on sleep onset — helping you fall asleep. DSIP works on sleep architecture — specifically slow-wave (delta) sleep, the deep phase where the body does most of its physical and neurological recovery. The two do different jobs. Falling asleep fine but waking unrestored is a different clinical picture than not being able to fall asleep, and DSIP is protocolled for the first case.",
    },
    {
      question: "How does DSIP compare to prescription sleep medications like Ambien or trazodone?",
      answer:
        "Prescription sleep medications work by sedation — they suppress the nervous system to bring on sleep. DSIP isn't a sedative. It signals the pathways that trigger slow-wave sleep, without forcing the system into unconsciousness. That's why users typically report waking without the grogginess or next-day cognitive drag that comes with sedative sleep aids. It's also why DSIP is used in protocol as a longer-term recovery approach rather than an as-needed prescription.",
    },
    {
      question: "Who is DSIP prescribed for — and can I take it with other therapies?",
      answer:
        "DSIP is prescribed for adults working on sleep quality, recovery, and stress regulation. It's commonly paired with peptides that support systemic recovery — including Sermorelin, where DSIP works on sleep architecture directly and Sermorelin supports the growth hormone pulse that runs during deep sleep. Share whatever you're currently on in your intake, including sleep medications, SSRIs, or anti-anxiety medications. It's not appropriate for pregnancy, active seizure disorders, or in combination with prescription sedatives without clinician review.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "DSIP has a small side effect profile — most users report none. Some people notice vivid dreams during the first week, mild headache, or a warm sensation at the injection site that resolves quickly. Effects typically ease as your body adjusts. Rare but serious effects are covered in your Important Safety Information. Anything concerning while on protocol — you message us and we adjust.",
    },
    {
      question: "What happens when I stop taking DSIP?",
      answer:
        "DSIP doesn't create dependence or withdrawal — it doesn't override the sleep system, it supports it. Sleep quality returns to your baseline when you stop, without the rebound insomnia that can come with prescription sedatives. This is one of the reasons DSIP works well inside a broader recovery protocol — you can taper, pause, or cycle it without losing ground, and use it seasonally or during high-stress periods without long-term commitment.",
    },
    FAQ_PAUSE,
    FAQ_RUNOUT,
    FAQ_INSURANCE,
  ],
});

export const motsCProduct: ProductContent = makeProduct({
  slug: "mots-c",
  eyebrow: "Metabolic",
  name: "MOTS-C",
  description:
    "MOTS-C is a mitochondrial peptide that acts on the systems governing how the body produces and uses energy — supporting insulin sensitivity, exercise capacity, and metabolic function at the cellular level. It's used in protocol for people focused on metabolic health, athletic performance, and long-term energy regulation.",
  tagline: "Metabolic health and cellular energy.",
  accordion: [
    {
      title: "What it is",
      body: "MOTS-C is a peptide encoded within mitochondrial DNA — one of a small class of molecules the mitochondria produce and release to signal across the body's metabolic system. It acts on muscle, liver, and fat tissue to influence how cells respond to insulin, how energy is used during exercise, and how the body maintains metabolic balance under stress. Research into its role in metabolic health and athletic performance is ongoing.",
    },
    {
      title: "How it's used",
      body: "MOTS-C is administered as a subcutaneous injection, typically two to three times per week. Most protocols run in defined cycles — often 8 to 12 weeks — with your clinician setting the exact dose, frequency, and cycle length based on your intake and goals. It's commonly used alongside training and structured lifestyle inputs, since MOTS-C's mechanism responds to physical demand.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade MOTS-C, compounded at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
  ],
  benefits: [
    { title: "Improves insulin sensitivity", description: "Helps skeletal muscle absorb glucose more efficiently, supporting blood sugar balance." },
    { title: "Enhances exercise capacity", description: "Mimics the metabolic effects of exercise to support endurance, stamina, and how muscle uses energy." },
    { title: "Regulates metabolism", description: "Acts as a metabolic switch — shifting the body toward burning fat for fuel rather than storing it." },
    { title: "Protects mitochondrial function", description: "Promotes mitochondrial biogenesis to sustain cellular energy production over time." },
  ],
  faqItems: [
    {
      question: "How is MOTS-C different from NAD+?",
      answer:
        "Both work at the mitochondrial level, but they do different jobs. NAD+ is a coenzyme the body uses to produce cellular energy — supplementing it raises the raw material your cells work with. MOTS-C is a signaling peptide that changes how cells use energy — it activates the metabolic pathways that improve insulin sensitivity, fat oxidation, and mitochondrial biogenesis. NAD+ tops up the supply; MOTS-C tunes the system. Some patients run both, staggered — your clinician recommends which one, and in what sequence, based on your goals and labs.",
    },
    {
      question: "How does MOTS-C compare to NMN or other longevity supplements?",
      answer:
        "NMN and NR are precursors — the body converts them into NAD+, which then feeds cellular energy production. MOTS-C works one layer above that: it's a peptide that signals cells to become more metabolically efficient in the first place. The two categories aren't interchangeable. Precursor supplements raise the fuel available; MOTS-C changes how the engine runs. MOTS-C is also prescribed and clinician-supervised, with dosing, cycling, and lab-tracking built in — not the same category as an OTC longevity supplement.",
    },
    {
      question: "Who is MOTS-C prescribed for — and can I take it with other therapies?",
      answer:
        "MOTS-C is prescribed for adults working on metabolic health, insulin sensitivity, athletic performance, or long-term energy regulation. It's commonly paired with peptides that support recovery and mitochondrial function — including NAD+, where MOTS-C tunes metabolic signaling and NAD+ supports the raw energy supply cells draw from. Share whatever you're currently on in your intake, including diabetes medications, thyroid medication, or existing peptide protocols. It's not appropriate for pregnancy, active cancer, or in combination with insulin without clinician review.",
    },
    {
      question: "What are the common side effects?",
      answer:
        "MOTS-C has a small side effect profile. The most commonly reported effect is injection site reaction — brief stinging, redness, or occasional swelling that resolves within an hour or two. Some patients notice a mild energy shift or warmth for the first hour after injection. Effects typically ease over the first few cycles as your body adjusts. Rare but serious effects are covered in your Important Safety Information. Anything concerning while on protocol — you message us and we adjust.",
    },
    {
      question: "What happens when I stop taking MOTS-C?",
      answer:
        "MOTS-C doesn't create dependence — the pathways it activates return to their pre-protocol state gradually over the weeks following your last cycle. Some of the metabolic improvements built during protocol persist longer if paired with continued training and structured lifestyle inputs, since MOTS-C's effect is amplified by physical demand. This is why we treat it as a cyclical protocol tied to real-world work — not a standalone intervention. Cycling on and off through the year is a common approach.",
    },
    FAQ_PAUSE,
    FAQ_RUNOUT,
    FAQ_INSURANCE,
  ],
});

/** Every product page, keyed by slug. Unknown slugs fall back to BPC-157. */

/* -------------------------------------------------------------------------- *
 *  Protocols added from the clinical review handoff. Pharmacy pricing is still
 *  pending for all six, so `price` and `plans` are deliberately empty: the PDP
 *  hides the figure and the plan selector, and the buy button becomes a link
 *  to the intake. Fill both in and they behave like every other protocol.
 *  Sections marked LOCKED in the handoff are shared verbatim across every PDP
 *  and are reused from BPC-157 rather than duplicated.
 * -------------------------------------------------------------------------- */

export const semaxProduct: ProductContent = {
  slug: "semax",
  eyebrow: "Cognitive",
  name: "Semax",
  description:
    "Semax is a neuropeptide that acts on the pathways governing focus, mood, and cognitive endurance — supporting how the brain sustains attention under load and recovers from mental fatigue. It's used in protocol for people running sustained cognitive demand, and for those who want cognitive support that works with the brain's own chemistry rather than stimulating it.",
  tagline: "Focus, mood and cognitive endurance support.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Intranasal method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "Semax is a synthetic neuropeptide derived from a fragment of adrenocorticotropic hormone (ACTH), modified for stability so it acts in the brain without triggering ACTH's hormonal effects. It supports the expression of BDNF and NGF — the growth factors the brain uses to maintain and repair neurons — and modulates dopamine and serotonin activity in regions tied to focus, mood, and stress response. It has decades of clinical use behind it, with ongoing research into its broader cognitive and neuroprotective role.",
    },
    {
      title: "How it's used",
      body: "Semax is administered as intranasal drops, typically taken one to two times per day during a defined protocol period. Most protocols run in cycles — often two to four weeks on, followed by a break — with your clinician setting the exact dosing, timing, and cycle length based on your goals. It's most often used during periods of concentrated cognitive demand rather than as a daily-forever intervention.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade Semax, compounded at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for intranasal peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/semax",
  why: {
    heading: "Why Semax",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Sharpens focus",
        description: "Supports sustained attention and mental clarity during demanding cognitive work.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Stabilises mood",
        description: "Modulates dopamine and serotonin activity to support steadier mood under stress.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Builds cognitive endurance",
        description: "Supports memory, learning, and the brain's own repair signalling for mental stamina.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Reinforces neural resilience",
        description: "Studied for its role in neuroprotection, stress adaptation, and recovery from cognitive fatigue.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "How is Semax different from stimulants like caffeine, modafinil, or Adderall?",
        answer: "Stimulants work by driving neurotransmitter release or blocking reuptake — they push the system harder. Semax doesn't work that way. It supports the brain's own regulatory chemistry — the growth factors and neurotransmitter systems that maintain focus, mood, and mental stamina — rather than forcing an output. That's why users typically report sustained cognitive endurance without the jitters, tolerance build, or crash that comes with stimulants. Semax isn't a replacement for a stimulant when you need one; it's a different tool for a different job.",
      },
      {
        question: "How does Semax compare to OTC nootropics — racetams, lion's mane, alpha-GPC?",
        answer: "OTC nootropics work on different mechanisms — cholinergic support, mushroom-derived nerve growth factor precursors, general neurotransmitter modulators. Some have evidence behind them, some don't. Semax is a prescription peptide with decades of clinical use behind it, dosed and cycled by a clinician, and made to pharmaceutical standards at a licensed compounding pharmacy. The comparison isn't stack-vs-stack — it's an OTC category versus a prescribed clinical protocol. Some patients continue with familiar OTC nootropics during a Semax cycle; that's a conversation to have with your clinician at intake.",
      },
      {
        question: "Who is Semax prescribed for — and can I take it with other therapies?",
        answer: "Semax is prescribed for adults working on focus, cognitive endurance, mood stability, or recovery from periods of high cognitive load. It's commonly paired with peptides that support the nervous system in complementary ways — including Selank, where Semax works on focus and cognitive drive while Selank supports calm and stress regulation. The two are often used together during high-demand periods. Share whatever you're currently on in your intake, including antidepressants, ADHD medication, or other nootropic use. It's not appropriate for pregnancy, active psychiatric conditions under acute treatment, or in combination with MAOIs without clinician review.",
      },
      {
        question: "What are the common side effects?",
        answer: "Semax has a small side effect profile. The most commonly reported effect is mild nasal irritation, a taste in the back of the throat after dosing, or a light headache during the first few days. Some patients notice a warm or energised sensation for the first hour after dosing. Effects typically ease as your body adjusts to the protocol. Rare but serious effects are covered in your Important Safety Information. Anything concerning while on protocol — you message us and we adjust.",
      },
      {
        question: "What happens when I stop taking Semax?",
        answer: "Semax doesn't create dependence — the pathways it supports return to baseline over the weeks following your last cycle. Because Semax works by supporting the brain's own systems rather than substituting for them, some of the gains built during a cycle — particularly around cognitive endurance and recovery — can persist beyond the protocol. This is why we use it cyclically, tied to periods of high cognitive demand, rather than as a permanent daily intervention. Cycling on and off through the year is common.",
      },
      {
        question: "What happens if I need to pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Do you take insurance, HSA, or FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const selankProduct: ProductContent = {
  slug: "selank",
  eyebrow: "Cognitive",
  name: "Selank",
  description:
    "Selank is a neuropeptide that acts on the systems regulating stress, mood, and cognitive stability — supporting a steadier nervous system, calmer focus, and reliable function under pressure. It's used in protocol for people running sustained stress load, and for those who want support that works with the body's own regulation rather than sedating or suppressing it.",
  tagline: "Stress resilience, steady mood and calm focus.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Intranasal method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "Selank is a synthetic neuropeptide derived from tuftsin, a naturally occurring immunopeptide, modified for stability so it acts on the brain's stress and mood regulation pathways. It supports the expression of BDNF and modulates GABA, serotonin, and dopamine activity in regions tied to stress response, focus, and emotional stability — without the sedative mechanism of benzodiazepines or the neurotransmitter suppression of SSRIs. It has decades of clinical use behind it, with ongoing research into its role in stress resilience, cognitive stability, and immune modulation.",
    },
    {
      title: "How it's used",
      body: "Selank is administered as intranasal drops, typically taken one to three times per day during a defined protocol period. Most protocols run in cycles — often two to three weeks on, followed by a break — with your clinician setting the exact dosing, timing, and cycle length based on your goals. It's most often used during periods of concentrated stress load or high performance demand rather than as a permanent daily intervention.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade Selank, compounded at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for intranasal peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/selank",
  why: {
    heading: "Why Selank",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Steadies stress response",
        description: "Quiets a racing mind and calms the nervous system without causing drowsiness.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Stabilises mood",
        description: "Optimizes serotonin and dopamine pathways to maintain steady emotional balance.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Sharpens focus under pressure",
        description: "Sustains attention span and locks in mental clarity during demanding tasks.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Reinforces neural resilience",
        description: "Builds long-term cognitive defense while actively supporting your immune health.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "How is Selank different from anti-anxiety medications like benzodiazepines or SSRIs?",
        answer: "Benzodiazepines work by sedating the nervous system. SSRIs work by suppressing serotonin reuptake. Selank does neither — it supports the nervous system's own regulation, modulating rather than sedating, adjusting rather than suppressing. That's why users typically report steadier stress response and calmer focus without drowsiness, dependence, or emotional flatness. Selank isn't a replacement for psychiatric medication when one is clinically needed. If you're on a benzodiazepine or SSRI, that's a conversation to have with your prescribing physician and your SYNC clinician before starting.",
      },
      {
        question: "How does Selank compare to OTC calm supplements — ashwagandha, L-theanine, magnesium, CBD?",
        answer: "OTC calm supplements work on different mechanisms — cortisol modulation, general relaxation, nerve support, or endocannabinoid modulation. Some have evidence behind them, some don't. Selank is a prescription peptide with decades of clinical use behind it, dosed and cycled by a clinician, and compounded to pharmaceutical standards. Some patients continue with familiar supplements during a Selank cycle — that's a conversation to have at intake.",
      },
      {
        question: "Who is Selank prescribed for — and can I take it with other therapies?",
        answer: "Selank is prescribed for adults working on stress regulation, emotional stability, or focus under pressure. It's commonly paired with Semax, where Selank supports calm and stress regulation while Semax supports focus and cognitive drive — often used together during high-demand periods. Share whatever you're currently on in your intake, including antidepressants, anti-anxiety medications, or ADHD medication. It's not appropriate for pregnancy, active psychiatric conditions under acute treatment, or in combination with MAOIs or benzodiazepines without clinician review.",
      },
      {
        question: "What are the common side effects?",
        answer: "Selank has a small side effect profile. The most commonly reported are mild nasal irritation, a taste in the back of the throat after dosing, or light drowsiness in the first few days that eases as your body adjusts. Some patients notice no perceptible effects until the second week — this is normal and doesn't mean the peptide isn't working. Rare but serious effects are covered in your Important Safety Information.",
      },
      {
        question: "What happens when I stop taking Selank?",
        answer: "Selank doesn't create dependence — the pathways it supports return to baseline over the weeks following your last cycle, without the rebound anxiety or tolerance that can come with benzodiazepines. Because Selank works by supporting the nervous system's own regulation, some of the stress resilience built during a cycle can persist beyond the protocol. This is why we use it cyclically rather than as a permanent daily intervention.",
      },
      {
        question: "What happens if I need to pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Do you take insurance, HSA, or FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const performProduct: ProductContent = {
  slug: "perform",
  eyebrow: "Performance",
  name: "PERFORM",
  description:
    "PERFORM combines CJC-1295 and Ipamorelin — two peptides that act on the systems regulating the body's natural growth hormone rhythm — supporting recovery, sleep depth, and lean body composition through the pulsatile release that training load, age, and stress tend to blunt. It's used in protocol for people running sustained physical demand, and for those who want performance support that works with the body's own axis rather than overriding it.",
  tagline: "CJC-1295 and Ipamorelin for recovery, sleep and lean composition.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Injection method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "PERFORM is a two-peptide protocol combining CJC-1295 and Ipamorelin, formulated to support the body's natural growth hormone axis through complementary mechanisms.",
    },
    {
      title: "How it's used",
      body: "PERFORM is typically administered as a subcutaneous injection before bed, typically five nights on with two off — timing that aligns the peptide-driven GH pulse with the body's natural overnight release. Your clinician sets your exact dose, cycle length, and stack composition based on your intake, and cycles usually run with structured breaks rather than continuously. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade CJC-1295 (without DAC) and Ipamorelin, compounded together at a licensed US 503A pharmacy in the concentration your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/perform",
  why: {
    heading: "Why PERFORM",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Maximized Recovery",
        description: "Rebuilds tissue faster between sessions so training load compounds instead of stacking as fatigue.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Enhanced Sleep Depth",
        description: "Achieve the deep sleep cycles required for physical rejuvenation.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Lean Composition Support",
        description: "Optimises metabolic efficiency to burn stored fat while preserving lean muscle across the cycle.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Sustained Baseline Support",
        description: "Elevate your natural baselines without shutting down your endocrine system.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "Why the blend instead of running CJC-1295 and Ipamorelin separately?",
        answer: "The two peptides act on different pathways — CJC-1295 through the GHRH receptor, Ipamorelin through the ghrelin receptor — to reinforce the same growth hormone pulse. Run separately, you get two protocols, two injections, two reconstitution steps, and two adherence points. Run together in one prescription, the pulse is co-timed by design, the dosing is calibrated against how they behave in the same body, and the clinician tracks one response instead of two. For most people who've decided they want both, the blend is the version that actually gets run consistently.",
      },
      {
        question: "How is this different from Sermorelin?",
        answer: "Sermorelin and CJC-1295 both act on the GHRH pathway — CJC-1295 with a longer signal window, Sermorelin with a shorter one. PERFORM adds Ipamorelin, which reinforces the same pulse through a separate receptor. The result is a fuller, more coordinated signal than Sermorelin produces alone. Sermorelin is the baseline restoration protocol; PERFORM is the optimized stack.",
      },
      {
        question: "Can I stack PERFORM with other peptides or medications?",
        answer: "Some peptides stack cleanly with PERFORM — BPC-157 for tissue repair, for example, runs on a separate pathway and typically layers without interaction. Others don't, particularly anything else acting on the GH axis or the pituitary. If you're on TRT, GLP-1s, thyroid medication, or any hormonal therapy, tell us at intake. Your clinician reviews the full picture before prescribing and will flag anything worth adjusting.",
      },
      {
        question: "What are the side effects?",
        answer: "Most people run PERFORM without notable side effects. What's reported: mild injection site tenderness early in the cycle, transient appetite increase from Ipamorelin that usually settles within two weeks, occasional mild water retention, and, less commonly, dream vividness or lighter sleep during the first few nights. Any component contraindication — active malignancy, uncontrolled endocrine disorders, pregnancy — is screened at intake.",
      },
      {
        question: "What happens when I stop?",
        answer: "Because PERFORM works by prompting your body's own GH release rather than replacing it, the pituitary axis stays intact when you stop. There's no dependence, no withdrawal, no crash. The pulse pattern returns to your pre-cycle baseline over a few weeks, which for most people means the recovery and sleep gains taper rather than end sharply. How long people run PERFORM varies — some cycle eight to twelve weeks on with structured breaks, others run longer arcs up to six months. Your clinician sets the rhythm at check-in.",
      },
      {
        question: "Can I pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Insurance / HSA / FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const repairProduct: ProductContent = {
  slug: "repair",
  eyebrow: "Recovery",
  name: "REPAIR",
  description:
    "REPAIR combines BPC-157, TB-500, KPV, and GHK-Cu — four peptides that act across the systems regulating tissue repair, inflammatory response, and connective tissue remodeling — supporting recovery from injury, training load, and the accumulated wear that soft tissue holds. It's used in protocol for people running sustained physical demand, and for those who want systemic recovery support that works across the full repair cycle rather than one site at a time.",
  tagline: "BPC-157, TB-500, KPV and GHK-Cu for full-cycle tissue repair.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Injection method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "REPAIR is a four-peptide protocol formulated to support the body's natural tissue repair systems through complementary pathways. Running these four peptides together covers the full repair cycle rather than acting on a single stage alone:",
    },
    {
      title: "How it's used",
      body: "REPAIR is typically administered as a subcutaneous injection, timing and frequency set by your clinician based on your intake — injury, training load, or the specific recovery pattern the protocol is targeting. Cycles run with structured breaks; some presentations warrant a shorter, more intensive cycle, others a longer, lower-dose arc. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade BPC-157, TB-500, KPV, and GHK-Cu, compounded together at a licensed US 503A pharmacy in the concentrations your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/repair",
  why: {
    heading: "Why REPAIR",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Accelerated Recovery",
        description: "Restore tissue faster after training, injury, and the accumulated load the body carries.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Calmed Inflammation",
        description: "Regulate the inflammatory response so the body resolves damage instead of holding it.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Reinforced Connective Tissue",
        description: "Rebuild the collagen and structural tissue that carry the strain of everyday movement.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Systemic Repair Support",
        description: "Cover the full repair cycle across four pathways instead of targeting one site at a time.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "Why the blend instead of running BPC-157 on its own?",
        answer: "BPC-157 is the most-researched of the four and the peptide most people already know for recovery — it's the anchor of the stack, not the whole of it. What BPC-157 does well is signaling: telling the body where and how to start repair. What it doesn't do alone is cover the full cycle. TB-500 supports the cell migration and tissue flexibility that comes after the signal. KPV addresses the inflammatory response that determines how cleanly repair actually resolves. GHK-Cu drives the collagen and connective tissue rebuilding in the later phase. Run alone, BPC-157 is a strong single. Run in REPAIR, it's the first move in a four-stage protocol that covers the full arc rather than one site or one stage.",
      },
      {
        question: "How is this different from just running the Wolverine Stack (BPC-157 + TB-500)?",
        answer: "The Wolverine Stack — BPC-157 with TB-500 — is the most common two-peptide recovery protocol and it works well for localized injury. REPAIR adds two things the Wolverine Stack doesn't: KPV, which addresses inflammatory response systemically and particularly through the gut lining, and GHK-Cu, which handles the collagen and connective tissue phase that comes after acute repair. If the presentation is a single acute injury, BPC-157 + TB-500 is often enough — and your clinician may recommend that path. REPAIR is the protocol for systemic wear, multiple sites, or the later-stage rebuilding that acute stacks don't reach.",
      },
      {
        question: "Can I stack REPAIR with other peptides or medications?",
        answer: "Some peptides stack cleanly with REPAIR — PERFORM for GH-axis support runs on separate pathways and typically layers without interaction, and REPAIR can also be run alongside single molecules like Sermorelin or NAD+ when your clinician determines the presentation warrants it. Others need clinical review, particularly anti-inflammatories, blood thinners, and anything affecting immune function. If you're on NSAIDs regularly, steroids, immunomodulators, or blood-thinning medication, tell us at intake. Copper-sensitivity is screened separately because of GHK-Cu. Your clinician reviews the full picture before prescribing and will flag anything worth adjusting.",
      },
      {
        question: "What are the side effects?",
        answer: "Most people run REPAIR without notable side effects. What's reported: mild injection site tenderness in the first few weeks, occasional water retention early in the cycle, transient fatigue or headache during the first few days as the body adjusts, and, less commonly, mild digestive changes as gut lining repair begins. Any component contraindication — active malignancy, active infection, pregnancy, copper sensitivity — is screened at intake.",
      },
      {
        question: "What happens when I stop?",
        answer: "Because REPAIR works by supporting the body's own repair systems rather than replacing anything, there's no dependence, no withdrawal, no rebound. Tissue changes built during the cycle hold — collagen and connective tissue remodeling doesn't unwind when the peptides clear. Some people run REPAIR as a single 90–120 day annual cycle, others run shorter cycles more frequently around training load or specific presentations. Your clinician sets the rhythm at check-in.",
      },
      {
        question: "Can I pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Insurance / HSA / FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const defineProduct: ProductContent = {
  slug: "define",
  eyebrow: "Metabolic",
  name: "DEFINE",
  description:
    "DEFINE combines AOD-9604, MOTS-c, and Tesamorelin to optimize fat mobilization, cellular energy, and visceral fat reduction. Engineered to refine body composition rather than suppress appetite, DEFINE is a sophisticated protocol for those who have moved past standard weight loss and into true recomposition. It offers a metabolic approach that works with the body's natural energy systems, rather than overriding them.",
  tagline: "AOD-9604, MOTS-c and Tesamorelin for body recomposition.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Injection method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "DEFINE is a three-peptide protocol formulated to support the body's metabolic composition systems through complementary pathways. Running these three peptides together works across the fat mobilization, cellular energy, and visceral fat reduction levers rather than acting on a single mechanism alone:",
    },
    {
      title: "How it's used",
      body: "DEFINE is typically administered as a subcutaneous injection, timing and frequency set by your clinician based on your intake — composition goals, prior GLP-1 history, training load, and bloods where relevant. Cycles typically run longer than shorter-acting protocols; Tesamorelin's clinical evidence supports arcs of several months for meaningful composition change. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade AOD-9604, MOTS-c, and Tesamorelin, compounded together at a licensed US 503A pharmacy in the concentrations your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/define",
  why: {
    heading: "Why DEFINE",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Targeted Fat Mobilization",
        description: "Release stored fat for use as energy without impacting appetite or gastric slowing.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Cellular Energy Support",
        description: "Optimize how mitochondria produce and utilize fuel directly at the cellular level.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Visceral Fat Reduction",
        description: "Target the deep, stubborn abdominal fat surrounding organs to lower metabolic risk.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Composition Over Weight",
        description: "Refine what is underneath the scale — the true sculpting work that comes after weight loss.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "How is DEFINE different from a GLP-1 like Semaglutide or Tirzepatide?",
        answer: "Different mechanism, different outcome. GLP-1s work by suppressing appetite and slowing gastric emptying — the body loses weight because you eat less. DEFINE works on the metabolic machinery underneath — mobilizing stored fat for use as energy, supporting how cells produce and use fuel, and specifically reducing the visceral fat that drives metabolic risk. GLP-1s move the number on the scale. DEFINE moves what's under the number. That's why they're not usually competitors — they solve different problems for different presentations. Some people run DEFINE after a GLP-1 cycle to refine what's left. Some run them concurrently at clinician direction. Some run DEFINE instead of a GLP-1 because they don't want appetite suppression as the mechanism of change.",
      },
      {
        question: "Why the blend instead of running Tesamorelin, AOD-9604, or MOTS-c on their own?",
        answer: "Each peptide addresses a distinct metabolic lever: AOD-9604 signals fat cells to mobilize stored fat, MOTS-c supports how the mitochondria produce and use energy, Tesamorelin specifically reduces visceral fat through the growth hormone axis. Run alone, each is a legitimate single with a specific target. Tesamorelin has the strongest clinical evidence of the three and is often the right starting point when the presentation warrants it. Run in DEFINE, the three levers work in the same direction across the same cycle — fat mobilization, cellular energy, and visceral reduction — rather than moving one at a time.",
      },
      {
        question: "Can I stack DEFINE with other peptides or medications?",
        answer: "Some peptides stack cleanly with DEFINE — REPAIR for tissue support runs on separate pathways and typically layers without interaction, and DEFINE can also be run alongside single molecules like BPC-157 or NAD+ when your clinician determines the presentation warrants it. GLP-1s are a specific case: DEFINE can run alongside Semaglutide or Tirzepatide, but the combined protocol requires clinical review of dose, timing, and blood work. If you're on GLP-1s, TRT, thyroid medication, or diabetes management, tell us at intake. Your clinician reviews the full picture before prescribing and will flag anything worth adjusting.",
      },
      {
        question: "What are the side effects?",
        answer: "Most people run DEFINE without notable side effects. What's reported: mild injection site tenderness in the first few weeks, occasional water retention early in the cycle, transient joint stiffness or mild peripheral swelling (most commonly associated with Tesamorelin's growth hormone axis effects), and, less commonly, mild glucose or IGF-1 shifts that are monitored through bloods where relevant. Any component contraindication — active malignancy, uncontrolled diabetes, pituitary or hypothalamic disease, pregnancy — is screened at intake.",
      },
      {
        question: "What happens when I stop?",
        answer: "Because DEFINE works by supporting the body's own metabolic machinery rather than suppressing appetite or replacing hormones, the mechanisms that changed during the cycle don't reverse the moment the peptides clear. The composition changes built during the cycle hold better than the scale changes from an appetite-suppression protocol — you kept the composition because the body changed how it uses fat, not how much you eat. Visceral fat that was reduced during a Tesamorelin cycle tends to stay reduced without ongoing dosing, though clinical response varies. DEFINE typically runs longer than shorter-acting protocols — twelve to twenty-four weeks is common, with some presentations running arcs of up to a year. Your clinician sets the arc at intake and adjusts at check-in.",
      },
      {
        question: "Can I pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Insurance / HSA / FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const restoreProduct: ProductContent = {
  slug: "restore",
  eyebrow: "Skin & Longevity",
  name: "RESTORE",
  description:
    "RESTORE pairs GHK-Cu and Epitalon to bridge the gap between visible rejuvenation and cellular longevity. Formulated as a paired protocol for surface and system, RESTORE addresses the visible markers of skin and hair alongside the internal biological rhythms that carry them. It offers a sophisticated longevity approach grounded in real mechanism—engineered for those who demand evidence-backed, systemic renewal rather than surface-level quick fixes.",
  tagline: "GHK-Cu and Epitalon for skin renewal and cellular longevity.",
  gallery: bpc157Product.gallery,
  trust: bpc157Product.trust,
  methodLabel: "Injection method",
  methods: bpc157Product.methods,
  // Pending pharmacy spec. Empty hides the price and plan selector.
  price: { amount: "", period: "" },
  planLabel: "",
  plans: [],
  cta: {
    label: "Start your protocol",
    href: "/start",
    note: "Charged only after your protocol is approved. Cancel anytime.",
  },
  accordion: [
    {
      title: "What it is",
      body: "RESTORE is a two-peptide protocol formulated to support the body's natural repair and regulation systems through complementary pathways. Running these two peptides together addresses the visible and systemic sides of healthy aging rather than either alone:",
    },
    {
      title: "How it's used",
      body: "RESTORE is typically administered as a subcutaneous injection, timing and frequency set by your clinician based on your intake — visible goals, sleep and circadian patterns, prior peptide history, and bloods where relevant. Cycle structure varies more with RESTORE than shorter-acting protocols; some presentations run continuous arcs, others run shorter intensive courses repeated periodically. Everything you need to reconstitute and inject is included, with instructions in your care portal.",
    },
    {
      title: "What's in the vial",
      body: "Pharmaceutical-grade GHK-Cu and Epitalon, compounded together at a licensed US 503A pharmacy in the concentrations your clinician prescribes. Buffers and diluent are standard for injectable peptide preparations. Every batch is third-party tested — full potency, sterility, pH, and endotoxin results in the Quality panel below.",
    },
    {
      title: "How SYNC ensures quality",
      body: "Every SYNC protocol is compounded to prescription at a licensed US 503A/503B pharmacy and clinician-reviewed before it ships. Full third-party batch testing details are in the Quality panel below.",
    },
  ],
  safetyLabel: "Important Safety Information",
  safetyHref: "/important-safety-information/restore",
  why: {
    heading: "Why RESTORE",
    features: [
      {
        icon: "/images/pdp/icon-cellular.svg",
        title: "Skin & Collagen Renewal",
        description: "Support the natural pathways that produce collagen and elastin — the structural proteins behind firm, resilient skin.",
      },
      {
        icon: "/images/pdp/icon-tissue.svg",
        title: "Hair & Connective Tissue Support",
        description: "Reinforce hair follicle activity and the connective tissue integrity that naturally softens and thins with age.",
      },
      {
        icon: "/images/pdp/icon-optimized.svg",
        title: "Circadian & Sleep Rhythm",
        description: "Support the body's natural sleep signals and the deep phases where overnight repair actually happens.",
      },
      {
        icon: "/images/pdp/icon-research.svg",
        title: "Surface Meets System",
        description: "Address the visible markers of aging alongside the internal rhythms that carry them, all in the same cycle.",
      },
    ],
  },
  qualityTest: bpc157Product.qualityTest,
  howItWorks: bpc157Product.howItWorks,
  faq: {
    ...bpc157Product.faq,
    items: [
      {
        question: "Why the blend instead of running GHK-Cu on its own?",
        answer: "GHK-Cu is the strongest-evidence peptide in the stack and the visible side of the protocol — the skin, hair, and connective tissue work most people already know it for. Epitalon works on the systemic side — sleep architecture, circadian regulation, and the cellular signaling associated with healthy aging over decades of clinical use. Run alone, GHK-Cu addresses the surface. Run in RESTORE, GHK-Cu and Epitalon address the visible markers and the internal rhythms that carry them in the same cycle. Some clinicians start with GHK-Cu alone for a first cycle and add Epitalon at cycle two if the response justifies it — that's a clinical call your provider makes on your intake.",
      },
      {
        question: "What can I actually expect from the Epitalon side of the protocol?",
        answer: "Sleep is the most reliable and most reported change — sleep onset, deep sleep phases, and reduced nighttime waking. Daytime energy tends to follow. Beyond that, Epitalon has decades of clinical use supporting cellular signaling associated with healthy aging, though the response markers on the systemic side are subtler and slower than the visible skin work GHK-Cu drives. If you're expecting a measurable biological age reversal or DNA-level outcome, that's not what this protocol claims. If you're looking for sleep architecture and circadian support alongside GHK-Cu's visible work, that's what the evidence holds.",
      },
      {
        question: "Can I stack RESTORE with other peptides or medications?",
        answer: "Some peptides stack cleanly with RESTORE — REPAIR for tissue support runs on complementary pathways, and RESTORE can also be run alongside single molecules like NAD+ or BPC-157 when your clinician determines the presentation warrants it. Copper sensitivity is screened separately because of GHK-Cu — copper metabolism disorders like Wilson's disease are contraindicated, and high-dose zinc supplementation can affect copper balance. If you're on hormone therapy, thyroid medication, or ongoing melatonin supplementation, tell us at intake. Your clinician reviews the full picture before prescribing and will flag anything worth adjusting.",
      },
      {
        question: "What are the side effects?",
        answer: "Most people run RESTORE without notable side effects. What's reported: mild injection site tenderness in the first few weeks, vivid dreams during the first ten days of an Epitalon course (usually settling within two weeks), occasional morning grogginess if injection timing is off, and, less commonly, mild fatigue or headache during the first few days as the body adjusts. Any component contraindication — active malignancy, copper metabolism disorders, pregnancy — is screened at intake.",
      },
      {
        question: "What happens when I stop?",
        answer: "Because RESTORE works by supporting the body's own repair and regulation systems rather than replacing anything, there's no dependence, no withdrawal, no rebound. Skin and connective tissue changes built during the cycle hold — collagen remodeling doesn't unwind when the peptides clear. Sleep and circadian benefits from an Epitalon course tend to hold for weeks to months after the course completes, though clinical response varies. RESTORE's cycle structure varies more than shorter-acting protocols; some presentations run continuous arcs, others run shorter intensive courses repeated periodically through the year. Your clinician sets the rhythm at check-in.",
      },
      {
        question: "Can I pause, change, or cancel?",
        answer: "Any time, from your account. If your goals change, message us and we'll adjust your protocol with you. No calls, no retention scripts, no penalty for pausing between cycles.",
      },
      {
        question: "What if I run out mid-cycle?",
        answer: "Message us and we'll expedite a replacement — most reorders ship the same day. Your subscription is timed so this shouldn't happen, but if life gets in the way, we've got you.",
      },
      {
        question: "Insurance / HSA / FSA?",
        answer: "No insurance — SYNC is cash-pay, which lets us build every protocol around your body rather than around what an insurer will approve. HSA and FSA support is rolling out soon through our payment partner, and we'll email you when it goes live.",
      },
    ],
  },
};

export const productsBySlug: Record<string, ProductContent> = {
  "bpc-157": bpc157Product,
  sermorelin: sermorelinProduct,
  nad: nadProduct,
  "pt-141": pt141Product,
  "ghk-cu": ghkCuProduct,
  semaglutide: semaglutideProduct,
  tirzepatide: tirzepatideProduct,
  dsip: dsipProduct,
  "mots-c": motsCProduct,
  semax: semaxProduct,
  selank: selankProduct,
  perform: performProduct,
  repair: repairProduct,
  define: defineProduct,
  restore: restoreProduct,
};

export const allProducts: ProductContent[] = [
  bpc157Product,
  sermorelinProduct,
  nadProduct,
  pt141Product,
  ghkCuProduct,
  semaglutideProduct,
  tirzepatideProduct,
  dsipProduct,
  motsCProduct,
  semaxProduct,
  selankProduct,
  performProduct,
  repairProduct,
  defineProduct,
  restoreProduct,
];

/* ------------------------------ Formulary (/start) ---------------------- */

export type FormularyContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  /** Label for the "show everything" category pill. */
  allLabel: string;
  sortLabel: string;
  sortOptions: string[];
  toggle: { options: string[]; active: string };
  products: CatalogProduct[];
  cta: {
    eyebrow: string;
    heading: string;
    subtext: string;
    label: string;
    href: string;
  };
};

/** Single-compound protocols vs the advanced metabolic / hormonal ones. */
const FORMULARY_TIERS: Record<string, string> = {
  "bpc-157": "Single",
  sermorelin: "Single",
  "ghk-cu": "Single",
  nad: "Single",
  dsip: "Single",
  tirzepatide: "Advanced",
  semaglutide: "Advanced",
  "mots-c": "Advanced",
  "pt-141": "Advanced",
};

// Only two vial renders exist, so cards alternate between them until real
// per-compound art lands (see docs/STORYBLOK-EDITING.md §5).
const FORMULARY_VIALS = [
  "/images/catalog/vial-recovery.png",
  "/images/catalog/vial-bpc157.png",
];

export const formulary: FormularyContent = {
  eyebrow: "The formulary",
  heading: "Every protocol, in one place.",
  subtext:
    "Six categories, one standard of care. Every compound below is prescribed by a licensed clinician in your state, compounded by a US pharmacy, and adjusted around how your body actually responds.",
  allLabel: "All",
  sortLabel: "Sort by:",
  sortOptions: ["Recommended", "Name A–Z", "Category"],
  // "All" drops the tier filter; category deep links land on it so a
  // category that spans both tiers arrives whole.
  toggle: { options: ["All", "Single", "Advanced"], active: "Single" },
  // Derived from the product pages so a new PDP appears here automatically.
  products: allProducts.map((p, i) => ({
    category: p.eyebrow,
    name: p.name,
    description: p.tagline,
    image: FORMULARY_VIALS[i % FORMULARY_VIALS.length],
    ctaLabel: "Start your protocol",
    ctaHref: `/products/${p.slug}`,
    tier: FORMULARY_TIERS[p.slug],
  })),
  cta: {
    eyebrow: "Not sure where to start",
    heading: "Let a clinician decide.",
    subtext:
      "Answer the intake and a licensed US clinician will tell you which compound fits or that none of them do. Both are real answers, and neither costs you anything until a protocol is approved.",
    label: "Start your protocol",
    href: "/products/bpc-157",
  },
};

export type CartUpsell = {
  category: string;
  name: string;
  description: string;
  image: string;
  price: string;
  href: string;
};

export type CartPaymentLogo = {
  src: string;
  alt: string;
};

export type CartContent = {
  title: string;
  emptyLabel: string;
  /** Upsell heading when the cart is empty vs. populated. */
  upsellTitle: string;
  pairedTitle: string;
  upsells: CartUpsell[];
  /** Line-item labels (populated state). */
  subscriptionLabel: string;
  removeLabel: string;
  switchPlanLabel: string;
  shippingLabel: string;
  shippingValue: string;
  paymentLabel: string;
  paymentLogos: CartPaymentLogo[];
  /** Trailing "5+" chip after the logos. */
  paymentMore: string;
  goodieLabel: string;
  goodieHighlight: string;
  goodieText: string;
  subtotalLabel: string;
  viewCartLabel: string;
  checkoutLabel: string;
  noteLabel: string;
  note: string;
};

export const cart: CartContent = {
  title: "Cart",
  emptyLabel: "Your cart is empty.",
  upsellTitle: "You might like",
  pairedTitle: "Paired well with",
  subscriptionLabel: "Subscription plan",
  removeLabel: "Remove",
  switchPlanLabel: "Switch plan",
  upsells: [
    {
      category: "Recovery",
      name: "BPC-157",
      description: "Tissue repair, joint and gut support.",
      image: "/images/catalog/vial-recovery.png",
      price: "$89.00",
      href: "/products/bpc-157",
    },
    {
      category: "Weight",
      name: "Compounded Tirzepatide",
      description: "Dual-action weight management, once weekly.",
      image: "/images/catalog/vial-bpc157.png",
      price: "$129.00",
      href: "/products/tirzepatide",
    },
    {
      category: "Performance",
      name: "Sermorelin",
      description: "Growth-hormone support, recovery and sleep.",
      image: "/images/catalog/vial-recovery.png",
      price: "$99.00",
      href: "/products/sermorelin",
    },
    {
      category: "Skin",
      name: "GHK-Cu",
      description: "Skin, hair and collagen renewal.",
      image: "/images/catalog/vial-bpc157.png",
      price: "$79.00",
      href: "/products/ghk-cu",
    },
  ],
  shippingLabel: "Shipping",
  shippingValue: "Free",
  paymentLabel: "Payment methods",
  paymentLogos: [
    { src: "/images/cart/mastercard.svg", alt: "Mastercard" },
    { src: "/images/cart/maestro.svg", alt: "Maestro" },
    { src: "/images/cart/visa.svg", alt: "Visa" },
    { src: "/images/cart/unionpay.svg", alt: "UnionPay" },
  ],
  paymentMore: "5+",
  goodieLabel: "Your exclusive goodie",
  goodieHighlight: "24 hours",
  goodieText: "Clinician review, included",
  subtotalLabel: "Subtotal",
  viewCartLabel: "View cart (3)",
  checkoutLabel: "Check out",
  noteLabel: "Note:",
  note: "Shipping and taxes are estimated and will be confirmed at checkout.",
};

export type CartPageContent = {
  eyebrow: string;
  heading: string;
  subtext: string;
  summaryTitle: string;
  subtotalLabel: string;
  shippingLabel: string;
  shippingValue: string;
  taxLabel: string;
  taxValue: string;
  dueLabel: string;
  checkoutLabel: string;
  trustLine: string;
  emptyLabel: string;
  emptyCtaLabel: string;
  emptyCtaHref: string;
  stackedEyebrow: string;
  stackedHeading: string;
};

/** Standalone /cart page (the "View cart" destination). Line items and totals
    come from the live cart; the "often stacked" grid reuses catalog products. */
export const cartPage: CartPageContent = {
  eyebrow: "Your cart",
  heading: "Cart",
  subtext: "Nothing here is charged yet. Proceed to check-out to buy the products.",
  summaryTitle: "Order summary",
  subtotalLabel: "Subtotal",
  shippingLabel: "Shipping · cold-chain",
  shippingValue: "Free",
  taxLabel: "Estimated tax",
  taxValue: "$0.00",
  dueLabel: "Due today",
  checkoutLabel: "Continue to checkout",
  trustLine: "Secure checkout · HIPAA-compliant · Cancel anytime",
  emptyLabel: "Your cart is empty.",
  emptyCtaLabel: "Browse protocols",
  emptyCtaHref: "/products/bpc-157",
  stackedEyebrow: "Often stacked with this",
  stackedHeading: "The architecture of in sync.",
};

export type CheckoutConsent = { title: string; body: RichTextValue };
export type CheckoutPayRow = {
  id: string;
  label: string;
  /** Chip logo SVG. Self-contained (own 56×32 box) unless `boxed`. */
  logo?: string;
  /** Rendered logo width in px. */
  logoW?: number;
  /** Bare badge that must be centred inside a white 56×32 chip box. */
  boxed?: boolean;
};
export type CheckoutFooterLink = { label: string; href: string };

export type CheckoutContent = {
  expressLabel: string;
  orLabel: string;
  contact: {
    title: string;
    signInLabel: string;
    signInHref: string;
    emailPlaceholder: string;
    optInLabel: string;
  };
  delivery: {
    title: string;
    countryLabel: string;
    countryValue: string;
    firstName: string;
    lastName: string;
    company: string;
    address: string;
    address2: string;
    zip: string;
    city: string;
    phone: string;
  };
  shipping: { title: string; empty: string };
  consent: { title: string; subtitle: string; items: CheckoutConsent[] };
  payment: {
    title: string;
    subtitle: string;
    cardLabel: string;
    logos: CartPaymentLogo[];
    logosMore: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
    nameOnCard: string;
    billingSame: string;
    altRows: CheckoutPayRow[];
    saveTitle: string;
    saveBody: string;
    saveDismiss: string;
  };
  discountPlaceholder: string;
  applyLabel: string;
  summary: {
    barLabel: string;
    subscriptionLabel: string;
    subtotalLabel: string;
    reviewLabel: string;
    reviewValue: string;
    shippingLabel: string;
    shippingValue: string;
    totalLabel: string;
    totalNote: string;
    taxNote: string;
  };
  payNow: string;
  payDisclaimer: RichTextValue;
  footerLinks: CheckoutFooterLink[];
};

/** Dedicated /checkout page. The order summary is driven by the live cart;
    everything else is presentational copy mirroring Figma 1030-27314. */
export const checkout: CheckoutContent = {
  expressLabel: "Express checkout",
  orLabel: "OR",
  contact: {
    title: "Contact",
    signInLabel: "Sign in",
    signInHref: "#",
    emailPlaceholder: "you@example.com",
    optInLabel: "Email me protocol updates and journal articles",
  },
  delivery: {
    title: "Delivery",
    countryLabel: "Country / Region",
    countryValue: "United States",
    firstName: "First name",
    lastName: "Last name",
    company: "Company (optional)",
    address: "Address",
    address2: "Apartment, suite, etc. (optional)",
    zip: "ZIP code",
    city: "City",
    phone: "Phone",
  },
  shipping: {
    title: "Shipping method",
    empty: "Enter your shipping address to view available shipping methods.",
  },
  consent: {
    title: "Medical review consent",
    subtitle:
      "Required before a clinician can review your intake and prescribe.",
    items: [
      {
        title: "I consent to a telehealth consultation",
        body: "A licensed US clinician will review my intake and may contact me for follow-up before prescribing.",
      },
      {
        title: "My medical history is accurate and complete",
        body: "Including current medications, allergies and conditions. Omissions can make a protocol unsafe.",
      },
      {
        title: "I understand these are compounded medications",
        body: "Compounded products are not FDA-approved and are prepared for me individually by a licensed pharmacy.",
      },
    ],
  },
  payment: {
    title: "Payment",
    subtitle:
      "All transactions are secure and encrypted. Card details are handled by Bask — SYNC never sees your card number.",
    cardLabel: "Credit card",
    logos: [
      { src: "/images/cart/mastercard.svg", alt: "Mastercard" },
      { src: "/images/cart/maestro.svg", alt: "Maestro" },
      { src: "/images/cart/visa.svg", alt: "Visa" },
      { src: "/images/cart/unionpay.svg", alt: "UnionPay" },
    ],
    logosMore: "5+",
    cardNumber: "Card number",
    expiry: "Expiration date (MM / YY)",
    cvc: "Security code",
    nameOnCard: "Name on card",
    billingSame: "Use shipping address as billing address",
    altRows: [
      { id: "paypal", label: "PayPal", logo: "/images/checkout/chip-paypal.svg", logoW: 56 },
      { id: "klarna", label: "Klarna", logo: "/images/checkout/chip-klarna.svg", logoW: 40, boxed: true },
      { id: "applepay", label: "Apple Pay", logo: "/images/checkout/chip-applepay.svg", logoW: 56 },
    ],
    saveTitle: "Save my information for a faster checkout",
    saveBody:
      "By continuing you agree to SYNC’s Telehealth Consent, Terms of Service and Privacy Policy.",
    saveDismiss: "Not now",
  },
  discountPlaceholder: "Discount code",
  applyLabel: "Apply",
  summary: {
    barLabel: "Order summary",
    subscriptionLabel: "Subscription plan",
    subtotalLabel: "Subtotal",
    reviewLabel: "Clinician review",
    reviewValue: "Included",
    shippingLabel: "Shipping",
    shippingValue: "Enter shipping address",
    totalLabel: "Total",
    totalNote: "Authorised today · charged on approval",
    taxNote: "Including $0.00 in estimated tax",
  },
  payNow: "Pay now",
  payDisclaimer:
    "Submitting is a request for care, not a guarantee of a prescription. Your card is authorised now and charged only if a clinician approves your protocol.",
  footerLinks: [
    { label: "Refund policy", href: "#" },
    { label: "Privacy policy", href: "/privacy-policy" },
    { label: "Terms of service", href: "/terms" },
    { label: "Contact", href: "#" },
  ],
};

/** Starter copy for the Refund Policy. Every field is overridden by the
    "refund-policy" story once the client edits it in Storyblok. */
export const refundPolicy: LegalContent = {
  eyebrow: "Legal",
  title: "Refund Policy",
  lastUpdated: "Last updated · 1 August 2026",
  intro:
    "Compounded medications are made to your individual prescription, which limits what can be returned. This policy sets out when we refund, when we replace, and how to raise a problem with an order.",
  contentsLabel: "Contents",
  clauses: [
    {
      number: "01",
      title: "Before your protocol ships",
      id: "before-shipping",
      body: "You can cancel any order for a full refund up until the point your prescription is released to the pharmacy. If your intake is still under clinical review, or a clinician declines to prescribe, you are not charged at all — any authorisation on your card is released.",
    },
    {
      number: "02",
      title: "After your protocol ships",
      id: "after-shipping",
      body: "Because each protocol is compounded to your prescription, dispensed medication cannot be returned, resold or reused, and is not refundable once it has left the pharmacy. This is a requirement of state pharmacy law, not a commercial preference.",
    },
    {
      number: "03",
      title: "Damaged, incorrect or delayed shipments",
      id: "damaged-or-incorrect",
      body: "If your order arrives damaged, arrives outside its required temperature range, is missing items, or is not what your prescription specifies, contact us within 7 days of delivery and we will replace it at no cost. Photographs of the packaging and vial help us resolve it faster and let us raise it with the pharmacy.",
    },
    {
      number: "04",
      title: "Subscriptions and renewals",
      id: "subscriptions",
      body: "Multi-month plans renew automatically until cancelled. Cancel or pause from your dashboard before the next cycle is processed and you are not charged for it. Cancelling does not refund a cycle that has already been dispensed.",
    },
    {
      number: "05",
      title: "How to request a refund",
      id: "how-to-request",
      body: "Email our care team with your order number and what went wrong. We aim to respond within one business day. Approved refunds return to your original payment method and typically clear within 5–10 business days, depending on your bank.",
    },
  ],
};

/** Starter copy for the Shipping Policy, served at /shipping — the address the
    footer already points at. Overridden by the "shipping" story. */
export const shippingPolicy: LegalContent = {
  eyebrow: "Legal",
  title: "Shipping Policy",
  lastUpdated: "Last updated · 1 August 2026",
  intro:
    "How your protocol gets to you: when it leaves the pharmacy, how it is packed, and what to do if something goes wrong in transit.",
  contentsLabel: "Contents",
  clauses: [
    {
      number: "01",
      title: "Processing time",
      id: "processing",
      body: "Most intakes are reviewed by a clinician the same day. Once your prescription is released, the pharmacy typically compounds and dispatches within 1–2 business days. Orders placed at a weekend or on a public holiday begin processing the next business day.",
    },
    {
      number: "02",
      title: "Delivery times and tracking",
      id: "delivery",
      body: "Standard delivery arrives within 2–5 business days of dispatch. You receive a tracking link by email as soon as the parcel is collected. Delivery estimates are provided by the carrier and are not guaranteed dates.",
    },
    {
      number: "03",
      title: "Cold chain and packaging",
      id: "cold-chain",
      body: "Compounds that require refrigeration ship in insulated packaging with a coolant pack, sized for the transit time. Every parcel is plain and unbranded — nothing on the outside identifies the contents or SYNC. Refrigerate temperature-sensitive items as soon as they arrive.",
    },
    {
      number: "04",
      title: "Shipping costs",
      id: "costs",
      body: "Delivery is free on orders over $50. Below that, a flat delivery charge is shown at checkout before you pay. Subscription cycles ship on the same terms as the original order.",
    },
    {
      number: "05",
      title: "Where we ship",
      id: "where-we-ship",
      body: "We ship within the United States only, and only to states where a licensed clinician can prescribe your protocol. We cannot deliver to PO boxes, freight forwarders, or addresses outside the US.",
    },
    {
      number: "06",
      title: "Failed, delayed or lost deliveries",
      id: "problems",
      body: "If a parcel is delayed beyond its estimate, arrives damaged, or is marked delivered but missing, contact our care team and we will trace it with the carrier. Where a temperature-sensitive shipment has been compromised in transit, we replace it rather than ask you to use it.",
    },
  ],
};
