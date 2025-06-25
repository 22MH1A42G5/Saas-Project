import React from 'react';

function AWSHelpModal({ isOpen, onClose, externalId }) {
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
          <h2>How to Create AWS IAM Role</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 1: Go to AWS IAM Console</h3>
          <p>Navigate to <a href="https://console.aws.amazon.com/iam/" target="_blank" rel="noopener noreferrer">AWS IAM Console</a></p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 2: Create a New Role</h3>
          <ol>
            <li>Click "Roles" in the left sidebar</li>
            <li>Click "Create role"</li>
            <li>Select "Another AWS account" as the trusted entity</li>
            <li>Enter your account ID</li>
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 3: Configure Trust Policy</h3>
          <p>Use this trust policy (replace with your account ID):</p>
          <pre style={{
            backgroundColor: '#f8f9fa',
            padding: '12px',
            borderRadius: '4px',
            overflowX: 'auto',
            fontSize: '12px'
          }}>
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR_ACCOUNT_ID:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "${externalId}"
        }
      }
    }
  ]
}`}
          </pre>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 4: Attach Permissions</h3>
          <p>Attach these policies to your role:</p>
          <ul>
            <li>AmazonEC2FullAccess</li>
            <li>AmazonECSFullAccess</li>
            <li>AmazonECRFullAccess</li>
            <li>IAMFullAccess</li>
            <li>CloudWatchFullAccess</li>
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Step 5: Get the Role ARN</h3>
          <p>After creating the role, copy the Role ARN and paste it in the form above.</p>
          <p><strong>Your External ID:</strong> <code style={{ backgroundColor: '#e9ecef', padding: '4px 8px', borderRadius: '4px' }}>{externalId}</code></p>
        </div>

        <button 
          onClick={onClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default AWSHelpModal;