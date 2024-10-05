import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminUserDetails = ({ match }) => {
  const userId = match.params.id;  // Get the user ID from URL params
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the user's details by ID
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2>User Details: {user?.username}</h2>
      <p><strong>Bank Account:</strong> ${user?.bankAccount}</p>
      <p><strong>Roles:</strong> {user?.roles.join(', ')}</p>
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
    </div>
  );
};

export default AdminUserDetails;
