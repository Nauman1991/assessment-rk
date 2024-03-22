import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

function MyApp({ Component, pageProps }) {
  const [notifications, setNotifications]: any[] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:3001');
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('notification', (data) => {
      setNotifications([...notifications, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [notifications]);

  return (
    <div>
      <h1>Real-time Notifications Example</h1>
      <Component {...pageProps} />
      <div>
        <h2>Notifications</h2>
        <ul>
          {notifications.map((notification: any, index: any) => (
            <li key={index}>{notification.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyApp;
