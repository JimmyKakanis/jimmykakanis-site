import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { 
  collection, getDocs, addDoc, updateDoc, deleteDoc, doc, 
  getDoc, query, orderBy 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Project } from '../../types/index';
import { Plus, Pencil, Trash2, ArrowLeft, Save, GripVertical } from 'lucide-react';
import { uploadImage } from '../../lib/upload';

const ProjectList = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <button
          onClick={() => navigate('new')}
          className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
        >
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <p className="text-gray-500 italic py-8 text-center border-2 border-dashed rounded-xl">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <GripVertical className="text-gray-300" />
                <img src={project.image} alt={project.title} className="w-12 h-12 object-cover rounded" />
                <div>
                  <h3 className="font-bold">{project.title}</h3>
                  <p className="text-xs text-gray-500 truncate max-w-xs">{project.description}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`edit/${project.id}`)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => project.id && handleDelete(project.id)}
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

const ProjectEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(id ? true : false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [link, setLink] = useState('');
  const [order, setOrder] = useState(0);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Project;
          setTitle(data.title);
          setDescription(data.description);
          setLink(data.link);
          setOrder(data.order);
          setImage(data.image);
        }
        setLoading(false);
      };
      fetchProject();
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadImage(file, 'projects');
        setImage(url);
      } catch (err) {
        console.error('Error uploading image:', err);
        alert('Failed to upload image');
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert('Please upload an image first');
      return;
    }
    setSaving(true);

    const projectData = {
      title,
      description,
      link,
      order,
      image,
    };

    try {
      if (id) {
        await updateDoc(doc(db, 'projects', id), projectData);
      } else {
        await addDoc(collection(db, 'projects'), projectData);
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Failed to save project');
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
          onClick={() => navigate('/admin/projects')}
          className="text-gray-500 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to projects
        </button>
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-red text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-red-hover transition-colors disabled:bg-gray-400"
        >
          <Save size={18} /> {saving ? 'Saving...' : 'Save Project'}
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
            placeholder="Enter project name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
            rows={3}
            placeholder="What is this project about?"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Link URL</label>
            <input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
              placeholder="https://..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Order</label>
            <input
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-red/20 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-600 uppercase">Image</label>
          <div className="flex items-center gap-4">
            {image && (
              <img src={image} alt="Project preview" className="w-24 h-24 object-cover rounded-lg" />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="text-sm"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const ProjectManager = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectList />} />
      <Route path="/new" element={<ProjectEditor />} />
      <Route path="/edit/:id" element={<ProjectEditor />} />
    </Routes>
  );
};

export default ProjectManager;

