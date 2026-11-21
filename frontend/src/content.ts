// All editable copy lives here. Guests named on the page are fictional.

export const site = {
  name: "Laruso",
  headline: "Never lose a returning guest.",
  subtext:
    "An AI assistant that spots hotel guests worth reaching out to, writes them a personal message, and waits for a person to approve it.",
  tagline: "An AI follow-up assistant for hotels.",
  // Paste only the video ID, e.g. "dQw4w9WgXcQ". The demo video shows once this is set.
  youtubeId: "",
  builderName: "Shema Divin",
  city: "Kigali",
};

export const links = {
  github: "https://github.com/Vine-77/Laruso",
  linkedin: "https://www.linkedin.com/in/shema-divin-106602386/",
  instagram: "https://www.instagram.com/divin___/",
  email: "shemadivin7@gmail.com",
  // Where the "View Demo" buttons go. Points at the repo until the demo is live.
  demo: "https://github.com/Vine-77/Laruso",
};

export const repo = (path: string) => `${links.github}${path}`;

// Hero
export const heroStats = [
  { value: 7, label: "Guests due to return" },
  { value: 12, label: "Unfinished bookings" },
  { value: 34, label: "Messages to review" },
];

export const returnCards = [
  { title: "Anniversary stay coming up", body: "Sam stayed 11 months ago for 3 nights." },
  { title: "Comes back every summer", body: "Tom books every July. Nothing yet this year." },
];
export const followUpCards = [
  { title: "Noise complaint, no reply", body: "Jane complained about noise in March. No one replied." },
  { title: "Booking never finished", body: "Ali looked at a 2-night suite and never booked." },
];

export const builtWith = ["Python", "pandas", "FastAPI", "LangGraph", "Ollama", "Streamlit"];

// How it works: 1. one guest list
export const mergeRows = [
  { text: "Jane found in all 3 systems", result: "Merged into one profile" },
  { text: "Same guest, name spelled differently", result: "Duplicate removed", removed: true },
  { text: "Noise complaint from March, still open", result: "Needs a follow-up" },
];

// 2. Priorities
export const priorities = [
  { tag: "Contact today", title: "Reply to Jane’s noise complaint", sub: "March stay, no reply yet" },
  { tag: "This week", title: "Ali’s unfinished suite booking", sub: "2 nights, never confirmed" },
  { tag: "Later", title: "Sam’s anniversary offer", sub: "Last stayed 11 months ago" },
];

// 3. Draft and approve
export const draft = {
  to: "To Jane",
  text: "Hi Jane, we’re sorry the room was noisy during your stay in March. We’d love the chance to make it right on your next visit.",
  steps: ["Written", "Approved", "Sent"],
  guardrails: ["No price promises", "No room promises", "Respects opt-outs"],
};

// What Laruso looks for
export const checks = [
  { name: "Return visits", desc: "Guests who are due for another stay" },
  { name: "Open complaints", desc: "Guests who never heard back" },
  { name: "Unfinished bookings", desc: "Searches that never turned into a booking" },
  { name: "Safety checks", desc: "Rules every message must pass" },
];

// Chat + approval queue
export const chat = [
  { from: "you", text: "Who hasn’t heard from us since a complaint?" },
  { from: "laruso", text: "4 guests have an open complaint with no reply. I’m writing messages for you to review." },
  { from: "you", text: "Skip anyone who opted out." },
  { from: "laruso", text: "Done. 1 guest removed, 3 messages ready." },
] as const;
export const queue = [
  { guest: "Jane", title: "Noise complaint follow-up" },
  { guest: "Ali", title: "Unfinished suite booking" },
  { guest: "Sam", title: "Anniversary stay offer" },
];

// Build log. Add `href` when a post is published.
export const posts: { title: string; href?: string }[] = [
  { title: "Why I’m building Laruso" },
  { title: "Making realistic test data" },
  { title: "Turning three systems into one guest list" },
  { title: "Adding human approval" },
  { title: "Testing with pretend guests" },
];

// Footer
export const footerColumns: { title: string; items: { label: string; href: string }[] }[] = [
  { title: "Project", items: [{ label: "About", href: "#about" }, { label: "Build log", href: "#build-log" }] },
  { title: "Code", items: [{ label: "GitHub repo", href: links.github }, { label: "README", href: repo("#readme") }] },
  { title: "Notes", items: [{ label: "Data and privacy", href: "#notes" }, { label: "Limits", href: "#notes" }] },
];
export const smallPrint = "Example data only. Not a commercial product.";
