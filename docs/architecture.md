# 🏗️ Architecture & Technical Overview

## 🌟 Vision
A personal site for Jimmy Kakanis, built to be clean, professional, and easily maintainable. It combines a public-facing blog and portfolio with a secure admin dashboard for content management.

## 🛠️ Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS 4
- **Backend/Database**: Firebase (Firestore, Auth, Storage)
- **Deployment**: Vercel (Frontend) + Firebase (Backend Services)
- **Icons**: Lucide React
- **Rich Text Editor**: Tiptap

---

## 📂 Project Structure
```text
src/
├── components/
│   ├── admin/       # Admin-only management components
│   ├── Editor.tsx   # Tiptap rich text editor wrapper
│   ├── Navbar.tsx   # Global navigation
│   └── ...
├── hooks/           # Custom React hooks (useAuth, etc.)
├── lib/             # Third-party service config (Firebase)
├── pages/           # Route-level components (Home, Blog, Admin)
└── types/           # Global TypeScript interfaces
```

---

## 🔐 Content Management & Draft System

### Data Models
Both **Blog Posts** and **Projects** share a similar lifecycle:
- `status`: `'draft'` or `'published'`
- Drafts are visible in the Admin panel but hidden from the public site.

### Publishing Flow
1. **Creation**: When a new post/project is started, it defaults to `draft`.
2. **Editor**: The Admin UI provides two distinct save paths:
   - **Save Draft**: Updates the database but keeps `status: 'draft'`.
   - **Publish**: Updates the database and sets `status: 'published'`.
3. **Filtering**: The public `Blog` and `Projects` pages fetch all records but filter for `status === 'published'` in the frontend to ensure no drafts are accidentally leaked.

---

## 📡 Firebase Integration

### Firestore
- `posts`: Collection for blog content.
  - Fields: `title`, `slug`, `content`, `excerpt`, `status`, `publishedAt`, `updatedAt`, `coverImage`, optional `coverImageThumbnail` (smaller JPEG for listings; UI falls back to `coverImage` when absent).
- `projects`: Collection for portfolio items.
  - Fields: `title`, `description`, `link`, `order`, `status`, `image`.

### Storage
- `blog-covers/`: Images for blog posts.
- `projects/`: Images for portfolio items.

### Auth
- Uses standard Firebase Email/Password authentication.
- Access to the `/admin` route is protected by the `ProtectedRoute.tsx` component.
- **`AuthProvider`** (`src/hooks/useAuth.tsx`) always renders the app shell; auth loading state is used only where needed (e.g. admin). Do not gate the entire `<App />` on auth loading, or public pages can appear blank.

---

## 🔧 Client configuration (`src/lib/firebase.ts`)

Firebase is initialized **lazily** the first time code calls `getDb()`, `getAuthInstance()`, or `getStorageInstance()`. This avoids a production **white screen** when `VITE_FIREBASE_*` variables were not present at build time (Vite bakes those values in during `npm run build`).

- **`firebaseConfigured`**: `true` only when all six `VITE_FIREBASE_*` env vars are non-empty strings at **build** time.
- If `firebaseConfigured` is `false`, public static routes still work; blog, projects, single post/project views, login, and admin show user-facing setup messages instead of calling Firebase.

---

## 🚀 Deployment & Build
- **Trigger**: Pushes to the `main` branch trigger a Vercel build.
- **Strict Build**: The project uses strict TypeScript checking. Ensure all imports are used and types are valid before pushing.
- **Environment**: Set every `VITE_FIREBASE_*` variable in the Vercel project for each environment you deploy (Production / Preview). Local development uses `.env` (gitignored); see root `.env.example`.

---

## Related documentation

- [Technical reference](./technical.md) — stack details, routing table, Firebase client usage, styling.
- [Project status](./status.md) — snapshot between releases.
- [Tasks](./tasks.md) — roadmap and backlog.
