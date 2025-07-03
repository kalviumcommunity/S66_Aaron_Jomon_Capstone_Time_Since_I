import React from 'react';
import axios from '../api/axiosInstance';

function ConfirmDeleteDialog({ activityId, onClose, onDelete }) {
  const handleDelete = async () => {
    try {
      await axios.delete(`/activities/${activityId}`);
      onClose();
      onDelete(); // Refresh list
    } catch (error) {
      console.error("Error deleting activity:", error);
    }
  };

  return (
    <div>
      <p>Are you sure you want to delete this activity?</p>
      <button onClick={handleDelete}>Yes, delete</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}

export default ConfirmDeleteDialog;
