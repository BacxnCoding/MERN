import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminCreateUser = () => {
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    bankAccount: 1000,
    isAdmin: false,
    nation_id: '',
    roles: [],
  });

  const [nations, setNations] = useState([]);  // Store the list of nations

  useEffect(() => {
    // Fetch nations for the dropdown
    const fetchNations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/nations');
        setNations(response.data);
      } catch (error) {
        console.error('Error fetching nations:', error);
      }
    };

    fetchNations();
  }, []);

  const handleRoleChange = (event) => {
    const { value, checked } = event.target;
    setFormValues((prevValues) => {
      const newRoles = checked
        ? [...prevValues.roles, value]  // Add role if checked
        : prevValues.roles.filter((role) => role !== value);  // Remove role if unchecked
      return { ...prevValues, roles: newRoles };
    });
  };

  const handleCreateUser = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users', formValues);
      alert('User created successfully!');
      // You can redirect back to the admin dashboard if needed
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user. Username might already be taken.');
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form>
        {/* Username Input */}
        <div>
          <label>Username</label>
          <input
            type="text"
            value={formValues.username}
            onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
          />
        </div>

        {/* Password Input */}
        <div>
          <label>Password</label>
          <input
            type="password"
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          />
        </div>

        {/* Checkbox Roles */}
        <div>
          <label>Roles</label>
          <div>
            <input
              type="checkbox"
              value="finance"
              checked={formValues.roles.includes('finance')}
              onChange={handleRoleChange}
            />
            <label>Finance</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="military"
              checked={formValues.roles.includes('military')}
              onChange={handleRoleChange}
            />
            <label>Military</label>
          </div>
          <div>
            <input
              type="checkbox"
              value="social"
              checked={formValues.roles.includes('social')}
              onChange={handleRoleChange}
            />
            <label>Social</label>
          </div>
        </div>

        {/* Is Admin Dropdown */}
        <div>
          <label>Is Admin?</label>
          <select
            value={formValues.isAdmin}
            onChange={(e) => setFormValues({ ...formValues, isAdmin: e.target.value === 'true' })}
          >
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </div>

        {/* Nation Dropdown */}
        <div>
          <label>Nation</label>
          <select
            value={formValues.nation_id}
            onChange={(e) => setFormValues({ ...formValues, nation_id: e.target.value })}
          >
            <option value="">Select a nation</option>
            {nations.map((nation) => (
              <option key={nation._id} value={nation._id}>
                {nation.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button type="button" onClick={handleCreateUser}>
          Create User
        </button>
      </form>
    </div>
  );
};

export default AdminCreateUser;
