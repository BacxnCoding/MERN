import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminUserDetails = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [user, setUser] = useState(null);
  const [nation, setNation] = useState(null); // State to store the user's associated nation
  const [requests, setRequests] = useState([]); // State to store user's purchase requests
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(userResponse.data);

        // Fetch the nation details if a nation ID exists
        if (userResponse.data.nation_id) {
          const nationResponse = await axios.get(`http://localhost:5000/api/nations/${userResponse.data.nation_id}`);
          setNation(nationResponse.data);
        }

        // Fetch user's purchase requests
        const requestsResponse = await axios.get(`http://localhost:5000/api/requests/${userResponse.data.username}`);
        setRequests(requestsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user, nation, or requests data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  // Handle request approval/denial
  const handleApproveRequest = async (requestId, status) => {
    const response = prompt(`Enter reason for ${status}:`);
    if (!response) {
      alert('Reason is required!');
      return;
    }

    try {
      const updatedRequestResponse = await axios.patch('http://localhost:5000/api/approve', {
        id: requestId,
        status,
        response,
      });

      // Update the requests state with the modified request
      setRequests(requests.map((r) =>
        r._id === requestId ? updatedRequestResponse.data : r
      ));
    } catch (error) {
      console.error('Failed to update request:', error);
      alert('Failed to update request');
    }
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <h2>User Details: {user.username}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><strong>Bank Account:</strong> ${user.bankAccount}</p>
      <p><strong>Nation:</strong> {nation ? nation.name : 'No nation assigned'}</p>
      <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
      
      <h3>Inventory</h3>
      <ul>
        {user.items && user.items.length > 0 ? (
          user.items.map((item, index) => (
            <li key={index}>{item.itemName} (x{item.quantity})</li>
          ))
        ) : (
          <li>No items in inventory</li>
        )}
      </ul>

      <h3>Purchase Requests</h3>
      <ul>
        {requests.length > 0 ? (
          requests.map((request) => (
            <li key={request._id}>
              {request.item} (x{request.quantity}) - {request.status}
              {request.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleApproveRequest(request._id, 'approved')}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveRequest(request._id, 'denied')}
                  >
                    Deny
                  </button>
                </>
              )}
              {request.adminResponse && (
                <p>Admin Comment: {request.adminResponse}</p>
              )}
            </li>
          ))
        ) : (
          <li>No purchase requests found for this user.</li>
        )}
      </ul>
    </div>
  );
};

export default AdminUserDetails;
