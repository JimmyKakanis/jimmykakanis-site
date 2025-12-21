import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import PostManager from '../components/admin/PostManager';
import ProjectManager from '../components/admin/ProjectManager';
import Migration from '../components/admin/Migration';
import { FileText, FolderRoot, LogOut, LayoutDashboard, Database } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { label: 'Posts', path: '/admin/posts', icon: FileText },
    { label: 'Projects', path: '/admin/projects', icon: FolderRoot },
    { label: 'Migration', path: '/admin/migration', icon: Database },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-2">
          <div className="flex items-center gap-2 px-4 py-3 mb-4 bg-gray-50 rounded-xl">
            <LayoutDashboard size={20} className="text-gray-400" />
            <span className="font-bold text-gray-700">Admin Panel</span>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-medium",
                    isActive 
                      ? "bg-black text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all font-medium mt-8"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <main className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm min-h-[600px]">
          <Routes>
            <Route path="/" element={<div className="flex flex-col items-center justify-center h-full text-gray-400">
              <LayoutDashboard size={48} className="mb-4 opacity-20" />
              <p>Select a section to manage content</p>
            </div>} />
            <Route path="/posts/*" element={<PostManager />} />
            <Route path="/projects/*" element={<ProjectManager />} />
            <Route path="/migration" element={<Migration />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Admin;
