import React, { useState } from 'react';
import axios from '../api/axiosInstance';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/auth/signup', {
        email: form.email,
        password: form.password
      });
      localStorage.setItem('token', res.data.token);

      // Trigger auth change event
      window.dispatchEvent(new Event('authChange'));

      console.log('Signup successful, navigating to dashboard');

      // Small delay to ensure state updates
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      console.error('Signup error:', err);
      console.error('Error response:', err.response);
      setError(err.response?.data?.message || 'Signup failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        background: '#2a2a2a',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <h2 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: '700'
        }}>
          TIME SINCE I...
        </h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            style={{
              padding: '16px 20px',
              fontSize: '16px',
              background: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '12px',
              color: 'white',
              outline: 'none'
            }}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            style={{
              padding: '16px 20px',
              fontSize: '16px',
              background: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '12px',
              color: 'white',
              outline: 'none'
            }}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            style={{
              padding: '16px 20px',
              fontSize: '16px',
              background: '#1a1a1a',
              border: '1px solid #404040',
              borderRadius: '12px',
              color: 'white',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '16px',
              fontSize: '16px',
              backgroundColor: '#8b45ff',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#9d5aff';
                e.target.style.boxShadow = '0 0 20px rgba(139, 69, 255, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#8b45ff';
                e.target.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          {error && <p style={{ color: '#ef4444', textAlign: 'center', fontSize: '14px' }}>{error}</p>}
          <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
            Already have an account? <Link to="/login" style={{ color: '#8b45ff', textDecoration: 'none' }}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;
