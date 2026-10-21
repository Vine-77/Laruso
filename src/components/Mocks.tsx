// Product mocks. They illustrate the intended UI with fictional records; none of them are live.
import { ArrowUp, Check, DotMark, Gear, Grid, Inbox, List, Merge, Message, Shield, Snow, User, Wrench } from "@/components/Icons";
import PlaceholderTag from "@/components/PlaceholderTag";
import {
  bookingRate,
  chat,
  checkDetail,
  checks,
  draft,
  heroStats,
  heroStatsSample,
  leadCards,
  priorities,
  queue,
  serviceCards,
  triageRows,
} from "@/content";

/* ---------- Shared bits ---------- */

// Tiny decorative dot cluster next to each stat
function StatSpark({ seed, tone }: { seed: number; tone: "accent" | "blue" | "ok" | "mixed" }) {
  const cols = 12;
  const rows = 3;
  const color = (i: number) => {
    if (tone === "mixed") return i % 3 === 0 ? "var(--blue)" : "var(--accent)";
    return tone === "accent" ? "var(--accent)" : tone === "blue" ? "var(--blue)" : "var(--ok)";
  };
  return (
    <svg viewBox={`0 0 ${cols * 4} ${rows * 4}`} className="h-3 w-12" aria-hidden="true">
      {Array.from({ length: cols * rows }, (_, i) => {
        const x = i % cols;
        const y = Math.floor(i / cols);
        const on = (x * 7 + y * 3 + seed) % 5 < 2 + (x > cols / 2 ? 1 : 0);
        return <circle key={i} cx={x * 4 + 2} cy={y * 4 + 2} r={1.2} fill={on ? color(i) : "var(--dot)"} />;
      })}
    </svg>
  );
}

function IdChip({ id, tone, ink }: { id: string; tone: "accent" | "blue"; ink?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-[11px] ${
        ink ? "bg-white/5 text-ink-fg ring-1 ring-ink-line" : "bg-bg text-fg ring-1 ring-line"
      }`}
    >
      <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${tone === "accent" ? "bg-accent" : "bg-blue"}`} />
      {id}
    </span>
  );
}

// Glassy dark card used inside the lime panels
function DarkCard({ title, sub, children }: { title: string; sub: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-[#1f1d19]/90 text-ink-fg shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 px-4 py-3.5 sm:px-5">
        <span className="font-semibold">{title}</span>
        <span className="text-xs text-ink-muted">{sub}</span>
      </div>
      {children}
    </div>
  );
}

export function LimePanel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <figure className="lime-panel grain overflow-hidden rounded-2xl p-4 sm:p-8 lg:p-11">
      <figcaption className="sr-only">{label}</figcaption>
      {children}
    </figure>
  );
}

/* ---------- 1–2. Hero app frame ---------- */

function FollowUpCard({ id, title, body, tone }: { id: string; title: string; body: string; tone: "accent" | "blue" }) {
  // Thin timeline: service = ticks along the track, leads = activity bunched at the end
  return (
    <li className="flex flex-col rounded-xl border border-line bg-surface p-4 sm:p-5">
      <p className="font-medium leading-snug">{title}</p>
      <div className="mt-2.5">
        <IdChip id={id} tone={tone} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{body}</p>
      <div aria-hidden="true" className="relative mt-5 h-2.5 rounded-sm bg-bg">
        {tone === "accent" ? (
          [2, 48, 92].map((l) => <span key={l} className="absolute top-0 h-full w-px bg-accent" style={{ left: `${l}%` }} />)
        ) : (
          <span className="absolute right-0 top-0 h-full w-[12%] rounded-sm bg-gradient-to-r from-blue/60 to-accent/80" />
        )}
      </div>
      <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-xs">
        <Message className="h-3 w-3 text-muted" />
        Draft ready
      </span>
    </li>
  );
}

function CardGroup({ title, cards, tone }: { title: string; cards: typeof serviceCards; tone: "accent" | "blue" }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-medium">
        {title}
        <span className="rounded bg-bg px-1.5 font-mono text-xs text-muted ring-1 ring-line">{cards.length}</span>
        <StatSpark seed={tone === "accent" ? 2 : 4} tone={tone} />
      </h3>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-3">
        {cards.map((c) => (
          <FollowUpCard key={c.id} {...c} tone={tone} />
        ))}
      </ul>
    </div>
  );
}

