// AdminViewUser.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AdminViewUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`/api/users/${id}`);
      setUser(response.data);
    };

    fetchUser();
  }, [id]);

  return user ? (
    <div>
      <h2>{user.username}'s Details</h2>
      <p><strong>Bank Account:</strong> {user.bankAccount}</p>
      <p><strong>Nation:</strong> {user.nation ? user.nation.name : 'No nation assigned'}</p>
      <p><strong>Roles:</strong> {user.roles.join(', ')}</p>
    </div>
  ) : (
    <p>Loading user details...</p>
  );
};

export default AdminViewUser;
