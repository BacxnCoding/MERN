import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminNationDetails = ({ match }) => {
  const nationId = match.params.id;  // Get the nation ID from URL params
  const [nation, setNation] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the nation's details by ID
    const fetchNationData = async () => {
      try {
        const nationResponse = await axios.get(`http://localhost:5000/api/nations/${nationId}`);
        setNation(nationResponse.data);

        // Fetch users who belong to this nation
        const usersResponse = await axios.get(`http://localhost:5000/api/users?nation=${nationId}`);
        setUsers(usersResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching nation or users:', error);
        setLoading(false);
      }
    };

    fetchNationData();
  }, [nationId]);

  if (loading) {
    return <p>Loading nation details...</p>;
  }

  return (
    <div>
      <h2>Nation Details: {nation?.name}</h2>
      <p><strong>National Bank:</strong> ${nation?.nationalBank}</p>
      <p><strong>People Index:</strong> {nation?.peopleindex}</p>
      <p><strong>Military Index:</strong> {nation?.militaryindex}</p>
      <p><strong>Economy Index:</strong> {nation?.economyindex}</p>

      <h3>Users in this Nation:</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.username} - <button onClick={() => window.location.href = `/admin/user/${user._id}`}>View User</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminNationDetails;
