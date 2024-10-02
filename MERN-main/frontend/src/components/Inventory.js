import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Shop from './Shop';

const Inventory = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [customItem, setCustomItem] = useState('');
  const [customPrice, setCustomPrice] = useState(0);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [nation, setNation] = useState(null);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?._id) {
        console.error('User ID not available');
        return;
      }
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        setUser(response.data); // Update the user data
        if (response.data.nation) {
          setNation(response.data.nation); // Set the nation directly from the user data
        }
        if (response.data.roles) {
          const rolePromises = response.data.roles.map((roleId) =>
            axios.get(`http://localhost:5000/api/roles/${roleId}`)
          );
          const rolesData = await Promise.all(rolePromises);
          setRoles(rolesData.map((roleResponse) => roleResponse.data));
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('ERROR: ' + (error.response?.data?.message || 'Unknown error'));
      }
    };

    if (user) {
      console.log('Fetching details for user:', user); // Log user to ensure it has the correct data
      fetchUserDetails();
    }
  }, [user, setUser]);

  const handleCustomPurchaseRequest = async () => {
    if (customItem && customPrice > 0 && customQuantity > 0) {
      try {
        await axios.post('http://localhost:5000/api/purchase', {
          username: user.username,
          item: customItem,
          quantity: customQuantity,
          price: customPrice,
        });
        alert('Custom purchase request sent to admin');
      } catch (error) {
        console.error('Failed to send purchase request:', error);
      }
    } else {
      alert('Please fill in all fields correctly');
    }
  };

  const handlePurchaseRequest = () => {
    alert('Purchase request sent to admin');
  };

  const toggleShowAllRequests = () => {
    setShowAllRequests((prev) => !prev);
  };

  if (!user) {
    return <div>Please log in to view your inventory and stats.</div>;
  }

  return (
    <div>
      <div>
        <h2>Welcome, {user?.username}</h2>

        <h3>Your Nation's Stats</h3>
        {nation ? (
          <div>
            {Object.keys(nation).map((key) => (
              <p key={key}><strong>{key}:</strong> {JSON.stringify(nation[key], null, 2)}</p>
            ))}
          </div>
        ) : (
          <p style={{ color: 'red' }}>Nation data not available.</p>
        )}

        <h3>Your Roles</h3>
        {roles.length > 0 ? (
          roles.map((role) => (
            <div key={role._id}>
              <p>
                <strong>Role:</strong> {role.role_Name}
              </p>
              <p>
                <strong>Description:</strong> {role.description}
              </p>
              <h4>Permissions:</h4>
              {role.permissions.length > 0 ? (
                role.permissions.map((permission, index) => (
                  <p key={index}>
                    {permission.action} on {permission.scope}
                  </p>
                ))
              ) : (
                <p>No permissions assigned.</p>
              )}
            </div>
          ))
        ) : (
          <p>No roles assigned.</p>
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

        <Shop user={user} onPurchaseRequest={handlePurchaseRequest} />

        <h3>Custom Purchase (Item Name, Price, Quantity)</h3>
        <div>
          <input
            type="text"
            placeholder="Item Name"
            value={customItem}
            onChange={(e) => setCustomItem(e.target.value)}
          />
          <input
            type="number"
            placeholder="Price"
            value={customPrice}
            onChange={(e) => setCustomPrice(parseFloat(e.target.value))}
          />
          <input
            type="number"
            placeholder="Quantity"
            value={customQuantity}
            onChange={(e) => setCustomQuantity(parseInt(e.target.value, 10))}
          />
          <button onClick={handleCustomPurchaseRequest}>Submit Custom Purchase</button>
        </div>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Inventory;
