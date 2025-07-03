// src/components/AddActivityForm.js
import React, { useState } from 'react';
import axios from '../api/axiosInstance';

function AddActivityForm({ onAdd }) {
  const [name, setName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await axios.post('/activities', { name });
      setName('');
      onAdd(); // Refresh the dashboard after successful add
    } catch (error) {
      console.error('Error adding activity:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '1rem' }}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter activity name"
        required
      />
      <button type="submit">Add</button>
    </form>
  );
}

export default AddActivityForm;
