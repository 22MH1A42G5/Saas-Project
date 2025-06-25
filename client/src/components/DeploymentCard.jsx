import React from 'react';

function DeploymentCard({ deployment, onDelete }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'deployed':
        return '#28a745';
      case 'deploying':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      case 'deleting':
        return '#6c757d';
      default:
        return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: 'white',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '15px'
      }}>
        <div>
          <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>
            {deployment.github_repo || 'Unnamed Deployment'}
          </h3>
          <p style={{ margin: '0', color: '#6c757d', fontSize: '14px' }}>
            Stack: {deployment.stack || 'Unknown'}
          </p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span style={{
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: getStatusColor(deployment.status)
          }}>
            {deployment.status || 'Unknown'}
          </span>
          <button
            onClick={() => onDelete(deployment._id)}
            style={{
              padding: '4px 8px',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p style={{ margin: '5px 0', fontSize: '14px' }}>
          <strong>Created:</strong> {formatDate(deployment.created_at)}
        </p>
        {deployment.load_balancer_url && (
          <p style={{ margin: '5px 0', fontSize: '14px' }}>
            <strong>URL:</strong> 
            <a 
              href={deployment.load_balancer_url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: '#007bff', textDecoration: 'none', marginLeft: '5px' }}
            >
              {deployment.load_balancer_url}
            </a>
          </p>
        )}
      </div>

      {deployment.deployment_logs && deployment.deployment_logs.length > 0 && (
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          maxHeight: '100px',
          overflowY: 'auto'
        }}>
          <strong style={{ fontSize: '12px', color: '#6c757d' }}>Recent Logs:</strong>
          <div style={{ fontSize: '12px', marginTop: '5px' }}>
            {deployment.deployment_logs.slice(-3).map((log, index) => (
              <div key={index} style={{ marginBottom: '2px' }}>
                {log.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DeploymentCard;