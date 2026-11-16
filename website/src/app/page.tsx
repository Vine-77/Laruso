import { ArrowRight, DotMark } from "@/components/Icons";
import GradientASCII from "@/components/GradientASCII";
import { ApprovalQueueMock, ChatMock, ChecksGrid, DraftMock, GlowPanel, HeroApp, MergeMock, PrioritiesMock } from "@/components/Mocks";
import Words from "@/components/motion/Words";
import SiteHeader from "@/components/SiteHeader";
import { builtWith, footerColumns, links, posts, site, smallPrint } from "@/content";

const container = "mx-auto w-full max-w-6xl px-4 sm:px-6";
const serif = "font-serif font-normal tracking-[-0.02em]";
const newTab = { target: "_blank", rel: "noopener noreferrer" };
const isExternalLink = (href: string) => href.startsWith("http://") || href.startsWith("https://");
type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;
const v = (vars: Record<string, string | number>) => vars as CSSVars;

function DemoButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={links.demo}
      {...(isExternalLink(links.demo) ? newTab : {})}
      className={`btn btn-primary group inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium ${className}`}
    >
      View Demo
      <ArrowRight className="nudge h-4 w-4" />
    </a>
  );
}

function TextPanel({ title, children, from }: { title: string; children: React.ReactNode; from: "left" | "right" }) {
  return (
    <div
      data-reveal={from}
      style={v({ "--delay": "120ms" })}
      className="flex h-full flex-col justify-center rounded-2xl border border-line p-6 transition-colors duration-700 hover:border-muted/40 sm:p-10 lg:p-12"
    >
      <h3 className="text-2xl font-medium tracking-tight sm:text-[1.75rem]">{title}</h3>
      <div className="mt-4 text-lg leading-relaxed text-muted">{children}</div>
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

      <SiteHeader />

      <main id="main" className="flex-1">
        {/* Hero + app frame */}
        <section id="top" aria-labelledby="hero-heading" className="relative overflow-hidden">
          {/* ASCII horizon (design-ref: public/background_mockup.png). Taller than the copy so the text sits in the
              bright sky and the dark arch lands behind the app frame, then fades into the page. */}
          <div aria-hidden="true" className="hero-ascii pointer-events-none absolute inset-x-0 top-0 h-[1300px] sm:h-[1400px]">
            <GradientASCII
              colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
              waveColor="#ff0071"
              shape="horizon"
              characters=" =+xX0S8#@"
              cellSize={18}
              density={0.8}
            />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-3 pb-10 pt-32 sm:px-6 sm:pt-44">
            <div className="relative isolate mx-auto max-w-3xl text-center">
              {/* Ice halo keeps the dark copy readable over the ASCII field */}
              <div aria-hidden="true" className="hero-halo pointer-events-none absolute -inset-x-40 -bottom-24 -top-16 -z-10" />
              <h1 id="hero-heading" className={`${serif} text-5xl leading-[1.05] text-balance sm:text-7xl lg:text-[5.25rem]`}>
                <Words text={site.headline} intro highlightLast />
              </h1>
              <p className="intro mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty" style={v({ "--delay": "520ms" })}>
                {site.subtext}
              </p>
              <div className="intro mt-9" style={v({ "--delay": "680ms" })}>
                <DemoButton className="px-7 py-3.5 text-base" />
              </div>
            </div>
            <div className="intro-frame relative mt-16 sm:mt-24" style={v({ "--delay": "820ms" })}>
              <div className="scroll-settle">
                <h2 className="sr-only">What Laruso shows you</h2>
                <HeroApp />
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-dashed border-line">
          <div className={`${container} py-20 sm:py-28`}>
            <p className={`${serif} max-w-4xl text-4xl leading-[1.1] text-balance sm:text-6xl`}>
              <Words text="Laruso handles the follow-up work so hotel teams can focus on hosting." />
            </p>
          </div>
        </div>

        {/* How it works: panels and text enter from opposite sides */}
        <section id="how-it-works" aria-labelledby="how-heading" className="py-32 sm:py-44">
          <h2 id="how-heading" className="sr-only">How it works</h2>
          <div className={`${container} space-y-5 sm:space-y-6`}>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
              <div data-reveal="left">
                <GlowPanel label="Example of guest records from three systems being combined.">
                  <MergeMock />
                </GlowPanel>
              </div>
              <TextPanel title="Finds who to contact" from="right">
                Laruso combines your booking system, guest profiles, and front-desk notes into one guest list. Then it
                spots guests who are due to return, have an open complaint, or didn’t finish a booking.
              </TextPanel>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1fr_1.55fr]">
              <div className="order-2 lg:order-1">
                <TextPanel title="Puts the most important first" from="left">
                  Each guest is ranked by how much the follow-up matters and how soon it should happen.
                </TextPanel>
              </div>
              <div className="order-1 lg:order-2" data-reveal="right">
                <GlowPanel label="Example priority list with fictional guests.">
                  <PrioritiesMock />
                </GlowPanel>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
              <div data-reveal="left">
                <GlowPanel label="Example message to a fictional guest, with approval steps and safety checks.">
                  <DraftMock />
                </GlowPanel>
              </div>
              <TextPanel title="Writes, then waits for you" from="right">
                Laruso writes a personal message based on each guest’s stay. A person reviews it, and nothing is sent
                without approval.
              </TextPanel>
            </div>
          </div>
        </section>

        {/* Why I built it */}
        <section aria-label="Why I built Laruso" className="py-16 sm:py-24">
          <div className={container}>
            <article id="about" aria-labelledby="about-heading" data-reveal="up" className="scroll-mt-24 rounded-2xl bg-surface p-8 sm:p-12">
              <h3 id="about-heading" className="text-sm font-medium text-pink-text">Why I built Laruso</h3>
              <blockquote className="mt-3 max-w-4xl text-2xl leading-snug tracking-tight text-pretty sm:text-3xl">
                “I wanted to learn how real AI systems get built: messy data, human approval, and testing. This is how
                I’m doing it in public.”
              </blockquote>
              <div className="mt-10 flex items-center gap-4">
                <span aria-hidden="true" className="grid h-14 w-14 place-items-center rounded-full bg-pink-soft text-pink-text ring-1 ring-pink/30">
                  <DotMark className="h-6 w-6" />
                </span>
                <p>
                  <span className="block text-lg">{site.builderName}</span>
                  <span className="text-muted">Founder of Laruso</span>
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* What it looks for */}
        <section aria-labelledby="checks-heading" className="aurora-band py-20 sm:py-28">
          <div className={container}>
            <div className="grid gap-8 md:grid-cols-2 md:gap-16">
              <h2 id="checks-heading" className={`${serif} text-4xl leading-[1.08] sm:text-6xl`}>
                <Words text="Always checking your guest list." />
              </h2>
              <p data-reveal="up" style={v({ "--delay": "250ms" })} className="text-lg leading-relaxed text-muted md:self-end">
                Laruso keeps an eye out for guests who need a follow-up, so nobody slips through the cracks.
              </p>
            </div>
            <div className="mt-14">
              <ChecksGrid />
            </div>
          </div>
        </section>

        {/* Ask and approve */}
        <section aria-labelledby="command-heading" className="py-20 sm:py-28">
          <div className={container}>
            <h2 id="command-heading" className={`${serif} text-4xl leading-[1.08] sm:text-6xl`}>
              <Words text="Just ask. Then approve." />
            </h2>
            <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-3">
              <div className="flex flex-col" data-reveal="left">
                <ChatMock />
                <h3 className="mt-6 text-xl font-medium">Ask in plain words.</h3>
                <p className="mt-2 max-w-md text-lg leading-relaxed text-muted">
                  Ask Laruso who needs a follow-up and why.
                </p>
              </div>
              <div className="flex flex-col" data-reveal="right" style={v({ "--delay": "150ms" })}>
                <ApprovalQueueMock />
                <h3 className="mt-6 text-xl font-medium">You have the final say.</h3>
                <p className="mt-2 max-w-md text-lg leading-relaxed text-muted">
                  Approve, edit, or reject every message before it goes out.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA, build log, notes, and built with */}
        <div>
          <section aria-labelledby="cta-heading" className="cta-glow grain border-b border-dashed border-line px-4 py-28 text-center sm:py-40">
            <h2 id="cta-heading" className={`${serif} text-4xl sm:text-6xl`}>
              <Words text="See Laruso in action." />
            </h2>
            <p data-reveal="up" style={v({ "--delay": "300ms" })} className="mx-auto mt-5 max-w-lg text-lg text-muted">
              Follow the build, read the code, and watch the demo when it’s ready.
            </p>
            {site.youtubeId && (
              <div data-reveal="scale" className="mx-auto mt-10 aspect-video max-w-3xl overflow-hidden rounded-2xl border border-line">
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
            <div data-reveal="up" style={v({ "--delay": "420ms" })}>
              <DemoButton className="mt-9 px-6 py-3" />
            </div>
          </section>

          <section id="build-log" aria-labelledby="log-heading" className="scroll-mt-24 py-12 sm:py-16">
            <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
              <div className="flex items-end justify-between gap-4">
                <h2 id="log-heading" className={`${serif} text-3xl sm:text-4xl`}>
                  <Words text="From the build log" />
                </h2>
                <a href={links.github} {...newTab} className="group inline-flex items-center gap-1.5 text-muted transition-colors hover:text-pink-text">
                  <span className="u-swap">View on GitHub</span>
                  <ArrowRight className="nudge h-4 w-4" />
                </a>
              </div>
              {/* Cards slide in from the right, one after another */}
              <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {posts.map((p, i) => (
                  <li key={p.title} data-reveal="right" style={v({ "--i": i })}>
                    {p.href ? (
                      <a href={p.href} {...(isExternalLink(p.href) ? newTab : {})} className="lift group block h-full rounded-xl border border-line bg-surface p-5 hover:border-muted">
                        <span className="block font-serif text-xl leading-snug">{p.title}</span>
                      </a>
                    ) : (
                      <div className="h-full rounded-xl border border-dashed border-line p-5">
                        <span className="block font-serif text-xl leading-snug">{p.title}</span>
                        <span className="mt-8 block text-sm text-pink-text">Coming soon</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section id="notes" aria-labelledby="notes-heading" className="scroll-mt-24 border-t border-dashed border-line py-12 sm:py-16">
            <div className="mx-auto grid max-w-[1400px] gap-6 px-4 sm:px-6 md:grid-cols-[1fr_2fr]">
              <h2 id="notes-heading" className={`${serif} text-3xl`}>Data, privacy, and limits</h2>
              <div data-reveal="up" className="max-w-2xl space-y-4 leading-relaxed text-muted">
                <p>
                  <strong className="font-medium text-pink-text">Data.</strong> Every guest and record is made up. No real guest
                  data is used.
                </p>
                <p>
                  <strong className="font-medium text-pink-text">Limits.</strong> Laruso is a prototype. It runs a small AI
                  model on my own computer, so messages can be uneven, and it hasn’t been used with a real hotel yet. The
                  numbers on this page are examples.
                </p>
              </div>
            </div>
          </section>

          {/* Built with (dark scene, continues into the footer) */}
          <section data-scene="dark" aria-labelledby="built-heading" className="border-t border-dashed border-line py-14 sm:py-20">
            <div className={container}>
              <h2 id="built-heading" data-reveal="up" className="text-center text-muted">Built with</h2>
              <ul className="fade-siblings mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-14">
                {builtWith.map((t, i) => (
                  <li
                    key={t}
                    data-reveal="up"
                    style={v({ "--i": i + 1 })}
                    className={`cursor-default text-2xl text-fg/70 sm:text-3xl ${i % 3 === 0 ? "font-serif" : i % 3 === 1 ? "font-mono tracking-tight" : "font-semibold tracking-tight"}`}
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>

      {/* Footer: stable, no entrance motion */}
      <footer data-scene="dark" className="border-t border-dashed border-line">
        <div className="mx-auto grid max-w-[1400px] sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((col) => (
            <nav key={col.title} aria-label={col.title} className="border-b border-dashed border-line px-4 py-10 sm:px-6 lg:border-b-0 lg:border-r">
              <h2 className="text-muted">{col.title}</h2>
              <ul className="mt-8 space-y-2">
                {col.items.map((it) => (
                  <li key={it.label}>
                    <a href={it.href} {...(isExternalLink(it.href) ? newTab : {})} className="u-link font-serif text-2xl transition-colors hover:text-pink-text sm:text-3xl">{it.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <div className="flex flex-col px-4 py-10 sm:px-6">
            <p className="text-sm text-muted">Built in {site.city}</p>
            <ul className="mt-6 space-y-1 text-sm text-muted">
              <li><a href={links.linkedin} {...newTab} className="u-swap hover:text-pink-text">LinkedIn</a></li>
              <li><a href={links.instagram} {...newTab} className="u-swap hover:text-pink-text">Instagram</a></li>
              <li><a href={`mailto:${links.email}`} className="u-swap hover:text-pink-text">{links.email}</a></li>
            </ul>
            <div className="mt-12 flex items-end justify-between gap-4 lg:mt-auto lg:pt-16">
              <div className="text-sm text-muted">
                <p>{site.tagline}</p>
                <p>{smallPrint}</p>
              </div>
              <DotMark className="h-12 w-12 shrink-0 text-pink" />
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
