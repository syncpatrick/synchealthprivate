import { SiteHeader } from "@/components/site-header";
import { AboutHero } from "@/components/about-hero";
import { FounderNotes } from "@/components/founder-notes";
import { HowItWorks } from "@/components/how-it-works";
import { Timeline } from "@/components/timeline";
import { Compare } from "@/components/compare";
import { Principles } from "@/components/principles";
import { Coverage } from "@/components/coverage";
import { Team } from "@/components/team";
import { Quality } from "@/components/quality";
import { Careers } from "@/components/careers";
import { Testimonials } from "@/components/testimonials";
import { Protocols } from "@/components/protocols";
import { Blog } from "@/components/blog";
import { FinalCta } from "@/components/final-cta";
import { Footer } from "@/components/footer";
import {
  siteHeader,
  aboutHero,
  founderNotes,
  aboutHowItWorks,
  timeline,
  aboutCompare,
  principles,
  coverage,
  team,
  aboutQuality,
  careers,
  aboutTestimonials,
  aboutProtocols,
  aboutBlog,
  aboutCta,
  footer,
  type SiteHeaderContent,
} from "@/lib/content";

export function AboutFallback({
  header = siteHeader,
}: {
  header?: SiteHeaderContent;
} = {}) {
  return (
    // Cream → white wash on the page itself; the sections that carry their own
    // fill (how-it-works, compare, the dark quality band) paint over it, which
    // is how the Figma frame is built.
    <main className="min-h-screen overflow-clip bg-[linear-gradient(180deg,#F0F0E7_0%,#FFFFFF_100%)]">
      <div className="p-3">
        <SiteHeader content={header} />
      </div>

      <AboutHero content={aboutHero} />
      <FounderNotes content={founderNotes} />
      <HowItWorks content={aboutHowItWorks} />
      <Timeline content={timeline} />
      <Compare content={aboutCompare} />
      <Principles content={principles} />
      <Coverage content={coverage} />
      <Team content={team} />
      <Quality content={aboutQuality} tone="dark" />
      <Careers content={careers} />
      <Testimonials content={aboutTestimonials} />
      <Protocols content={aboutProtocols} />
      <Blog content={aboutBlog} />
      <FinalCta content={aboutCta} />
      <Footer content={footer} />
    </main>
  );
}
