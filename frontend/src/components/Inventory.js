import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from './UserContext';
import Shop from './Shop';
import NationInfo from './NationInfo';
import axios from 'axios';  // For fetching nation data

const Inventory = () => {
  const { user, setUser } = useContext(UserContext);
  const [nation, setNation] = useState(null);
  const [loading, setLoading] = useState(true);  // State for tracking loading status

  useEffect(() => {
    // Fetch the user's specific nation data by ID when the component mounts
    const fetchNationData = async () => {
      try {
        if (user && user.nation_id) {  // Ensure the user and nation_id exist
          const response = await axios.get(`http://localhost:5000/api/nations/${user.nation_id}`);
          console.log('Fetched nation data:', response.data);  // Log the fetched nation data
          setNation(response.data);  // Set the specific nation data
        }
        setLoading(false);  // Stop loading when data is fetched
      } catch (error) {
        console.error('Error fetching nation data:', error);
        setLoading(false);  // Stop loading even if there's an error
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

    // Cleanup WebSocket connection on component unmount
    return () => {
      console.log('WebSocket disconnected');
      socket.close();
    };
  }, [user]);  // Dependency array includes `user` to trigger on changes

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

      {/* Shop component for purchasing */}
      <Shop user={user} />
    </div>
  );
};

export default Inventory;
