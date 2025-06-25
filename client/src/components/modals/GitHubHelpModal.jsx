import React from 'react';

function GitHubHelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '24px',
        borderRadius: '8px',
        maxWidth: '600px',
        maxHeight: '80vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>How to Create GitHub Personal Access Token</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 1: Go to GitHub Settings</h3>
          <ol>
            <li>Log in to your GitHub account</li>
            <li>Click your profile picture in the top-right corner</li>
            <li>Select "Settings" from the dropdown menu</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 2: Navigate to Developer Settings</h3>
          <ol>
            <li>Scroll down to the bottom of the left sidebar</li>
            <li>Click "Developer settings"</li>
            <li>Click "Personal access tokens"</li>
            <li>Click "Tokens (classic)"</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 3: Generate New Token</h3>
          <ol>
            <li>Click "Generate new token"</li>
            <li>Select "Generate new token (classic)"</li>
            <li>Give your token a descriptive name (e.g., "SaaS Deployment Engine")</li>
            <li>Set expiration as needed (recommended: 90 days)</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 4: Select Required Permissions</h3>
          <p><strong>Required Scopes:</strong></p>
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px',
            marginBottom: '10px'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#28a745' }}>✅ Required Permissions:</h4>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li><strong>repo</strong> - Full control of private repositories
                <ul>
                  <li>repo:status</li>
                  <li>repo_deployment</li>
                  <li>public_repo</li>
                  <li>repo:invite</li>
                  <li>security_events</li>
                </ul>
              </li>
              <li><strong>admin:repo_hook</strong> - Full control of repository hooks
                <ul>
                  <li>write:repo_hook</li>
                  <li>read:repo_hook</li>
                </ul>
              </li>
            </ul>
          </div>
          
          <div style={{ 
            backgroundColor: '#fff3cd', 
            padding: '15px', 
            borderRadius: '4px',
            border: '1px solid #ffeaa7'
          }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Important Notes:</h4>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              <li>These permissions allow the system to read your repository content and create webhooks</li>
              <li>The token will be used to push Dockerfile and buildspec.yml to your repository</li>
              <li>Keep your token secure and never share it publicly</li>
              <li>You can revoke this token anytime from GitHub settings</li>
            </ul>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 5: Generate and Copy Token</h3>
          <ol>
            <li>Scroll to the bottom and click "Generate token"</li>
            <li><strong>IMPORTANT:</strong> Copy the token immediately - you won't see it again!</li>
            <li>Paste the token in the form above</li>
          </ol>
        </div>

        <div style={{ 
          backgroundColor: '#d1ecf1', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #bee5eb'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#0c5460' }}>🔒 Security Best Practices:</h4>
          <ul style={{ margin: '0', paddingLeft: '20px' }}>
            <li>Use the minimum required permissions</li>
            <li>Set an appropriate expiration date</li>
            <li>Regularly rotate your tokens</li>
            <li>Never commit tokens to your repository</li>
          </ul>
        </div>

        <button 
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default GitHubHelpModal;