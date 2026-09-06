"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ArrowIcon } from "@/components/arrow-icon";
import {
  MENU_CATEGORY_LIMIT,
  MOBILE_MENU_PROMO,
  PROTOCOL_CATEGORIES,
  LEARN_LINKS,
  type NavGroup,
} from "@/components/nav-links";
import type { SiteHeaderContent } from "@/lib/content";

/** Account glyph used on the Login pill (matches the header's login icon). */
function UserIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden className={className}>
      <path
        d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6024 18.3327 10C18.3327 5.39762 14.6017 1.66666 9.99935 1.66666C5.39698 1.66666 1.66602 5.39762 1.66602 10C1.66602 14.6024 5.39698 18.3333 9.99935 18.3333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 10.8333C11.3807 10.8333 12.5 9.71405 12.5 8.33334C12.5 6.95262 11.3807 5.83334 10 5.83334C8.61929 5.83334 7.5 6.95262 7.5 8.33334C7.5 9.71405 8.61929 10.8333 10 10.8333Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.83398 17.2183V15.8333C5.83398 15.3913 6.00958 14.9674 6.32214 14.6548C6.6347 14.3423 7.05862 14.1667 7.50065 14.1667H12.5007C12.9427 14.1667 13.3666 14.3423 13.6792 14.6548C13.9917 14.9674 14.1673 15.3913 14.1673 15.8333V17.2183"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Mobile / tablet navigation. The desktop nav links are `md:hidden`, so below
 * `md` this hamburger is the only way to reach the protocol categories, Learn,
 * Login, etc. Renders its own trigger + a full-screen overlay; open state stays
 * client-side. Layout follows Figma 190:2828 — a "MENU" bar, one flat row per
 * category, a Login pill, and a promo card pinned to the bottom.
 */
export function MobileMenu({ content }: { content: SiteHeaderContent }) {
  // `open` only flips on a click, so the portal never renders during SSR and
  // needs no extra "mounted" guard.
  const [open, setOpen] = useState(false);
  // Which category row is expanded — one at a time keeps the list scannable.
  const [expanded, setExpanded] = useState<string | null>(null);

  // One entry per category row, so the effect below can bring the row that
  // just opened back into view.
  const rows = useRef<Record<string, HTMLDivElement | null>>({});

  // The rows fill a phone screen, so the last one — Learn — opens its links
  // below the fold of the scrolling list, where they read as missing rather
  // than as something to scroll to. `nearest` scrolls only when the row
  // (sub-links included) doesn't already fit, so the rows near the top stay put.
  useEffect(() => {
    if (!expanded) return;
    const row = rows.current[expanded];
    if (!row) return;
    // A frame late: the sub-links have to be laid out before "nearest" can
    // tell how far the row overflows.
    const frame = requestAnimationFrame(() => {
      row.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "nearest",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [expanded]);

  // Lock body scroll + close on Escape while the overlay is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  const categories: NavGroup[] = content.protocolCategories?.length
    ? content.protocolCategories.map((c) => ({
      label: c.label,
      children: c.children ?? [],
      moreHref: c.moreHref,
    }))
    : PROTOCOL_CATEGORIES.map((c) => ({
      label: c.label,
      children: c.children ?? [],
      moreHref: c.moreHref,
    }));

  const menuLinks: NavGroup[] = [
    ...categories,
    { label: "Learn", children: LEARN_LINKS, moreHref: undefined },
  ];

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="shrink-0 rounded-full p-3 text-ink/80 transition-colors hover:bg-white/70 md:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-50 flex flex-col bg-cream"
          >
            {/* Header: MENU + close */}
            <div className="flex items-center justify-between border-b border-ink/[0.08] px-5 py-3">
              <span className="font-mono text-sm font-medium uppercase tracking-[0.08em] text-ink">
                Menu
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="rounded-full p-2 text-ink/80 transition-colors hover:bg-white/60"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>

            {/* Categories + Login */}
            <div className="flex flex-1 flex-col gap-9 overflow-y-auto p-5">
              <nav className="flex flex-col gap-1">
                {menuLinks.map((link) => {
                  const isOpen = expanded === link.label;
                  const children = link.children ?? [];
                  const shown = children.slice(0, MENU_CATEGORY_LIMIT);
                  const overflows = children.length > MENU_CATEGORY_LIMIT;
                  return (
                    <div
                      key={link.label}
                      ref={(el) => {
                        rows.current[link.label] = el;
                      }}
                      className="scroll-mb-4 border-b border-ink/[0.12]"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() => setExpanded(isOpen ? null : link.label)}
                        className="flex w-full items-center gap-1 py-3 text-left text-ink/80 transition-colors hover:text-ink"
                      >
                        <span className="flex-1 text-2xl leading-9">
                          {link.label}
                        </span>
                        {/* The Figma's right arrow, swung down while open. */}
                        <ArrowIcon
                          className={`size-9 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""
                            }`}
                        />
                      </button>

                      {isOpen && (
                        <ul className="flex flex-col pb-2">
                          {shown.map((child) => (
                            <li key={`${child.label}-${child.href}`}>
                              <Link
                                href={child.href}
                                onClick={close}
                                className="block py-2 text-lg leading-7 text-ink/60 transition-colors hover:text-brand"
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                          {overflows && link.moreHref && (
                            <li>
                              <Link
                                href={link.moreHref}
                                onClick={close}
                                className="flex items-center gap-1.5 py-2 text-lg leading-7 text-brand"
                              >
                                See more
                                <ArrowIcon className="size-5 shrink-0" />
                              </Link>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </nav>

              <Link
                href={content.loginHref}
                onClick={close}
                className="flex items-center gap-2 rounded-full bg-white px-5 py-4 text-base leading-6 text-ink"
              >
                <UserIcon className="size-5 shrink-0" />
                {content.loginLabel}
              </Link>
            </div>

            {/* Promo card (Figma 404:1594) — salmon→cream wash with the
                cut-out photo bleeding off the right edge. The gradient is CSS
                rather than the exported PNG: it is a plain vertical ramp, so
                this saves ~675KB and stays crisp at any size. */}
            <div
              className="relative isolate m-5 mt-0 shrink-0 overflow-hidden rounded-3xl px-4 py-5"
              style={{
                background:
                  "linear-gradient(180deg, #F3AEA0 0%, #F7CFC0 45%, #FCF4ED 100%)",
              }}
            >
              {/* Sits behind the copy so the headline stays legible where the
                  two overlap. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/nav/menu-promo-person.png"
                alt=""
                aria-hidden
                className="pointer-events-none absolute bottom-0 right-1 -z-10 h-[88%] w-auto max-w-none select-none"
              />

              <div className="flex flex-col items-start gap-4">
                <h2 className="whitespace-pre-line text-[28px] font-medium leading-9 tracking-[-0.02em] text-ink">
                  {MOBILE_MENU_PROMO.heading}
                </h2>
                <Link
                  href={content.ctaHref}
                  onClick={close}
                  className="group inline-flex items-center gap-2 rounded-full bg-brand py-3 pl-5 pr-4 text-base leading-6 text-brand-foreground"
                >
                  {content.ctaLabel}
                  <ArrowIcon className="size-6 shrink-0 transition-transform group-hover:-rotate-45" />
                </Link>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
