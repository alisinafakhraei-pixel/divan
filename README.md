# Divan

Wikipedia-for-Iranian-entrepreneurship: browsable directories of People and Startups wrapped in
News, Insights, Hackathon, Community, Events, Perks, About, and Contribute. Next.js (App Router) +
TypeScript + Tailwind v4 + shadcn/ui (`base-nova` style, Base UI primitives).

Live at: https://github.com/alisinafakhraei-pixel/divan (deployed via Vercel)

## Status

All 12 planned phases (0-11) are built. Data is static mock data in `lib/data/*` behind a
`lib/data-access/*` seam — no backend yet. See `PROGRESS.md` for full build history, known quirks,
and fixed bugs.

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
- `lib/data/*` — mock fixtures
- `lib/data-access/*` — the seam a real backend integration will replace
- `lib/hooks/use-url-filters.ts` — shared URL-driven filter/sort/pagination contract used by every directory page

## Deploying

Deployed on Vercel from the `main` branch of
[alisinafakhraei-pixel/divan](https://github.com/alisinafakhraei-pixel/divan).
