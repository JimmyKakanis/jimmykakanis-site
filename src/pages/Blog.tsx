import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BlogPost } from '../types/index';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, 'posts'), 
          orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
          .filter((post: any) => post.status === 'published') as BlogPost[];
        setPosts(postsData);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-12 text-center text-gray-400">
      Loading blog...
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-12 text-center">Blog</h1>
      <div className="space-y-16">
        {posts.map((post) => (
          <article key={post.id} className="flex flex-col md:flex-row gap-8 items-start group">
            {post.coverImage && typeof post.coverImage === 'string' && post.coverImage.trim() !== '' && (
              <div className="w-full md:w-48 aspect-square overflow-hidden rounded-xl bg-gray-50 flex-shrink-0">
                <Link to={`/blog/${post.id}`}>
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
                    onError={(e) => {
                      // Fallback if image fails to load
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
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
        ))}
        {posts.length === 0 && (
          <p className="text-center text-gray-500 italic">No posts yet. Check back soon!</p>
        )}
      </div>
    </div>
  );
};

export default Blog;
