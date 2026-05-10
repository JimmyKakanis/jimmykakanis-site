# Project status

Snapshot of where the repo stands between releases. For planned work, see [tasks.md](./tasks.md).

## Current state

| Area | Status |
|------|--------|
| Public site (home, about, contact) | **Healthy** — static routes independent of Firebase |
| Blog & projects (Firestore) | **Healthy** when `VITE_FIREBASE_*` are set at **build** time on the host |
| Admin (Auth + CMS) | **Healthy** with same env + valid Firebase Auth users |
| Production deploy | **Vercel** — env vars must be mirrored from local `.env` |

## Recent highlights

- Lazy Firebase initialization and `firebaseConfigured` flag prevent a blank page when env is missing; affected routes show setup guidance instead.
- `.env` is gitignored; `.env.example` documents required `VITE_FIREBASE_*` keys.
- Blog covers support optional thumbnails; home contact tile uses the “Permission to Be Fallow” cover when available.
- Site title and JK favicon in `index.html` / `public/favicon.svg`.

## Open / follow-ups

Tracked in [tasks.md](./tasks.md) (e.g. SEO meta, analytics, image CDN). No known blockers for day-to-day authoring once Vercel env is correct.

## How to update this file

After a meaningful release or milestone, adjust **Current state** and **Recent highlights** in a sentence or two; keep **Open / follow-ups** thin and defer detail to `tasks.md`.
