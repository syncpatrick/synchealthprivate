/**
 * Storyblok component (blok) schema definitions for the Sync. site.
 * Consumed by scripts/storyblok-provision.mjs. Field technical names match the
 * keys read in src/components/storyblok/index.tsx exactly.
 */

// --- field builders -------------------------------------------------------
let P = 0;
const reset = () => (P = 0);
const text = () => ({ type: "text", pos: P++ });
const textarea = () => ({ type: "textarea", pos: P++ });
const asset = () => ({ type: "asset", filetypes: ["images"], pos: P++ });
const boolean = () => ({ type: "boolean", pos: P++ });
const number = () => ({ type: "number", pos: P++ });
const option = (values) => ({
  type: "option",
  pos: P++,
  use_uuid: false,
  default_value: values[0],
  options: values.map((v) => ({ name: v, value: v })),
});
const bloks = (whitelist, extra = {}) => ({
  type: "bloks",
  pos: P++,
  restrict_components: true,
  component_whitelist: whitelist,
  ...extra,
});

/** Build a component definition; `schema` is created with a fresh pos counter. */
const comp = (name, display_name, schemaFn, opts = {}) => {
  reset();
  return {
    name,
    display_name,
    is_root: false,
    is_nestable: true,
    schema: schemaFn(),
    ...opts,
  };
};

// --- nested item bloks ----------------------------------------------------
export const SECTION_NAMES = [
  "hero",
  "trust_bar",
  "how_it_works",
  "protocols",
  "quality",
  "catalog",
  "compare",
  "testimonials",
  "blog",
  "faq",
  "final_cta",
  "footer",
];

