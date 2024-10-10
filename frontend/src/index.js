import React from 'react';
import { createRoot } from 'react-dom/client';  // For React 18
import App from './App';
import { BrowserRouter } from 'react-router-dom';  // Import BrowserRouter here
import { UserProvider } from './components/UserContext';  // Ensure correct path

const container = document.getElementById('root');
const root = createRoot(container);  // React 18 createRoot

root.render(
  <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserProvider>
);
