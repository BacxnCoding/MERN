import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminView = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      const checkRequests = async () => {
        const response = await axios.get('http://localhost:5000/api/requests');
        if (response.data.length > 0) {
          alert('New purchase request received');
        }
      };
    };

    const interval = setInterval(fetchUsers, 5000);

    fetchUsers();

    return () => clearInterval(interval);
  }, []);

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setEditingUser({ ...user });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editingUser);
      setSelectedUser(response.data);
      setEditingUser(null);
      setUsers(users.map(user => (user._id === response.data._id ? response.data : user)));
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h2>Admin View</h2>
      <div>
        <h3>All Users</h3>
        <ul>
          {users.map((user) => (
            <li key={user._id} onClick={() => handleUserClick(user)}>
              {user.username} (Admin: {user.isAdmin ? 'Yes' : 'No'})
            </li>
          ))}
        </ul>
      </div>
      {selectedUser && (
        <div>
          <h3>Edit User: {selectedUser.username}</h3>
          <div>
            <label>
              Username: 
              <input type="text" name="username" value={editingUser.username} onChange={handleInputChange} />
            </label>
            <label>
              Password: 
              <input type="text" name="password" value={editingUser.password} onChange={handleInputChange} />
            </label>
            <label>
              Bank Account: 
              <input type="number" name="bankAccount" value={editingUser.bankAccount} onChange={handleInputChange} />
            </label>
            <label>
              Is Admin: 
              <input type="checkbox" name="isAdmin" checked={editingUser.isAdmin} onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.checked })} />
            </label>
            <h4>Stats</h4>
            <label>
              Strength: 
              <input type="number" name="strength" value={editingUser.stats.strength} onChange={(e) => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, strength: e.target.value } })} />
            </label>
            <label>
              Agility: 
              <input type="number" name="agility" value={editingUser.stats.agility} onChange={(e) => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, agility: e.target.value } })} />
            </label>
            <label>
              Intelligence: 
              <input type="number" name="intelligence" value={editingUser.stats.intelligence} onChange={(e) => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, intelligence: e.target.value } })} />
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
