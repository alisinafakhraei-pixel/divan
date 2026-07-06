# Divan

Wikipedia-for-Iranian-entrepreneurship: browsable directories of People and Startups, an
Ecosystem map (world map + charts), News, Hackathon, Events, and Contribute. Next.js (App Router) +
TypeScript + Tailwind v4 + shadcn/ui (`base-nova` style, Base UI primitives).

Live at: https://divan-delta.vercel.app (source: https://github.com/alisinafakhraei-pixel/divan)

## Status

All 12 planned phases (0-11) are built, then followed by a real-data pass: `lib/data/people.ts`,
`lib/data/startups.ts`, and `lib/data/news.ts` now hold real, curated entrepreneurs/startups/news
(not placeholder fixtures) behind the same `lib/data-access/*` seam — no backend yet. Events,
Hackathon, Community, and Perks still use mock fixture data. The site's real logo/favicon and
per-entity Open Graph link previews are wired up. Discussions, Perks, and News are currently
unlinked from the navbar/footer/homepage (pages still exist, just not promoted). See `PROGRESS.md`
for full build history, known quirks, and fixed bugs.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Note: `.npmrc` sets `legacy-peer-deps=true` — required because `react-simple-maps` only declares
React ≤18 as a peer dependency; the app runs fine on React 19.

## Key paths

- `app/` — routes (App Router)
- `components/ui/` — shadcn primitives
- `components/shared/`, `components/<feature>/` — app components
- `lib/types.ts` — entity types
- `lib/data/*` — fixtures (people/startups/news are real curated data; events/hackathon/community/perks are still mock)
- `lib/data-access/*` — the seam a real backend integration will replace
- `lib/hooks/use-url-filters.ts` — shared URL-driven filter/sort/pagination contract used by every directory page
- `lib/og-image.ts` — resolves a Person/Startup image (remote URL or local `/public` path) for use in generated Open Graph images
- `public/logo.svg`, `app/icon.svg` — real Divan brand mark (navbar logo + favicon)

## Deploying

Deployed on Vercel from the `main` branch of
[alisinafakhraei-pixel/divan](https://github.com/alisinafakhraei-pixel/divan).
