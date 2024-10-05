import React from 'react';

function Notifications({ notifications, handleDismissNotification }) {
  return (
    <div>
      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.text}
            <button onClick={() => handleDismissNotification(notification.id)}>
              Dismiss
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notifications;
