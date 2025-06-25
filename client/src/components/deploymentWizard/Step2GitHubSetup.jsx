import React, { useState } from 'react';
import GitHubHelpModal from '../modals/GitHubHelpModal';

function Step2GitHubSetup({ data, update, next, prev }) {
  const [error, setError] = useState('');
  const [showGitHubHelp, setShowGitHubHelp] = useState(false);

  const handleNext = (e) => {
    e.preventDefault();
    if (!data.github_repo || !data.github_pat || !data.stack) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    next();
  };

  const addEnvVar = () => {
    update({ env_variables: [...data.env_variables, { key: '', value: '' }] });
  };

  const removeEnvVar = (index) => {
    update({ env_variables: data.env_variables.filter((_, i) => i !== index) });
  };

  const updateEnvVar = (index, field, value) => {
    const newVars = data.env_variables.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    update({ env_variables: newVars });
  };

  return (
    <form onSubmit={handleNext}>
      <h3>GitHub Setup</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <label>GitHub Repository (owner/repo):</label>
        <input
          type="text"
          value={data.github_repo}
          onChange={e => update({ github_repo: e.target.value })}
          placeholder="username/repository"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          required
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>GitHub Personal Access Token:</label>
        <input
          type="password"
          value={data.github_pat}
          onChange={e => update({ github_pat: e.target.value })}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          required
        />
        <button 
          type="button"
          onClick={() => setShowGitHubHelp(true)}
          style={{ 
            marginTop: '5px',
            padding: '4px 8px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Need help creating PAT?
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Stack:</label>
        <select
          value={data.stack}
          onChange={e => update({ stack: e.target.value })}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          required
        >
          <option value="">Select your application stack</option>
          <option value="flask">Flask (Python)</option>
          <option value="nodejs">Node.js</option>
          <option value="django">Django (Python)</option>
          <option value="react">React (Node.js)</option>
          <option value="express">Express.js (Node.js)</option>
          <option value="fastapi">FastAPI (Python)</option>
          <option value="spring">Spring Boot (Java)</option>
          <option value="dotnet">ASP.NET Core (.NET)</option>
        </select>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Environment Variables:</label>
        {data.env_variables.map((env, index) => (
          <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Key"
              value={env.key}
              onChange={e => updateEnvVar(index, 'key', e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            <input
              type="text"
              placeholder="Value"
              value={env.value}
              onChange={e => updateEnvVar(index, 'value', e.target.value)}
              style={{ flex: 1, padding: '8px' }}
            />
            {data.env_variables.length > 1 && (
              <button 
                type="button"
                onClick={() => removeEnvVar(index)}
                style={{ 
                  padding: '8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button 
          type="button"
          onClick={addEnvVar}
          style={{ 
            padding: '6px 12px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          + Add Variable
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '8px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
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
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Continue →
        </button>
      </div>

      <GitHubHelpModal 
        isOpen={showGitHubHelp}
        onClose={() => setShowGitHubHelp(false)}
      />
    </form>
  );
}

export default Step2GitHubSetup;