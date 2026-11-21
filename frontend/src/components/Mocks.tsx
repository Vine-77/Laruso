"use client";

// Product mocks. They illustrate the intended UI with fictional guests; none of them are live.
// Each one plays a short, one-time sequence when scrolled into view that acts out what the step does.
// Server HTML and reduced-motion users get the final state.
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ArrowUp, Check, DotMark, Message, Shield, User } from "@/components/Icons";
import CountUp from "@/components/motion/CountUp";
import { useInView, useReducedMotion, useSequence } from "@/components/motion/hooks";
import { chat, checks, draft, followUpCards, heroStats, mergeRows, priorities, queue, returnCards } from "@/content";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

// Before hydration (and without JS) every sequence shows its end state.
// After hydration, `useSequence` restarts it from step 0 until the mock is in view.
function useStaged(times: number[], threshold = 0.4) {
  const [ref, inView] = useInView<HTMLDivElement>(threshold);
  const step = useSequence(inView, times);
  return [ref, step] as const;
}

/* ---------- Shared bits ---------- */

function DrawCheck({ on, className = "h-3.5 w-3.5" }: { on: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`draw-check ${className}`} data-on={on ? "" : undefined} fill="none" stroke="currentColor" strokeWidth={2.25} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

// Glassy dark card used inside the glow panels
function DarkCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-ink-surface/90 text-ink-fg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 px-4 py-3.5 sm:px-5">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-ink-muted">{sub}</span>
      </div>
      {children}
    </div>
  );
}

export function GlowPanel({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLElement>(null);
  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <figure ref={ref} onPointerMove={onMove} className="glow-panel grain pointer-glow h-full overflow-hidden rounded-2xl p-4 sm:p-8 lg:p-11">
      <figcaption className="sr-only">{label}</figcaption>
      {children}
    </figure>
  );
}

/* ---------- Hero app frame ---------- */

function FollowUpCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="lift group flex h-full flex-col rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="font-medium leading-snug">{title}</p>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs transition-colors duration-300 group-hover:border-fg/30">
        <Message className="h-3 w-3 text-pink" />
        Message ready
      </span>
    </div>
  );
}

