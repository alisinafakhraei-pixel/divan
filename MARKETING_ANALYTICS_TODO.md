# Marketing Analytics — TODO

Tracking doc for adding basic marketing/usage metrics. Not started — picking this up later.

## Metrics to track

1. Total page views
2. Total users
3. Total active users (active = at least one page view per day / week / month — need all three windows)
4. Number of edit requests
5. Number of add (new entity) requests

All records need a date/time stamp.

## Decisions already made

- **No login on the site** — "users" and "active users" are anonymous, session-based (e.g. a session ID in a cookie/localStorage), not real accounts. A person clearing cookies or switching devices counts as a new user.
- **Bots are counted** — no user-agent filtering needed.
- **Edit/add requests are logged as events**, not derived from `data/submissions.json` — keeps all 5 metrics coming from one consistent event source with timestamps, even though `app/actions/contribute.ts` (`submitNewEntity` / `submitEditSuggestion`) already writes those to `data/submissions.json` today.

## Blocker before building

The Supabase MCP connection in this session pointed at an **unrelated project** (tables like `tasks`, `profiles`, `bluer_transactions`, `kiss_counter` — not Divan data). Per [BACKEND_TODO.md](BACKEND_TODO.md)'s existing note, reconnect to the real Divan Supabase project first:

```
claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<divan-project-ref>"
```

Re-authenticate, then confirm `list_tables` shows the actual Divan schema before applying any analytics migrations.

Also note: per `BACKEND_TODO.md`, Supabase in this repo has so far been scoped to auth/validation only (not started) — data storage is otherwise GitHub JSON files (`lib/server/github-store.ts`). This analytics table would be the first real Supabase usage in the app.

## Planned shape (not yet built)

- One `events` table: `id`, `event_type` (`page_view` / `edit_request` / `add_request`), `session_id`, `page_path` (nullable), `entity_id` (nullable, for edit/add requests), `created_at`.
- Total page views: `COUNT(*) WHERE event_type = 'page_view'`.
- Total users: `COUNT(DISTINCT session_id)`.
- Active users (day/week/month): `COUNT(DISTINCT session_id) WHERE event_type = 'page_view' AND created_at > now() - interval '...'` for each window.
- Edit/add request counts: `COUNT(*) WHERE event_type = 'edit_request' / 'add_request'`.
- No aggregation/rollup tables needed yet at this metric count and traffic level — raw event queries are fine for now.
