import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { UserProvider } from './components/UserContext';  // Import UserProvider

ReactDOM.render(
  <UserProvider> {/* Wrap the entire app */}
    <App />
  </UserProvider>,
  document.getElementById('root')
);
