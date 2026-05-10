import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { getDb, firebaseConfigured } from '../lib/firebase';
import type { BlogPost } from '../types/index';
import { ArrowLeft } from 'lucide-react';

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) {
      setLoading(false);
      return;
    }
    if (id) {
      const fetchPost = async () => {
        const docRef = doc(getDb(), 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          if (data.status === 'published') {
            setPost(data);
          }
        }
        setLoading(false);
      };
      fetchPost();
    } else {
      setLoading(false);
    }
  }, [id]);

  if (!firebaseConfigured) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-gray-600">
        <p className="mb-6">This post cannot load because Firebase environment variables are missing on this deployment.</p>
        <Link to="/" className="text-brand-red hover:underline">Back home</Link>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center text-gray-400 font-serif">
      Loading story...
    </div>
  );

  if (!post) return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <h1 className="text-2xl font-serif mb-4">Post not found</h1>
      <Link to="/blog" className="text-brand-red hover:underline flex items-center justify-center gap-2">
        <ArrowLeft size={18} /> Back to blog
      </Link>
    </div>
  );

  return (
    <article className="max-w-2xl mx-auto px-6 py-12">
      <Link to="/blog" className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 mb-8 group">
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> Back to blog
      </Link>
      
      {post.coverImage && (
        <img src={post.coverImage} alt={post.title} className="w-full aspect-[2/1] object-cover rounded-2xl mb-8" decoding="async" fetchPriority="high" />
      )}

      <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">{post.title}</h1>
      <p className="text-gray-400 italic mb-12 border-b border-gray-100 pb-8">
        Posted on {post.publishedAt?.toDate().toLocaleDateString('en-AU', { 
          day: '2-digit', month: '2-digit', year: 'numeric' 
        })}
      </p>

      <div 
        className="blog-prose-content prose prose-lg prose-gray max-w-none 
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
          prose-a:text-blog-link prose-a:underline hover:prose-a:text-blog-link-hover
          prose-img:rounded-2xl prose-blockquote:border-brand-red prose-blockquote:font-serif"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
};

export default Post;
