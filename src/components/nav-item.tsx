"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { ArrowIcon } from "@/components/arrow-icon";
import { MENU_CATEGORY_LIMIT, menuForLabel } from "@/components/nav-links";
import type { NavGroup } from "@/components/nav-links";

/** How long the panel survives the mouse leaving, so the diagonal trip from
 *  the nav item down into the panel doesn't close it. */
const CLOSE_DELAY = 140;

/** A category row: the label opens its compounds, the compounds are the links. */
function MenuGroup({
  group,
  open,
  onToggle,
  onNavigate,
}: {
  group: NavGroup;
  open: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  if (!group.children?.length) {
    return (
      <Link
        href={group.href ?? "#"}
        onClick={onNavigate}
        className="text-xl leading-[30px] text-ink transition-colors hover:text-brand"
      >
        {group.label}
      </Link>
    );
  }

  // Past the limit the menu shows the first few and hands the rest to the
  // formulary, already filtered to this category.
  const shown = group.children.slice(0, MENU_CATEGORY_LIMIT);
  const overflows = group.children.length > MENU_CATEGORY_LIMIT;

  return (
    <div className="flex flex-col">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex items-center gap-2 text-left text-xl leading-[30px] text-ink transition-colors hover:text-brand"
      >
        <span className="flex-1">{group.label}</span>
        <ChevronDown
          aria-hidden
          className={`size-4 shrink-0 text-ink/40 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <ul className="mt-2 flex flex-col gap-2 border-l border-ink/[0.12] pl-4">
          {shown.map((child) => (
            <li key={`${child.label}-${child.href}`}>
              <Link
                href={child.href}
                onClick={onNavigate}
                className="block text-base leading-6 text-ink/70 transition-colors hover:text-brand"
              >
                {child.label}
              </Link>
            </li>
          ))}
          {overflows && group.moreHref && (
            <li>
              <Link
                href={group.moreHref}
                onClick={onNavigate}
                className="group/more flex items-center gap-1.5 text-base leading-6 text-brand transition-opacity hover:opacity-80"
              >
                See more
                <ArrowIcon className="size-4 transition-transform group-hover/more:-rotate-45" />
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

/**
 * One top-level nav entry. Items with a mega-menu are a disclosure button, not
 * a link: they used to point at a section page that doesn't exist, so clicking
 * the label landed on a 404 instead of showing the menu. The panel opens on
 * hover and on click/keyboard, which is also the only way to reach it on a
 * touch device wide enough to get the desktop nav.
 */
export function NavItem({
  label,
  href,
  hasDropdown,
  cta,
  protocolCategories,
  resourcesEyebrow,
}: {
  label: string;
  href: string;
  hasDropdown?: boolean;
  cta: { label: string; href: string };
  protocolCategories?: NavGroup[];
  resourcesEyebrow?: string;
}) {
  const menu = menuForLabel(label, {
    categories: protocolCategories,
    eyebrow: resourcesEyebrow,
  });
  const [open, setOpen] = useState(false);
  // One category expanded at a time keeps the panel from growing unbounded.
  const [expanded, setExpanded] = useState<string | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const close = () => {
    clearTimeout(timer.current);
    setOpen(false);
    setExpanded(null);
  };
  const openNow = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(close, CLOSE_DELAY);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => clearTimeout(timer.current), []);

  if (!menu) {
    return (
      <Link
        href={href}
        className="flex items-center gap-1 rounded-full py-3 pl-4 pr-3 text-base font-medium text-ink/80 transition-colors hover:bg-white/70"
      >
        {label}
        {hasDropdown && (
          <ChevronDown className="size-5 text-ink/50" aria-hidden />
        )}
      </Link>
    );
  }

  return (
    <div
      ref={wrap}
      className="relative"
      onPointerEnter={openNow}
      onPointerLeave={closeSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) close();
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? close() : openNow())}
        className="flex items-center gap-1 rounded-full py-3 pl-4 pr-3 text-base font-medium text-ink/80 transition-colors hover:bg-white/70"
      >
        {label}
        <ChevronDown
          aria-hidden
          className={`size-5 text-ink/50 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Kept mounted so it can fade; `invisible` also takes it out of the tab
          order while closed. The pt-3 bridges the gap to the nav item so the
          pointer doesn't cross dead space on the way down. */}
      <div
        className={`absolute left-0 top-full z-50 pt-3 transition-all ${
          open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"
        }`}
      >
        <div className="flex items-stretch gap-8 rounded-xl bg-white p-6 shadow-[0_24px_70px_rgba(29,29,27,0.16)]">
          {/* Left: categories + CTA */}
          <div className="flex w-[320px] flex-col justify-between gap-10">
            <div className="flex flex-col gap-4">
              <p className="font-mono text-base font-medium uppercase tracking-[0.02em] text-brand">
                {menu.eyebrow}
              </p>
              {menu.groups.map((group) => (
                <MenuGroup
                  key={group.label}
                  group={group}
                  open={expanded === group.label}
                  onToggle={() =>
                    setExpanded(expanded === group.label ? null : group.label)
                  }
                  onNavigate={close}
                />
              ))}
            </div>
            {/* Figma: Source Code Pro Medium 16/24, uppercase. */}
            <Link
              href={cta.href}
              onClick={close}
              className="group/cta inline-flex items-center gap-2 self-start rounded-full bg-brand py-4 pl-6 pr-5 font-mono text-base font-medium uppercase leading-6 text-white"
            >
              {cta.label}
              <ArrowIcon className="size-6 transition-transform group-hover/cta:-rotate-45" />
            </Link>
          </div>

          {/* Right: featured product card */}
          <Link
            href="/products/bpc-157"
            onClick={close}
            className="group/card flex w-[256px] shrink-0 flex-col gap-3 self-start rounded-2xl bg-white p-2 shadow-[0_10px_40px_rgba(29,29,27,0.10)]"
          >
            <div className="aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src="/images/catalog/vial-recovery.png"
                alt="BPC-157"
                width={240}
                height={240}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col gap-3 px-2 pb-1">
              <div className="flex flex-col gap-0.5">
                <p className="font-mono text-xs font-medium uppercase tracking-[0.02em] text-brand">
                  Recovery
                </p>
                <h4 className="text-xl font-medium text-ink">BPC-157</h4>
                <p className="text-sm text-ink/80">
                  Tissue repair, joint and gut support.
                </p>
              </div>
              <div className="h-px w-full bg-ink/[0.08]" />
              <span className="flex items-center gap-2 text-base text-ink">
                Learn more
                <ArrowIcon className="size-6 transition-transform group-hover/card:-rotate-45" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
