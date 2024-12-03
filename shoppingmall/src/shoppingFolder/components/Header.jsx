import React from 'react';
import '../components/css/Header.css';  // Import the CSS file
import LogoutButton from './Logout/Logout';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="mall-header">
      <div className="logo">Shopping Mall</div>
      <nav className="nav-links">
        <a href="/">Home</a>
        <a href="/shoplist">Shops</a>
        <a href="/deals">Deals</a>
        <a href="/event">Events</a>
        <a href="/signup">Sign Up</a>
        <div className='logout-button'>
          <LogoutButton/>
        </div>

      </nav>
      <div className="search-bar">
      </div>
    </header>
  );
};

export default Header;