export function HeroApp() {
  const tones = ["accent", "blue", "mixed", "ok"] as const;
  return (
    <div className="rounded-3xl border border-line bg-surface-2 p-3 shadow-[0_40px_80px_-50px_rgba(40,30,20,0.35)] sm:p-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between" aria-hidden="true">
        <div className="flex items-center gap-1">
          <span className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface"><DotMark className="h-4 w-4" /></span>
          <span className="flex items-center gap-3 rounded-lg border border-line bg-surface px-3 py-2.5 text-muted">
            <Wrench /><Snow /><List /><Inbox /><Gear />
          </span>
        </div>
        <span className="hidden sm:block"><StatSpark seed={1} tone="mixed" /></span>
      </div>

      {/* Search + stats */}
      <div className="mx-auto mt-10 max-w-5xl sm:mt-14">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-muted">
          Who needs a follow-up today?
          <span aria-hidden="true" className="grid h-6 w-6 place-items-center rounded-full border border-line"><ArrowUp /></span>
        </div>
        <dl className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          {heroStats.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2 sm:border-l sm:border-line sm:pl-5 sm:first:border-0 sm:first:pl-0">
              <dd className="order-1 font-mono text-2xl tabular-nums">{s.value}</dd>
              <dt className="order-2 text-xs text-muted">{s.label}</dt>
              <span className="order-3"><StatSpark seed={i * 3} tone={tones[i]} /></span>
            </div>
          ))}
        </dl>
        {heroStatsSample && (
          <p className="mt-3 flex justify-center"><PlaceholderTag label="Sample data" /></p>
        )}
      </div>

      {/* Divider */}
      <div className="my-8 flex items-center gap-4 text-muted sm:my-10" aria-hidden="true">
        <span className="h-px flex-1 bg-line" />
        <Grid /><Merge /><User />
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-8 xl:grid-cols-2">
        <CardGroup title="Today’s service follow-ups" cards={serviceCards} tone="accent" />
        <CardGroup title="Cold leads to revive" cards={leadCards} tone="blue" />
      </div>
      <p className="mt-5 flex justify-end"><PlaceholderTag label="Fictional examples" /></p>
    </div>
  );
}

/* ---------- 3. Triage ---------- */

