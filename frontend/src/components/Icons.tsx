// Small stroke icons and the Laruso dot mark. All decorative (aria-hidden).

type P = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

// Dot mark: dots stepping down into an "L".
// `lit` (0–1) dims the dots that haven't been reached yet, in path order: the header uses it as a reading-progress meter.
export const DOT_COUNT = 10;
export function DotMark({ className = "h-5 w-5", lit }: P & { lit?: number }) {
  const dots = [
    [3, 3, 1.6], [3, 8, 1.6], [3, 13, 1.6], [3, 18, 1.8],
    [8, 18, 1.8], [13, 18, 1.6], [18, 18, 1.4],
    [8, 13, 1], [13, 8, 0.8], [18, 3, 0.6],
  ];
  return (
    <svg viewBox="0 0 21 21" className={className} aria-hidden="true">
      {dots.map(([cx, cy, r], i) => {
        const on = lit === undefined || i < Math.max(1, Math.ceil(lit * DOT_COUNT));
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill="currentColor"
            style={lit === undefined ? undefined : { opacity: on ? 1 : 0.22, transition: "opacity 400ms var(--ease-out)" }}
          />
        );
      })}
    </svg>
  );
}

export const ArrowUp = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 19V5M5 12l7-7 7 7" /></svg>
);
export const ArrowRight = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M5 12h14M12 5l7 7-7 7" /></svg>
);
export const Check = ({ className = "h-3.5 w-3.5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base} strokeWidth={2.25}><path d="M5 12.5l4.5 4.5L19 7" /></svg>
);
export const Shield = ({ className = "h-5 w-5" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M12 3l8 3v6c0 4.5-3.4 8.3-8 9-4.6-.7-8-4.5-8-9V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
);
export const Message = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12z" /></svg>
);
export const User = ({ className = "h-4 w-4" }: P) => (
  <svg viewBox="0 0 24 24" className={className} {...base}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
