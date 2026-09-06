import {
  StoryblokServerComponent,
  storyblokEditable,
  type SbBlokData,
} from "@storyblok/react/rsc";

import { Hero } from "@/components/hero";
import { SiteHeader } from "@/components/site-header";
import { AboutHero } from "@/components/about-hero";
import { FounderNotes } from "@/components/founder-notes";
import { Timeline } from "@/components/timeline";
import { Principles } from "@/components/principles";
import { Coverage } from "@/components/coverage";
import { Team } from "@/components/team";
import { Careers } from "@/components/careers";
import { Contact } from "@/components/contact";
import { FaqBrowser } from "@/components/faq-browser";
import { TrustBar } from "@/components/trust-bar";
import { HowItWorks } from "@/components/how-it-works";
import { Protocols } from "@/components/protocols";
import { Quality } from "@/components/quality";
import { Catalog } from "@/components/catalog";
import { Formulary } from "@/components/formulary";
import { Compare } from "@/components/compare";
import { Testimonials } from "@/components/testimonials";
import { Blog } from "@/components/blog";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import { Reveal } from "@/components/reveal";

import {
  testimonials,
  type CompareCell,
} from "@/lib/content";
import { mapTestimonials, mapHeader } from "@/lib/storyblok-map";
import { isRichDoc, type RichTextValue } from "@/lib/richtext";

/* ------------------------------------------------------------------ *
 * Small helpers to read loosely-typed Storyblok blok fields safely.
 * ------------------------------------------------------------------ */
const str = (v: unknown): string => (typeof v === "string" ? v : "");
const num = (v: unknown): number => (Number(v) ? Number(v) : 0);
const bool = (v: unknown): boolean => v === true || v === "true";
const arr = (v: unknown): SbBlokData[] => (Array.isArray(v) ? v : []);
/**
 * Rich text field → the editor's document, or the plain string the field held
 * before it could be formatted (a story keeps that until it is re-saved).
 */
const rich = (v: unknown): RichTextValue => (isRichDoc(v) ? v : str(v));

/** Storyblok asset field → a plain URL string (empty when unset). */
const img = (v: unknown): string => {
  if (v && typeof v === "object" && "filename" in v) {
    return str((v as { filename?: unknown }).filename);
  }
  return str(v);
};
const alt = (v: unknown): string =>
  v && typeof v === "object" && "alt" in v
    ? str((v as { alt?: unknown }).alt)
    : "";

/* ------------------------------------------------------------------ *
 * Section bloks — each maps a Storyblok blok onto the presentational
 * component and forwards `storyblokEditable` for click-to-edit.
 * ------------------------------------------------------------------ */


export function HeroBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Hero
      {...storyblokEditable(blok)}
      header={mapHeader(arr(blok.header)[0])}
      content={{
        headline: str(blok.headline),
        subheadline: str(blok.subheadline),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
        backgroundImage: {
          src: img(blok.backgroundImage),
          alt: alt(blok.backgroundImage) || str(blok.backgroundAlt),
        },
      }}
    />
  );
}

export function TrustBarBlok({ blok }: { blok: SbBlokData }) {
  return (
    <TrustBar
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        logos: arr(blok.logos).map((l) => ({
          src: img(l.image),
          alt: str(l.alt) || alt(l.image),
          width: num(l.width) || 120,
          height: num(l.height) || 56,
        })),
      }}
    />
  );
}

export function HowItWorksBlok({ blok }: { blok: SbBlokData }) {
  return (
    <HowItWorks
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        cardImage: img(blok.cardImage),
        steps: arr(blok.steps).map((s) => ({
          number: str(s.number),
          title: str(s.title),
          description: str(s.description),
          image: img(s.image),
        })),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
      }}
    />
  );
}

export function ProtocolsBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Protocols
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        cards: arr(blok.cards).map((c) => ({
          image: img(c.image),
          description: str(c.description),
          category: str(c.category),
          featured: bool(c.featured),
          color: str(c.color) || undefined,
          bgColor: str(c.bgColor) || undefined,
        })),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
      }}
    />
  );
}

/** Standalone header row. Home nests its header inside the hero blok; the
    About / Contact pages place it as its own section so it can be moved. */
