import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../api/axiosInstance';

function EditTaskPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequencyValue: 1,
    frequencyUnit: 'days'
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the activity data when component mounts
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get(`/activities/${id}`);
        const activity = response.data.activity;
        setFormData({
          name: activity.name || '',
          description: activity.description || '',
          frequencyValue: activity.frequencyValue || 1,
          frequencyUnit: activity.frequencyUnit || 'days'
        });
      } catch (error) {
        console.error('Error fetching activity:', error);
        setError('Failed to load task data');
      } finally {
        setFetchLoading(false);
      }
    };

    if (id) {
      fetchActivity();
    }
  }, [id]);

  const getMaxValue = (unit) => {
    switch (unit) {
      case 'hours': return 8760;
      case 'days': return 366;
      case 'weeks': return 52;
      case 'months': return 12;
      case 'years': return 1;
      default: return 365;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If changing to years, set value to 1
    if (name === 'frequencyUnit' && value === 'years') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        frequencyValue: 1
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Auto-resize textarea
    if (e.target.tagName === 'TEXTAREA') {
      e.target.style.height = 'auto';
      e.target.style.height = e.target.scrollHeight + 'px';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Task name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.put(`/activities/${id}`, formData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating activity:', error);
      setError(error.response?.data?.message || 'Failed to update task');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (fetchLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: 'white', fontSize: '18px' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      padding: '20px'
    }}>
      {/* Back Button */}
      <button
        onClick={handleBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '40px',
          padding: '10px 0'
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15,18 9,12 15,6"></polyline>
        </svg>
        Back
      </button>

      {/* Main Form Container */}
      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        background: '#2a2a2a',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
      }}>
        <form onSubmit={handleSubmit}>
          {/* Task Name */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              TASK NAME
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter task name..."
              value={formData.name}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b45ff';
                e.target.style.boxShadow = '0 0 0 2px rgba(139, 69, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#404040';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Task Description */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              TASK DESCRIPTION
            </label>
            <textarea
              name="description"
              placeholder="Enter task description..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: '#1a1a1a',
                border: '1px solid #404040',
                borderRadius: '12px',
                color: 'white',
                fontSize: '14px',
                outline: 'none',
                resize: 'none',
                minHeight: '100px',
                transition: 'all 0.3s ease',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#8b45ff';
                e.target.style.boxShadow = '0 0 0 2px rgba(139, 69, 255, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#404040';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Task Frequency */}
          <div style={{ marginBottom: '40px' }}>
            <label style={{
              display: 'block',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              letterSpacing: '0.5px'
            }}>
              TASK FREQUENCY
            </label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input
                type="number"
                name="frequencyValue"
                placeholder="1"
                min="1"
                max={getMaxValue(formData.frequencyUnit)}
                value={formData.frequencyValue}
                onChange={handleInputChange}
                style={{
                  flex: '1',
                  padding: '16px 20px',
                  background: '#1a1a1a',
                  border: '1px solid #404040',
                  borderRadius: '12px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  fontFamily: 'inherit'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#8b45ff';
                  e.target.style.boxShadow = '0 0 0 2px rgba(139, 69, 255, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#404040';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ position: 'relative', flex: '2' }}>
                <select
                  name="frequencyUnit"
                  value={formData.frequencyUnit}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    background: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '14px',
                    outline: 'none',
                    cursor: 'pointer',
                    appearance: 'none',
                    fontFamily: 'inherit'
                  }}
                >
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Year</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#6b7280'
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              border: 'none',
              background: '#8b45ff',
              color: 'white',
              fontSize: '24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.boxShadow = '0 0 20px rgba(139, 69, 255, 0.5)';
                e.target.style.background = '#9d5aff';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.boxShadow = 'none';
                e.target.style.background = '#8b45ff';
              }
            }}
          >
            {loading ? '...' : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20,6 9,17 4,12"></polyline>
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditTaskPage;
