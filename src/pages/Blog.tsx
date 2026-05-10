import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getDb, firebaseConfigured } from '../lib/firebase';
import type { BlogPost } from '../types/index';
import { Link } from 'react-router-dom';
import { CoverImageWithFallback } from '../components/CoverImageWithFallback';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) return;

    const fetchPosts = async () => {
      try {
        const q = query(
          collection(getDb(), 'posts'), 
          orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs
          .map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data(),
          } as BlogPost))
          .filter((post) => post.status === 'published');
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (!firebaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-6 text-center">Blog</h1>
        <p className="text-center text-gray-600 leading-relaxed">
          Posts are not loading because Firebase was not configured for this deployment. In Vercel (or your host), open{' '}
          <strong>Project → Settings → Environment Variables</strong> and add the same{' '}
          <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">VITE_FIREBASE_*</code> values you use locally, then{' '}
          <strong>redeploy</strong>.
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center text-gray-400">
      Loading blog...
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-12 text-center">Blog</h1>
      <div className="space-y-16">
        {posts.map((post, index) => {
          const hasCover =
            (typeof post.coverImage === 'string' && post.coverImage.trim() !== '') ||
            (typeof post.coverImageThumbnail === 'string' && post.coverImageThumbnail.trim() !== '');

          return (
          <article key={post.id} className="flex flex-col md:flex-row gap-8 items-start group">
            {hasCover && (
              <div className="w-full md:w-48 aspect-square overflow-hidden rounded-xl bg-gray-50 flex-shrink-0 relative">
                <Link to={`/blog/${post.id}`}>
                  <CoverImageWithFallback
                    thumbnailSrc={post.coverImageThumbnail}
                    primarySrc={post.coverImage}
                    alt={post.title}
                    width={448}
                    height={448}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    fetchPriority={index === 0 ? 'high' : undefined}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </Link>
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-2xl font-serif mb-2 group-hover:underline decoration-brand-red">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
              <p className="text-sm text-gray-400 italic">
                {post.publishedAt?.toDate ? post.publishedAt.toDate().toLocaleDateString('en-AU', { 
                  day: '2-digit', month: '2-digit', year: 'numeric' 
                }) : 'Date unavailable'}
              </p>
            </div>
          </article>
        );
        })}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 italic">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