export function SiteHeaderBlok({ blok }: { blok: SbBlokData }) {
  return (
    <div className="p-3" {...storyblokEditable(blok)}>
      <SiteHeader content={mapHeader(blok)} />
    </div>
  );
}

export function AboutHeroBlok({ blok }: { blok: SbBlokData }) {
  return (
    <AboutHero
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        body: rich(blok.body),
        image: {
          src: img(blok.image),
          alt: alt(blok.image) || str(blok.imageAlt),
        },
      }}
    />
  );
}

export function FounderNotesBlok({ blok }: { blok: SbBlokData }) {
  return (
    <FounderNotes
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        notes: arr(blok.notes).map((n) => ({
          name: str(n.name),
          role: str(n.role),
          quote: str(n.quote),
          photo: img(n.photo),
        })),
      }}
    />
  );
}

export function TimelineBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Timeline
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        steps: arr(blok.steps).map((s) => ({
          year: str(s.year),
          title: str(s.title),
          body: rich(s.body),
        })),
      }}
    />
  );
}

export function PrinciplesBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Principles
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        image: {
          src: img(blok.image),
          alt: alt(blok.image) || str(blok.imageAlt),
        },
        principles: arr(blok.principles).map((p) => ({
          number: str(p.number),
          title: str(p.title),
          body: rich(p.body),
        })),
      }}
    />
  );
}

export function CoverageBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Coverage
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        paragraphs: arr(blok.paragraphs).map((p) => str(p.text)),
        map: { src: img(blok.map), alt: alt(blok.map) || str(blok.mapAlt) },
        // Percentages of the map box, so they survive any map image swap.
        markers: arr(blok.markers).map((m) => ({ x: num(m.x), y: num(m.y) })),
      }}
    />
  );
}

export function TeamBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Team
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        members: arr(blok.members).map((m) => ({
          name: str(m.name),
          role: str(m.role),
          tag: str(m.tag),
          photo: img(m.photo),
        })),
      }}
    />
  );
}

export function CareersBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Careers
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        body: rich(blok.body),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
        collage: {
          src: img(blok.collage),
          alt: alt(blok.collage) || str(blok.collageAlt),
        },
      }}
    />
  );
}

export function ContactBlok({ blok }: { blok: SbBlokData }) {
  const form = arr(blok.form)[0] ?? ({} as SbBlokData);
  return (
    <Contact
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        form: {
          eyebrow: str(form.eyebrow),
          nameLabel: str(form.nameLabel),
          namePlaceholder: str(form.namePlaceholder),
          emailLabel: str(form.emailLabel),
          emailPlaceholder: str(form.emailPlaceholder),
          messageLabel: str(form.messageLabel),
          messagePlaceholder: str(form.messagePlaceholder),
          submitLabel: str(form.submitLabel),
          disclaimer: rich(form.disclaimer),
          successHeading: str(form.successHeading),
          successBody: str(form.successBody),
          errorBody: str(form.errorBody),
        },
        // A channel is either a mailto row or a CTA button — whichever the
        // author fills in. Empty strings would render an <a href="">.
        channels: arr(blok.channels).map((c) => ({
          eyebrow: str(c.eyebrow),
          description: str(c.description),
          email: str(c.email) || undefined,
          cta: str(c.ctaLabel)
            ? { label: str(c.ctaLabel), href: str(c.ctaHref) }
            : undefined,
        })),
        emergency: {
          eyebrow: str(blok.emergencyEyebrow),
          body: rich(blok.emergencyBody),
        },
      }}
    />
  );
}

export function FaqBrowserBlok({ blok }: { blok: SbBlokData }) {
  return (
    <FaqBrowser
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        allLabel: str(blok.allLabel),
        items: arr(blok.items).map((i) => ({
          category: str(i.category),
          question: str(i.question),
          answer: rich(i.answer),
        })),
      }}
    />
  );
}

export function QualityBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Quality
      {...storyblokEditable(blok)}
      tone={str(blok.tone) === "dark" ? "dark" : "light"}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        supporting: str(blok.supporting),
        features: arr(blok.features).map((f) => ({
          icon: img(f.icon),
          title: str(f.title),
          description: str(f.description),
        })),
      }}
    />
  );
}

