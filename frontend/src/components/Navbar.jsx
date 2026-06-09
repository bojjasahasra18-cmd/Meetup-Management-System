import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MeetUp <span>Sync</span>
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Dashboard</Link>
          
          {isAuthenticated ? (
  <>
    <Link to="/profile" className="nav-link">Profile</Link>
    <Link to="/history" className="nav-link">
  History
</Link>

    {(user?.role === 'organizer' || user?.role === 'admin') && (
      <Link to="/create-meetup" className="nav-link">Create Meetup</Link>
    )}
              <div className="nav-user-info">
                <span className="nav-user-name" title={`${user?.profession || ''} @ ${user?.company || ''}`}>
                  {user?.name}
                </span>
                {user?.role && <span className="nav-user-role">{user.role}</span>}
              </div>
              <button onClick={handleLogout} className="btn btn-outline nav-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link nav-btn-register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
