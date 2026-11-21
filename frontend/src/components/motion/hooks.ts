"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const reducedQuery = "(prefers-reduced-motion: reduce)";

export function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(reducedQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(reducedQuery).matches,
    () => false,
  );
}

// True once the element has been meaningfully on screen; never flips back.
export function useInView<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// Steps through a timeline (ms offsets) once `start` is true. Returns how many steps have fired.
// Server HTML renders the final step (so the page reads fine without JS); after hydration the
// sequence rewinds to 0 while still offscreen, then plays once. Reduced motion stays on the final step.
export function useSequence(start: boolean, times: number[]) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(times.length);
  const key = times.join(",");
  useEffect(() => {
    const end = times.length;
    if (reduced) {
      const t = window.setTimeout(() => setStep(end), 0);
      return () => window.clearTimeout(t);
    }
    const ids = [window.setTimeout(() => setStep((s) => (start ? s : 0)), 0)];
    if (start) times.forEach((ms, i) => ids.push(window.setTimeout(() => setStep((s) => Math.max(s, i + 1)), ms)));
    return () => ids.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduced, key]);
  return step;
}
