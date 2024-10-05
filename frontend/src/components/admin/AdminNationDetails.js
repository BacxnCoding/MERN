import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NationInfo from '../NationInfo';  // Import the NationInfo component
import { UserContext } from '../UserContext';  // Import UserContext to access the logged-in user

const AdminNationDetails = () => {
  const { id } = useParams();  // Extract the nation ID from the URL parameters
  const { user } = useContext(UserContext);  // Get the logged-in user's context (admin or regular user)
  const [nation, setNation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to fetch the nation's details
    const fetchNationDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/nations/${id}`);
        setNation(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nation details:', error);
        setLoading(false);
      }
    };

    fetchNationDetails();

    // WebSocket setup for real-time updates
    const socket = new WebSocket('ws://localhost:5000');

    socket.onopen = () => {
      console.log('WebSocket connected for real-time nation updates');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);

      // Update the nation info in real time if the nation ID matches
      if (message.type === 'nation-update' && message.nation._id === id) {
        console.log('Handling nation update:', message.nation);
        setNation(message.nation);  // Update the state with the updated nation info
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();  // Clean up the WebSocket connection when the component unmounts
    };
  }, [id]);

  if (loading) {
    return <p>Loading nation details...</p>;
  }

  if (!nation) {
    return <p>Nation not found</p>;
  }

  return (
    <div>
      <h2>Nation Details</h2>
      {/* Render the NationInfo component and pass the user and nation data */}
      <NationInfo nation={nation} user={user} />
    </div>
  );
};

export default AdminNationDetails;