function CardGroup({ title, cards, offset }: { title: string; cards: typeof returnCards; offset: number }) {
  return (
    <div>
      <h3 className="text-sm font-medium">{title}</h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {cards.map((c, i) => (
          // Cards slide in from the right, one after another
          <li key={c.title} data-reveal="right" style={{ "--i": offset + i } as CSSVars}>
            <FollowUpCard {...c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroApp() {
  return (
    <div className="rounded-3xl border border-line bg-surface-2 p-3 shadow-[0_40px_80px_-50px_var(--shadow)] sm:p-5">
      <span aria-hidden="true" className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface"><DotMark className="h-4 w-4" /></span>

      {/* Search + stats */}
      <div className="mx-auto mt-8 max-w-5xl sm:mt-10">
        <div className="group mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted transition-[border-color,box-shadow] duration-500 hover:border-fg/25 hover:shadow-[0_8px_24px_-16px_var(--shadow)]">
          Who should we reach out to today?
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full border border-line transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5"><ArrowUp /></span>
        </div>
        <dl className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {heroStats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:border-l sm:border-line sm:pl-6 sm:first:border-0 sm:first:pl-0">
              <dd className="order-1 text-2xl">
                <CountUp value={s.value} delay={900 + i * 120} />
              </dd>
              <dt className="order-2 text-sm text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>

      <div aria-hidden="true" className="my-8 h-px bg-line sm:my-10" />

      <div className="grid gap-8 xl:grid-cols-2">
        <CardGroup title="Due to return" cards={returnCards} offset={0} />
        <CardGroup title="Needs a follow-up" cards={followUpCards} offset={2} />
      </div>
    </div>
  );
}

/* ---------- 1. One guest list: records arrive, the duplicate gets struck ---------- */

export function MergeMock() {
  const [ref, step] = useStaged([200, 900, 1600]);
  return (
    <div ref={ref}>
      <DarkCard title="One guest list" sub="From 3 systems">
        <ul>
          {mergeRows.map((r, i) => {
            const on = step > i;
            return (
              <li
                key={r.text}
                className={`seq flex flex-col gap-1.5 border-t border-white/10 px-4 py-4 first:border-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 ${on ? "" : "seq-hidden"}`}
              >
                {r.removed ? (
                  <span className={`strike [transition-delay:400ms] ${on ? "text-ink-muted" : ""}`} data-on={on ? "" : undefined}>
                    {r.text}
                  </span>
                ) : (
                  <span className="font-medium">{r.text}</span>
                )}
                <span className={`seq shrink-0 text-sm [transition-delay:450ms] ${r.removed ? "text-ink-muted" : "text-ink-teal"} ${on ? "" : "seq-hidden"}`}>
                  {r.result}
                </span>
              </li>
            );
          })}
        </ul>
      </DarkCard>
    </div>
  );
}

/* ---------- 2. Priorities: the unanswered complaint climbs to the top ---------- */

const tagTone: Record<string, string> = {
  "Contact today": "bg-ink-pink text-white",
  "This week": "bg-white/10 text-ink-fg",
  Later: "bg-white/5 text-ink-muted",
};

export function PrioritiesMock() {
  const [ref, inView] = useInView<HTMLDivElement>(0.45);
  const reduced = useReducedMotion();
  const items = useRef(new Map<string, HTMLLIElement>());
  // Server HTML shows the final ranking. After hydration the list rewinds (while offscreen) to the
  // pre-ranking order, then once visible the complaint is promoted with a FLIP animation.
  const [promoted, setPromoted] = useState(true);

  useEffect(() => {
    if (reduced) return;
    if (!inView) {
      const t = window.setTimeout(() => setPromoted(false), 0);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => {
      // Snapshot positions right before the reorder so scrolling in between doesn't skew the motion
      const before = new Map<string, number>();
      items.current.forEach((el, key) => before.set(key, el.getBoundingClientRect().top));
      flushSync(() => setPromoted(true));
      items.current.forEach((el, key) => {
        const dy = (before.get(key) ?? 0) - el.getBoundingClientRect().top;
        if (!dy) return;
        el.animate([{ transform: `translateY(${dy}px)` }, { transform: "none" }], {
          duration: 900,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        });
      });
    }, 1300);
    return () => window.clearTimeout(t);
  }, [inView, reduced]);

  const settled = promoted || reduced;
  const ranked = settled ? priorities : [priorities[1], priorities[2], priorities[0]];

  return (
    <div ref={ref}>
      <DarkCard title="Who to contact first" sub="Most important at the top">
        <ol className="space-y-2.5 p-4 sm:p-5">
          {ranked.map((p, i) => {
            const top = settled && i === 0;
            return (
              <li
                key={p.title}
                ref={(el) => {
                  if (el) items.current.set(p.title, el);
                  else items.current.delete(p.title);
                }}
              >
                <div className={`seq rounded-lg border p-3.5 ${top ? "border-ink-pink/50 bg-white/[0.08]" : "border-white/10 bg-white/[0.03]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{p.title}</p>
                    <span className={`shrink-0 rounded px-2 py-0.5 text-xs font-medium ${tagTone[p.tag]}`}>{p.tag}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-muted">{p.sub}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </DarkCard>
    </div>
  );
}

/* ---------- 3. Write → approve → send, then the safety checks ---------- */

export function DraftMock() {
  // 1 message wipes in · 2–4 steps tick · 5–7 safety checks tick
  const [ref, step] = useStaged([150, 1100, 1600, 2100, 2500, 2750, 3000]);
  return (
    <div ref={ref}>
      <DarkCard title="Message for review" sub={draft.to}>
        <p className="wipe mx-4 mt-4 rounded-lg bg-white/[0.05] p-4 text-sm leading-relaxed sm:mx-5" data-on={step >= 1 ? "" : undefined}>
          {draft.text}
        </p>

        <ol className="mx-4 flex justify-between border-b border-white/10 py-4 text-sm sm:mx-5">
          {draft.steps.map((s, i) => {
            const on = step >= 2 + i;
            return (
              <li key={s} className={`seq flex items-center gap-1.5 ${on ? "text-ink-ok" : "text-ink-muted/60"}`}>
                <DrawCheck on={on} />
                {s}
              </li>
            );
          })}
        </ol>

        <div className="flex gap-3 p-4 sm:p-5">
          <Shield className="h-5 w-5 shrink-0 text-ink-ok" />
          <div className="flex-1">
            <p className="font-medium">Safety checks</p>
            <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
              {draft.guardrails.map((g, i) => (
                <li key={g} className="flex items-center gap-1.5">
                  {g}
                  <DrawCheck on={step >= 5 + i} className="h-3.5 w-3.5 text-ink-ok" />
                  <span className="sr-only">passed</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </DarkCard>
    </div>
  );
}

/* ---------- What Laruso looks for ---------- */

const glyphHues = ["#1e3fd8", "#ff0071", "#38bdf8", "#ff0071"];

function CheckGlyph({ i }: { i: number }) {
  const hue = glyphHues[i % glyphHues.length];
  return (
    <svg viewBox="0 0 32 32" className="glyph h-8 w-8 shrink-0" aria-hidden="true">
      <defs>
        <clipPath id={`cg-${i}`}><circle cx="16" cy="16" r="15" /></clipPath>
      </defs>
      <circle cx="16" cy="16" r="15" fill={hue} opacity="0.85" />
      <g clipPath={`url(#cg-${i})`} stroke="#fff" strokeOpacity="0.7" strokeWidth="1.6" transform={`rotate(${i * 26} 16 16)`}>
        {[-8, -2, 4, 10].map((o) => <line key={o} x1={o} y1="0" x2={o + 22} y2="32" />)}
      </g>
    </svg>
  );
}

export function ChecksGrid() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {checks.map((c, i) => (
        <li key={c.name} data-reveal="up" style={{ "--i": i } as CSSVars}>
          <div className="lift group h-full rounded-xl border border-line bg-surface/80 p-5 backdrop-blur">
            <CheckGlyph i={i} />
            <p className="mt-5 font-medium">{c.name}</p>
            <p className="mt-1 text-sm text-muted">{c.desc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Chat: the conversation plays out; space is reserved so nothing shifts ---------- */

export function ChatMock() {
  // Messages land at these times; Laruso's replies are preceded by a typing indicator.
  const [ref, step] = useStaged([200, 1300, 2200, 3200, 3800], 0.35);
  const shown = (i: number) => step > i;
  const typing = (i: number) => chat[i].from === "laruso" && step === i;

  return (
    <figure ref={ref} className="slate-panel grain flex h-full flex-col rounded-2xl p-4 sm:p-10">
      <figcaption className="sr-only">Example conversation with Laruso about fictional guests.</figcaption>
      <ul className="flex flex-1 flex-col gap-4 text-sm">
        {chat.map((m, i) => {
          const you = m.from === "you";
          return (
            <li key={i} className={`relative flex items-start gap-2.5 ${you ? "flex-row-reverse self-end" : "self-start"}`}>
              <span
                aria-hidden="true"
                className={`seq grid h-8 w-8 shrink-0 place-items-center rounded-lg ${you ? "bg-fg/10 text-fg" : "bg-pink text-white"} ${
                  shown(i) || typing(i) ? "" : "seq-hidden"
                }`}
              >
                {you ? <User /> : <DotMark className="h-4 w-4" />}
              </span>
              <div
                className={`seq max-w-[17rem] rounded-xl px-4 py-3 ${shown(i) ? "" : "seq-hidden"} ${
                  you ? "bg-fg text-bg" : "border border-line bg-surface/80 text-fg backdrop-blur"
                }`}
              >
                <span className="sr-only">{you ? "You:" : "Laruso:"} </span>
                {m.text}
              </div>
              {/* Typing indicator sits in the reply's slot until it arrives */}
              <span
                aria-hidden="true"
                className={`seq typing absolute left-[42px] top-1 flex gap-1 rounded-xl border border-line bg-surface/80 px-3 py-3 duration-200 ${typing(i) ? "" : "opacity-0"}`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              </span>
            </li>
          );
        })}
      </ul>
      <div aria-hidden="true" className="mt-5 flex items-center justify-between rounded-xl border border-line bg-bg/60 px-4 py-3 text-sm text-muted">
        Ask Laruso a question…
        <span className="grid h-7 w-7 place-items-center rounded-md bg-fg/10 text-muted"><ArrowUp /></span>
      </div>
    </figure>
  );
}

/* ---------- Approval queue: a reviewer approves the first message ---------- */

export function ApprovalQueueMock() {
  const [ref, step] = useStaged([1600, 2100], 0.4);
  return (
    <figure ref={ref} className="slate-panel grain flex h-full flex-col rounded-2xl p-4 sm:p-10">
      <figcaption className="sr-only">Example approval screen with messages to fictional guests and Approve, Edit, and Reject buttons.</figcaption>
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-line bg-surface-2 text-fg shadow-[0_24px_60px_-30px_var(--shadow)]">
        <div className="border-b border-line px-5 py-4 text-lg font-semibold">Waiting for approval</div>
        <ul className="flex-1">
          {queue.map((q, i) => {
            const approved = i === 0 && step >= 2;
            return (
              <li key={q.guest} className={`seq border-b border-line px-5 py-4 last:border-0 ${approved ? "bg-ok/[0.07]" : ""}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">{q.guest}</p>
                    <p className="mt-0.5 font-medium">{q.title}</p>
                  </div>
                  {i === 0 && (
                    <span className={`seq flex items-center gap-1 rounded bg-ok/15 px-2 py-0.5 text-xs font-medium text-ok ${approved ? "" : "seq-hidden"}`}>
                      <Check className="h-3 w-3" /> Approved
                    </span>
                  )}
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium" aria-hidden="true">
                  <span
                    className={`rounded-md px-3 py-1.5 transition-[background-color,color] duration-500 ${i === 0 && step >= 1 ? "press" : ""} ${approved ? "bg-teal-text text-white" : "bg-fg text-bg"}`}
                  >
                    Approve
                  </span>
                  <span className="rounded-md border border-line px-3 py-1.5">Edit</span>
                  <span className="rounded-md border border-line px-3 py-1.5 text-muted">Reject</span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </figure>
  );
}
