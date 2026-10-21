// All editable copy and placeholders live here.
// Anything with `placeholder: true` renders with a visible "Placeholder" tag.

export const site = {
  name: "Laruso",
  tagline:
    "An AI agent that finds dealership customers who are due for service or have gone cold, drafts a personal follow-up, and waits for a human to approve it.",
  // Paste only the video ID, e.g. "dQw4w9WgXcQ" from https://www.youtube.com/watch?v=dQw4w9WgXcQ
  youtubeId: "",
};

export const links = {
  github: { href: "https://github.com/your-username/laruso", placeholder: true },
  linkedin: { href: "https://www.linkedin.com/in/your-profile", placeholder: true },
  email: { href: "you@example.com", placeholder: true },
};

export const problem = [
  {
    title: "Service reminders go out late, or not at all",
    body: "Customer records sit in the DMS, the CRM, and the service lane. Nobody has time to cross-check all three every week.",
  },
  {
    title: "Cold leads stay cold",
    body: "A customer who stopped replying rarely gets a second, thoughtful message. Generic blasts are easy to ignore.",
  },
  {
    title: "The cost is quiet",
    body: "A missed oil change or a lapsed lead doesn't show up as an error. It shows up as a customer who went somewhere else.",
  },
];

export type Result = {
  metric: string;
  description: string;
  value: number; // 0–100
  unit: string;
  placeholder: boolean;
};

// Replace with real numbers from your scorer and set placeholder: false.
export const results: Result[] = [
  {
    metric: "Right customers flagged",
    description: "Share of due or cold customers the agent correctly picked",
    value: 80,
    unit: "%",
    placeholder: true,
  },
  {
    metric: "Draft quality",
    description: "Scorer rubric: personal, accurate, on-brand",
    value: 70,
    unit: "/100",
    placeholder: true,
  },
  {
    metric: "Approved without edits",
    description: "Drafts a human approved as written",
    value: 60,
    unit: "%",
    placeholder: true,
  },
  {
    metric: "Simulated positive replies",
    description: "Synthetic customers who responded positively",
    value: 50,
    unit: "%",
    placeholder: true,
  },
];

export const stack = [
  {
    tool: "Ollama + small local models",
    why: "Free, runs on a laptop, and no customer data leaves the machine.",
  },
  {
    tool: "Synthetic DMS, CRM, and service-lane data",
    why: "Realistic shape without touching anyone's real records.",
  },
  {
    tool: "Human approval step",
    why: "Nothing is sent without a person signing off. The agent drafts; people decide.",
  },
  {
    tool: "Customer simulator",
    why: "Fake customers react to drafts, so the agent can be tested end to end without real people.",
  },
  {
    tool: "Scorer",
    why: "Turns each run into numbers, so changes can be compared instead of eyeballed.",
  },
  {
    tool: "Next.js + Tailwind, static export",
    why: "This page. No backend needed, so it hosts for free.",
  },
];
