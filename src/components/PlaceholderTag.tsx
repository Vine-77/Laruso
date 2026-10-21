export default function PlaceholderTag({ label = "Placeholder" }: { label?: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-accent px-2 py-0.5 font-mono text-[11px] font-medium uppercase tracking-wider text-accent">
      {label}
    </span>
  );
}
