import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import ActivityCard from '../components/ActivityCard';
import AddActivityForm from '../components/AddActivityForm';

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch activities from the backend
  const fetchActivities = async () => {
    try {
      const response = await axios.get('/activities');
      setActivities(response.data.activities); // Adjust if your response is different
      setLoading(false);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setLoading(false);
    }
  };

  // Load on first render
  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Dashboard</h1>
      <AddActivityForm onAdd={fetchActivities} />

      {loading ? (
        <p>Loading activities...</p>
      ) : activities.length === 0 ? (
        <p>No activities yet. Add your first one!</p>
      ) : (
        activities.map((activity) => (
          <ActivityCard
            key={activity._id}
            activity={activity}
            onUpdate={fetchActivities}
          />
        ))
      )}
    </div>
  );
}

export default Dashboard;