export function CatalogBlok({ blok }: { blok: SbBlokData }) {
  const options = arr(blok.toggleOptions).map((o) => str(o.text));
  return (
    <Catalog
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        toggle: {
          options,
          active: str(blok.toggleActive) || options[0] || "",
        },
        products: arr(blok.products).map((p) => ({
          category: str(p.category),
          name: str(p.name),
          description: str(p.description),
          image: img(p.image),
          ctaLabel: str(p.ctaLabel),
          ctaHref: str(p.ctaHref),
          featured: bool(p.featured),
          tier: str(p.tier),
        })),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
      }}
    />
  );
}

export function FormularyBlok({ blok }: { blok: SbBlokData }) {
  const toggleOptions = arr(blok.toggleOptions).map((o) => str(o.text));
  const sortOptions = arr(blok.sortOptions).map((o) => str(o.text));
  return (
    <div {...storyblokEditable(blok)}>
      <Formulary
        content={{
          eyebrow: str(blok.eyebrow),
          heading: str(blok.heading),
          subtext: str(blok.subtext),
          allLabel: str(blok.allLabel) || "All",
          sortLabel: str(blok.sortLabel),
          // The component reads sortOptions[0] as the initial sort, so an
          // empty list would leave the select with nothing to select.
          sortOptions: sortOptions.length ? sortOptions : ["Recommended"],
          toggle: {
            options: toggleOptions,
            active: str(blok.toggleActive) || toggleOptions[0] || "",
          },
          products: arr(blok.products).map((p) => ({
            category: str(p.category),
            name: str(p.name),
            description: str(p.description),
            image: img(p.image),
            ctaLabel: str(p.ctaLabel),
            ctaHref: str(p.ctaHref),
            featured: bool(p.featured),
            tier: str(p.tier),
          })),
          cta: {
            eyebrow: str(blok.ctaEyebrow),
            heading: str(blok.ctaHeading),
            subtext: str(blok.ctaSubtext),
            label: str(blok.ctaLabel),
            href: str(blok.ctaHref),
          },
        }}
      />
    </div>
  );
}

function mapCell(c: SbBlokData): CompareCell {
  const type = str(c.type);
  if (type === "text") return { type: "text", text: str(c.text) };
  return { type: type === "cross" ? "cross" : type === "yes" ? "yes" : "check" };
}

export function CompareBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Compare
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        features: arr(blok.features).map((f) => str(f.text)),
        sync: arr(blok.sync).map(mapCell),
        competitors: arr(blok.competitors).map((col) => ({
          title: str(col.title),
          cells: arr(col.cells).map(mapCell),
        })),
        supporting: arr(blok.supporting).map((s) => ({
          icon: img(s.icon),
          label: str(s.label),
        })),
      }}
    />
  );
}

export function TestimonialsBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Testimonials
      {...storyblokEditable(blok)}
      content={mapTestimonials(blok, testimonials)}
    />
  );
}

export function BlogBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Blog
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        articles: arr(blok.articles).map((a) => ({
          category: str(a.category),
          title: str(a.title),
          meta: str(a.meta),
          image: img(a.image),
          href: str(a.href),
        })),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
      }}
    />
  );
}

export function FaqBlok({ blok }: { blok: SbBlokData }) {
  return (
    <Faq
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
        items: arr(blok.items).map((i) => ({
          question: str(i.question),
          answer: rich(i.answer),
        })),
      }}
    />
  );
}

export function FinalCtaBlok({ blok }: { blok: SbBlokData }) {
  return (
    <FinalCta
      {...storyblokEditable(blok)}
      content={{
        eyebrow: str(blok.eyebrow),
        heading: str(blok.heading),
        subtext: str(blok.subtext),
        ctaLabel: str(blok.ctaLabel),
        ctaHref: str(blok.ctaHref),
      }}
    />
  );
}

export function FooterBlok({ blok }: { blok: SbBlokData }) {
  const socials = arr(blok.socials)
    .map((s) => ({ name: str(s.name), href: str(s.href) }))
    .filter((s) =>
      ["instagram", "linkedin", "facebook", "youtube"].includes(s.name),
    ) as { name: "instagram" | "linkedin" | "facebook" | "youtube"; href: string }[];

  return (
    <Footer
      {...storyblokEditable(blok)}
      content={{
        tagline: str(blok.tagline),
        socials,
        navColumns: arr(blok.navColumns).map((col) => ({
          links: arr(col.links).map((l) => ({
            label: str(l.label),
            href: str(l.href),
            muted: bool(l.muted),
          })),
        })),
        newsletter: {
          text: str(blok.newsletterText),
          placeholder: str(blok.newsletterPlaceholder),
          ctaLabel: str(blok.newsletterCta),
        },
        disclaimer: rich(blok.disclaimer),
        payments: arr(blok.payments).map((p) => ({
          src: img(p.image),
          alt: str(p.alt) || alt(p.image),
        })),
      }}
    />
  );
}

