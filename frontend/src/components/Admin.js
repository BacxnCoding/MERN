import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditNation from './EditNation';
import EditUser from './EditUser';

function Admin({ user }) {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [error, setError] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQuantity, setCustomItemQuantity] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [nations, setNations] = useState([]);
  const [selectedNation, setSelectedNation] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(null); // For user toggling
  const [isNationDetailsOpen, setIsNationDetailsOpen] = useState(null); // For nation toggling

  useEffect(() => {
    if (!user?.isAdmin) return;

    const fetchUsersAndRequests = async () => {
      try {
        const usersData = await axios.get('http://localhost:5000/api/users');
        setUsers(usersData.data);
        const requestsData = await axios.get('http://localhost:5000/api/requests');
        setRequests(requestsData.data);
        const nationsData = await axios.get('http://localhost:5000/api/nations');
        setNations(nationsData.data);
      } catch (error) {
        setError('Failed to fetch data');
        console.error(error);
      }
    };

    fetchUsersAndRequests();

    const socket = new WebSocket('ws://localhost:5000');

    socket.onmessage = (message) => {
      const data = JSON.parse(message.data);
      switch (data.type) {
        case 'REQUEST_UPDATED':
          setRequests((prevRequests) =>
            prevRequests.map((req) =>
              req._id === data.request._id ? data.request : req
            )
          );
          break;
        case 'REQUEST_CREATED':
          setRequests((prevRequests) => [...prevRequests, data.request]);
          break;
        case 'ADMIN_NOTIFICATION':
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            { id: Date.now(), text: data.notification },
          ]);
          break;
        case 'NOTIFICATION_DISMISSED':
          setNotifications((prevNotifications) =>
            prevNotifications.filter((notif) => notif.id !== data.notificationId)
          );
          break;
        default:
          break;
      }
    };

    return () => socket.close();
  }, [user]);

  const handleDismissNotification = async (notificationId) => {
    try {
      await axios.post('http://localhost:5000/api/dismiss-notification', {
        notificationId,
      });
      setNotifications(
        notifications.filter((notif) => notif.id !== notificationId)
      );
    } catch (error) {
      console.error('Failed to dismiss notification:', error);
    }
  };

  const handleUpdateUser = async (userId, updatedData) => {
    try {
      const userToUpdate = users.find((u) => u._id === userId);
      const newUser = { ...userToUpdate, ...updatedData };
      await axios.put(`http://localhost:5000/api/users/${userId}`, newUser);
      const updatedUsers = users.map((u) =>
        u._id === userId ? newUser : u
      );
      setUsers(updatedUsers);
      setSelectedUser(newUser);
    } catch (error) {
      setError('Failed to update user');
      console.error(error);
    }
  };

  const handleUpdateNation = async (nationId, updatedData) => {
    try {
      const nationToUpdate = nations.find((n) => n._id === nationId);
      const newNation = { ...nationToUpdate, ...updatedData };
      await axios.put(`http://localhost:5000/api/nations/${nationId}`, newNation);
      const updatedNations = nations.map((n) =>
        n._id === nationId ? newNation : n
      );
      setNations(updatedNations);
      setSelectedNation(newNation);
    } catch (error) {
      setError('Failed to update nation');
      console.error(error);
    }
  };

  // Reimplemented request approval/denial
  const handleApproveRequest = async (requestId, status, response) => {
    try {
      await axios.post('http://localhost:5000/api/approve', { id: requestId, status, response });
      const updatedRequests = requests.map((r) =>
        r._id === requestId ? { ...r, status, adminResponse: response } : r
      );
      setRequests(updatedRequests);
    } catch (error) {
      setError('Failed to update request');
      console.error(error);
    }
  };

  // Reimplemented Assign Nation
  const handleAssignNation = async () => {
    if (!selectedNation) {
      setAdminError('Please select a nation first');
      return;
    }

    if (!selectedUser) {
      setAdminError('Please select a user first');
      return;
    }

    try {
      const updatedData = { nation: selectedNation._id }; // Assign the selected nation's _id
      await handleUpdateUser(selectedUser._id, updatedData); // Update the user with the selected nation
      alert('Nation assigned successfully');
      setAdminError('');
    } catch (error) {
      console.error('Failed to assign nation:', error);
      alert('Failed to assign nation');
    }
  };

  const handleUnassignNation = async () => {
    if (!selectedUser) {
      setAdminError('Please select a user first');
      return;
    }

    try {
      const updatedData = { nation: null }; // Unassign the nation
      await handleUpdateUser(selectedUser._id, updatedData);
      alert('Nation unassigned successfully');
    } catch (error) {
      console.error('Failed to unassign nation:', error);
      alert('Failed to unassign nation');
    }
  };

  // Reimplemented Assign Role
  const handleAssignRole = async (role) => {
    if (!selectedUser) {
      alert('No user selected');
      return;
    }
  
    if (!selectedNation) {
      setAdminError('Please select a nation first');
      return;
    }
  
    // We now know that selectedNation is a full object
    if (!selectedNation.name) {
      alert('Nation does not have a valid name');
      return;
    }
  
    // Concatenate role with nation name
    const roleName = `${selectedNation.name.toUpperCase()}_${role.toUpperCase()}`;
  
    console.log('Assigning role:', roleName);  // Debugging
  
    try {
      // Ensure unique roles (use Set to avoid duplicates)
      const updatedRoles = [
        ...new Set([
          ...selectedUser.roles.map((r) => r.toUpperCase()), // Ensure all roles are uppercase
          roleName, // Add the new role
        ]),
      ];
  
      // Update the user with the new roles
      await handleUpdateUser(selectedUser._id, { roles: updatedRoles });
  
      alert(`Assigned ${roleName} role successfully`);
      setAdminError('');
    } catch (error) {
      console.error('Failed to assign role:', error);
      alert('Failed to assign role');
    }
  };
  
  


  const handleRemoveRole = async (role) => {
    if (!selectedUser) {
      alert('No user selected');
      return;
    }
  
    if (!selectedNation) {
      setAdminError('Please select a nation first');
      return;
    }
  
    if (!selectedNation.name) {
      alert('Nation does not have a valid name');
      return;
    }
  
    // Use selectedNation directly since it's the nation object
    const roleName = `${selectedNation.name.toUpperCase()}_${role.toUpperCase()}`;
  
    console.log('Removing role:', roleName); // Debugging
  
    try {
      // Filter out the role to be removed
      const updatedRoles = selectedUser.roles.filter(
        (r) => r.toUpperCase() !== roleName
      );
  
      // Update the user with the new roles
      await handleUpdateUser(selectedUser._id, { roles: updatedRoles });
  
      alert(`Role ${roleName} removed successfully`);
      setAdminError('');
    } catch (error) {
      console.error('Failed to remove role:', error);
      alert('Failed to remove role');
    }
  };
  

  const handleAddCustomItem = () => {
    if (!customItemName || customItemQuantity <= 0) {
      alert('Please enter valid item details');
      return;
    }

    const updatedItems = [
      ...selectedUser.items,
      { itemName: customItemName, quantity: customItemQuantity },
    ];
    handleUpdateUser(selectedUser._id, { items: updatedItems });
    setCustomItemName('');
    setCustomItemQuantity(1);
  };

  const toggleUserDetails = (userId) => {
    if (isUserDetailsOpen === userId) {
      setIsUserDetailsOpen(null);
      setSelectedUser(null); // Reset selected user when toggling off
    } else {
      setIsUserDetailsOpen(userId);
      const userToSelect = users.find(user => user._id === userId); // Find the selected user
      setSelectedUser(userToSelect); // Set the selected user
    }
  };
  

  const toggleNationDetails = (nationId) => {
    if (isNationDetailsOpen === nationId) {
      setIsNationDetailsOpen(null);
    } else {
      setIsNationDetailsOpen(nationId);
    }
  };

  if (!user?.isAdmin) {
    return <div>Access denied. Admins only.</div>;
  }

  return (
    <div>
      <h2>Admin Panel</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {adminError && <p style={{ color: 'red' }}>{adminError}</p>}

      <h3>Notifications</h3>
      <ul>
        {notifications.map((notification) => (
          <li key={notification.id}>
            {notification.text}
            <button onClick={() => handleDismissNotification(notification.id)}>
              Dismiss
            </button>
          </li>
        ))}
      </ul>

      <h3>Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            {request.item} (x{request.quantity}) - {request.status} by {request.username}
            {request.status === 'pending' && (
              <>
                <button
                  onClick={() =>
                    handleApproveRequest(
                      request._id,
                      'approved',
                      prompt('Enter approval message:')
                    )
                  }
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleApproveRequest(
                      request._id,
                      'denied',
                      prompt('Enter denial message:')
                    )
                  }
                >
                  Deny
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p onClick={() => toggleUserDetails(user._id)}>{user.username}</p>
            {isUserDetailsOpen === user._id && (
              <EditUser
                selectedUser={user}
                setSelectedUser={setSelectedUser}
                selectedNation={selectedNation}
                setSelectedNation={setSelectedNation}
                handleUpdateUser={handleUpdateUser}
                customItemName={customItemName}
                setCustomItemName={setCustomItemName}
                customItemQuantity={customItemQuantity}
                setCustomItemQuantity={setCustomItemQuantity}
                nations={nations}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                handleAssignNation={handleAssignNation}
                handleUnassignNation={handleUnassignNation}
                handleAssignRole={handleAssignRole}
                handleRemoveRole={handleRemoveRole}
                handleAddCustomItem={handleAddCustomItem}
              />
            )}
          </li>
        ))}
      </ul>

      <h3>Nations</h3>
      <ul>
        {nations.map((nation) => (
          <li key={nation._id}>
            <p onClick={() => toggleNationDetails(nation._id)}>{nation.name}</p>
            {isNationDetailsOpen === nation._id && (
              <EditNation
                selectedNation={nation}
                setSelectedNation={setSelectedNation}
                handleUpdateNation={handleUpdateNation}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Admin;