export const components = [
  comp("text_item", "Text item", () => ({ text: text() })),
  comp("nav_link", "Nav link", () => ({
    label: text(),
    href: text(),
    hasDropdown: boolean(),
  })),
  comp("cert_logo", "Certification logo", () => ({
    image: asset(),
    alt: text(),
    width: number(),
    height: number(),
  })),
  comp("step", "Step", () => ({
    number: text(),
    title: text(),
    description: textarea(),
    image: asset(),
  })),
  comp("protocol_card", "Protocol card", () => ({
    image: asset(),
    category: text(),
    description: textarea(),
    featured: boolean(),
    color: text(), // dot / pill-fill colour, e.g. #DC5B24
    bgColor: text(), // image-background top tint, e.g. #F6C6A0
  })),
  comp("quality_feature", "Quality feature", () => ({
    icon: asset(),
    title: text(),
    description: textarea(),
  })),
  comp("catalog_product", "Catalog product", () => ({
    category: text(),
    name: text(),
    description: textarea(),
    image: asset(),
    ctaLabel: text(),
    ctaHref: text(),
    featured: boolean(),
    // Which Single / Advanced tab shows this product. Blank = shown in both.
    tier: option(["Single", "Advanced"]),
  })),
  comp("compare_cell", "Compare cell", () => ({
    type: option(["check", "cross", "yes", "text"]),
    text: text(),
  })),
  comp("compare_column", "Compare column", () => ({
    title: text(),
    cells: bloks(["compare_cell"]),
  })),
  comp("compare_support", "Compare support line", () => ({
    icon: asset(),
    label: text(),
  })),
  comp("testimonial", "Testimonial", () => ({
    highlight: text(),
    quote: textarea(),
    name: text(),
    tag: text(),
    image: asset(),
  })),
  comp("article", "Article", () => ({
    category: text(),
    title: text(),
    meta: text(),
    image: asset(),
    href: text(),
  })),
  comp("faq_item", "FAQ item", () => ({
    question: text(),
    answer: textarea(),
  })),
  comp("social_link", "Social link", () => ({
    name: option(["instagram", "linkedin", "facebook", "youtube"]),
    href: text(),
  })),
  comp("footer_link", "Footer link", () => ({
    label: text(),
    href: text(),
    muted: boolean(),
  })),
  comp("footer_column", "Footer column", () => ({
    links: bloks(["footer_link"]),
  })),
  comp("payment_logo", "Payment logo", () => ({
    image: asset(),
    alt: text(),
  })),
  comp("nav_sub_link", "Nav sub link", () => ({
    label: text(),
    href: text(),
  })),
  comp("protocol_category", "Protocol category", () => ({
    label: text(),
    children: bloks(["nav_sub_link"]),
    moreHref: text(),
  })),
  comp("site_header", "Site header", () => ({
    tickerMessages: bloks(["text_item"]),
    navLinks: bloks(["nav_link"]),
    resourcesEyebrow: text(),
    protocolCategories: bloks(["protocol_category"]),
    loginLabel: text(),
    loginHref: text(),
    ctaLabel: text(),
    ctaHref: text(),
  })),

  // --- section bloks ------------------------------------------------------
  comp("hero", "Hero", () => ({
    headline: text(),
    subheadline: textarea(),
    ctaLabel: text(),
    ctaHref: text(),
    backgroundImage: asset(),
    backgroundAlt: text(),
    header: bloks(["site_header"], { maximum: 1 }),
  })),
  comp("trust_bar", "Trust bar", () => ({
    eyebrow: text(),
    logos: bloks(["cert_logo"]),
  })),
  comp("how_it_works", "How it works", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    cardImage: asset(),
    steps: bloks(["step"]),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp("protocols", "Protocols", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    cards: bloks(["protocol_card"]),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp("quality", "Quality", () => ({
    eyebrow: text(),
    heading: text(),
    supporting: textarea(),
    features: bloks(["quality_feature"]),
  })),
  comp("catalog", "Catalog", () => ({
    eyebrow: text(),
    heading: text(),
    toggleOptions: bloks(["text_item"]),
    toggleActive: text(),
    products: bloks(["catalog_product"]),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp("compare", "Compare", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    features: bloks(["text_item"]),
    sync: bloks(["compare_cell"]),
    competitors: bloks(["compare_column"]),
    supporting: bloks(["compare_support"]),
  })),
  comp("testimonials", "Testimonials", () => ({
    eyebrow: text(),
    heading: text(),
    ratingLabel: text(),
    testimonials: bloks(["testimonial"]),
  })),
  comp("blog", "Blog", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    articles: bloks(["article"]),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp("faq", "FAQ", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    ctaLabel: text(),
    ctaHref: text(),
    items: bloks(["faq_item"]),
  })),
  comp("final_cta", "Final CTA", () => ({
    eyebrow: text(),
    heading: textarea(),
    subtext: textarea(),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp("footer", "Footer", () => ({
    tagline: textarea(),
    socials: bloks(["social_link"]),
    navColumns: bloks(["footer_column"]),
    newsletterText: text(),
    newsletterPlaceholder: text(),
    newsletterCta: text(),
    disclaimer: textarea(),
    payments: bloks(["payment_logo"]),
  })),

  // --- Legal pages (Terms, Privacy) ---------------------------------------
  comp("legal_clause", "Legal clause", () => ({
    number: text(),
    title: text(),
    id: text(),
    body: textarea(),
  })),
  comp(
    "legal_page",
    "Legal page",
    () => ({
      eyebrow: text(),
      title: text(),
      lastUpdated: text(),
      intro: textarea(),
      contentsLabel: text(),
      clauses: bloks(["legal_clause"]),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- Journal index ------------------------------------------------------
  comp("journal_article", "Journal article card", () => ({
    category: text(),
    title: text(),
    excerpt: textarea(),
    meta: text(),
    image: text(),
    href: text(),
  })),
  comp("journal_featured", "Journal featured", () => ({
    eyebrow: text(),
    title: text(),
    excerpt: textarea(),
    meta: text(),
    image: asset(),
    href: text(),
    readMoreLabel: text(),
  })),
  comp("journal_newsletter", "Journal newsletter", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    placeholder: text(),
    ctaLabel: text(),
  })),
  comp(
    "journal_page",
    "Journal page",
    () => ({
      eyebrow: text(),
      heading: text(),
      subtext: textarea(),
      tabs: bloks(["text_item"]),
      featured: bloks(["journal_featured"]),
      articles: bloks(["journal_article"]),
      loadMoreLabel: text(),
      newsletter: bloks(["journal_newsletter"]),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- Article detail -----------------------------------------------------
  comp("article_toc", "Article TOC item", () => ({
    label: text(),
    id: text(),
  })),
  comp("article_prose", "Article prose block", () => ({
    type: option(["lead", "h2", "p", "quote", "image"]),
    text: textarea(),
    id: text(),
    image: asset(),
    caption: text(),
  })),
  comp(
    "article_page",
    "Article page",
    () => ({
      journalLabel: text(),
      category: text(),
      title: textarea(),
      dek: textarea(),
      authorLabel: text(),
      authorName: text(),
      authorAvatar: asset(),
      publishedLabel: text(),
      publishedValue: text(),
      readTimeLabel: text(),
      readTimeValue: text(),
      metaLine: text(),
      cover: asset(),
      tocLabel: text(),
      toc: bloks(["article_toc"]),
      prose: bloks(["article_prose"]),
      disclaimerLabel: text(),
      disclaimerText: textarea(),
      reviewerLabel: text(),
      reviewerName: text(),
      reviewerNote: textarea(),
      reviewerAvatar: asset(),
      relatedEyebrow: text(),
      relatedHeading: text(),
      relatedArticles: bloks(["journal_article"]),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- Checkout -----------------------------------------------------------
  comp("checkout_contact", "Checkout contact", () => ({
    title: text(),
    signInLabel: text(),
    signInHref: text(),
    emailPlaceholder: text(),
    optInLabel: text(),
  })),
  comp("checkout_delivery", "Checkout delivery", () => ({
    title: text(),
    countryLabel: text(),
    countryValue: text(),
    firstName: text(),
    lastName: text(),
    company: text(),
    address: text(),
    address2: text(),
    zip: text(),
    city: text(),
    phone: text(),
  })),
  comp("checkout_shipping", "Checkout shipping", () => ({
    title: text(),
    empty: textarea(),
  })),
  comp("checkout_consent_item", "Checkout consent item", () => ({
    title: text(),
    body: textarea(),
  })),
  comp("checkout_consent", "Checkout consent", () => ({
    title: text(),
    subtitle: textarea(),
    items: bloks(["checkout_consent_item"]),
  })),
  comp("checkout_card_logo", "Checkout card logo", () => ({
    src: text(),
    alt: text(),
  })),
  comp("checkout_pay_row", "Checkout pay row", () => ({
    id: text(),
    label: text(),
    logo: text(),
    logoW: number(),
    boxed: boolean(),
  })),
  comp("checkout_payment", "Checkout payment", () => ({
    title: text(),
    subtitle: textarea(),
    cardLabel: text(),
    logos: bloks(["checkout_card_logo"]),
    logosMore: text(),
    cardNumber: text(),
    expiry: text(),
    cvc: text(),
    nameOnCard: text(),
    billingSame: text(),
    altRows: bloks(["checkout_pay_row"]),
    saveTitle: text(),
    saveBody: textarea(),
    saveDismiss: text(),
  })),
  comp("checkout_summary", "Checkout summary", () => ({
    barLabel: text(),
    subscriptionLabel: text(),
    subtotalLabel: text(),
    reviewLabel: text(),
    reviewValue: text(),
    shippingLabel: text(),
    shippingValue: text(),
    totalLabel: text(),
    totalNote: text(),
    taxNote: text(),
  })),
  comp(
    "checkout_page",
    "Checkout page",
    () => ({
      expressLabel: text(),
      orLabel: text(),
      contact: bloks(["checkout_contact"]),
      delivery: bloks(["checkout_delivery"]),
      shipping: bloks(["checkout_shipping"]),
      consent: bloks(["checkout_consent"]),
      payment: bloks(["checkout_payment"]),
      discountPlaceholder: text(),
      applyLabel: text(),
      summary: bloks(["checkout_summary"]),
      payNow: text(),
      payDisclaimer: textarea(),
      footerLinks: bloks(["footer_link"]),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- Cart ---------------------------------------------------------------
  comp("cart_upsell", "Cart upsell", () => ({
    category: text(),
    name: text(),
    description: textarea(),
    image: text(),
    price: text(),
    href: text(),
  })),
  comp(
    "cart_page",
    "Cart page",
    () => ({
      eyebrow: text(),
      heading: text(),
      subtext: textarea(),
      summaryTitle: text(),
      subtotalLabel: text(),
      shippingLabel: text(),
      shippingValue: text(),
      taxLabel: text(),
      taxValue: text(),
      dueLabel: text(),
      checkoutLabel: text(),
      trustLine: text(),
      emptyLabel: text(),
      emptyCtaLabel: text(),
      emptyCtaHref: text(),
      stackedEyebrow: text(),
      stackedHeading: text(),
    }),
    { is_root: true, is_nestable: false },
  ),
  comp(
    "cart_drawer",
    "Cart drawer",
    () => ({
      title: text(),
      emptyLabel: text(),
      upsellTitle: text(),
      pairedTitle: text(),
      upsells: bloks(["cart_upsell"]),
      subscriptionLabel: text(),
      removeLabel: text(),
      switchPlanLabel: text(),
      shippingLabel: text(),
      shippingValue: text(),
      paymentLabel: text(),
      paymentLogos: bloks(["checkout_card_logo"]),
      paymentMore: text(),
      goodieLabel: text(),
      goodieHighlight: text(),
      goodieText: text(),
      subtotalLabel: text(),
      viewCartLabel: text(),
      checkoutLabel: text(),
      noteLabel: text(),
      note: textarea(),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- Product ------------------------------------------------------------
  comp("product_trust", "Product trust", () => ({
    icon: text(),
    label: text(),
  })),
  comp("product_method", "Product method image", () => ({
    image: text(),
    alt: text(),
  })),
  comp("product_plan", "Product plan", () => ({
    label: text(),
    price: text(),
    period: text(),
    badgeText: text(),
    badgeVariant: text(),
    save: text(),
  })),
  comp("product_accordion", "Product accordion item", () => ({
    title: text(),
    body: textarea(),
  })),
  comp("product_why_feature", "Product why feature", () => ({
    icon: text(),
    title: text(),
    description: textarea(),
  })),
  comp("product_quality_test", "Product quality test", () => ({
    name: text(),
    status: text(),
    description: textarea(),
  })),
  comp("product_quality", "Product quality block", () => ({
    heading: text(),
    collage: bloks(["text_item"]),
    lead: textarea(),
    body: textarea(),
    tests: bloks(["product_quality_test"]),
  })),
  // Like how_it_works but with image paths as text (product images stay in
  // /public rather than uploaded assets).
  comp("product_how_it_works", "Product how it works", () => ({
    eyebrow: text(),
    heading: text(),
    subtext: textarea(),
    cardImage: text(),
    steps: bloks(["step"]),
    ctaLabel: text(),
    ctaHref: text(),
  })),
  comp(
    "product_page",
    "Product page",
    () => ({
      slug: text(),
      eyebrow: text(),
      name: text(),
      description: textarea(),
      tagline: text(),
      galleryMain: text(),
      galleryThumbnails: bloks(["text_item"]),
      trust: bloks(["product_trust"]),
      methodLabel: text(),
      methods: bloks(["product_method"]),
      priceAmount: text(),
      pricePeriod: text(),
      planLabel: text(),
      plans: bloks(["product_plan"]),
      ctaLabel: text(),
      ctaHref: text(),
      ctaNote: textarea(),
      accordion: bloks(["product_accordion"]),
      safetyLabel: text(),
      safetyHref: text(),
      whyHeading: text(),
      whyFeatures: bloks(["product_why_feature"]),
      qualityTest: bloks(["product_quality"]),
      howItWorks: bloks(["product_how_it_works"]),
      faq: bloks(["faq"]),
    }),
    { is_root: true, is_nestable: false },
  ),

  // --- root content type --------------------------------------------------
  comp(
    "page",
    "Page",
    () => ({ body: bloks(SECTION_NAMES) }),
    { is_root: true, is_nestable: false },
  ),
];
