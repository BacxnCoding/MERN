import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';  // Ensure UserContext is imported

const AdminDashboard = () => {
  const { user } = useContext(UserContext);  // Get the user context here
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // To navigate between pages

  useEffect(() => {
    const fetchNations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/nations');
        setNations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nations:', error);
        setLoading(false);
      }
    };

    fetchNations();
  }, []);

  // Handle the "View Nation" action
  const handleViewNation = (nationId) => {
    navigate(`/admin/nation/${nationId}`);  // Navigate to the nation details page
  };

  // Handle the "Edit Nation" action
  const handleEdit = (nationId) => {
    const password = prompt('Enter admin password to confirm editing:');

    if (password === user.password) {  // Ensure the admin's password is correct
      navigate(`/admin/nation/edit/${nationId}`);  // Redirect to the edit page
    } else {
      alert('Incorrect password!');
    }
  };

  // Handle the "Delete Nation" action
  const handleDelete = async (nationId) => {
    const password = prompt('Enter admin password to confirm deletion:');
    if (password === user.password) {  // Validate admin password before deleting
      try {
        await axios.delete(`http://localhost:5000/api/nations/${nationId}`);
        alert('Nation deleted successfully');
        setNations(nations.filter((nation) => nation._id !== nationId));  // Update UI after deletion
      } catch (error) {
        console.error('Error deleting nation:', error);
        alert('Failed to delete nation');
      }
    } else {
      alert('Incorrect password!');
    }
  };

  if (loading) {
    return <p>Loading nations...</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <button onClick={() => navigate('/admin/create-nation')}>Create New Nation</button>
      <button onClick={() => navigate('/admin/create-user')}>Create New User</button>

      <h3>Nations List</h3>
      <ul>
        {nations.map((nation) => (
          <li key={nation._id}>
            {nation.name}
            <button onClick={() => handleViewNation(nation._id)}>View Nation</button>
            <button onClick={() => handleEdit(nation._id)}>Edit Nation</button>
            <button onClick={() => handleDelete(nation._id)}>Delete Nation</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
