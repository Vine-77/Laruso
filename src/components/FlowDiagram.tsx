type BoxProps = {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
  accent?: boolean;
  dashed?: boolean;
};

function Box({ x, y, w, h, title, sub, accent, dashed }: BoxProps) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={10}
        className={accent ? "fill-accent-soft stroke-accent" : "fill-surface stroke-line"}
        strokeWidth={accent ? 2 : 1.5}
        strokeDasharray={dashed ? "5 4" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2 - 6}
        textAnchor="middle"
        className="fill-fg"
        fontSize={15}
        fontWeight={600}
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + h / 2 + 14}
        textAnchor="middle"
        className="fill-muted"
        fontSize={11.5}
      >
        {sub}
      </text>
    </g>
  );
}

function ArrowDefs({ id }: { id: string }) {
  return (
    <defs>
      <marker
        id={id}
        viewBox="0 0 10 10"
        refX="9"
        refY="5"
        markerWidth="7"
        markerHeight="7"
        orient="auto-start-reverse"
      >
        <path d="M0,0 L10,5 L0,10 z" style={{ fill: "var(--muted)" }} />
      </marker>
    </defs>
  );
}

const line = { stroke: "var(--muted)", strokeWidth: 1.5, fill: "none" };
const dashedLine = { ...line, strokeDasharray: "5 4" };

const steps = [
  { title: "Customer data", sub: "DMS · CRM · service lane" },
  { title: "Find who to contact", sub: "Due for service or gone cold" },
  { title: "AI drafts message", sub: "Local model via Ollama" },
  { title: "Human approves", sub: "Approve, edit, or reject", accent: true },
  { title: "Log", sub: "Every decision recorded" },
];

const summary =
  "Customer data from the DMS, CRM, and service lane flows to a step that finds who to contact. An AI model drafts a message, a human approves, edits, or rejects it, and the decision is logged. Separately, a customer simulator plays synthetic customers and a scorer measures each run.";

function Horizontal() {
  const w = 160;
  const gap = 34;
  const y = 40;
  const h = 84;
  const xs = steps.map((_, i) => 20 + i * (w + gap));
  const cx = (i: number) => xs[i] + w / 2;

  return (
    <svg
      viewBox="0 0 960 360"
      role="img"
      aria-labelledby="flow-h-title flow-h-desc"
      className="hidden h-auto w-full md:block"
    >
      <title id="flow-h-title">How Laruso works</title>
      <desc id="flow-h-desc">{summary}</desc>
      <ArrowDefs id="arrow-h" />

      {steps.map((s, i) => (
        <Box key={s.title} x={xs[i]} y={y} w={w} h={h} {...s} />
      ))}
      {steps.slice(1).map((_, i) => (
        <line
          key={i}
          x1={xs[i] + w + 2}
          y1={y + h / 2}
          x2={xs[i + 1] - 4}
          y2={y + h / 2}
          style={line}
          markerEnd="url(#arrow-h)"
        />
      ))}

      {/* Test harness */}
      <rect
        x={10}
        y={178}
        width={940}
        height={170}
        rx={14}
        style={{ ...dashedLine, stroke: "var(--line)" }}
      />
      <text x={28} y={202} className="fill-muted" fontSize={12} fontFamily="var(--font-geist-mono)">
        TEST HARNESS · SYNTHETIC ONLY
      </text>

      <Box x={40} y={240} w={260} h={80} title="Customer simulator" sub="Fake customers that answer drafts" dashed />
      <Box x={660} y={240} w={260} h={80} title="Scorer" sub="Measures each run" dashed />

      <line x1={cx(0)} y1={240} x2={cx(0)} y2={y + h + 4} style={dashedLine} markerEnd="url(#arrow-h)" />
      <text x={cx(0) + 8} y={158} className="fill-muted" fontSize={11.5}>plays the customers</text>

      <line x1={cx(4)} y1={y + h + 2} x2={cx(4)} y2={236} style={dashedLine} markerEnd="url(#arrow-h)" />
      <text x={cx(4) - 8} y={158} textAnchor="end" className="fill-muted" fontSize={11.5}>logs feed the score</text>

      <line x1={302} y1={280} x2={656} y2={280} style={dashedLine} markerEnd="url(#arrow-h)" />
      <text x={479} y={272} textAnchor="middle" className="fill-muted" fontSize={11.5}>simulated replies</text>
    </svg>
  );
}

function Vertical() {
  const x = 40;
  const w = 280;
  const h = 66;
  const gap = 34;
  const ys = steps.map((_, i) => 16 + i * (h + gap));
  const last = ys[ys.length - 1] + h;
  const harnessY = last + 50;

  return (
    <svg
      viewBox={`0 0 360 ${harnessY + 190}`}
      role="img"
      aria-labelledby="flow-v-title flow-v-desc"
      className="h-auto w-full md:hidden"
    >
      <title id="flow-v-title">How Laruso works</title>
      <desc id="flow-v-desc">{summary}</desc>
      <ArrowDefs id="arrow-v" />

      {steps.map((s, i) => (
        <Box key={s.title} x={x} y={ys[i]} w={w} h={h} {...s} />
      ))}
      {steps.slice(1).map((_, i) => (
        <line
          key={i}
          x1={180}
          y1={ys[i] + h + 2}
          x2={180}
          y2={ys[i + 1] - 4}
          style={line}
          markerEnd="url(#arrow-v)"
        />
      ))}

      <line x1={180} y1={last + 2} x2={180} y2={harnessY - 4} style={dashedLine} markerEnd="url(#arrow-v)" />
      <text x={190} y={last + 30} className="fill-muted" fontSize={11.5}>tested by</text>

      <rect
        x={10}
        y={harnessY}
        width={340}
        height={176}
        rx={14}
        style={{ ...dashedLine, stroke: "var(--line)" }}
      />
      <text x={24} y={harnessY + 22} className="fill-muted" fontSize={11} fontFamily="var(--font-geist-mono)">
        TEST HARNESS · SYNTHETIC ONLY
      </text>
      <Box x={x} y={harnessY + 36} w={w} h={56} title="Customer simulator" sub="Fake customers that answer drafts" dashed />
      <line x1={180} y1={harnessY + 94} x2={180} y2={harnessY + 104} style={dashedLine} markerEnd="url(#arrow-v)" />
      <Box x={x} y={harnessY + 108} w={w} h={56} title="Scorer" sub="Measures each run" dashed />
    </svg>
  );
}

export default function FlowDiagram() {
  return (
    <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <Horizontal />
      <Vertical />
      <figcaption className="mt-4 text-sm text-muted">
        Solid path: the agent. Dashed: the test harness that checks it.
      </figcaption>
    </figure>
  );
}
