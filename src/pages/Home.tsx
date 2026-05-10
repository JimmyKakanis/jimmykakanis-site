import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { getDb, firebaseConfigured } from '../lib/firebase';
import type { BlogPost } from '../types/index';
import { CoverImageWithFallback } from '../components/CoverImageWithFallback';

const FALLOW_SLUG = 'permission-to-be-fallow';
const FALLOW_TITLE = 'Permission to Be Fallow';
/** Legacy listing image if the post has no cover in Firestore */
const CONTACT_FALLBACK_SRC = '/img/tea.webp';

const Home = () => {
  const [fallowCover, setFallowCover] = useState<{
    thumbnail: string | null;
    full: string | null;
  } | null>(null);
  const [fallowResolved, setFallowResolved] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadFallowCover = async () => {
      if (!firebaseConfigured) {
        if (!cancelled) setFallowResolved(true);
        return;
      }
      try {
        const slugQ = query(
          collection(getDb(), 'posts'),
          where('slug', '==', FALLOW_SLUG),
          limit(1)
        );
        const titleQ = query(
          collection(getDb(), 'posts'),
          where('title', '==', FALLOW_TITLE),
          limit(1)
        );
        const [slugSnap, titleSnap] = await Promise.all([getDocs(slugQ), getDocs(titleQ)]);
        const docSnap = slugSnap.docs[0] ?? titleSnap.docs[0];
        if (cancelled || !docSnap) return;

        const data = docSnap.data() as BlogPost;
        if (data.status !== 'published') return;

        const thumb =
          typeof data.coverImageThumbnail === 'string' ? data.coverImageThumbnail.trim() : '';
        const full = typeof data.coverImage === 'string' ? data.coverImage.trim() : '';
        if (thumb || full) {
          setFallowCover({
            thumbnail: thumb || null,
            full: full || null,
          });
        }
      } catch (e) {
        console.error('Home: could not load fallow post cover', e);
      } finally {
        if (!cancelled) setFallowResolved(true);
      }
    };

    loadFallowCover();
    return () => {
      cancelled = true;
    };
  }, []);

  const hasFirestoreCover = Boolean(fallowCover?.thumbnail || fallowCover?.full);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/projects">
          <img src="/img/DSCF5041.JPG" alt="Projects" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0">Projects</h2>
          </div>
        </Link>
      </div>
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/blog">
          <img src="/img/thumb - snow_1.59.1.png" alt="Blog" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0">Blog</h2>
          </div>
        </Link>
      </div>
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/about">
          <img src="/img/lost hair.webp" alt="About Me" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0">About Me</h2>
          </div>
        </Link>
      </div>
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/contact" className="block absolute inset-0">
          {hasFirestoreCover && fallowCover ? (
            <CoverImageWithFallback
              thumbnailSrc={fallowCover.thumbnail}
              primarySrc={fallowCover.full}
              alt={FALLOW_TITLE}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : fallowResolved ? (
            <img
              src={CONTACT_FALLBACK_SRC}
              alt={FALLOW_TITLE}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 via-neutral-800 to-neutral-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8 pointer-events-none">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0 text-center">Contact Me</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
