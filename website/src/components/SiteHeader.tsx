"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, DotMark } from "@/components/Icons";
import { links, site } from "@/content";

const navLinks = [
  { label: "Build log", href: "#build-log" },
  { label: "GitHub", href: links.github },
];
const menuLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Build log", href: "#build-log" },
  { label: "Data and limits", href: "#notes" },
  { label: "GitHub", href: links.github },
];
const newTab = { target: "_blank", rel: "noopener noreferrer" };
const isExternalLink = (href: string) => href.startsWith("http://") || href.startsWith("https://");

export default function SiteHeader() {
  const [progress, setProgress] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false, glide: false });
  const menuBtn = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  // Scroll state: reading progress and the compact shadow.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Mobile menu: Escape and outside clicks close it; focus moves into it on open.
  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) menuBtn.current?.focus();
  }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close(true);
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !menuBtn.current?.contains(t)) close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open, close]);

  const movePill = (e: React.PointerEvent<HTMLAnchorElement> | React.FocusEvent<HTMLAnchorElement>) => {
    const a = e.currentTarget;
    const x = a.offsetLeft;
    const w = a.offsetWidth;
    // Glide only when the pill is already showing; otherwise fade it in in place.
    setPill((p) => ({ x, w, on: true, glide: p.on }));
  };

  return (
    <header
      className="site-header fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4"
      data-scrolled={scrolled ? "" : undefined}
    >
      <div className="relative mx-auto flex max-w-[1400px] items-start justify-between gap-3">
        <a
          href="#top"
          className="hdr-box group flex h-12 items-center gap-2.5 rounded-2xl px-4 backdrop-blur-md sm:h-14 sm:px-5"
          aria-label={`${site.name}, back to top`}
        >
          <DotMark className="h-5 w-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:scale-110" lit={progress} />
          <span className="text-lg font-medium tracking-tight">{site.name}</span>
        </a>

        <nav aria-label="Main" className="hdr-box flex h-12 items-center gap-1 rounded-2xl p-1.5 backdrop-blur-md sm:h-14 sm:gap-2">
          <ul className="relative hidden items-center text-sm sm:flex" onPointerLeave={() => setPill((p) => ({ ...p, on: false }))}>
            <span
              aria-hidden="true"
              className="nav-pill pointer-events-none absolute left-0 top-0 h-full rounded-full"
              data-glide={pill.glide ? "" : undefined}
              style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.on ? 1 : 0 }}
            />
            {navLinks.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(isExternalLink(l.href) ? newTab : {})}
                  onPointerEnter={movePill}
                  onFocus={movePill}
                  onBlur={() => setPill((p) => ({ ...p, on: false }))}
                  className="relative block rounded-full px-3.5 py-2 text-[var(--hdr-muted)] transition-colors duration-300 hover:text-[var(--hdr-fg)] focus-visible:text-[var(--hdr-fg)]"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <span aria-hidden="true" className="hidden h-5 w-px bg-[var(--hdr-line)] sm:block" />
          <a
            href={links.github}
            {...newTab}
            className="btn btn-primary group hidden h-full items-center gap-1.5 rounded-xl px-4 text-sm font-medium sm:inline-flex"
          >
            View on GitHub
            <ArrowRight className="nudge h-3.5 w-3.5" />
          </a>
          <button
            ref={menuBtn}
            type="button"
            className="btn inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--hdr-fg)] hover:bg-[var(--hdr-pill)] sm:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="menu-icon flex flex-col gap-1" aria-hidden="true">
              <span className="block h-[1.5px] w-4 rounded bg-current" />
              <span className="block h-[1.5px] w-4 rounded bg-current" />
            </span>
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          ref={panel}
          id="mobile-menu"
          className="menu-panel hdr-box absolute right-0 top-[calc(100%+8px)] w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl p-2 backdrop-blur-xl sm:hidden"
          data-open={open ? "" : undefined}
          inert={!open}
        >
          <ul>
            {menuLinks.map((l, i) => (
              <li key={l.label} style={{ "--i": i } as React.CSSProperties}>
                <a
                  href={l.href}
                  {...(isExternalLink(l.href) ? newTab : {})}
                  onClick={() => close()}
                  className="group flex items-center justify-between rounded-xl px-4 py-3 text-lg hover:bg-[var(--hdr-pill)]"
                >
                  {l.label}
                  <ArrowRight className="nudge h-4 w-4 opacity-50" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
