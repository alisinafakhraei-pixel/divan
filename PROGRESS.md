# Divan Build Progress

Local-only Next.js build. Plan file: `~/.claude/plans/users-alisinafakhraei-documents-1-work-delightful-donut.md`.
Dev server: `npm run dev` (or Claude Preview `divan-web` config in `.claude/launch.json`).

## Done (Phases 0-5)

- **Phase 0** — Scaffold: Next.js 16 (App Router) + TS + Tailwind v4 + shadcn (`base-nova` style, Base UI primitives, not Radix). Design tokens in `app/globals.css`. Mock data in `lib/data/*`, seam in `lib/data-access/*`. Shared components in `components/shared/*`. `/style-guide` route.
- **Phase 1** — Home (`app/page.tsx`): hero+search, stats, featured carousels, news strip, dynamic hackathon banner, events teaser, CTA.
- **Phase 2** — Entrepreneurs (`app/entrepreneurs/`, `components/entrepreneurs/`): filters/sort/pagination via `lib/hooks/use-url-filters.ts` (URL search params — reused by every directory page since).
- **Phase 3** — Startups (`app/startups/`, `components/startups/`): 7 filter facets, founder↔startup cross-links closed both ways.
- **Phase 4** — News (`app/news/`): type filter + search.
- **Phase 5** — Insights (`app/insights/`, `components/insights/`): world map (react-simple-maps + local `public/world-110m.json`, no CDN dependency), donut/bar charts (recharts via shadcn `components/ui/chart.tsx`), all click through to pre-filtered directory URLs.

New deps added beyond Phase 0 scaffold: `recharts` (via `shadcn add chart`), `react-simple-maps` + `@types/react-simple-maps` (installed with `--legacy-peer-deps`, no official React 19 peer support yet but works fine).

## Done (Phase 8)

- **Phase 8** — Events (`app/events/page.tsx`): Upcoming/Past tabs, reuses `EventCard` and existing `lib/data-access/events.ts`. Regression-checked against Home's events teaser.

## Two real bugs found and fixed while building Phase 8 (both pre-existing since Phase 5, missed in that phase's verification)

1. **Base UI `Tabs.Panel` inert-but-visible bug**: the inactive tab panel gets `inert` but no `display:none`, so after switching tabs both panels were visible/overlapping. Fixed with a scoped CSS rule in `globals.css`: `[data-slot="tabs-content"][inert] { display: none; }` (scoped, not a blanket `[inert]` rule, since Dialog/Sheet legitimately use `inert` on backgrounds that should stay visible).
2. **RSC boundary violation in Insights charts**: `app/insights/page.tsx` (Server Component) was passing an inline `buildHref` function prop to `ClickableDonutChart`/`ClickableBarChart` (Client Components) — this throws "Functions cannot be passed directly to Client Components" server-side, which silently 500'd those 4 tabs the whole time (only the World Map tab, which takes no function props, ever worked). Fixed by changing the components to accept serializable `linkBase`/`linkParam` strings and building the href internally instead of accepting a function.
   - **Lesson**: server-side RSC errors don't show up in browser console — check `preview_logs` (server stdout/stderr) too, not just `preview_console_logs`, especially for any Server Component that renders a Client Component with non-trivial props.

## Two more real bugs found and fixed (post-Phase-11, user-reported)

3. **World map click was a silent no-op for ~166 of 177 countries**: only countries present in our 11-country fixture set had an `onClick` handler wired; clicking anywhere else (the vast majority of the map) did nothing with no feedback, reading as "broken." Fixed in `components/insights/world-map.tsx` — every country is now clickable, and clicking one with no data shows an `EmptyState` ("No results for X") instead of nothing. Also added a visible selected-state highlight (blue stroke) on the clicked country.
4. **Pie chart legends showed color swatches but no text labels**: shadcn's `ChartLegendContent` only renders a label if it finds a matching entry in the `config` prop (keyed by the literal data value, not a generic key) — passing `config={{}}` (as the tooltip did fine, since tooltip has a fallback) left the legend labels blank. Fixed in `components/insights/clickable-donut-chart.tsx` by building a real `ChartConfig` from `data` (one entry per label, mapped to its slice color) instead of an empty object.

## World map UX rework + a critical bug caught in the process (user-reported)

User feedback: the below-the-map results panel was easy to miss ("users won't see it") — wanted a slide-in sidebar instead, with the rule that you close it before picking another country.

First attempt used the shared `Sheet` (Base UI `Dialog`) component, same as the mobile nav menu. That surfaced a serious bug: closing the sheet left it stuck in `data-ending-style` forever — opacity animated to 0 (invisible) but the DOM node, including its full-viewport backdrop, never unmounted. Because the backdrop still had `pointer-events: auto`, this made **the entire page permanently unclickable** after the first close, with no visible sign anything was wrong. Root cause looks like a Base UI exit-animation-completion timing issue specific to this component/library combo — not chased further.

