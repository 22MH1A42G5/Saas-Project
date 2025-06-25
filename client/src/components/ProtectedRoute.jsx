import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  // TEMPORARY: Allow access for testing (remove this when backend is ready)
  return children;

  // ORIGINAL CODE (uncomment when backend is ready):
  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }
  // return children;
}

export default ProtectedRoute;