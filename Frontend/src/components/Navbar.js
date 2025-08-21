import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav style={{
      backgroundColor: '#007bff',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ margin: 0 }}>Time Since I...</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {user && <span>Welcome, {user.email}</span>}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid white',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
