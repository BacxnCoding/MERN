import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Hub from './components/Hub';
import Wiki from './components/Wiki';
import Inventory from './components/Inventory';
import Map from './components/Map';
import Support from './components/Support';
import Admin from './components/Admin';
import Login from './components/Login';
import { UserContext } from './components/UserContext';  // Import UserContext

const App = () => {
  const { user, logout } = useContext(UserContext);  // Access user and logout from context

  return (
    <Router>
      <div>
        <header>
          {user ? (
            <>
              <p>Logged in as: {user.username}</p>
              <button onClick={logout}>Logout</button>  {/* Use logout from context */}
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

        <Routes>
          <Route path="/" exact element={<Hub />} />
          <Route path="/wiki" element={<Wiki />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/map" element={<Map />} />
          <Route path="/support" element={<Support />} />
          {user && user.isAdmin && <Route path="/admin" element={<Admin />} />}
          {!user && <Route path="/login" element={<Login />} />}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
