import React, { useState } from 'react';
import GitHubHelpModal from '../modals/GitHubHelpModal';
import externalIdService from '../../services/externalIdService';

function Step2GitHubSetup({ data, update, next, prev }) {
  const [error, setError] = useState('');
  const [showGitHubHelp, setShowGitHubHelp] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnvVarChange = (idx, field, value) => {
    const newVars = [...data.env_variables];
    newVars[idx][field] = value;
    update({ env_variables: newVars });
  };

  const addEnvVar = () => {
    update({ env_variables: [...data.env_variables, { key: '', value: '' }] });
  };

  const removeEnvVar = (idx) => {
    update({ env_variables: data.env_variables.filter((_, i) => i !== idx) });
  };

  const handleNext = async (e) => {
    e.preventDefault();
    if (!data.github_repo || !data.github_pat || !data.stack) {
      setError('Please fill in all required fields');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await externalIdService.submitGitHub(
        data.deployment_id,
        data.github_repo,
        data.github_pat,
        data.stack,
        data.env_variables
      );
      next();
    } catch (err) {
      setError(err.message || 'Failed to save GitHub info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleNext}>
      <h3>GitHub Setup</h3>
      <div style={{ marginBottom: '20px' }}>
        <label>GitHub Repository URL:</label>
        <input
          type="text"
          value={data.github_repo}
          onChange={e => update({ github_repo: e.target.value })}
          placeholder="https://github.com/your-username/your-repo"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>GitHub Personal Access Token:</label>
        <input
          type="password"
          value={data.github_pat}
          onChange={e => update({ github_pat: e.target.value })}
          placeholder="Paste your GitHub PAT here"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
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
          Need help creating a PAT?
        </button>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Stack:</label>
        <select
          value={data.stack}
          onChange={e => update({ stack: e.target.value })}
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        >
          <option value="">Select stack</option>
          <option value="flask">Flask</option>
          <option value="node">Node.js</option>
          {/* Add more stacks as needed */}
        </select>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>Environment Variables:</label>
        {data.env_variables.map((env, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input
              type="text"
              placeholder="Key"
              value={env.key}
              onChange={e => handleEnvVarChange(idx, 'key', e.target.value)}
              style={{ flex: 1 }}
            />
            <input
              type="text"
              placeholder="Value"
              value={env.value}
              onChange={e => handleEnvVarChange(idx, 'value', e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              onClick={() => removeEnvVar(idx)}
              disabled={data.env_variables.length === 1}
              style={{
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: data.env_variables.length === 1 ? 'not-allowed' : 'pointer',
                fontSize: '12px',
                padding: '4px 8px'
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addEnvVar}
          style={{
            backgroundColor: '#17a2b8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            padding: '4px 8px'
          }}
        >
          Add Variable
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
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </div>
      <GitHubHelpModal isOpen={showGitHubHelp} onClose={() => setShowGitHubHelp(false)} />
    </form>
  );
}

export default Step2GitHubSetup;