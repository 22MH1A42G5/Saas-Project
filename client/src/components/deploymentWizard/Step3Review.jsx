import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import deploymentService from '../../services/deploymentService';

function Step3Review({ data, prev }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    
    try {
      // Prepare the deployment data
      const deploymentData = {
        aws_arn: data.aws_arn,
        external_id: data.external_id,
        github_repo: data.github_repo,
        github_pat: data.github_pat,
        stack: data.stack,
        env_variables: data.env_variables.filter(env => env.key && env.value) // Only include non-empty env vars
      };

      // Call the backend API
      const response = await deploymentService.createDeployment(deploymentData);
      
      setSubmitted(true);
      
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to create deployment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ textAlign: 'center', padding: '32px' }}>
        <h3 style={{ color: '#28a745' }}>✅ Deployment Created Successfully!</h3>
        <p>Your deployment request has been submitted and is being processed.</p>
        <p>You will be redirected to your dashboard in a few seconds...</p>
        <div style={{ marginTop: '20px' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Go to Dashboard Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Review Your Deployment</h3>
      
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>AWS Configuration</h4>
        <p><strong>ARN:</strong> {data.aws_arn}</p>
        <p><strong>External ID:</strong> {data.external_id}</p>
        
        <h4>GitHub Configuration</h4>
        <p><strong>Repository:</strong> {data.github_repo}</p>
        <p><strong>Stack:</strong> {data.stack}</p>
        
        <h4>Environment Variables</h4>
        {data.env_variables.filter(env => env.key && env.value).length > 0 ? (
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {data.env_variables
              .filter(env => env.key && env.value)
              .map((env, index) => (
                <li key={index}>{env.key}: {env.value}</li>
              ))}
          </ul>
        ) : (
          <p style={{ color: '#6c757d' }}>No environment variables set</p>
        )}
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          marginBottom: '15px', 
          padding: '8px', 
          backgroundColor: '#f8d7da', 
          borderRadius: '4px' 
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          type="button"
          onClick={prev}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <button 
          type="submit"
          disabled={submitting}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1
          }}
        >
          {submitting ? 'Creating Deployment...' : 'Create Deployment'}
        </button>
      </div>
    </form>
  );
}

export default Step3Review;