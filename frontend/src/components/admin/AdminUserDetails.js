import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminUserDetails = () => {
  const { id } = useParams(); // Extract the user ID from the URL
  const [user, setUser] = useState(null);
  const [nation, setNation] = useState(null); // State to store the user's associated nation
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
        setUser(userResponse.data);

        // Fetch the nation details if a nation ID exists
        if (userResponse.data.nation_id) {
          const nationResponse = await axios.get(`http://localhost:5000/api/nations/${userResponse.data.nation_id}`);
          setNation(nationResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user or nation data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [id]);

  if (loading) {
    return <p>Loading user details...</p>;
  }

  if (!user) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <h2>User Details: {user.username}</h2>
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
    </div>
  );
};

export default AdminUserDetails;
