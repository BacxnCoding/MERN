import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditUser = () => {
  const { id } = useParams();  // Extract user ID from URL
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    bankAccount: '',
    isAdmin: false,
    nation_id: '',
    roles: [],
  });
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
        const userData = userResponse.data;

        setFormValues({
          username: userData.username || '',
          password: '',
          bankAccount: userData.bankAccount || '',
          isAdmin: userData.isAdmin || false,
          nation_id: userData.nation_id || '',  // Default to an empty string if null
          roles: userData.roles || [],
        });

        const nationsResponse = await axios.get('http://localhost:5000/api/nations');
        setNations(nationsResponse.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}`, formValues);
      alert('User updated successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  if (loading) {
    return <p>Loading user data...</p>;
  }

  return (
    <div>
      <h2>Edit User: {formValues.username}</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formValues.username || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formValues.password || ''}
            onChange={handleInputChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div>
          <label>Bank Account</label>
          <input
            type="number"
            name="bankAccount"
            value={formValues.bankAccount || ''}
            onChange={handleInputChange}
          />
        </div>

        <div>
    /*hi*/
  <label>Nation</label>
  <select
    name="nation_id"
    value={formValues.nation_id || ''}
    onChange={handleInputChange}
  >
    {/* Option for No Nation */}
    <option value="">No Nation</option>
    {nations.map((nation) => (
      <option key={nation._id} value={nation._id}>
        {nation.name}
      </option>
    ))}
  </select>
</div>



        <div>
          <label>Is Admin?</label>
          <select
            name="isAdmin"
            value={formValues.isAdmin ? 'true' : 'false'}
            onChange={(e) =>
              setFormValues({ ...formValues, isAdmin: e.target.value === 'true' })
            }
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        <div>
          <label>Roles</label>
          <input
            type="text"
            name="roles"
            value={formValues.roles.join(', ') || ''}
            onChange={(e) =>
              setFormValues({
                ...formValues,
                roles: e.target.value.split(', ').map(role => role.trim())
              })
            }
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default AdminEditUser;
