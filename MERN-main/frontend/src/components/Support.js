import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Support = ({ user }) => {
  const [notificationSent, setNotificationSent] = useState(false);

  useEffect(() => {
    const script1 = document.createElement('script');
    script1.src = "https://cdn.botpress.cloud/webchat/v2/inject.js";
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = "https://mediafiles.botpress.cloud/99bdcd27-6dd2-4a89-8fa8-a75cfa249dd6/webchat/v2/config.js";
    script2.async = true;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  const handleCallCommander = async () => {
    if (!user) {
      alert('You need to be logged in to call a commander.');
      return;
    }

    try {
      const message = `${user.username} is requesting technical assistance through the "Call A Commander" button.`;
      await axios.post('http://localhost:5000/api/notify-admin', {
        message,
        user: user.username,
      });
      setNotificationSent(true);
      alert('A commander has been notified and will assist you shortly.');
    } catch (error) {
      console.error('Error notifying commander:', error);
      alert('An error occurred while notifying the commander. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Support</h2>
      <p>If you have any questions, feel free to ask our support bot below!</p>

      <div style={{ margin: '20px 0' }}>
        <button onClick={handleCallCommander} disabled={notificationSent}>
          Call A Commander
        </button>
        <p style={{ fontSize: '12px', color: 'red', marginTop: '5px' }}>
          Only call if technical help is needed.
        </p>
      </div>
    </div>
  );
};

export default Support;
