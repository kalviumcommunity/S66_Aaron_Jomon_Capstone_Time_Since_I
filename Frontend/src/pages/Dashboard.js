import React, { useEffect, useState, useCallback } from 'react';
import axios from '../api/axiosInstance';
import ActivityCard from '../components/ActivityCard';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';

function Dashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const navigate = useNavigate();

  // Fetch activities from the backend
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/activities');
      const activitiesData = response.data.activities || [];
      setActivities(activitiesData);
      setFilteredActivities(activitiesData);
      setError('');
    } catch (error) {
      console.error('Error fetching activities:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load activities');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');

    // Trigger auth change event
    window.dispatchEvent(new Event('authChange'));

    console.log('Logout successful, navigating to login');
    navigate('/login');
  };

  const handleMarkDone = async (activity) => {
    try {
      await axios.patch(`/activities/${activity._id}/done`);
      // Clear notification for this task since it's now completed
      notificationService.clearTaskNotification(activity._id);
      fetchActivities(); // Refresh the list
    } catch (error) {
      console.error('Error marking activity as done:', error);
      setError('Failed to mark activity as done');
    }
  };

  const handleDeleteActivity = async (activity) => {
    if (window.confirm(`Are you sure you want to delete "${activity.name}"?`)) {
      try {
        await axios.delete(`/activities/${activity._id}`);
        fetchActivities(); // Refresh the list
      } catch (error) {
        console.error('Error deleting activity:', error);
        setError('Failed to delete activity');
      }
    }
  };

  const handleEditActivity = (activity) => {
    navigate(`/edit-task/${activity._id}`);
  };

  const handleAddActivity = () => {
    navigate('/add-task');
  };

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setFilteredActivities(activities);
    } else {
      const filtered = activities.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.description && activity.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredActivities(filtered);
    }
  };

  // Initialize notifications on first render
  useEffect(() => {
    const initializeNotifications = async () => {
      const hasPermission = await notificationService.requestPermission();
      setNotificationsEnabled(hasPermission);
    };

    initializeNotifications();
    fetchActivities();
  }, [fetchActivities]);

  // Check for overdue tasks and send notifications
  useEffect(() => {
    if (notificationsEnabled && activities.length > 0) {
      try {
        notificationService.checkAndNotifyOverdueTasks(activities);
      } catch (error) {
        console.error('Error with notification service:', error);
      }
    }
  }, [activities, notificationsEnabled]);

  // Set up periodic notification checks (every 5 minutes)
  useEffect(() => {
    if (!notificationsEnabled) return;

    const interval = setInterval(() => {
      if (activities.length > 0) {
        try {
          notificationService.checkAndNotifyOverdueTasks(activities);
        } catch (error) {
          console.error('Error in periodic notification check:', error);
        }
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [activities, notificationsEnabled]);

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a0a',
      position: 'relative'
    }}>

      <Header
        onAddActivity={handleAddActivity}
        onSearch={handleSearch}
        onLogout={handleLogout}
      />

      {/* Notification Permission Banner */}
      {!notificationsEnabled && (
        <div style={{
          background: 'linear-gradient(135deg, #8b45ff 0%, #6b35cc 100%)',
          color: 'white',
          padding: '12px 40px',
          textAlign: 'center',
          fontSize: '14px',
          borderBottom: '1px solid #333'
        }}>
          <span style={{ marginRight: '15px' }}>
            🔔 Enable notifications to get alerts when your tasks are due!
          </span>
          <button
            onClick={async () => {
              const hasPermission = await notificationService.requestPermission();
              setNotificationsEnabled(hasPermission);
            }}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Enable Notifications
          </button>
        </div>
      )}

      <div style={{
        padding: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {error && (
          <div style={{
            backgroundColor: 'rgba(248, 215, 218, 0.9)',
            color: '#721c24',
            padding: '15px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'white',
            fontSize: '18px'
          }}>
            Loading activities...
          </div>
        ) : filteredActivities.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            color: 'white',
            fontSize: '18px'
          }}>
            {activities.length === 0 ?
              'No activities yet. Click the + button to add your first one!' :
              'No activities match your search.'
            }
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
            maxWidth: '1400px',
            margin: '0 auto'
          }}>
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity._id}
                activity={activity}
                onMarkDone={handleMarkDone}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        )}
      </div>


    </div>
  );
}

export default Dashboard;
