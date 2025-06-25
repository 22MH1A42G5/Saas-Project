import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import deploymentService from '../services/deploymentService';
import DeploymentCard from '../components/DeploymentCard';

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDeployments();
  }, []);

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const data = await deploymentService.getDeployments();
      setDeployments(data);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch deployments');
      // If it's an authentication error, redirect to login
      if (err.message?.includes('unauthorized') || err.message?.includes('token')) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeployment = async (deploymentId) => {
    if (window.confirm('Are you sure you want to delete this deployment? This will destroy all associated infrastructure.')) {
      try {
        await deploymentService.deleteDeployment(deploymentId);
        // Refresh the deployments list
        fetchDeployments();
      } catch (err) {
        setError(err.message || 'Failed to delete deployment');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleNewDeployment = () => {
    navigate('/new-deployment');
  };

  const refreshDeployments = () => {
    fetchDeployments();
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1>Dashboard</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={refreshDeployments}
            disabled={loading}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#17a2b8', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button 
            onClick={handleNewDeployment}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            New Deployment
          </button>
          <button 
            onClick={handleLogout}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        border: '1px solid #dee2e6',
        marginBottom: '30px'
      }}>
        <h2>Welcome to your Dashboard!</h2>
        <p>Manage your deployments and monitor their status.</p>
        <p style={{ color: '#6c757d', fontSize: '14px' }}>
          <strong>Note:</strong> This is connected to the backend API. 
          Real deployments will be created and managed here.
        </p>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#f8d7da', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      <div>
        <h3>Your Deployments ({deployments.length})</h3>
        
        {loading ? (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '200px' 
          }}>
            Loading deployments...
          </div>
        ) : deployments.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #dee2e6'
          }}>
            <h4>No deployments yet</h4>
            <p>Create your first deployment to get started!</p>
            <button 
              onClick={handleNewDeployment}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#007bff', 
                color: 'white', 
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Create Deployment
            </button>
          </div>
        ) : (
          <div>
            {deployments.map(deployment => (
              <DeploymentCard
                key={deployment._id}
                deployment={deployment}
                onDelete={handleDeleteDeployment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;