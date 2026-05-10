# Jimmy Kakanis — personal site

Public blog and portfolio with a Firebase-backed admin (posts, projects). Built with **React 19**, **TypeScript**, **Vite**, **Tailwind CSS 4**, and **Firebase** (Firestore, Auth, Storage). Deployed on **Vercel**.

## Documentation

- [Architecture overview](./docs/architecture.md)
- [Technical reference](./docs/technical.md)
- [Project status](./docs/status.md)
- [Tasks & roadmap](./docs/tasks.md)

## Local setup

```bash
npm install
```

### Environment variables

Secrets are **not** in git. Copy the template and fill in your Firebase web app values (from the Firebase console → Project settings → Your apps). On Windows you can copy the file manually; on macOS/Linux:

```bash
cp .env.example .env
```

Required for the browser app (Vite exposes only variables prefixed with `VITE_`):

| Variable | Purpose |
|----------|---------|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID |
| `VITE_FIREBASE_APP_ID` | App ID |

Optional (local scripts only, e.g. thumbnail backfill): see `.env.example` for `GOOGLE_APPLICATION_CREDENTIALS` and Admin SDK notes.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | ESLint |
| `npm run backfill:thumbnails` | Admin script to generate post cover thumbnails (requires Admin SDK setup) |

## Deployment (Vercel)

Vite inlines `import.meta.env.VITE_*` **at build time**. After removing `.env` from the repository, you **must** define the same `VITE_FIREBASE_*` variables in **Vercel → Project → Settings → Environment Variables** (Production and Preview as needed), then **redeploy**.

If those variables are missing, the site still loads, but blog, projects, and admin show an explanatory message instead of Firebase data (the app no longer crashes on a blank screen).

## Branding

- Document title: **Jimmy Kakanis** (`index.html`).
- Favicon: `public/favicon.svg` (JK monogram on brand red).
