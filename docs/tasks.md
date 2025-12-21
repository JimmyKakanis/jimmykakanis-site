# 📋 Development Tasks & Roadmap

## ✅ Completed Recently
- [x] **Draft/Publish System**: Implemented dual-state content management.
- [x] **Admin UI Polish**: Added status badges and improved save buttons.
- [x] **Content Migration**: Successfully moved all legacy static content into the dynamic database.
- [x] **Bug Fix**: Resolved build failures caused by unused imports in page templates.

## 🛠️ Current Priorities
- [ ] **Image Optimization**: Consider using a CDN or Firebase image resizing extensions for better performance.
- [ ] **SEO**: Add Meta tags and OpenGraph data to the `Post.tsx` page for better social sharing.
- [ ] **Analytics**: Integrate a simple analytics tool (like Vercel Analytics) to track visitor engagement.

## 📅 Maintenance Tasks
- **Firebase Indexes**: If re-enabling server-side filtering, ensure composite indexes for `status` + `orderBy` fields are created in the Firebase Console.
- **Tiptap Plugins**: Periodically check for updates to Tiptap extensions to ensure the editor stays secure and functional.

