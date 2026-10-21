// All editable copy lives here.
// `sample: true` / `placeholder: true` render with a visible tag. Flip them off once the data is real.
// Names and IDs are fictional (e.g. "Customer C-1042").

export const site = {
  name: "Laruso",
  headline: "Never miss a follow-up.",
  subtext:
    "An AI agent that finds dealership customers due for service or gone cold, drafts personalized follow-ups, and waits for a human to approve them.",
  tagline: "An AI follow-up agent for car dealerships.",
  // Paste only the video ID, e.g. "dQw4w9WgXcQ". Used by the "Watch demo" button once set.
  youtubeId: "",
  // Placeholders: replace and they render as plain text.
  builderName: "[Your name]",
  city: "[your city]",
};

export const links = {
  github: { href: "https://github.com/your-username/laruso", placeholder: true },
  linkedin: { href: "https://www.linkedin.com/in/your-profile", placeholder: true },
  email: { href: "you@example.com", placeholder: true },
};

export const repo = (path: string) => `${links.github.href}${path}`;

// 1. Hero dashboard mock
export const heroStats = [
  { value: 7, label: "Customers due for service" },
  { value: 12, label: "Cold leads found" },
  { value: 34, label: "Drafts awaiting approval" },
  { value: 144, label: "Records merged" },
];
export const heroStatsSample = true;

// 2. Follow-up cards
export const serviceCards = [
  { id: "SVC-17", title: "Brake work declined", body: "Customer C-1042 declined brake pad replacement 14 months ago. No visit since. Draft ready." },
  { id: "SVC-16", title: "Oil change overdue", body: "Last service 9 months ago. The interval is 6 months." },
  { id: "SVC-15", title: "Tire rotation overdue", body: "No rotation recorded in 12 months." },
];
export const leadCards = [
  { id: "LEAD-24", title: "SUV inquiry went quiet", body: "Asked about a 2022 SUV in March. No contact since July." },
  { id: "LEAD-23", title: "Test drive no-show", body: "Booked a test drive, did not attend, no reply." },
  { id: "LEAD-22", title: "Trade-in quote not followed up", body: "Quote sent, no response." },
];

export const builtWith = ["Python", "pandas", "FastAPI", "LangGraph", "Ollama", "Streamlit"];

// 3. Signal triage
export const triageRows = [
  { time: "2m", sources: ["DMS", "CRM", "Service lane"], record: "Jane D. found in 3 systems, merged into one record", result: "C-1042" },
  { time: "5m", sources: ["CRM"], record: "Duplicate lead (same phone, different spelling)", result: "Filtered as duplicate" },
  { time: "9m", sources: ["Service lane"], record: "2019 Corolla last serviced 14 months ago", result: "SVC-17" },
];

// 4. Priorities
export const priorities = [
  { rank: "01", id: "SVC-17", kind: "Service", tag: "Contact now", title: "Follow up on declined brake work", sub: "14 months since the repair was declined" },
  { rank: "02", id: "LEAD-24", kind: "Lead", tag: "Follow up soon", title: "Revive SUV inquiry", sub: "Quiet for 3 months" },
  { rank: "03", id: "SVC-16", kind: "Service", tag: "Routine", title: "Oil change reminder", sub: "3 months overdue" },
];

// 5. Draft and approve
export const draft = {
  ref: "SVC-17 · C-1042",
  text: "Hi Jane, it’s been 14 months since your last visit, and the brake work from then is still open. Would you like to book a quick inspection this week?",
  steps: ["Drafted", "Approved", "Logged"],
  guardrails: ["No price promises", "Opt-out respected", "Facts match record"],
};
export const bookingRate = { before: 18, after: 31, sample: true };

// 6. Results stat. Set `value` to a number from your own evals, e.g. "42".
export const unsafeDrafts = { value: "[X]", placeholder: true };

// 7. Checks. Cadences are the design intent, so they stay "planned" until real.
export const checks = [
  { name: "Service Due", desc: "Overdue maintenance", cadence: "Daily", planned: true },
  { name: "Declined Work", desc: "Repairs customers turned down", cadence: "Daily", planned: true },
  { name: "Cold Leads", desc: "Stale CRM leads", cadence: "Daily", planned: true },
  { name: "Data Cleaner", desc: "Duplicates and messy records", cadence: "On import", planned: true },
  { name: "Guardrails", desc: "Rules on every draft", cadence: "Every draft", planned: true },
  { name: "Simulator", desc: "Fake customers", cadence: "On demand", planned: true },
  { name: "Scorer", desc: "Quality evals", cadence: "On demand", planned: true },
];
export const checkDetail = {
  name: "Declined Work",
  subtitle: "Find customers who declined repairs and haven’t been back.",
  metric: "14 customers",
  sample: true,
  card: { id: "SVC-17", title: "Follow up on declined brake work", meta: ["Drafts generated", "Guardrails passed"] },
  footer: "Scope: synthetic dealership data. Runs: daily (planned).",
};

// 8. Chat + approval queue
export const chat = [
  { from: "you", text: "Who’s overdue for service?" },
  { from: "laruso", text: "7 customers are past their service interval. Drafting follow-ups for review.", tags: ["SVC-17", "C-1042"] },
  { from: "you", text: "Skip anyone who opted out." },
  { from: "laruso", text: "Done. 1 customer removed. 6 drafts ready." },
] as const;
export const queue = [
  { id: "SVC-17", customer: "C-1042", title: "Brake inspection follow-up" },
  { id: "LEAD-24", customer: "C-2210", title: "SUV inquiry check-in" },
  { id: "SVC-16", customer: "C-0877", title: "Oil change reminder" },
];

// 9. Build log (planned posts). Add `href` when a post is published.
export const posts: { title: string; href?: string }[] = [
  { title: "Why I’m building Laruso" },
  { title: "Generating messy dealership data" },
  { title: "Cleaning three systems into one customer list" },
  { title: "Adding human approval to the agent" },
  { title: "Testing the agent with fake customers" },
];

// 10. Footer
export const footerColumns = [
  { title: "Project", items: [{ label: "About", href: "#about" }, { label: "Build log", href: "#build-log" }] },
  {
    title: "Resources",
    items: [
      { label: "GitHub repo", href: links.github.href },
      { label: "README", href: repo("#readme") },
      { label: "Architecture", href: repo("/blob/main/docs/architecture.md") },
      { label: "Glossary", href: repo("/blob/main/docs/glossary.md") },
    ],
  },
  {
    title: "Notes",
    items: [
      { label: "Data and privacy", href: "#notes" },
      { label: "Limits", href: "#notes" },
      { label: "License", href: repo("/blob/main/LICENSE") },
    ],
  },
];
export const smallPrint = "Synthetic data only. No real customer data. Not a commercial product.";
