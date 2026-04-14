import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar glass">
      <div className="navbar-container">
        <div className="logo">
          Refox<span className="text-refox-green">AI</span>
        </div>
        
        <div className="nav-links">
          <a href="/templates" className="nav-link">Templates</a>
          <a href="/editor" className="nav-link">Editor</a>
          <a href="/download" className="nav-link">Download</a>
        </div>
        
        <div className="nav-actions">
          <button className="btn-get-started">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
