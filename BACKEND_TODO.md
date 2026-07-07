# Backend TODO — Contribute flow

Tracking doc for this repo's backend architecture: **GitHub is the database.** All entrepreneur/startup data and uploaded images live as checked-in files in this repo (`data/*.json`, `public/uploads/**`), read and written directly by the Next.js app. Supabase is scoped to auth/validation only, not data storage.

## What's implemented

- **Data storage**: `data/people.json`, `data/startups.json`, `data/submissions.json` are the source of truth (migrated from the old `lib/data/*.ts` fixture arrays). `lib/data/people.ts` / `startups.ts` / `submissions.ts` read/write these files fresh on every call via `lib/server/json-store.ts` (`node:fs`, no in-memory caching) — no rebuild or redeploy needed to see a change.
- **Image storage**: file uploads (photo/logo, capped at 1MB client-side in `components/contribute/form-field-input.tsx`) are saved into `public/uploads/people/` or `public/uploads/startups/` by `lib/server/image-store.ts`, so they're tracked the same way as the JSON data.
- **Server Actions** (`app/actions/contribute.ts`, `app/actions/admin.ts`) handle every mutation:
  - `submitNewEntity` / `submitEditSuggestion` — public contribute forms write a pending row into `data/submissions.json`. Shows up on `/admin` immediately (`revalidatePath`).
  - `adminPublishSubmission` / `adminApproveEdit` — admin review screens write straight into `data/people.json` / `data/startups.json` and mark the submission `approved`. Live on the site immediately.
  - `adminDeclineSubmission` / `adminCancelEdit` — mark a submission `declined`.
  - `adminPublishDirect` — `/admin/add`, no queue, writes straight to the JSON files.
- Field-value ↔ Person/Startup mapping lives in `lib/server/entity-builders.ts` (`toPersonPatch`/`toStartupPatch`) — the inverse of `personToFieldValues`/`startupToFieldValues` in `components/contribute/suggest-form-fields.ts`.

## Known simplifications (by design, not bugs)

- **Git history is not touched automatically.** Writes land in the working tree only — nothing is committed or pushed to GitHub on its own. Review with `git status`/`git diff` and push when ready, same as any other change. (Chose this over auto-commit-per-click so admin/community actions can't silently rewrite repo history without review.)
- **New "Known for" companies aren't created.** The combobox in `components/contribute/combobox.tsx` lets a contributor type a company name that doesn't exist yet, but it's stored as a plain string — no new `Startup` row is created. An admin has to manually reconcile it later.
- **`valuationTier` and `companyType`** aren't collected by the form. `valuationTier` is derived from the free-text `valuation` field (`lib/server/entity-builders.ts`); `companyType` defaults to `"Startup"` for every new startup.
- **Founder/knownFor linking is name-matching only.** `founders` and `knownFor` are matched against existing records by exact (case-insensitive) name — if no match, the field is just dropped (`founderIds`) or left unlinked (`knownForStartupId`).
- **`additionalInfo` supports exactly one link** (the "LinkedIn or other link" field) — editing overwrites the array entirely, so any additional links on an existing record beyond the first are lost on approval.

## Supabase scope (not started)

- **Auth**: `/admin` has no authentication today — anyone with the URL can reach it. Gate it behind Supabase auth before this is exposed anywhere but a local/trusted environment.
- **Validation**: form inputs are only validated client-side (`required`, file size). Add server-side validation (e.g. via Supabase Edge Functions or a validation layer in the Server Actions) before treating submissions as trustworthy.
- Note: the Supabase MCP connection active in past sessions pointed at an unrelated project (tables like `tasks`, `profiles`, `bluer_transactions`) — re-run `claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=<divan-project-ref>"` and re-authenticate before doing any Supabase work here.
