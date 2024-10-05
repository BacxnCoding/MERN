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

  // Handle the delete action
  const handleDelete = async (nationId) => {
    const password = prompt('Enter admin password to confirm deletion:');
    
    if (password === user.password) {  // Ensure the admin's password is correct
      try {
        await axios.delete(`http://localhost:5000/api/nations/${nationId}`);
        alert('Nation deleted successfully');
        setNations((prevNations) => prevNations.filter(nation => nation._id !== nationId));  // Remove nation from list
      } catch (error) {
        console.error('Error deleting nation:', error);
        alert('Failed to delete the nation');
      }
    } else {
      alert('Incorrect password!');
    }
  };

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

  if (loading) {
    return <p>Loading nations...</p>;
  }

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <table>
        <thead>
          <tr>
            <th>Nation Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {nations.map((nation) => (
            <tr key={nation._id}>
              <td>{nation.name}</td>
              <td>
                <button onClick={() => handleDelete(nation._id)}>Delete</button>
                <button onClick={() => handleViewNation(nation._id)}>View Nation</button>
                <button onClick={() => handleEdit(nation._id)}>Edit Nation</button>  {/* Ensure edit button works */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
