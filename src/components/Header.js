import React from 'react';

const Header = ({ isDarkTheme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="logo-section">
        <div className="logo-container">
          <span className="material-icons-outlined logo-icon">verified</span>
        </div>
        <h1 className="app-title">CredHex</h1>
        <span className="app-subtitle">Certificate Manager</span>
      </div>
      <div className="header-actions">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          <span className="material-icons-outlined">
            {isDarkTheme ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;