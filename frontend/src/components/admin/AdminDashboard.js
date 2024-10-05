import React, { useEffect, useState, useContext } from 'react';  // Ensure useContext is imported
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';  // Ensure UserContext is imported correctly

const AdminDashboard = () => {
  const { user } = useContext(UserContext);  // Access the logged-in user's details
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // useNavigate for programmatic navigation

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

  const handleDelete = async (nationId) => {
    const password = prompt('Enter admin password to confirm deletion:');
    
    const normalizedPassword = password.trim();
    console.log('Entered password (trimmed):', normalizedPassword);

    // Compare the entered password with the logged-in user's password
    if (normalizedPassword === user.password) {  // Ensure user.password is available
      console.log('Password is correct. Proceeding with deletion...');
      try {
        const response = await axios.delete(`http://localhost:5000/api/nations/${nationId}`);
        console.log('Nation deleted:', response);
        alert('Nation deleted successfully');
        setNations((prevNations) => prevNations.filter(nation => nation._id !== nationId));  // Remove nation from list
      } catch (error) {
        console.error('Error deleting nation:', error);
        alert('Failed to delete the nation');
      }
    } else {
      console.log('Incorrect password:', normalizedPassword);
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
                <button onClick={() => navigate(`/admin/nation/${nation._id}`)}>View Nation</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
