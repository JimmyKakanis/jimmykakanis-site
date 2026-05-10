import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { firebaseConfigured } from '../lib/firebase';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (!firebaseConfigured) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center text-gray-600">
        <p className="max-w-md mb-4">Admin requires Firebase. Add VITE_FIREBASE_* environment variables to this deployment and redeploy.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

