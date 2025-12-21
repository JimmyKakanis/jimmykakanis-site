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
  - Fields: `title`, `slug`, `content`, `excerpt`, `status`, `publishedAt`, `updatedAt`, `coverImage`.
- `projects`: Collection for portfolio items.
  - Fields: `title`, `description`, `link`, `order`, `status`, `image`.

### Storage
- `blog-covers/`: Images for blog posts.
- `projects/`: Images for portfolio items.

### Auth
- Uses standard Firebase Email/Password authentication.
- Access to the `/admin` route is protected by the `ProtectedRoute.tsx` component.

---

## 🚀 Deployment & Build
- **Trigger**: Pushes to the `main` branch trigger a Vercel build.
- **Strict Build**: The project uses strict TypeScript checking. Ensure all imports are used and types are valid before pushing.

