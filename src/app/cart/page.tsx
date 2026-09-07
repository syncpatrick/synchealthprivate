import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { CartPageBody } from "@/components/cart-page";
import { cartPage, catalog } from "@/lib/content";
import {
  getStoryContent,
  resolveVersion,
  resolveSiteHeader,
  resolveFooter,
} from "@/lib/storyblok";
import { mapCartPage } from "@/lib/storyblok-map";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cart — Sync.",
  description: "Review your protocol before checkout.",
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [sp, { isEnabled }, header, footer] = await Promise.all([
    searchParams,
    draftMode(),
    resolveSiteHeader(searchParams),
    resolveFooter(searchParams),
  ]);
  const content = mapCartPage(
    await getStoryContent("cart", resolveVersion(sp, isEnabled)),
    cartPage,
  );

  return (
    <main className="min-h-screen overflow-x-clip bg-[linear-gradient(180deg,#FCF8F1_0%,#FFFFFF_62%)]">
      <div className="p-3">
        <SiteHeader content={header} />
      </div>
      <CartPageBody content={content} stacked={catalog} />
      <Footer content={footer} />
    </main>
  );
}
