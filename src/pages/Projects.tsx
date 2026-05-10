import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { getDb, firebaseConfigured } from '../lib/firebase';
import type { Project } from '../types/index';
import { getExternalProjectUrl } from '../lib/projectLinks';

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) return;

    const fetchProjects = async () => {
      try {
        const q = query(
          collection(getDb(), 'projects'), 
          orderBy('order', 'asc')
        );
        const querySnapshot = await getDocs(q);
        const projectsData = querySnapshot.docs
          .map((snap) => ({
            id: snap.id,
            ...snap.data(),
          } as Project))
          .filter((project) => project.status === 'published' && !!project.id);
        setProjects(projectsData);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (!firebaseConfigured) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-serif mb-6 text-center">Projects</h1>
        <p className="text-center text-gray-600 leading-relaxed">
          Projects are not loading because Firebase was not configured for this deployment. Add your{' '}
          <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">VITE_FIREBASE_*</code> variables in your host&apos;s environment settings and redeploy.
        </p>
      </div>
    );
  }

  if (loading) return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center text-gray-400 font-serif">
      Loading projects...
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-12 text-center">Projects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => {
          const external = getExternalProjectUrl(project.link);
          const cardClass =
            'group block bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1';
          const inner = (
            <>
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={project.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-brand-red transition-colors">{project.title}</h3>
                <div
                  className="text-gray-600 text-sm leading-relaxed line-clamp-3 prose prose-sm max-w-none [&_p]:my-1 [&_*]:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: project.description || '' }}
                />
              </div>
            </>
          );

          return external ? (
            <a
              key={project.id}
              href={external}
              target="_blank"
              rel="noopener noreferrer"
              className={cardClass}
              aria-label={`${project.title} (opens in a new tab)`}
            >
              {inner}
            </a>
          ) : (
            <Link key={project.id} to={`/projects/${project.id}`} className={cardClass}>
              {inner}
            </Link>
          );
        })}
        {projects.length === 0 && (
          <p className="col-span-full text-center text-gray-500 italic">No projects added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
