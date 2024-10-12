import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import axios from 'axios';

const AdminDashboard = () => {
  const { user } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [nations, setNations] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get('http://localhost:5000/api/users');
        setUsers(usersResponse.data);

        const nationsResponse = await axios.get('http://localhost:5000/api/nations');
        setNations(nationsResponse.data);

        const requestsResponse = await axios.get('http://localhost:5000/api/requests/:username');
        console.log('Fetched Requests:', requestsResponse.data);
        setRequests(requestsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to handle password confirmation
  const confirmPassword = () => {
    const password = window.prompt('Please enter your password to confirm:');
    if (!password) {
      alert('Password is required to proceed.');
      return false;
    }

    if (user.password === password) {
      return true;
    } else {
      alert('Incorrect password.');
      return false;
    }
  };

  // Handle request approval/denial
// Handle request approval/denial
const handleApproveRequest = async (requestId, status) => {
  const response = prompt(`Enter reason for ${status}:`);
  if (!response) {
    alert('Reason is required!');
    return;
  }

  try {
    // Make sure to use PATCH and include the requestId in the URL
    const updatedRequestResponse = await axios.patch(`http://localhost:5000/api/approve/${requestId}`, {
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


  // Handle the "View User" action
  const handleViewUser = (userId) => {
    navigate(`/admin/user/${userId}`);
  };

  // Handle the "Edit User" action
  const handleEditUser = (user) => {
    const isConfirmed = confirmPassword();
    if (isConfirmed) {
      navigate(`/admin/user/edit/${user._id}`);
    }
  };

  // Handle the "Delete User" action
  const handleDeleteUser = async (userId) => {
    const isConfirmed = confirmPassword();
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${userId}`);
        alert('User deleted successfully');
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    }
  };

  // Handle the "View Nation" action
  const handleViewNation = (nationId) => {
    navigate(`/admin/nation/${nationId}`);
  };

  // Handle the "Edit Nation" action
  const handleEditNation = (nation) => {
    const isConfirmed = confirmPassword();
    if (isConfirmed) {
      navigate(`/admin/nation/edit/${nation._id}`);
    }
  };

  // Handle the "Delete Nation" action
  const handleDeleteNation = async (nationId) => {
    const isConfirmed = confirmPassword();
    if (isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/nations/${nationId}`);
        alert('Nation deleted successfully');
        setNations(nations.filter((nation) => nation._id !== nationId));
      } catch (error) {
        console.error('Error deleting nation:', error);
        alert('Failed to delete nation');
      }
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={() => navigate('/admin/create-user')}>Create New User</button>
      <button onClick={() => navigate('/admin/create-nation')}>Create New Nation</button>

      <h3>Users List</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username}
            <button onClick={() => handleViewUser(user._id)}>View</button>
            <button onClick={() => handleEditUser(user)}>Edit</button>
            <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Nations List</h3>
      <ul>
        {nations.map((nation) => (
          <li key={nation._id}>
            {nation.name}
            <button onClick={() => handleViewNation(nation._id)}>View</button>
            <button onClick={() => handleEditNation(nation)}>Edit</button>
            <button onClick={() => handleDeleteNation(nation._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Requests</h3>
      <ul>
        {requests.length > 0 ? (
          requests.map((request) => (
            <li key={request._id}>
              {request.item} (x{request.quantity}) - {request.status} by {request.username}
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
          <p>No requests available.</p>
        )}
      </ul>
    </div>
  );
};

export default AdminDashboard;