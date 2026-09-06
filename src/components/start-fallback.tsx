import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Formulary } from "@/components/formulary";
import { siteHeader, formulary, footer, type SiteHeaderContent } from "@/lib/content";

/** The formulary rendered from local content, used whenever Storyblok is
    unconfigured or the `start` story is missing, so the page never blanks. */
export function StartFallback({
  header = siteHeader,
}: {
  header?: SiteHeaderContent;
} = {}) {
  return (
    <main className="min-h-screen overflow-clip bg-white">
      {/* Cream → white wash behind the header + listing (Figma gradient). */}
      <div className="bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_56%)]">
        <div className="p-3">
          <SiteHeader content={header} />
        </div>
        <Formulary content={formulary} />
      </div>
      <Footer content={footer} />
    </main>
  );
}
