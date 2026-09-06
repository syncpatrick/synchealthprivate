import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { ArrowIcon } from "@/components/arrow-icon";
import { MobileMenu } from "@/components/mobile-menu";
import { NavItem } from "@/components/nav-item";
import { StickyNav } from "@/components/sticky-nav";
import type { SiteHeaderContent } from "@/lib/content";
import { marqueeLoop } from "@/lib/marquee";

function TickerTrack({
  messages,
  ariaHidden = false,
}: {
  messages: string[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden}
      className="flex shrink-0 items-center gap-12 whitespace-nowrap pr-12 font-mono text-[11px] uppercase tracking-[0.08em] text-ink sm:gap-24 sm:pr-24 sm:text-[13px]"
    >
      {messages.map((msg, i) => (
        <li key={i}>{msg}</li>
      ))}
    </ul>
  );
}

/** Deliberately under the real advance (~8.8px at 13px mono with 0.08em
    tracking) so the estimate errs towards an extra repeat rather than a gap. */
const TICKER_CHAR_PX = 8;
/** gap-24 between messages, pr-24 after the last one. */
const TICKER_GAP_PX = 96;
/** Matches the pace of the original fixed 40s pass. */
const TICKER_SPEED = 22;

function Ticker({ messages }: { messages: string[] }) {
  // Identical tracks in one flex; the flex slides -50% for a seamless loop.
  // The track is repeated enough times that a half always overruns the
  // viewport, otherwise the wrap point shows blank space on wide screens.
  const trackWidth = messages.reduce(
    (w, msg) => w + msg.length * TICKER_CHAR_PX + TICKER_GAP_PX,
    0,
  );
  const { tracks, duration } = marqueeLoop(trackWidth, TICKER_SPEED);

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white/80 py-2 backdrop-blur-sm sm:py-3">
      <div
        className="flex w-max animate-marquee"
        style={{ "--marquee-duration": duration } as React.CSSProperties}
      >
        {tracks.map((i) => (
          <TickerTrack key={i} messages={messages} ariaHidden={i > 0} />
        ))}
      </div>
    </div>
  );
}

export function SiteHeader({ content }: { content: SiteHeaderContent }) {
  return (
    <header className="relative z-20 flex w-full flex-col items-center gap-2">
      <Ticker messages={content.tickerMessages} />

      <StickyNav>
        <nav className="relative flex w-full max-w-[980px] items-center justify-between rounded-full bg-white/[0.56] px-3 py-2 backdrop-blur-md sm:justify-start sm:gap-3 sm:py-3 sm:pl-8 sm:pr-3">
          {/* Left: hamburger (mobile) · logo + primary links (sm ↑) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <MobileMenu content={content} />

            <Link
              href="/"
              className="hidden shrink-0 sm:block"
              aria-label="Sync. home"
            >
              <Image
                src="/images/sync-logo.svg"
                alt="Sync."
                width={100}
                height={26}
                priority
                className="h-auto w-[100px]"
              />
            </Link>

            {/* Primary links */}
            <div className="hidden items-center gap-0.5 md:flex">
              {content.navLinks.map((link) => (
                <NavItem
                  key={link.label}
                  label={link.label}
                  href={link.href}
                  hasDropdown={link.hasDropdown}
                  cta={{ label: content.ctaLabel, href: content.ctaHref }}
                  protocolCategories={content.protocolCategories}
                  resourcesEyebrow={content.resourcesEyebrow}
                />
              ))}
            </div>
          </div>

          {/* Mobile: logo centred in the pill. Drawn at the SVG's natural
              100×26 — its ink box is 86.24×24 there, which is exactly the
              wordmark the mobile frame specs (Frame 1984078171). */}
          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 shrink-0 sm:hidden"
            aria-label="Sync. home"
          >
            <Image
              src="/images/sync-logo.svg"
              alt="Sync."
              width={100}
              height={26}
              priority
              className="h-auto w-[100px]"
            />
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:flex-1 sm:justify-end sm:gap-1">
            <button
              type="button"
              aria-label="Search"
              className="shrink-0 rounded-full p-3 text-ink/80 transition-colors hover:bg-white/70"
            >
              <Search className="size-5" aria-hidden />
            </button>

            <Link
              href={content.loginHref}
              className="hidden items-center gap-2 rounded-full py-3 pl-4 pr-5 text-base font-medium text-ink/80 transition-colors hover:bg-white/70 sm:flex"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="size-5" aria-hidden>
                <path
                  d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6024 18.3327 10C18.3327 5.39762 14.6017 1.66666 9.99935 1.66666C5.39698 1.66666 1.66602 5.39762 1.66602 10C1.66602 14.6024 5.39698 18.3333 9.99935 18.3333Z"
                  stroke="#1D1D1B"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33334C12.5 6.95262 11.3807 5.83334 10 5.83334C8.61929 5.83334 7.5 6.95262 7.5 8.33334C7.5 9.71405 8.61929 10.8333 10 10.8333Z"
                  stroke="#1D1D1B"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.83398 17.2183V15.8333C5.83398 15.3913 6.00958 14.9674 6.32214 14.6548C6.6347 14.3423 7.05862 14.1667 7.50065 14.1667H12.5007C12.9427 14.1667 13.3666 14.3423 13.6792 14.6548C13.9917 14.9674 14.1673 15.3913 14.1673 15.8333V17.2183"
                  stroke="#1D1D1B"
                  strokeOpacity="0.8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {content.loginLabel}
            </Link>

            {/* Nav CTA — Figma: Source Code Pro Medium 16/24, uppercase. */}
            <Link
              href={content.ctaHref}
              className="group hidden shrink-0 items-center gap-1.5 rounded-full bg-brand py-2.5 pl-4 pr-3 font-mono text-sm font-medium uppercase leading-6 text-brand-foreground sm:flex sm:gap-2 sm:py-3 sm:pl-5 sm:pr-4 sm:text-base"
            >
              <span className="whitespace-nowrap">{content.ctaLabel}</span>
              <ArrowIcon className="size-5 shrink-0 transition-transform group-hover:-rotate-45" />
            </Link>
          </div>
        </nav>
      </StickyNav>
    </header>
  );
}
