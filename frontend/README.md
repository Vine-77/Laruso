# Laruso — portfolio site

Static Next.js + Tailwind site for the Laruso project. No backend.

## Edit content

All copy lives in `src/content.ts`. Anything not real yet is visibly tagged on the page:

- `site.builderName`, `site.city` — replace the `[...]` placeholders.
- `site.youtubeId` — paste a YouTube video ID to embed the demo in the "See Laruso in action" block.
- `links` — GitHub, LinkedIn, email. Set `placeholder: false` once real.
- `heroStatsSample`, `bookingRate.sample`, `checkDetail.sample` — set to `false` once the numbers come from real runs.
- `unsafeDrafts` — set `value` to your eval result and `placeholder: false`.
- `checks[].planned` — set to `false` when a check actually runs on that schedule.
- `posts[].href` — add a link when a build-log post is published; the "Planned" tag disappears.

Mocks (dashboard, triage, priorities, draft, chat, approval queue) are in `src/components/Mocks.tsx`.

## Run locally (from the Laruso folder)

```
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```
npm run build
```

Outputs a fully static site to `out/`.
