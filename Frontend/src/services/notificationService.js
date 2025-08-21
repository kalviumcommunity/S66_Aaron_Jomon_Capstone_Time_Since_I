// Notification service for handling browser notifications
class NotificationService {
  constructor() {
    this.permission = Notification.permission;
    this.notifiedTasks = new Set(); // Track which tasks we've already notified about
  }

  // Request permission for notifications
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    }

    return false;
  }

  // Check if a task is overdue
  isTaskOverdue(activity) {
    if (!activity.lastDone) {
      return false; // New tasks aren't overdue
    }

    const now = new Date();
    const lastDoneDate = new Date(activity.lastDone);
    const diffMs = now - lastDoneDate;

    // Convert frequency to milliseconds
    let frequencyMs;
    const { frequencyValue, frequencyUnit } = activity;

    switch (frequencyUnit) {
      case 'hours':
        frequencyMs = frequencyValue * 60 * 60 * 1000;
        break;
      case 'days':
        frequencyMs = frequencyValue * 24 * 60 * 60 * 1000;
        break;
      case 'weeks':
        frequencyMs = frequencyValue * 7 * 24 * 60 * 60 * 1000;
        break;
      case 'months':
        frequencyMs = frequencyValue * 30 * 24 * 60 * 60 * 1000;
        break;
      case 'years':
        frequencyMs = frequencyValue * 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        frequencyMs = 24 * 60 * 60 * 1000; // Default to 1 day
    }

    return diffMs >= frequencyMs;
  }

  // Send notification for overdue task
  sendTaskDueNotification(activity) {
    if (this.permission !== 'granted') {
      return;
    }

    const taskId = activity._id;
    
    // Don't send duplicate notifications for the same task
    if (this.notifiedTasks.has(taskId)) {
      return;
    }

    const notification = new Notification(`${activity.name} is due!`, {
      body: `It's time to complete "${activity.name}". Click to open the app.`,
      icon: '/favicontsi.ico',
      badge: '/favicontsi.ico',
      tag: `task-due-${taskId}`, // Prevents duplicate notifications
      requireInteraction: true, // Keeps notification visible until user interacts
      actions: [
        {
          action: 'mark-done',
          title: 'Mark as Done'
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });

    // Handle notification click
    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Mark this task as notified
    this.notifiedTasks.add(taskId);

    // Remove from notified set after 1 hour to allow re-notification
    setTimeout(() => {
      this.notifiedTasks.delete(taskId);
    }, 60 * 60 * 1000);

    return notification;
  }

  // Check all activities and send notifications for overdue ones
  checkAndNotifyOverdueTasks(activities) {
    if (this.permission !== 'granted') {
      return;
    }

    activities.forEach(activity => {
      if (this.isTaskOverdue(activity)) {
        this.sendTaskDueNotification(activity);
      }
    });
  }

  // Clear notification tracking for a task (when marked as done)
  clearTaskNotification(taskId) {
    this.notifiedTasks.delete(taskId);
  }

  // Get notification permission status
  getPermissionStatus() {
    return this.permission;
  }
}

// Create and export a singleton instance
const notificationService = new NotificationService();
export default notificationService;
