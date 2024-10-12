import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminEditUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    username: '',
    bankAccount: 0,
    isAdmin: false,
    nation_id: '',
    roles: [],
  });
  const [nations, setNations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user details and nations for the dropdowns
    const fetchUserDetails = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:5000/api/users/${id}`);
        setFormValues(userResponse.data);

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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle role change for checkboxes
  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    const updatedRoles = checked
      ? [...formValues.roles, value]
      : formValues.roles.filter((role) => role !== value);
    setFormValues({ ...formValues, roles: updatedRoles });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/api/users/${id}`, formValues);
      alert('User updated successfully!');
      navigate('/admin'); // Redirect back to the admin dashboard after update
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  if (loading) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2>Edit User: {formValues.username}</h2>
      <form onSubmit={handleFormSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
          />
        </label>

        {/* Checkbox Menu for Roles */}
        <div>
          <label>Roles:</label>
          <div>
            <input
              type="checkbox"
              value="finance"
              checked={formValues.roles.includes('finance')}
              onChange={handleRoleChange}
            />
            Finance
          </div>
          <div>
            <input
              type="checkbox"
              value="military"
              checked={formValues.roles.includes('military')}
              onChange={handleRoleChange}
            />
            Military
          </div>
          <div>
            <input
              type="checkbox"
              value="social"
              checked={formValues.roles.includes('social')}
              onChange={handleRoleChange}
            />
            Social
          </div>
        </div>

        {/* Dropdown Menu for Nation */}
        <label>
          Nation:
          <select
            name="nation_id"
            value={formValues.nation_id}
            onChange={handleInputChange}
          >
            <option value="">Select a nation</option>
            {nations.map((nation) => (
              <option key={nation._id} value={nation._id}>
                {nation.name}
              </option>
            ))}
          </select>
        </label>

        {/* Dropdown Menu for Admin Role */}
        <label>
          Is Admin:
          <select
            name="isAdmin"
            value={formValues.isAdmin ? 'true' : 'false'}
            onChange={(e) => setFormValues({ ...formValues, isAdmin: e.target.value === 'true' })}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </label>

        {/* Input for Bank Account */}
        <label>
          Bank Account:
          <input
            type="number"
            name="bankAccount"
            value={formValues.bankAccount}
            onChange={handleInputChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default AdminEditUserPage;
