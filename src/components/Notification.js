import React, { useEffect } from 'react';

const Notification = ({ notification, onClose }) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return 'check_circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <div className={`notification ${notification.type}`}>
      <div className="notification-content">
        <span className="material-icons-outlined notification-icon">
          {getIcon(notification.type)}
        </span>
        <span className="notification-message">{notification.message}</span>
        <button className="notification-close" onClick={onClose}>
          <span className="material-icons-outlined">close</span>
        </button>
      </div>
    </div>
  );
};

export default Notification;