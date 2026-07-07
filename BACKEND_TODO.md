# Backend TODO — Contribute flow

Temporary tracking doc for backend work the contribute/edit forms currently mock client-side. Not built yet — everything below is UI-only until Supabase is wired up.

## Image uploads (photo / logo)
- Contribute and edit-sheet forms currently accept a file (max 1MB) but don't upload it anywhere.
- Plan: upload to Supabase Storage on submit, store the resulting URL on the `Person.picture` / `Startup.logo` field.
- Client-side size validation exists in `components/contribute/form-field-input.tsx` (`FileFieldInput`) — keep it as a first line of defense, but re-validate size/type server-side too.

## New company creation ("Known for" combobox)
- `components/contribute/combobox.tsx` lets a contributor type a company name that isn't in the existing `Startup` list and use it as free text.
- Plan: when the submission is reviewed, the admin either links it to an existing `Startup` row or creates a new draft `Startup` in Supabase, then relinks `Person.knownFor` / `knownForStartupId`.
- No new startup is actually created today — the typed value is just submitted as a string.

## Submission storage & moderation queue
- All forms (`SuggestForm`) currently just flip local state to "submitted" — nothing is persisted, no queue exists.
- Plan: POST submissions (new + edit) to a Supabase table (e.g. `submissions`) with `type` (person/startup), `mode` (new/edit), `targetId` (for edits), `payload` (JSON of field values), `status` (pending/approved/rejected), `createdAt`.
- Edit submissions should store a diff or full proposed payload against the current published record so admins can compare old vs. new.

## Admin approval UI — built, not wired up
- `/admin` (community suggestions list + diff/publish review) and `/admin/add` (immediate-publish add form) exist as UI now, backed by a hardcoded mock queue in `lib/data/submissions.ts`.
- Approve/Decline/Publish/Cancel buttons only flip local component state (`components/admin/review-new-submission.tsx`, `components/admin/review-edit-submission.tsx`) — nothing is written back to `lib/data/people.ts` / `lib/data/startups.ts`, and the queue doesn't shrink on reload.
- Plan: wire these actions to Supabase — approve/publish writes through to the real `Person`/`Startup` tables and marks the `submissions` row `approved`; decline/cancel marks it `declined`.
- `/admin/add` bypasses the queue by design per product decision (no approval step for admin-entered records) — still needs the real create-row mutation once Supabase is connected.

## Admin auth
- `/admin` currently has no authentication or access control — anyone with the URL can reach it.
- Plan: gate behind Supabase auth (or similar) before this goes anywhere near production data.

## GitHub integration
- Mentioned as a possible path for storing uploaded images / contributed data changes as PRs instead of (or alongside) Supabase — decide storage strategy before building the upload pipeline.
