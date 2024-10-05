import React, { createContext, useState, useEffect } from 'react';

// Create the UserContext with an initial value (set as null or empty object)
export const UserContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On app load, check if user data exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));  // Set user from localStorage if available
    }
  }, []);

  // Function to handle user login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));  // Save user data to localStorage
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');  // Remove user data from localStorage on logout
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
