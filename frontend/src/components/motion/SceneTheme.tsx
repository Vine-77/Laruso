"use client";

import { useEffect } from "react";

// The page takes the theme of whichever section is just scrolling into view: a trigger line sits EDGE
// in from the edge the content is arriving from (near the bottom scrolling down, near the top scrolling
// up), and the page goes dark while a [data-scene="dark"] section is on that line.
// The colors ease over in CSS (scene block in globals.css).
const EDGE = 0.15;

export default function SceneTheme() {
  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-scene='dark']"));
    const root = document.documentElement;
    let raf = 0;
    let dark = false;
    let lastY = window.scrollY;
    let down = true;

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (y !== lastY) down = y > lastY;
      lastY = y;
      const line = vh * (down ? 1 - EDGE : EDGE);
      const inView = zones.some((z) => {
        const r = z.getBoundingClientRect();
        return r.top <= line && r.bottom >= line;
      });
      // Only touch the attribute on a real change: rewriting it restyles the whole page
      if (inView === dark) return;
      dark = inView;
      if (inView) root.dataset.scene = "dark";
      else delete root.dataset.scene;
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
      delete root.dataset.scene;
    };
  }, []);

  return null;
}
