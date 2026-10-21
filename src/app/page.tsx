import { ArrowRight, DotMark } from "@/components/Icons";
import {
  ApprovalQueueMock,
  ChatMock,
  CheckDetail,
  ChecksList,
  DraftMock,
  HeroApp,
  LimePanel,
  PrioritiesMock,
  TriageMock,
} from "@/components/Mocks";
import PlaceholderTag, { Fill } from "@/components/PlaceholderTag";
import ThemeToggle from "@/components/ThemeToggle";
import { builtWith, footerColumns, links, posts, site, smallPrint, unsafeDrafts } from "@/content";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const serif = "font-serif font-normal tracking-[-0.02em]";

function GitHubButton({ className = "", light = false }: { className?: string; light?: boolean }) {
  return (
    <a
      href={links.github.href}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-85 ${
        light ? "bg-ink-fg text-ink" : "bg-fg text-bg"
      } ${className}`}
    >
      View on GitHub
      {links.github.placeholder && <span className="sr-only"> (placeholder link)</span>}
    </a>
  );
}

function TextPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center rounded-2xl border border-ink-line p-6 sm:p-10 lg:p-12">
      <h3 className="text-2xl font-medium tracking-tight text-ink-fg sm:text-[1.75rem]">{title}</h3>
      <div className="mt-4 text-lg leading-relaxed text-ink-muted">{children}</div>
    </div>
  );
}

function DotGrid({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span aria-hidden="true" className="grid grid-cols-10 gap-1">
        {Array.from({ length: 80 }, (_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-sage-fg/25" />
        ))}
      </span>
      <span className="text-sm text-sage-fg">{label}</span>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>

      {/* Floating nav */}
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-[1400px] items-start justify-between gap-3">
          <a
            href="#top"
            className="flex h-12 items-center gap-2.5 rounded-2xl border border-line bg-surface/80 px-4 text-fg backdrop-blur-md sm:h-14 sm:px-5"
          >
            <DotMark className="h-5 w-5" />
            <span className="text-lg font-medium tracking-tight">{site.name}</span>
          </a>
          <nav aria-label="Main" className="flex h-12 items-center gap-1 rounded-2xl border border-line bg-surface/80 p-1.5 backdrop-blur-md sm:h-14 sm:gap-2">
            <ul className="hidden items-center text-sm text-muted sm:flex">
              <li><a href="#build-log" className="rounded-full px-3 py-2 hover:text-fg">Build log</a></li>
              <li><a href={links.github.href} className="rounded-full px-3 py-2 hover:text-fg">GitHub</a></li>
            </ul>
            <span aria-hidden="true" className="hidden h-5 w-px bg-line sm:block" />
            <ThemeToggle />
            <GitHubButton className="h-full px-4 py-0" />
          </nav>
        </div>
      </header>

      <main id="main" className="flex-1">
        {/* 1–2. Hero + app frame */}
        <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
          <div aria-hidden="true" className="dot-field pointer-events-none absolute inset-x-0 top-0 h-[900px]" />
          <div className="relative mx-auto max-w-[1400px] px-3 pb-10 pt-32 sm:px-6 sm:pt-44">
            <div className="mx-auto max-w-3xl text-center">
              <h1 id="hero-heading" className={`${serif} text-5xl leading-[1.05] text-balance sm:text-7xl lg:text-[5.25rem]`}>
                {site.headline}
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">{site.subtext}</p>
              <div className="mt-9 flex flex-col items-center gap-3">
                <GitHubButton className="px-7 py-3.5 text-base" />
                <span className="font-mono text-xs text-muted">Prototype · synthetic data · local models</span>
              </div>
            </div>
            <div className="mt-16 sm:mt-24">
              <h2 className="sr-only">What Laruso shows you</h2>
              <HeroApp />
            </div>
          </div>
        </section>

        {/* Built with */}
        <section aria-labelledby="built-heading" className="py-14 sm:py-20">
          <div className={container}>
            <h2 id="built-heading" className="text-center text-muted">Built with</h2>
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
              {builtWith.map((t, i) => (
                <li
                  key={t}
                  className={`text-2xl text-fg/70 sm:text-3xl ${i % 3 === 0 ? "font-serif" : i % 3 === 1 ? "font-mono tracking-tight" : "font-semibold tracking-tight"}`}
                >
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-dashed border-line">
          <div className={`${container} py-20 sm:py-28`}>
            <p className={`${serif} max-w-4xl text-4xl leading-[1.1] text-balance sm:text-6xl`}>
              Laruso handles the follow-up work so dealership teams can focus on selling.
            </p>
          </div>
        </div>

        {/* 3–5. Dark band */}
        <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-20 bg-ink py-16 sm:py-24">
          <h2 id="how-heading" className="sr-only">How it works</h2>
          <div className={`${container} space-y-5 sm:space-y-6`}>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
              <LimePanel label="Example triage log with fictional records.">
                <TriageMock />
              </LimePanel>
              <TextPanel title="Finds who needs contact">
                Laruso merges sales, CRM, and service records into one customer view, removes duplicates, and flags
                customers who are due for service or have gone cold.
              </TextPanel>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_1.55fr]">
              <div className="order-2 lg:order-1">
                <TextPanel title="Ranks who to contact first">
                  Laruso scores each opportunity by <strong className="font-medium text-ink-fg">value</strong> and{" "}
                  <strong className="font-medium text-ink-fg">timing</strong>, so the most important follow-ups come first.
                </TextPanel>
              </div>
              <div className="order-1 lg:order-2">
                <LimePanel label="Example priority list with fictional records.">
                  <PrioritiesMock />
                </LimePanel>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
              <LimePanel label="Example draft for a fictional customer, with approval status and guardrail checks.">
                <DraftMock />
              </LimePanel>
              <TextPanel title="Drafts and approves">
                Laruso writes a personalized message from each customer’s history. A person reviews it, and nothing goes
                out without approval. Every action is logged.
              </TextPanel>
            </div>
          </div>
        </section>

        {/* 6. Note + stat */}
        <section aria-label="Why I built Laruso" className="py-16 sm:py-24">
          <div className={container}>
            <div className="grid gap-3 rounded-2xl bg-surface p-3 md:grid-cols-[1fr_22rem]">
              <article id="about" aria-labelledby="about-heading" className="flex scroll-mt-24 flex-col p-5 sm:p-8">
                <h3 id="about-heading" className="text-sm text-muted">Why I built Laruso</h3>
                <blockquote className="mt-3 text-2xl leading-snug tracking-tight text-pretty sm:text-3xl">
                  “I wanted to learn how real AI systems get built: messy data, tool use, human approval, and testing.
                  This is how I’m doing it in public.”
                </blockquote>
                <div className="mt-10 flex items-center gap-4 md:mt-auto">
                  <span aria-hidden="true" className="grid h-16 w-16 place-items-center rounded-full bg-bg text-muted ring-1 ring-line">
                    <DotMark className="h-7 w-7" />
                  </span>
                  <p>
                    <span className="block text-lg"><Fill>{site.builderName}</Fill></span>
                    <span className="text-muted">Builder of Laruso</span>
                  </p>
                </div>
              </article>

              <div className="rounded-xl bg-sage-bg p-6 sm:p-8">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-6xl tracking-tight text-sage-fg">
                    <Fill>{unsafeDrafts.value}</Fill>%
                  </p>
                  {unsafeDrafts.placeholder && <PlaceholderTag label="Awaiting evals" />}
                </div>
                <p className="mt-4 text-lg">fewer unsafe drafts after guardrails</p>
                <div className="mt-8 flex justify-around gap-4">
                  <DotGrid label="Before" />
                  <DotGrid label="After" />
                </div>
                {unsafeDrafts.placeholder && (
                  <p className="mt-4 text-xs text-sage-fg">Fills in once the scorer has real before-and-after runs.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Checks */}
        <section aria-labelledby="checks-heading" className="sunset-band grain py-20 sm:py-28">
          <div className={container}>
            <div className="grid gap-8 md:grid-cols-2 md:gap-16">
              <h2 id="checks-heading" className={`${serif} text-4xl leading-[1.08] sm:text-6xl`}>
                Always checking your customer list.
              </h2>
              <div>
                <p className="text-lg leading-relaxed text-muted">
                  Laruso runs checks across your data to find who needs a follow-up, beyond what staff remember to chase.
                </p>
                <a href="#build-log" className="mt-6 inline-flex items-center gap-2 text-lg underline decoration-1 underline-offset-[6px] hover:decoration-2">
                  Read the build log <ArrowRight />
                </a>
              </div>
            </div>
            <div className="mt-14 grid gap-3 lg:grid-cols-[1fr_1.4fr]">
              <ChecksList />
              <CheckDetail />
            </div>
          </div>
        </section>

        {/* 8. At your command */}
        <section aria-labelledby="command-heading" className="py-20 sm:py-28">
          <div className={container}>
            <h2 id="command-heading" className={`${serif} text-4xl leading-[1.08] sm:text-6xl`}>
              Your customers, at your command.
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-3">
              <div className="flex flex-col">
                <ChatMock />
                <h3 className="mt-6 text-xl font-medium">Ask questions. Approve the work.</h3>
                <p className="mt-2 max-w-md text-lg leading-relaxed text-muted">
                  Ask Laruso who needs a follow-up and why, then review every draft before it goes out.
                </p>
              </div>
              <div className="flex flex-col">
                <ApprovalQueueMock />
                <h3 className="mt-6 text-xl font-medium">Review before anything goes out.</h3>
                <p className="mt-2 max-w-md text-lg leading-relaxed text-muted">
                  Every draft waits in a queue where you can approve, edit, or reject it. Each action is logged with its reason.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 9. CTA + build log, dark */}
        <div className="bg-ink text-ink-fg">
          <section aria-labelledby="cta-heading" className="cta-glow grain border-b border-dashed border-ink-line px-4 py-28 text-center sm:py-40">
            <h2 id="cta-heading" className={`${serif} text-4xl sm:text-6xl`}>See Laruso in action.</h2>
            <p className="mx-auto mt-5 max-w-lg text-lg text-ink-muted">
              Follow the build, read the code, and watch the demo when it’s ready.
            </p>
            {site.youtubeId && (
              <div className="mx-auto mt-10 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-ink-line">
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
            )}
            <GitHubButton light className="mt-9 px-6 py-3" />
          </section>

          <section id="build-log" aria-labelledby="log-heading" className="scroll-mt-24 py-12 sm:py-16">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <h2 id="log-heading" className={`${serif} text-3xl sm:text-4xl`}>From the build log</h2>
                <a href={links.github.href} className="text-ink-muted underline decoration-1 underline-offset-[6px] hover:text-ink-fg">
                  View all posts
                </a>
              </div>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {posts.map((p, i) => {
                  const body = (
                    <>
                      <span className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                        {!p.href && <PlaceholderTag label="Planned" tone="ink" />}
                      </span>
                      <span className="mt-12 block font-serif text-xl leading-snug">{p.title}</span>
                    </>
                  );
                  return (
                    <li key={p.title}>
                      {p.href ? (
                        <a href={p.href} className="block h-full rounded-xl border border-ink-line bg-ink-surface p-5 transition-colors hover:border-ink-muted">
                          {body}
                        </a>
                      ) : (
                        <div className="h-full rounded-xl border border-dashed border-ink-line p-5">{body}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>

          <section id="notes" aria-labelledby="notes-heading" className="scroll-mt-24 border-t border-dashed border-ink-line py-12 sm:py-16">
            <div className="mx-auto grid max-w-[1400px] gap-6 px-4 sm:px-6 md:grid-cols-[1fr_2fr]">
              <h2 id="notes-heading" className={`${serif} text-3xl`}>Data, privacy, and limits</h2>
              <div className="max-w-2xl space-y-4 leading-relaxed text-ink-muted">
                <p>
                  <strong className="font-medium text-ink-fg">Data.</strong> Every record is synthetic. The DMS, CRM, and
                  service-lane data are generated, and names and IDs are fictional. No real customer data is used.
                </p>
                <p>
                  <strong className="font-medium text-ink-fg">Limits.</strong> Laruso is a prototype. It runs a small local
                  model through Ollama, so drafts can be uneven. It hasn’t been used with real customers or connected to a
                  real dealership system. Numbers marked sample or placeholder are not measured results.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 10. Footer */}
      <footer className="border-t border-dashed border-ink-line bg-ink text-ink-fg">
        <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="border-b border-dashed border-ink-line px-4 py-10 sm:px-6 lg:border-b-0 lg:border-r">
              <h2 className="text-ink-muted">{col.title}</h2>
              <ul className="mt-8 space-y-2">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a href={it.href} className="font-serif text-2xl hover:text-ink-muted sm:text-3xl">{it.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="flex flex-col px-4 py-10 sm:px-6">
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-2 rounded-md bg-ink-fg px-3 py-1 font-medium text-ink">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-ink" />
                Prototype · In progress
              </span>
              <span className="inline-flex items-center rounded-md border border-ink-line px-3 py-1 text-ink-muted">
                Built in&nbsp;<Fill>{site.city}</Fill>
              </span>
            </div>
            <ul className="mt-6 space-y-1 text-sm text-ink-muted">
              <li className="flex flex-wrap items-center gap-2">
                <a href={links.linkedin.href} className="underline underline-offset-4 hover:text-ink-fg">LinkedIn</a>
                {links.linkedin.placeholder && <PlaceholderTag tone="ink" />}
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <a href={`mailto:${links.email.href}`} className="underline underline-offset-4 hover:text-ink-fg">{links.email.href}</a>
                {links.email.placeholder && <PlaceholderTag tone="ink" />}
              </li>
              {links.github.placeholder && (
                <li className="flex flex-wrap items-center gap-2">GitHub links <PlaceholderTag tone="ink" /></li>
              )}
            </ul>
            <div className="mt-12 flex items-end justify-between gap-4 lg:mt-auto lg:pt-16">
              <div className="text-sm text-ink-muted">
                <p>{site.tagline}</p>
                <p>{smallPrint}</p>
              </div>
              <DotMark className="h-12 w-12 shrink-0 text-ink-fg" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
