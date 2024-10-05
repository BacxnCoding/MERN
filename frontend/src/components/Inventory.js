import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Shop from './Shop';
import NationInfo from './NationInfo';
import axios from 'axios';  // For fetching user and nation data

const Inventory = () => {
  const { user, setUser } = useContext(UserContext);
  const [nation, setNation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's specific nation data by ID
    const fetchNationData = async () => {
      try {
        if (user && user.nation_id) {
          const response = await axios.get(`http://localhost:5000/api/nations/${user.nation_id}`);
          console.log('Fetched nation data:', response.data);
          setNation(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nation data:', error);
        setLoading(false);
      }
    };

    // Call the fetch function
    fetchNationData();

    // Set up WebSocket connection for real-time updates
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      switch (message.type) {
        case 'user-update':
          if (message.user._id === user._id) {  // Update only if the user's ID matches
            console.log('Handling user update:', message.user);
            setUser(message.user);  // Update the user state with real-time data
          }
          break;

        case 'nation-update':
          if (message.nation._id === user.nation_id) {  // Update only if the nation's ID matches the user's nation
            console.log('Handling nation update:', message.nation);
            setNation(message.nation);  // Update the nation state with real-time data
          }
          break;

        default:
          break;
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      console.log('WebSocket disconnected');
      socket.close();
    };
  }, [user, setUser]);

  return (
    <div>
      <h2>Welcome, {user?.username}</h2>
      <p>Your bank account: ${user?.bankAccount}</p>

      {/* Conditionally render based on loading state and nation data availability */}
      {loading ? (
        <p>Loading nation info...</p>
      ) : nation ? (
        <NationInfo nation={nation} user={user} />
      ) : (
        <p>No nation data available.</p>
      )}

      <h3>Inventory</h3>
      <ul>
        {user?.items?.length > 0 ? (
          user.items.map((item, index) => (
            <li key={index}>{item.itemName} (x{item.quantity})</li>
          ))
        ) : (
          <li>No items in inventory</li>
        )}
      </ul>

      <Shop user={user} />
    </div>
  );
};

export default Inventory;
