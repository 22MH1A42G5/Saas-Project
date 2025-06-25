import React, { useState } from 'react';
import Step1AWSSetup from '../components/deploymentWizard/Step1AWSSetup';
import Step2GitHubSetup from '../components/deploymentWizard/Step2GitHubSetup';
import Step3Review from '../components/deploymentWizard/Step3Review';

const steps = [
  'AWS Setup',
  'GitHub Setup', 
  'Review & Submit'
];

function NewDeploymentPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    aws_arn: '',
    external_id: '',
    github_repo: '',
    github_pat: '',
    stack: '',
    env_variables: [{ key: '', value: '' }]
  });

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #eee', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>New Deployment Wizard</h2>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 32 }}>
        {steps.map((label, idx) => (
          <div key={label} style={{ 
            flex: 1, 
            textAlign: 'center', 
            color: idx === activeStep ? '#007bff' : '#aaa', 
            fontWeight: idx === activeStep ? 'bold' : 'normal',
            fontSize: '14px'
          }}>
            {label}
            {idx < steps.length - 1 && <span style={{ margin: '0 8px' }}>→</span>}
          </div>
        ))}
      </div>

      {activeStep === 0 && (
        <Step1AWSSetup 
          data={formData} 
          update={updateFormData} 
          next={nextStep} 
        />
      )}
      {activeStep === 1 && (
        <Step2GitHubSetup 
          data={formData} 
          update={updateFormData} 
          next={nextStep} 
          prev={prevStep} 
        />
      )}
      {activeStep === 2 && (
        <Step3Review 
          data={formData} 
          prev={prevStep} 
        />
      )}
    </div>
  );
}

export default NewDeploymentPage;