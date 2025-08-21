import React, { useState } from 'react';

function Header({ onAddActivity, onSearch, onLogout }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      // Fallback if no onLogout prop provided
      localStorage.removeItem('token');
      window.dispatchEvent(new Event('authChange'));
    }
  };

  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      background: '#1a1a1a',
      borderBottom: '1px solid #333'
    }}>
      {/* Logo */}
      <div style={{
        fontSize: '24px',
        fontWeight: '700',
        color: 'white',
        letterSpacing: '1px'
      }}>
        TIME SINCE I...
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        flex: '0 0 400px',
        maxWidth: '400px'
      }}>
        <input
          type="text"
          placeholder="Search Tasks"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{
            width: '100%',
            padding: '12px 50px 12px 20px',
            borderRadius: '25px',
            border: '1px solid #374151',
            background: '#1f2937',
            color: 'white',
            fontSize: '14px',
            outline: 'none',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#8b45ff';
            e.target.style.boxShadow = '0 0 0 2px rgba(139, 69, 255, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = '#374151';
            e.target.style.boxShadow = 'none';
          }}
        />
        <div style={{
          position: 'absolute',
          right: '15px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20px',
          height: '20px',
          cursor: 'pointer',
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        {/* Add Button */}
        <button
          onClick={onAddActivity}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            border: 'none',
            background: '#8b45ff',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.boxShadow = '0 0 20px rgba(139, 69, 255, 0.5)';
            e.target.style.background = '#9d5aff';
          }}
          onMouseLeave={(e) => {
            e.target.style.boxShadow = 'none';
            e.target.style.background = '#8b45ff';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Profile/Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            width: '45px',
            height: '45px',
            borderRadius: '50%',
            border: 'none',
            background: '#374151',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#4b5563';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#374151';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16,17 21,12 16,7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default Header;
