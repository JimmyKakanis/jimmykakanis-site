import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, 
  getDoc, query, orderBy, Timestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { BlogPost } from '../../types/index';
import Editor from '../Editor';
import { Plus, Pencil, Trash2, ArrowLeft, Save } from 'lucide-react';
import { uploadImage } from '../../lib/upload';

const PostList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      setPosts(postsData);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deleteDoc(doc(db, 'posts', id));
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  if (loading) return <div>Loading posts...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={() => navigate('new')}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 italic py-8 text-center border-2 border-dashed rounded-xl">No posts yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
              <div>
                <h3 className="font-bold text-lg">{post.title}</h3>
                <p className="text-sm text-gray-500">
                  {post.publishedAt?.toDate ? post.publishedAt.toDate().toLocaleDateString() : 'Draft'}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`edit/${post.id}`)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => post.id && handleDelete(post.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PostEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as BlogPost;
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content);
          setExcerpt(data.excerpt);
          setCoverImage(data.coverImage || null);
        }
        setLoading(false);
      };
      fetchPost();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file, 'blog-covers');
        setCoverImage(url);
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const postData = {
      title,
      slug: slug || title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      content,
      excerpt,
      coverImage,
      updatedAt: Timestamp.now(),
    };

    try {
      if (id) {
        await updateDoc(doc(db, 'posts', id), postData);
      } else {
        await addDoc(collection(db, 'posts'), {
          ...postData,
          publishedAt: Timestamp.now(),
          tags: [],
        });
      }
      navigate('/admin/posts');
    } catch (err) {
      console.error('Error saving post:', err);
      alert('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading editor...</div>;

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={() => navigate('/admin/posts')}
          className="text-gray-500 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to posts
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-red text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-red-hover transition-colors disabled:bg-gray-400"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Post'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
            placeholder="Enter post title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Slug (URL)</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
            placeholder="post-url-slug"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
            rows={2}
            placeholder="Brief summary of the post"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Cover Image</label>
          <div className="flex items-center gap-4">
            {coverImage && (
              <img src={coverImage} alt="Cover preview" className="w-24 h-24 object-cover rounded-lg" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Content</label>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </form>
  );
};

const PostManager = () => {
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/new" element={<PostEditor />} />
      <Route path="/edit/:id" element={<PostEditor />} />
    </Routes>
  );
};

export default PostManager;

