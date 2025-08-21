import React, { useState } from 'react';
import axios from '../api/axiosInstance';

function TestConnection() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testBackendConnection = async () => {
    setLoading(true);
    try {
      // Test the health endpoint
      const response = await axios.get('/health');
      setResult(`✅ Backend connected! Response: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error) {
      setResult(`❌ Backend connection failed: ${error.message}\nStatus: ${error.response?.status}\nData: ${JSON.stringify(error.response?.data, null, 2)}`);
      console.error('Connection test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    try {
      const testData = {
        email: 'test@example.com',
        password: 'test123456'
      };
      const response = await axios.post('/auth/signup', testData);
      setResult(`✅ Signup test successful! Token received: ${response.data.token ? 'Yes' : 'No'}`);
    } catch (error) {
      setResult(`❌ Signup test failed: ${error.response?.data?.message || error.message}`);
      console.error('Signup test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Connection Test Page</h2>
      <p>Use this page to test the connection between frontend and backend.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testBackendConnection}
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Backend Connection
        </button>
        
        <button 
          onClick={testSignup}
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Test Signup Endpoint
        </button>
      </div>

      {loading && <p>Testing...</p>}
      
      {result && (
        <div style={{ 
          padding: '15px', 
          backgroundColor: result.includes('✅') ? '#d4edda' : '#f8d7da',
          border: `1px solid ${result.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
          borderRadius: '4px',
          marginTop: '20px'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{result}</pre>
        </div>
      )}

      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>Debug Info:</h4>
        <p><strong>API Base URL:</strong> {process.env.REACT_APP_API_URL || 'https://time-since-i.onrender.com/api'}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
}

export default TestConnection;
