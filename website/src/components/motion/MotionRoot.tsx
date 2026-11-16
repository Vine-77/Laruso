"use client";

import { useEffect } from "react";

// One IntersectionObserver for every [data-reveal] element on the page.
// Each element reveals once and is then left alone, so nothing re-animates on scroll back.
export default function MotionRoot() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const vh = window.innerHeight;

    // Anything already on screen at load shows immediately, so it never flickers out and back in.
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh && r.bottom > 0) el.dataset.in = "";
    }
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.in = "";
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    els.forEach((el) => el.dataset.in === undefined && io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
