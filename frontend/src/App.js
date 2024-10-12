import React, { useContext } from 'react';
import { Route, Routes, Link, Navigate } from 'react-router-dom';  // No need to import BrowserRouter here
import Hub from './components/Hub';
import Wiki from './components/Wiki';
import Inventory from './components/Inventory';
import Map from './components/Map';
import Support from './components/Support';
import Login from './components/Login';  // Ensure Login component is imported
import { UserContext } from './components/UserContext';  // Import UserContext for user state

// Import the admin components from the admin folder
import AdminDashboard from './components/admin/AdminDashboard';
import AdminNationDetails from './components/admin/AdminNationDetails';
import AdminUserDetails from './components/admin/AdminUserDetails';
import AdminEditNation from './components/admin/AdminEditNation';
import AdminCreateNation from './components/admin/AdminCreateNation';
import AdminCreateUser from './components/admin/AdminCreateUser';
import AdminEditUserPage from './components/admin/AdminEditUserPage';

const App = () => {
  const { user, logout } = useContext(UserContext);  // Get user state and logout function from context

  return (
    <div>
      <header>
        {user ? (
          <>
            <p>Logged in as: {user.username}</p>
            <button onClick={logout}>Logout</button>  {/* Logout button */}
          </>
        ) : (
          <p>Not logged in</p>
        )}
      </header>

      <nav>
        <ul>
          <li><Link to="/">Hub</Link></li>
          <li><Link to="/wiki">Wiki</Link></li>
          <li><Link to="/inventory">Inventory</Link></li>
          <li><Link to="/map">Map</Link></li>
          <li><Link to="/support">Support</Link></li>
          {user && user.isAdmin && (
            <li><Link to="/admin">Admin</Link></li>
          )}
          {!user && <li><Link to="/login">Login</Link></li>}
        </ul>
      </nav>

      {/* Route handling */}
      <Routes>
        <Route path="/" element={<Hub />} />
        <Route path="/wiki" element={<Wiki />} />

        {/* Protected Route: Only allow access to inventory if user is logged in */}
        <Route 
          path="/inventory" 
          element={user ? <Inventory /> : <Navigate to="/login" />}  // Redirect to login if not logged in
        />

        <Route path="/map" element={<Map />} />
        <Route path="/support" element={<Support />} />

        {/* Admin routes */}
        {user && user.isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create-nation" element={<AdminCreateNation />} />
            <Route path="/admin/create-user" element={<AdminCreateUser />} />
            <Route path="/admin/nation/:id" element={<AdminNationDetails />} />
            <Route path="/admin/user/:id" element={<AdminUserDetails />} />
            <Route path="/admin/nation/edit/:id" element={<AdminEditNation />} />
            <Route path="/admin/user/edit/:id" element={<AdminEditUserPage />} />
          </>
        )}

        {/* Route for login */}
        {!user && <Route path="/login" element={<Login />} />}  {/* Show login form if not logged in */}

        {/* Fallback: If no routes match, redirect to login */}
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default App;
