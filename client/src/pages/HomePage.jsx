import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to SaaS Deployment Engine</h1>
      <p>Deploy your applications to AWS with ease</p>
      
      <div style={{ marginTop: '30px' }}>
        <Link 
          to="/login" 
          style={{ 
            margin: '0 10px', 
            padding: '10px 20px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Login
        </Link>
        <Link 
          to="/register" 
          style={{ 
            margin: '0 10px', 
            padding: '10px 20px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default HomePage;