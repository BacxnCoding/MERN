import React from 'react';

function Users({ users, setSelectedUser }) {
  return (
    <div>
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id} onClick={() => setSelectedUser(user)}>
            <p>{user.username}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
