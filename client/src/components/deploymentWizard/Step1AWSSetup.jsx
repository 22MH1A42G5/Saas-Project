import React, { useState, useEffect } from 'react';
import externalIdService from '../../services/externalIdService';
import AWSHelpModal from '../modals/AWSHelpModal';

function Step1AWSSetup({ data, update, next }) {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // Auto-generate external ID on component mount
  useEffect(() => {
    generateExternalId();
  }, []);

  const generateExternalId = async () => {
    try {
      setLoading(true);
      setError('');
      
      // TEMPORARY: Generate mock external ID for testing
      // const mockExternalId = 'ext_' + Math.random().toString(36).substr(2, 9);
      // update({ external_id: mockExternalId });

      // ORIGINAL CODE (uncomment when backend is ready):
      const externalId = await externalIdService.generateExternalId();
      update({ external_id: externalId });
      
    } catch (err) {
      setError(err.message || 'Failed to generate external ID');
    } finally {
      setLoading(false);
    }
  };

  const validateARN = async () => {
    if (!data.aws_arn) {
      setError('Please enter the AWS ARN');
      return;
    }

    try {
      setValidating(true);
      setError('');
      
      // TEMPORARY: Mock validation for testing
      // Simulate API call delay
      // await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation result
      // const isValid = data.aws_arn.includes('arn:aws:iam:');
      // if (!isValid) {
      //   setError('Invalid ARN format. Please check your ARN and try again.');
      //   return;
      // }

      // ORIGINAL CODE (uncomment when backend is ready):
      const isValid = await externalIdService.validateARN(data.aws_arn, data.external_id);
      if (!isValid) {
        setError('Invalid ARN or external ID. Please check your credentials.');
        return;
      }

      // If validation passes, proceed to next step
      next();
      
    } catch (err) {
      setError(err.message || 'Failed to validate ARN');
    } finally {
      setValidating(false);
    }
  };

  return (
    <div>
      <h3>AWS Setup</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <label>External ID (Auto-generated):</label>
        <input
          type="text"
          value={data.external_id}
          readOnly
          style={{ 
            width: '100%', 
            padding: '8px',
            marginTop: '5px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #dee2e6'
          }}
        />
        {loading && <small style={{ color: '#6c757d' }}>Generating external ID...</small>}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>AWS Role ARN:</label>
        <input
          type="text"
          value={data.aws_arn}
          onChange={e => update({ aws_arn: e.target.value })}
          placeholder="arn:aws:iam::123456789012:role/YourRoleName"
          style={{ width: '100%', padding: '8px', marginTop: '5px' }}
        />
        <button 
          type="button"
          onClick={() => setShowHelp(true)}
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
          Need help creating IAM role?
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '8px', backgroundColor: '#f8d7da', borderRadius: '4px' }}>
          {error}
        </div>
      )}

      <button 
        onClick={validateARN}
        disabled={validating || loading}
        style={{ 
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: validating || loading ? 'not-allowed' : 'pointer',
          opacity: validating || loading ? 0.6 : 1
        }}
      >
        {validating ? 'Validating...' : 'Validate & Continue'}
      </button>

      <AWSHelpModal 
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
        externalId={data.external_id}
      />
    </div>
  );
}

export default Step1AWSSetup;