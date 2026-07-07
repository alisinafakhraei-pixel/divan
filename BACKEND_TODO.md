# Backend TODO — Contribute flow

Tracking doc for this repo's backend architecture: **GitHub is the database.** All entrepreneur/startup data and uploaded images live as checked-in files in this repo (`data/*.json`, committed images), read and written directly by the Next.js app through the GitHub REST API. Supabase is scoped to auth/validation only, not data storage.

## Required setup: GITHUB_TOKEN

Reads and writes go through GitHub's Contents API (`lib/server/github-store.ts`), not the local filesystem — this is what makes it work identically on `localhost` and on Vercel, where the deployed filesystem is read-only.

1. Generate a token: [github.com/settings/personal-access-tokens/new](https://github.com/settings/personal-access-tokens/new) — fine-grained, scoped to the `divan` repo only, with **Contents: Read and write** permission. (A classic PAT with the `repo` scope also works.)
2. **Local dev**: create `.env.local` in the project root (already gitignored) with:
   ```
   GITHUB_TOKEN=ghp_...
   ```
3. **Vercel**: Project Settings → Environment Variables → add `GITHUB_TOKEN` for Production (and Preview if you want PRs to work too), then redeploy.
4. Optional overrides if the repo isn't `alisinafakhraei-pixel/divan` on `main`: `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`.

Without `GITHUB_TOKEN` set, every data read/write throws a clear "GITHUB_TOKEN is not set" error instead of a silent failure.

**Local dev note:** once `GITHUB_TOKEN` is set, the app reads `data/*.json` from GitHub's `main` branch, not your local working tree — editing `data/people.json` in your editor without committing/pushing won't change what the running app shows. This also means `next build` needs `GITHUB_TOKEN` set to prerender any page that reads Person/Startup data.

**Heads up:** once this is configured, every publish/approve/decline/contribute action creates a real commit on `main` (e.g. "Add person: Jane Doe", "Approve edit: ..."). There's no staging step — this is what "auto published instantly" required.

## What's implemented

- **Data storage**: `data/people.json`, `data/startups.json`, `data/submissions.json` are the source of truth, read/written via `lib/server/github-store.ts` (GitHub Contents API). Reads are cached in memory for 30s per warm server instance so one page load doesn't fire off a dozen separate GitHub requests — a write immediately updates that instance's cache, so the writer sees their own change instantly; other instances catch up within the 30s window.
- **Image storage**: uploads (photo/logo, capped at 1MB client-side) are committed into `public/uploads/people/` or `public/uploads/startups/` via the same GitHub API (`lib/server/image-store.ts`), and served back dynamically through `app/api/uploads/[folder]/[filename]/route.ts` — not Next's static `/public` output, since that's frozen at the last deploy and wouldn't show a newly uploaded image until a redeploy.
- **Server Actions** (`app/actions/contribute.ts`, `app/actions/admin.ts`) handle every mutation:
  - `submitNewEntity` / `submitEditSuggestion` — public contribute forms write a pending row into `data/submissions.json`. Shows up on `/admin` immediately.
  - `adminPublishSubmission` / `adminApproveEdit` — admin review screens write straight into `data/people.json` / `data/startups.json` and mark the submission `approved`.
  - `adminDeclineSubmission` / `adminCancelEdit` — mark a submission `declined`.
  - `adminPublishDirect` — `/admin/add`, no queue, writes straight to the JSON files.
- Field-value ↔ Person/Startup mapping lives in `lib/server/entity-builders.ts` (`toPersonPatch`/`toStartupPatch`) — the inverse of `personToFieldValues`/`startupToFieldValues` in `components/contribute/suggest-form-fields.ts`.
- Every `lib/data-access/*` function is now `async` (GitHub API calls aren't synchronous like local file reads) — every page/component reading Person/Startup/Submission data awaits it.

## Known simplifications (by design, not bugs)

- **In-memory cache is per server instance, not global.** On Vercel, different warm lambda instances each keep their own 30s cache — a write is instant for the instance that made it, but another visitor hitting a different (or cold) instance may see the old value for up to 30s. Fine for current traffic levels; would need a shared cache (e.g. Vercel KV) or shorter/no TTL if this becomes a real concern.
- **New "Known for" companies aren't created.** The combobox in `components/contribute/combobox.tsx` lets a contributor type a company name that doesn't exist yet, but it's stored as a plain string — no new `Startup` row is created. An admin has to manually reconcile it later.
- **`valuationTier` and `companyType`** aren't collected by the form. `valuationTier` is derived from the free-text `valuation` field; `companyType` defaults to `"Startup"` for every new startup.
- **Founder/knownFor linking is name-matching only.** `founders` and `knownFor` are matched against existing records by exact (case-insensitive) name — if no match, the field is just dropped (`founderIds`) or left unlinked (`knownForStartupId`).
- **`additionalInfo` supports exactly one link** (the "LinkedIn or other link" field) — editing overwrites the array entirely, so any additional links on an existing record beyond the first are lost on approval.
- **GitHub API rate limits apply.** An authenticated token gets 5,000 requests/hour. At current traffic this is a non-issue given the 30s read cache, but a Show-HN-scale traffic spike could exhaust it — worth revisiting with a longer cache TTL or ISR if that ever happens.

## Supabase scope (not started)

- **Auth**: `/admin` has no authentication today — anyone with the URL can reach it. Gate it behind Supabase auth before this is exposed anywhere but a local/trusted environment.
- **Validation**: form inputs are only validated client-side (`required`, file size). Add server-side validation (e.g. via Supabase Edge Functions or a validation layer in the Server Actions) before treating submissions as trustworthy.
- Note: the Supabase MCP connection active in past sessions pointed at an unrelated project (tables like `tasks`, `profiles`, `bluer_transactions`) — re-run `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<divan-project-ref>"` and re-authenticate before doing any Supabase work here.
