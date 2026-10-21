// Visible marker for anything not real yet: placeholder copy, sample numbers, planned features.
export default function PlaceholderTag({
  label = "Placeholder",
  tone = "page",
}: {
  label?: string;
  tone?: "page" | "ink";
}) {
  const color = tone === "ink" ? "border-ink-accent text-ink-accent" : "border-accent text-accent";
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border border-dashed px-2 py-0.5 font-mono text-[10px] font-medium uppercase leading-4 tracking-wider ${color}`}
    >
      {label}
    </span>
  );
}

// Inline placeholder text like "[Your name]", highlighted so it can't be missed.
export function Fill({ children }: { children: React.ReactNode }) {
  const text = String(children);
  if (!text.startsWith("[")) return <>{children}</>;
  return (
    <mark className="rounded border border-dashed border-accent bg-accent-soft px-1 text-accent">
      {children}
      <span className="sr-only"> (placeholder)</span>
    </mark>
  );
}
