import FlowDiagram from "@/components/FlowDiagram";
import PlaceholderTag from "@/components/PlaceholderTag";
import ThemeToggle from "@/components/ThemeToggle";
import { links, problem, results, site, stack } from "@/content";

const nav = [
  { id: "problem", label: "Problem" },
  { id: "how-it-works", label: "How it works" },
  { id: "results", label: "Results" },
  { id: "stack", label: "Stack" },
  { id: "limits", label: "Limits" },
  { id: "links", label: "Links" },
];

function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20 border-t border-line py-16 sm:py-20">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{index}</p>
      <h2 id={`${id}-heading`} className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

function Video() {
  if (site.youtubeId) {
    return (
      <div className="aspect-video overflow-hidden rounded-2xl border border-line bg-surface">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${site.youtubeId}`}
          title="Laruso demo video"
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div
      role="img"
      aria-label="Placeholder: demo video not added yet"
      className="placeholder-stripes flex aspect-video flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-accent bg-surface p-6 text-center"
    >
      <PlaceholderTag label="Placeholder · demo video" />
      <p className="max-w-xs text-sm text-muted">
        Demo video coming soon. Set <code className="font-mono text-fg">youtubeId</code> in{" "}
        <code className="font-mono text-fg">src/content.ts</code>.
      </p>
    </div>
  );
}

export default function Home() {
  const anyPlaceholderResult = results.some((r) => r.placeholder);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="#top" className="font-mono text-sm font-semibold tracking-wider">
            LARUSO
          </a>
          <nav aria-label="Sections" className="hidden md:block">
            <ul className="flex gap-6 text-sm text-muted">
              {nav.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} className="hover:text-fg">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </header>

      <main id="main" className="mx-auto w-full max-w-5xl flex-1 px-4 sm:px-6">
        {/* Hero */}
        <section id="top" aria-labelledby="hero-heading" className="grid gap-10 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
              Prototype · synthetic data · local models
            </p>
            <h1 id="hero-heading" className="mt-6 text-5xl font-semibold tracking-tight sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{site.tagline}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#how-it-works"
                className="rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-85"
              >
                See how it works
              </a>
              <a
                href={links.github.href}
                className="rounded-full border border-line bg-surface px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent"
              >
                View on GitHub{links.github.placeholder && <span className="sr-only"> (placeholder link)</span>}
              </a>
            </div>
          </div>
          <Video />
        </section>

        <Section id="problem" index="01 · Problem" title="Follow-ups slip, and the customer drifts">
          <ul className="grid gap-4 sm:grid-cols-3">
            {problem.map((p) => (
              <li key={p.title} className="rounded-2xl border border-line bg-surface p-5">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{p.body}</p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="how-it-works" index="02 · How it works" title="Agent drafts. Human decides. Harness checks.">
          <p className="mb-8 max-w-2xl leading-relaxed text-muted">
            Laruso reads three simulated systems, picks who to contact, and writes a draft for each. Nothing is sent
            until a person approves it. A simulator of fake customers and a scorer test the whole loop.
          </p>
          <FlowDiagram />
        </Section>

        <Section id="results" index="03 · Results" title="Eval scores">
          {anyPlaceholderResult && (
            <p className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-accent bg-accent-soft px-4 py-3 text-sm">
              <PlaceholderTag />
              <span>These numbers are placeholders, not measured results. Real scores will replace them.</span>
            </p>
          )}
          <div className="overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[520px] text-left text-sm">
              <caption className="sr-only">
                Laruso evaluation scores{anyPlaceholderResult ? " (placeholder values)" : ""}
              </caption>
              <thead className="border-b border-line font-mono text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Metric</th>
                  <th scope="col" className="px-5 py-3 font-medium">Score</th>
                  <th scope="col" className="w-2/5 px-5 py-3 font-medium">
                    <span className="sr-only">Bar</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.metric} className="border-b border-line last:border-0">
                    <th scope="row" className="px-5 py-4 align-top font-normal">
                      <span className="font-medium">{r.metric}</span>
                      <span className="mt-0.5 block text-xs text-muted">{r.description}</span>
                    </th>
                    <td className="whitespace-nowrap px-5 py-4 align-top font-mono">
                      {r.value}
                      {r.unit}
                      {r.placeholder && (
                        <span className="ml-2 font-sans text-xs text-accent">
                          <span aria-hidden="true">*</span>
                          <span className="sr-only">placeholder</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 align-middle" aria-hidden="true">
                      <div className="h-2 w-full rounded-full bg-line">
                        <div
                          className={`h-2 rounded-full ${r.placeholder ? "placeholder-stripes border border-dashed border-accent" : "bg-accent"}`}
                          style={{ width: `${r.value}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {anyPlaceholderResult && (
            <p className="mt-3 text-xs text-muted">* Placeholder value.</p>
          )}
        </Section>

        <Section id="stack" index="04 · Stack and decisions" title="What it's built with, and why">
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {stack.map((s) => (
              <div key={s.tool} className="border-l-2 border-accent pl-4">
                <dt className="font-semibold">{s.tool}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-muted">{s.why}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section id="limits" index="05 · Limits" title="What this is, and what it isn't">
          <div className="max-w-2xl rounded-2xl border border-line bg-surface p-6 leading-relaxed">
            <p>
              Laruso is a <strong>prototype</strong>. It runs on <strong>synthetic data</strong>, not real dealership
              records, and uses a <strong>small local model</strong>, so drafts can be uneven. It has not been tested
              with real customers or connected to a real DMS or CRM.
            </p>
          </div>
        </Section>

        <Section id="links" index="06 · Links" title="Find me">
          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "GitHub repo", href: links.github.href, text: links.github.href.replace("https://", ""), placeholder: links.github.placeholder },
              { label: "LinkedIn", href: links.linkedin.href, text: links.linkedin.href.replace("https://www.", ""), placeholder: links.linkedin.placeholder },
              { label: "Email", href: `mailto:${links.email.href}`, text: links.email.href, placeholder: links.email.placeholder },
            ].map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="group block h-full rounded-2xl border border-line bg-surface p-5 transition-colors hover:border-accent"
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{l.label}</span>
                    {l.placeholder && <PlaceholderTag />}
                  </span>
                  <span className="mt-2 block break-all font-mono text-xs text-muted group-hover:text-fg">{l.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-muted sm:px-6">
          {site.name} · a portfolio prototype. Built with Next.js and Tailwind.
        </div>
      </footer>
    </>
  );
}
