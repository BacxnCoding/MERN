import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Shop from './Shop';

const Inventory = ({ user, setUser }) => {
  const [requests, setRequests] = useState([]);
  const [customItem, setCustomItem] = useState('');
  const [customPrice, setCustomPrice] = useState(0);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [nation, setNation] = useState(null);  // Holds the current nation data
  const [error, setError] = useState('');

  // Fetch requests when the component mounts
  useEffect(() => {
    if (user) {
      const fetchRequests = async () => {
        try {
          const result = await axios.get(`http://localhost:5000/api/requests/${user.username}`);
          setRequests(result.data);
        } catch (error) {
          console.error('Failed to fetch requests:', error);
          setError('Failed to fetch requests.');
        }
      };
      fetchRequests();
    }
  }, [user]);

  // Fetch user details and their nation data
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${user._id}`);
        setUser(response.data);  // Update the user data
        if (response.data.nation) {
          setNation(response.data.nation);  // Set the nation directly from the user data
          console.log("Nation data:", response.data.nation); // Verify the nation object
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
        setError('ERROR: ' + (error.response?.data?.message || 'Unknown error'));
      }
    };

    if (user) {
      fetchUserDetails();  // Fetch user and nation details when the component mounts
    }
  }, [user, setUser]);

  // WebSocket integration for real-time updates
  useEffect(() => {
    if (user) {
      const socket = new WebSocket('ws://localhost:5000');

      socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        if (data.type === 'USER_UPDATED' && data.user._id === user._id) {
          setUser(data.user);  // Update the user data in real-time
          setNation(data.user.nation);  // Update the nation if it was changed
        }
      };

      return () => socket.close();
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

  // **Function to render stats based on role**
  const renderRoleBasedStats = (role) => {
    if (!nation) {
      return <p style={{ color: 'red' }}>Nation data not available.</p>;
    }

    // Finance Role (Economy stats)
    if (role.includes('FINANCE')) {
      return (
        <div>
          <h3>Finance Stats for {nation.name}</h3>
          <p>National Bank: ${nation?.nationalBank || 'N/A'}</p>
          <p>Inflation: {nation?.economy?.inflation || 'N/A'}</p>
          <h4>Income:</h4>
          <p>Tax Rate: {nation?.economy?.income?.taxRate || 'N/A'}</p>
          <p>Exports: {nation?.economy?.income?.exports || 'N/A'}</p>
          <h4>Spending:</h4>
          <p>Debt: {nation?.economy?.spending?.debt || 'N/A'}</p>
          <p>Imports: {nation?.economy?.spending?.imports || 'N/A'}</p>
        </div>
      );
    }

    // Military Role (Military stats)
    if (role.includes('MILITARY')) {
      return (
        <div>
          <h3>Military Stats for {nation.name}</h3>
          <p>Soldiers: {nation?.soldiersAmount || 'N/A'}</p>
          <h4>Personnel:</h4>
          <p>Training: {nation.military?.personnel?.training || 'N/A'}</p>
          <p>Well-being: {nation.military?.personnel?.wellBeing || 'N/A'}</p>
          <h4>Equipment:</h4>
          <p>Bases: {nation.military?.equipment?.bases || 'N/A'}</p>
          <p>Ports: {nation.military?.equipment?.ports || 'N/A'}</p>
          <p>Communication: {nation.military?.equipment?.communication || 'N/A'}</p>
          <p>Equipment Quality: {nation.military?.equipment?.equipmentQuality || 'N/A'}</p>
          <p>Overall Performance: {nation.military?.performance || 'N/A'}</p>
        </div>
      );
    }

    // Social Role (Health stats within People)
    if (role.includes('SOCIAL')) {
      return (
        <div>
          <h3>Health Stats for {nation.name}</h3>
          <p>Vaccinations: {nation.people?.health?.vaccines || 'N/A'}</p>
          <p>Hospitals: {nation.people?.health?.hospitals || 'N/A'}</p>
          <h4>Satisfaction:</h4>
          <p>Infrastructure: {nation.people?.satisfaction?.infrastructure || 'N/A'}</p>
          <p>Political Stability: {nation.people?.satisfaction?.politicalStability || 'N/A'}</p>
          <p>Education: {nation.people?.satisfaction?.education || 'N/A'}</p>
          <p>Internal Safety: {nation.people?.satisfaction?.internalSafety || 'N/A'}</p>
          <p>Freedom: {nation.people?.satisfaction?.freedom || 'N/A'}</p>
          <p>Economy Satisfaction: {nation.people?.satisfaction?.economy || 'N/A'}</p>
        </div>
      );
    }

    return null;
  };

  const renderUserRoles = () => {
    if (!user || !user.roles) return null;
    return user.roles.map((role, index) => (
      <div key={index}>
        <p><strong>Role:</strong> {role}</p>
        {renderRoleBasedStats(role)}
      </div>
    ));
  };

  if (!user) {
    return <div>Please log in to view your inventory and stats.</div>;
  }

  return (
    <div>
      <div>
        <h2>Welcome, {user?.username}</h2>
        <h3>Stats</h3>
        <p>Strength: {user?.stats?.strength || 'N/A'}</p>
        <p>Agility: {user?.stats?.agility || 'N/A'}</p>
        <p>Intelligence: {user?.stats?.intelligence || 'N/A'}</p>

        <h3>Your Roles and Linked Stats</h3>
        {renderUserRoles()}

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

        <h3>Purchase Requests</h3>
        <ul>
          {requests.length > 0 ? (
            showAllRequests ? (
              requests.map(request => (
                <li key={request._id} style={{ color: request.status === 'pending' ? 'blue' : request.status === 'denied' ? 'red' : 'green' }}>
                  {request.item} (x{request.quantity}) - {request.status} {request.adminResponse && `(${request.adminResponse})`}
                </li>
              ))
            ) : (
              requests.slice(0, 3).map(request => (
                <li key={request._id} style={{ color: request.status === 'pending' ? 'blue' : request.status === 'denied' ? 'red' : 'green' }}>
                  {request.item} (x{request.quantity}) - {request.status} {request.adminResponse && `(${request.adminResponse})`}
                </li>
              ))
            )
          ) : (
            <li>No purchase requests</li>
          )}
        </ul>
        {requests.length > 3 && (
          <button onClick={toggleShowAllRequests}>
            {showAllRequests ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Inventory;
