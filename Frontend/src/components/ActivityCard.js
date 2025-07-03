// src/components/ActivityCard.js
import React from 'react';

function ActivityCard({ activity, onMarkDone, onEdit, onDelete }) {
  const { name, lastDone } = activity;

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
      <h3>{name}</h3>
      <p>Last done: {new Date(lastDone).toLocaleString()}</p>
      <button onClick={() => onMarkDone(activity)}>Mark as Done</button>
      <button onClick={() => onEdit(activity)}>Edit</button>
      <button onClick={() => onDelete(activity)}>Delete</button>
    </div>
  );
}

export default ActivityCard;
