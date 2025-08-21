// src/components/AddActivityForm.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';

function AddActivityForm({ onAdd, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setLoading(true);
    setError('');
    try {
      await axios.post('/activities', formData);
      setFormData({ name: '', description: '', frequency: 'daily' });
      onAdd(); // Refresh the dashboard after successful add
    } catch (error) {
      console.error('Error adding activity:', error);
      setError('Failed to add activity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0', fontSize: '24px', color: '#333' }}>Add New Activity</h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#666',
              padding: '5px'
            }}
          >
            ×
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Activity name (e.g., 'Water plants')"
            required
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description (optional)"
          style={{ padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading || !formData.name.trim() ? 'not-allowed' : 'pointer',
              opacity: loading || !formData.name.trim() ? 0.6 : 1
            }}
          >
            {loading ? 'Adding...' : 'Add Activity'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 20px',
                fontSize: '16px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {error && <p style={{ color: 'red', margin: '0' }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddActivityForm;
