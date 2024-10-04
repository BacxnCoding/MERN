// Inventory.js
import React, { useState } from 'react';
import axios from 'axios';
import Shop from './Shop';
import NationInfo from './NationInfo';

const Inventory = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [customItem, setCustomItem] = useState('');
  const [customPrice, setCustomPrice] = useState(0);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [error, setError] = useState('');

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

        {/* User's Personal Info */}
        <h3>Your Personal Information</h3>
        <p><strong>Bank Account:</strong> ${user.bankAccount}</p>
        <p><strong>Roles:</strong> {user.roles.join(', ')}</p>

        {/* NationInfo Component */}
        <NationInfo user={user} />

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