/**
 * Page backdrops. Sections that carry their own fill paint over these; the
 * ones that don't (founder notes, timeline, team…) sit on the wash, which is
 * how the About frame is built. "warm" uses a fixed 620px stop so the tint
 * doesn't stretch with page length.
 */
const PAGE_BACKGROUNDS: Record<string, string> = {
  cream: "linear-gradient(180deg,#F0F0E7 0%,#FFFFFF 100%)",
  warm: "linear-gradient(180deg,#FCF8F1 0%,#FFFFFF 620px)",
  // Same wash as `warm` but running much further down, for the long
  // formulary listing on /start.
  sand: "linear-gradient(180deg,#FCF8F1 0%,#FFFFFF 1080px)",
};

/** Top-level page: renders its `body` list of section bloks in order. */
export function PageBlok({ blok }: { blok: SbBlokData }) {
  const background = PAGE_BACKGROUNDS[str(blok.background)];
  return (
    <main
      className={`min-h-screen overflow-clip ${background ? "" : "bg-white"}`}
      style={background ? { background } : undefined}
      {...storyblokEditable(blok)}
    >
      {arr(blok.body).map((nested) => (
        <StoryblokServerComponent blok={nested} key={nested._uid} />
      ))}
    </main>
  );
}

/**
 * Sections that must not animate in. The page wrapper would fade the whole
 * document at once rather than section by section; the header and footer are
 * chrome and should simply be there; and the hero is the first thing painted,
 * so fading it in delays the page looking loaded for no gain.
 */
const NEVER_REVEAL = new Set(["page", "site_header", "footer", "hero"]);

type BlokComponent = ((props: { blok: SbBlokData }) => React.ReactNode) & {
  displayName?: string;
};

const SECTION_BLOKS: Record<string, BlokComponent> = {
  page: PageBlok,
  hero: HeroBlok,
  site_header: SiteHeaderBlok,
  about_hero: AboutHeroBlok,
  founder_notes: FounderNotesBlok,
  timeline: TimelineBlok,
  principles: PrinciplesBlok,
  coverage: CoverageBlok,
  team: TeamBlok,
  careers: CareersBlok,
  contact: ContactBlok,
  faq_browser: FaqBrowserBlok,
  trust_bar: TrustBarBlok,
  how_it_works: HowItWorksBlok,
  protocols: ProtocolsBlok,
  quality: QualityBlok,
  catalog: CatalogBlok,
  formulary: FormularyBlok,
  compare: CompareBlok,
  testimonials: TestimonialsBlok,
  blog: BlogBlok,
  faq: FaqBlok,
  final_cta: FinalCtaBlok,
  footer: FooterBlok,
};

/**
 * Registry passed to storyblokInit (server + client).
 *
 * Two things are done here rather than inside each section, so a blok added
 * later gets both without anyone remembering to ask.
 *
 * A section ticked as hidden in Storyblok stops rendering. Nothing is deleted:
 * the content stays on the story and unticking the box brings it back exactly
 * as it was. That is the difference between switching a section off for a while
 * and dragging it to the bin. The check runs for every blok, and only the
 * components that carry the field can be switched off at all, which keeps the
 * header and the footer out of reach.
 *
 * Everything else is wrapped so it settles into place the first time it is
 * scrolled to.
 */
export const storyblokComponents: Record<string, BlokComponent> =
  Object.fromEntries(
    Object.entries(SECTION_BLOKS).map(([name, Blok]) => {
      const Section: BlokComponent = (props) => {
        if (props.blok?.hidden === true) return null;
        if (NEVER_REVEAL.has(name)) return <Blok {...props} />;
        return (
          <Reveal>
            <Blok {...props} />
          </Reveal>
        );
      };
      Section.displayName = `Section(${name})`;
      return [name, Section];
    }),
  );
