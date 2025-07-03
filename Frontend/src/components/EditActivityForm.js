import React, { useState } from 'react';
import axios from '../api/axiosInstance';

function EditActivityForm({ activity, onClose, onUpdate }) {
  const [title, setTitle] = useState(activity.title);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/activities/${activity._id}`, { title });
      onClose();
      onUpdate();
    } catch (error) {
      console.error("Error updating activity:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />
      <button type="submit">Save</button>
      <button onClick={onClose}>Cancel</button>
    </form>
  );
}

export default EditActivityForm;