export function TriageMock() {
  return (
    <DarkCard title="Signal triage" sub="Synthetic records">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs text-ink-muted">
            <tr>
              {["Time", "Source", "Record", "Result"].map((h) => (
                <th key={h} scope="col" className="px-4 py-2.5 font-normal sm:px-5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {triageRows.map((r, i) => {
              const filtered = r.result.startsWith("Filtered");
              return (
                <tr key={r.record} className={`border-t border-white/10 ${i === 0 ? "bg-white/[0.04] shadow-[inset_2px_0_0_var(--accent)]" : ""}`}>
                  <td className="whitespace-nowrap px-4 py-4 text-ink-muted sm:px-5">{r.time}</td>
                  <td className="px-4 py-4 text-xs text-ink-muted sm:px-5">{r.sources.join(" · ")}</td>
                  <td className={`px-4 py-4 sm:px-5 ${filtered ? "text-ink-muted line-through decoration-ink-muted/60" : "font-medium"}`}>{r.record}</td>
                  <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                    {filtered ? (
                      <span className="text-xs text-ink-muted">{r.result}</span>
                    ) : (
                      <IdChip id={r.result} tone={r.result.startsWith("SVC") ? "accent" : "blue"} ink />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="h-24 sm:h-36" aria-hidden="true" />
    </DarkCard>
  );
}

/* ---------- 4. Priorities ---------- */

const tagTone: Record<string, string> = {
  "Contact now": "bg-accent/20 text-[#f4935f]",
  "Follow up soon": "bg-white/10 text-ink-fg",
  Routine: "bg-white/5 text-ink-muted",
};

export function PrioritiesMock() {
  return (
    <DarkCard title="Your priorities" sub="Ranked by value and timing">
      <p className="flex items-center gap-3 px-4 pt-4 text-sm text-[#f4935f] sm:px-5">
        <ArrowUp className="h-4 w-4 shrink-0" />
        Declined brake work is now 14 months old. Moved to the top.
      </p>
      <ol className="space-y-2.5 p-4 sm:p-5">
        {priorities.map((p, i) => (
          <li key={p.id} className="flex items-center gap-3">
            <span className="w-5 font-mono text-xs text-ink-muted">{p.rank}</span>
            <div className={`min-w-0 flex-1 rounded-lg border border-white/10 p-3.5 ${i === 0 ? "bg-white/[0.07]" : "bg-white/[0.03]"}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`font-mono text-[11px] ${p.kind === "Lead" ? "text-[#8fb0f2]" : "text-[#f4935f]"}`}>
                  {p.id} <span className="font-sans">{p.kind}</span>
                </span>
                <span className={`rounded px-2 py-0.5 text-[11px] font-medium ${tagTone[p.tag]}`}>{p.tag}</span>
              </div>
              <p className="mt-1.5 font-medium">{p.title}</p>
              <p className="mt-0.5 text-sm text-ink-muted">{p.sub}</p>
            </div>
          </li>
        ))}
      </ol>
    </DarkCard>
  );
}

/* ---------- 5. Draft and approve ---------- */

export function DraftMock() {
  return (
    <DarkCard title="Draft and approve" sub={draft.ref}>
      <div className="flex gap-3 px-4 pt-4 sm:px-5">
        <Message className="mt-0.5 h-4 w-4 shrink-0 text-ink-ok" />
        <div>
          <p className="font-medium">Brake work follow-up</p>
          <p className="text-xs text-ink-muted">Draft · written from service history</p>
        </div>
      </div>
      <p className="mx-4 mt-4 rounded-lg bg-white/[0.05] p-4 text-sm leading-relaxed sm:mx-5">{draft.text}</p>

      <ol className="mx-4 flex justify-between border-b border-white/10 py-4 text-sm text-ink-ok sm:mx-5">
        {draft.steps.map((s) => (
          <li key={s} className="flex items-center gap-1.5"><Check />{s}</li>
        ))}
      </ol>

      <div className="mx-4 border-b border-white/10 py-4 sm:mx-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-medium">Simulated booking rate, before and after prompt change</span>
          {bookingRate.sample && <PlaceholderTag label="Sample" tone="ink" />}
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          {[
            { label: "Before", value: bookingRate.before, bar: "bg-[#f4935f]" },
            { label: "After", value: bookingRate.after, bar: "bg-ink-ok" },
          ].map((b) => (
            <div key={b.label} className="grid grid-cols-[3.5rem_1fr_2.5rem] items-center gap-3">
              <dt className="text-xs text-ink-muted">{b.label}</dt>
              <dd className="contents">
                <span aria-hidden="true" className="h-1.5 rounded-full bg-white/10">
                  <span className={`block h-1.5 rounded-full ${b.bar}`} style={{ width: `${(b.value / 40) * 100}%` }} />
                </span>
                <span className="text-right font-mono">{b.value}%</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="flex gap-3 p-4 sm:p-5">
        <Shield className="h-5 w-5 shrink-0 text-ink-ok" />
        <div className="flex-1">
          <p className="font-medium">Guardrail checks</p>
          <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
            {draft.guardrails.map((g) => (
              <li key={g} className="flex items-center gap-1.5">
                {g}
                <Check className="h-3.5 w-3.5 text-ink-ok" />
                <span className="sr-only">passed</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </DarkCard>
  );
}

/* ---------- 7. Checks ---------- */

const glyphHues = ["#c9a98a", "#a68bb0", "#9fb08a", "#d8b26a", "#9aa7b8", "#c27b7b", "#e0905f"];

function CheckGlyph({ i }: { i: number }) {
  const hue = glyphHues[i % glyphHues.length];
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
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

export function ChecksList() {
  return (
    <ul className="space-y-2">
      {checks.map((c, i) => {
        const active = c.name === checkDetail.name;
        return (
          <li
            key={c.name}
            aria-current={active ? "true" : undefined}
            className={`rounded-xl border px-4 py-3.5 backdrop-blur ${
              active ? "border-white bg-surface shadow-lg dark:border-line" : "border-white/60 bg-surface/60 dark:border-line/60"
            }`}
          >
            <div className="flex items-center gap-3">
              <CheckGlyph i={i} />
              <span className="min-w-0 flex-1">
                <span className="font-medium">{c.name}</span>{" "}
                <span className="text-sm text-muted">{c.desc}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1 sm:flex-row sm:items-center">
                <span className="rounded-md bg-fg/5 px-2 py-0.5 text-xs">{c.cadence}</span>
                {c.planned && <PlaceholderTag label="Planned" />}
              </span>
            </div>
            {active && <div aria-hidden="true" className="mt-3 h-1 rounded-full bg-line"><div className="h-1 w-1/4 rounded-full bg-accent" /></div>}
          </li>
        );
      })}
    </ul>
  );
}

export function CheckDetail() {
  const idx = checks.findIndex((c) => c.name === checkDetail.name);
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-white/70 bg-surface/80 backdrop-blur dark:border-line">
      <div className="flex items-center gap-2.5 border-b border-line px-5 py-3.5">
        <CheckGlyph i={idx} />
        <span className="font-medium">{checkDetail.name}</span>
        <span className="text-sm text-muted">{checks[idx].desc}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p>{checkDetail.subtitle}</p>
        <div className="mt-6 flex items-end justify-between gap-3">
          <span className="text-sm text-muted">Declined repairs, no return visit</span>
          <span className="flex items-center gap-2">
            {checkDetail.sample && <PlaceholderTag label="Sample" />}
            <span className="text-2xl">{checkDetail.metric}</span>
          </span>
        </div>
        {/* Empty dot grid: a chart lands here once the check runs on real data */}
        <div aria-hidden="true" className="mt-4 h-32 rounded-lg bg-[radial-gradient(circle,var(--dot)_1px,transparent_1.4px)] bg-[length:14px_14px]" />
        <div className="mt-4 rounded-lg border border-line bg-surface p-4">
          <p className="font-mono text-xs text-accent">{checkDetail.card.id} <span className="font-sans">Service</span></p>
          <p className="mt-1 font-medium">{checkDetail.card.title}</p>
          <p className="mt-3 border-t border-line pt-3 text-sm text-ok">{checkDetail.card.meta.join(" · ")}</p>
        </div>
      </div>
      <p className="border-t border-line px-5 py-3.5 text-sm text-muted">{checkDetail.footer}</p>
    </div>
  );
}

/* ---------- 8. At your command ---------- */

export function ChatMock() {
  return (
    <figure className="mauve-panel grain flex h-full flex-col rounded-2xl p-4 sm:p-10">
      <figcaption className="sr-only">Example conversation with Laruso about fictional customers.</figcaption>
      <ul className="flex flex-1 flex-col gap-4 text-sm">
        {chat.map((m, i) => {
          const you = m.from === "you";
          return (
            <li key={i} className={`flex items-start gap-2.5 ${you ? "flex-row-reverse self-end" : "self-start"}`}>
              <span
                aria-hidden="true"
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${you ? "bg-white/80 text-[#4a3d55]" : "bg-[#24211e] text-white"}`}
              >
                {you ? <User /> : <DotMark className="h-4 w-4" />}
              </span>
              <div
                className={`max-w-[17rem] rounded-xl px-4 py-3 ${
                  you ? "bg-white/90 text-[#1c1a17]" : "border border-white/40 bg-white/40 text-[#1c1a17] backdrop-blur"
                }`}
              >
                <span className="sr-only">{you ? "You:" : "Laruso:"} </span>
                {m.text}
                {"tags" in m && (
                  <span className="mt-2 flex gap-1.5">
                    {m.tags.map((t) => (
                      <span key={t} className="rounded bg-white/70 px-1.5 py-0.5 font-mono text-[11px] text-[#4a3d55]">{t}</span>
                    ))}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-white/95 px-4 py-3 text-sm text-[#1c1a17] sm:ml-10">
        <span className="flex items-center gap-2.5">
          <Message className="h-4 w-4 text-[#4f7a1c]" />
          <span className="font-medium">Brake inspection follow-up</span>
        </span>
        <span className="rounded bg-[#e8f0dc] px-2 py-0.5 font-mono text-[11px] text-[#4f7a1c]">Ready for review</span>
      </div>
      <div aria-hidden="true" className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-4 py-3 text-sm text-[#6b675f]">
        Ask Laruso a question…
        <span className="grid h-7 w-7 place-items-center rounded-md bg-[#8f8a93] text-white"><ArrowUp /></span>
      </div>
    </figure>
  );
}

export function ApprovalQueueMock() {
  return (
    <figure className="mauve-panel grain flex h-full flex-col rounded-2xl p-4 sm:p-10">
      <figcaption className="sr-only">Mock of the Streamlit approval screen, showing fictional drafts with Approve, Edit, and Reject buttons.</figcaption>
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl bg-white text-[#1c1a17] shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e3e1d9] px-5 py-4">
          <span className="text-lg font-semibold">Approval queue</span>
          <span className="font-mono text-xs text-[#6b675f]">Streamlit · mock</span>
        </div>
        <ul className="flex-1">
          {queue.map((q) => (
            <li key={q.id} className="border-b border-[#eeece6] px-5 py-4 last:border-0">
              <p className="font-mono text-xs text-[#6b675f]">{q.id} · {q.customer}</p>
              <p className="mt-1 font-medium">{q.title}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium" aria-hidden="true">
                <span className="rounded-md bg-[#1c1a17] px-3 py-1.5 text-white">Approve</span>
                <span className="rounded-md border border-[#e3e1d9] px-3 py-1.5">Edit</span>
                <span className="rounded-md border border-[#e3e1d9] px-3 py-1.5 text-[#6b675f]">Reject</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
