"use client";

import { useEffect, useState } from "react";
import { useInView, useReducedMotion } from "./hooks";

// Counts from 0 to `value` once visible. Server HTML holds the final number, and
// tabular numerals keep the width steady so nothing shifts while it counts.
export default function CountUp({ value, delay = 0, duration = 1400 }: { value: number; delay?: number; duration?: number }) {
  const [ref, inView] = useInView<HTMLSpanElement>(0.5);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduced) return;
    let raf = 0;
    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now + delay;
      const p = Math.min(1, Math.max(0, (now - t0) / duration));
      setShown(Math.round(value * (1 - Math.pow(1 - p, 4))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame((now) => {
      setShown(0);
      tick(now);
    });
    return () => cancelAnimationFrame(raf);
  }, [inView, reduced, value, delay, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown}
    </span>
  );
}
