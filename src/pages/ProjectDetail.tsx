import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Project } from '../types/index';
import { ArrowLeft } from 'lucide-react';
import { getExternalProjectUrl } from '../lib/projectLinks';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const load = async () => {
      const snap = await getDoc(doc(db, 'projects', id));
      if (snap.exists()) {
        const data = snap.data() as Project;
        if (data.status === 'published') {
          setProject({ ...data, id: snap.id });
        } else setProject(null);
      } else {
        setProject(null);
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center text-gray-400 font-serif">Loading...</div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-serif mb-4">Project not found</h1>
        <Link to="/projects" className="text-blog-link underline hover:text-blog-link-hover">
          Back to projects
        </Link>
      </div>
    );
  }

  const ext = getExternalProjectUrl(project.link);

  return (
    <article className="max-w-2xl mx-auto px-6 py-12">
      <Link
        to="/projects"
        className="text-gray-400 hover:text-black transition-colors flex items-center gap-2 mb-8 group font-sans text-sm"
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" /> All projects
      </Link>

      {project.image?.trim() && (
        <img
          src={project.image.trim()}
          alt={project.title}
          className="w-full aspect-[2/1] object-cover rounded-2xl mb-8 shadow-sm"
          decoding="async"
          fetchPriority="high"
        />
      )}

      <header className="mb-10 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-5xl font-serif mb-4 leading-tight">{project.title}</h1>
        {ext && (
          <a
            href={ext}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blog-link underline hover:text-blog-link-hover font-sans"
          >
            Open external link
          </a>
        )}
      </header>

      <div
        className="blog-prose-content prose prose-lg prose-gray max-w-none
          prose-headings:font-serif prose-headings:font-bold prose-headings:text-black
          prose-a:text-blog-link prose-a:underline hover:prose-a:text-blog-link-hover
          prose-img:rounded-2xl prose-blockquote:border-brand-red prose-blockquote:font-serif"
        dangerouslySetInnerHTML={{ __html: project.description || '' }}
      />
    </article>
  );
};

export default ProjectDetail;
