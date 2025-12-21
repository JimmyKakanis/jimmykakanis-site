import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { legacyPosts, legacyProjects } from '../../lib/migrationData';
import { Database, CheckCircle, AlertCircle } from 'lucide-react';

const Migration = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState('');

  const runMigration = async () => {
    if (!window.confirm('This will clear your existing dynamic posts/projects and import ALL legacy content. Continue?')) return;
    
    setStatus('running');
    try {
      console.log('Starting migration...');
      
      // Optional: Clear existing collections first for a clean migration
      setProgress('Clearing existing data...');
      const postsSnap = await getDocs(collection(db, 'posts'));
      for (const d of postsSnap.docs) await deleteDoc(doc(db, 'posts', d.id));
      
      const projectsSnap = await getDocs(collection(db, 'projects'));
      for (const d of projectsSnap.docs) await deleteDoc(doc(db, 'projects', d.id));

      // Migrate Posts
      setProgress('Migrating all 9 blog posts...');
      for (const post of legacyPosts) {
        console.log(`Migrating post: ${post.title}`);
        await addDoc(collection(db, 'posts'), {
          ...post,
          updatedAt: post.publishedAt,
          tags: []
        });
      }

      // Migrate Projects
      setProgress('Migrating all 5 projects...');
      for (const project of legacyProjects) {
        console.log(`Migrating project: ${project.title}`);
        await addDoc(collection(db, 'projects'), project);
      }
      console.log('Migration finished successfully');

      setStatus('success');
      setProgress('Migration completed successfully!');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setProgress(`Error: ${err.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 text-center">
      <Database size={48} className="mx-auto mb-4 text-gray-300" />
      <h2 className="text-2xl font-bold mb-2">Content Migration</h2>
      <p className="text-gray-500 mb-8">
        Import your existing blog posts and projects from the legacy static site into the new dynamic database.
      </p>

      {status === 'idle' && (
        <button
          onClick={runMigration}
          className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg"
        >
          Start Migration
        </button>
      )}

      {status === 'running' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="font-medium">{progress}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-6 bg-green-50 rounded-2xl flex flex-col items-center gap-2">
          <CheckCircle className="text-green-500" size={32} />
          <p className="text-green-800 font-bold">{progress}</p>
          <p className="text-green-600 text-sm">You can now view your content in the Posts and Projects sections.</p>
        </div>
      )}

      {status === 'error' && (
        <div className="p-6 bg-red-50 rounded-2xl flex flex-col items-center gap-2">
          <AlertCircle className="text-red-500" size={32} />
          <p className="text-red-800 font-bold">Migration Failed</p>
          <p className="text-red-600 text-sm">{progress}</p>
        </div>
      )}
    </div>
  );
};

export default Migration;

