import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { Contact } from "@/components/contact";
import { FaqBrowser } from "@/components/faq-browser";
import { FinalCta } from "@/components/final-cta";
import {
  siteHeader,
  contact,
  faqPage,
  contactCta,
  footer,
  type SiteHeaderContent,
} from "@/lib/content";

export function ContactFallback({
  header = siteHeader,
}: {
  header?: SiteHeaderContent;
} = {}) {
  return (
    <main className="min-h-screen overflow-clip bg-white">
      {/* Cream → white wash behind the header, contact block and FAQ; the
          closing CTA sits on plain white with its own glow (Figma 1108:7992). */}
      <div className="bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_67%)]">
        <div className="p-3">
          <SiteHeader content={header} />
        </div>
        <Contact content={contact} />
        <FaqBrowser content={faqPage} />
      </div>
      <FinalCta content={contactCta} />
      <Footer content={footer} />
    </main>
  );
}
