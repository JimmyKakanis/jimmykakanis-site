import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance, firebaseConfigured } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(getAuthInstance(), email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  if (!firebaseConfigured) {
    return (
      <div className="max-w-md mx-auto px-6 py-24">
        <h1 className="text-3xl font-serif mb-6 text-center">Admin Login</h1>
        <p className="text-center text-gray-600 leading-relaxed">
          Login is disabled because Firebase environment variables are not set for this deployment. Add all{' '}
          <code className="text-sm bg-gray-100 px-1.5 py-0.5 rounded">VITE_FIREBASE_*</code> keys in your host (e.g. Vercel → Environment Variables), redeploy, then try again.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-24">
      <h1 className="text-3xl font-serif mb-8 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-6 p-8 border border-gray-100 rounded-2xl shadow-xl">
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-gray-400"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
