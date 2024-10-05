import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminCreateUser = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
    roles: [],
    nation_id: '',  // Optionally, if assigning a nation to a user
    bankAccount: 1000,  // Default bank account value
    profile: '',
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  // Handle form submission to create a new user
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/users', formValues);
      alert('User created successfully!');
      navigate('/admin');  // Redirect back to admin dashboard after creation
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  return (
    <div>
      <h2>Create New User</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formValues.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Roles</label>
          <input
            type="text"
            name="roles"
            value={formValues.roles}
            onChange={handleInputChange}
            required
            placeholder="Enter comma-separated roles, e.g. military,finance"
          />
        </div>
        <div>
          <label>Nation ID</label>
          <input
            type="text"
            name="nation_id"
            value={formValues.nation_id}
            onChange={handleInputChange}
            placeholder="Optional: Assign a nation"
          />
        </div>
        <div>
          <label>Bank Account</label>
          <input
            type="number"
            name="bankAccount"
            value={formValues.bankAccount}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Profile</label>
          <textarea
            name="profile"
            value={formValues.profile}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default AdminCreateUser;
