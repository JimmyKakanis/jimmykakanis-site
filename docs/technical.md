# Technical reference

Conventions, tooling, and patterns used in this repo. For system shape and data flow, see [architecture.md](./architecture.md).

## Stack versions

Track `package.json` as the source of truth. Notable choices:

- **Vite 7** — dev server and production bundler; `import.meta.env` for env (only `VITE_*` exposed to the client).
- **React 19** — function components; `StrictMode` in `main.tsx`.
- **React Router 6** — `BrowserRouter`, nested `/admin` routes with `Outlet`.
- **Tailwind CSS 4** — `@import "tailwindcss"` and `@theme` in `src/index.css` (brand colors, fonts).
- **Firebase JS SDK** — modular imports (`firebase/app`, `firebase/auth`, `firebase/firestore`, `firebase/storage`).
- **Tiptap 3** — rich text in admin; custom extensions (e.g. Vimeo) under `src/lib/`.

## TypeScript

- Strict project references via `tsc -b` before `vite build`.
- Prefer explicit types; avoid `any` except at narrow boundaries (e.g. legacy `catch (err: any)`).
- Shared document shapes live in `src/types/index.ts` (`BlogPost`, `Project`, etc.).

## Routing

| Path | Purpose |
|------|---------|
| `/` | Home grid (projects, blog, about, contact) |
| `/about`, `/contact` | Static-style pages |
| `/blog`, `/blog/:id` | Post list and detail (Firestore) |
| `/projects`, `/projects/:id` | Project list and detail (Firestore) |
| `/login` | Admin sign-in |
| `/admin/*` | Protected CMS (posts, projects) |

`vercel.json` rewrites all paths to `index.html` for SPA routing.

## Firebase client (`src/lib/firebase.ts`)

- Import **`getDb()`**, **`getAuthInstance()`**, **`getStorageInstance()`** — do not assume eager singletons; init runs on first use.
- Check **`firebaseConfigured`** before Firestore/Auth UX that should degrade gracefully when env was missing at build time.
- Server-side or CLI scripts (e.g. thumbnail backfill) use **Firebase Admin** with credentials from `.secrets/` (gitignored), not the Vite client env.

## Content & media

- **Blog HTML**: Stored as strings in Firestore; rendered with `dangerouslySetInnerHTML` where appropriate. Prose/embed styles live in `src/index.css` (e.g. YouTube/Vimeo aspect ratio).
- **Cover images**: `CoverImageWithFallback` prefers `coverImageThumbnail`, then `coverImage`. Upload helpers in `src/lib/upload.ts` + `imageResize.ts` generate hero + thumb when possible.
- **Static assets**: Files under `public/` (e.g. `public/img/`, `public/favicon.svg`) are served at the root URL.

## Styling

- Prefer Tailwind utility classes in components; use `font-serif` / `font-sans` per `@theme`.
- Brand red: `brand-red` / `brand-red-hover`; blog link colors: `blog-link` / `blog-link-hover` (see `src/index.css`).

## Linting & format

- ESLint flat config: `eslint.config.js`. Run `npm run lint` before pushing substantive changes.

## Scripts outside the app

- `scripts/backfill-cover-thumbnails.ts` — optional Firestore/Storage maintenance; requires Admin credentials and env documented in `.env.example`. Not part of the Vercel build.

## Security notes

- Never commit `.env`, service account JSON, or `.secrets/`.
- Admin operations rely on Firebase Auth + `ProtectedRoute`; public reads use published-only filtering in the UI (see architecture).

## Related docs

- [architecture.md](./architecture.md) — CMS model, Firestore collections, deployment.
- [tasks.md](./tasks.md) — roadmap and backlog.
- [status.md](./status.md) — current snapshot and recent changes.