Fix: replaced it with a plain CSS slide-in panel local to `components/insights/world-map.tsx` (no Dialog primitive) — backdrop and panel visibility/`pointer-events` are tied directly to React state via Tailwind classes, not to an animation-completion callback, so there is no path to a stuck state regardless of transition timing. Added manual Escape-to-close. Confirmed via direct testing that clicking is re-enabled within 50ms of closing, well before any CSS transition would finish.

**Lesson**: when a "closeable overlay" component doesn't unmount as expected, check `pointer-events` and DOM presence immediately after closing — not just visual appearance — since an invisible full-viewport element can silently block the entire page.

## Known quirks / fixed bugs worth remembering

- Base UI `Button`/`SheetClose` need `nativeButton={false}` when rendering as a `Link`/`<a>` via the `render` prop, else a console warning (fixed generically in `components/ui/button.tsx` via `nativeButton = !render` default; fixed at the call site for `SheetClose` in `header.tsx`).
- Base UI `Select`'s `SelectValue` does NOT auto-resolve the selected value to its item's label — use the `FacetSelect` wrapper (`components/shared/facet-select.tsx`) which passes a children render-function.
- Don't read `window.location.href` during render in a client component (SSR/hydration mismatch) — read it in `useEffect` instead (see `components/shared/share-buttons.tsx`).
- `lucide-react` in this project's version has no brand icons (no `Twitter`/`Linkedin`) — use `Share2`/generic icons.
- Country name mismatch between our fixtures and the world-atlas topojson: "United States" vs "United States of America" — see `COUNTRY_TOPOJSON_ALIASES` in `lib/data-access/insights.ts`.
- The `preview_screenshot` tool occasionally returns a blank/white image even when the DOM is correct — verify via `preview_eval` (check `document.body.innerText`, `elementFromPoint`, console logs) before assuming a real rendering bug.

## Open item from user

- Favicon (`app/icon.svg`) is a hand-recreated approximation of the Divan logo mark and the user said it doesn't match. Waiting on the user to drop the actual logo file into the project (no path was ever provided) so it can be redone precisely instead of guessed.

## Done (Phase 6)

- **Phase 6** — Hackathon (`app/hackathon/`, `app/hackathon/cohorts/`, `app/hackathon/cohorts/[slug]/`, `app/hackathon/apply/`, `components/hackathon/`): landing reuses `getCohortDisplayState` (same logic as Home banner), archive + recap pages, apply page clearly labeled as a placeholder. Added `getAllCohorts()` to `lib/data-access/hackathon.ts`.

## Done (Phase 7)

- **Phase 7** — Community (`app/community/`, `components/community/`): UI-only, `lib/mock-auth.tsx` provides sign-in-gated posting via React context (in-memory, resets per page load — by design). Discussions/Ask share the same `Post` engine (`postType` discriminator). Locally-composed posts/jobs (id/slug prefixed `local-`) are intentionally non-clickable since there's no backend to look them up by — see the `isLocal` guard in `DiscussionCard`/`JobCard`.

## Done (Phases 9-11 — full sitemap complete)

- **Phase 9** — Perks (`app/perks/`): category filter, Formaloo's perk sorts first via existing `featured` flag.
- **Phase 10** — About (`app/about/`): mission tile, team grid (`getTeamMembers()` — Admin/Moderator/Contributor roles from `members.ts`, real names from `Divan_Context.md`), FAQ accordion, mock contact form.
- **Phase 11** — Contribute (`app/contribute/`): 3-tab mock suggestion forms (Person/Startup/News), guidelines, moderation explainer. Verified every "Suggest an edit/entrepreneur/startup" and "Submit news" stub link built since Phase 2 now correctly resolves here instead of 404ing.

**All 12 phases (0-11) of the plan are now built and verified.** Every route type-checks clean and has been manually exercised in-browser (console + server logs both checked, per the Phase 8 lesson).

## Remaining phases (see plan file for full detail)

(none — see "Done" sections above for the full build)
- **Phase 8** — Events (upcoming/past split — data-access already exists in `lib/data-access/events.ts`).
- **Phase 9** — Perks.
- **Phase 10** — About (confirm with user: real team names from `Divan_Context.md` admin list, or placeholders).
- **Phase 11** — Contribute (closes out all the "Suggest an edit/entrepreneur/startup" stub links pointing here since Phase 2).

Cross-cutting reminders: filter/sort URL-param contract is established (`lib/hooks/use-url-filters.ts` + `components/shared/facet-select.tsx`) — reuse verbatim, don't reinvent. Every phase's "done when" includes a manual browser check per `PROGRESS.md` verification workflow (type-check with `npx tsc --noEmit`, then load in `Claude Preview`, check console, click through the feature).
