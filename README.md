# Laruso — portfolio site

Static Next.js + Tailwind site for the Laruso project. No backend.

## Edit content

Everything you'll want to change is in `src/content.ts`:

- `site.youtubeId` — paste the YouTube video ID to replace the video placeholder.
- `links` — GitHub, LinkedIn, email. Set `placeholder: false` once real.
- `results` — eval scores. Set `placeholder: false` on each row once measured.
  The "Placeholder" banner disappears when no row is a placeholder.
- `stack`, `problem` — short copy blocks.

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
