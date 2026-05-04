import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthModal from '../AuthModal';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { token, openLogin, openSignup } = useAuth();

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="logo">
          <Link to="/">
            <div className="logo-icon"></div>
            <span>SwarAI</span>
          </Link>
        </div>
        
        <ul className="nav-links">
          <li><Link to="/features">Features</Link></li>
          <li><Link to="/pricing">Pricing</Link></li>
          <li><Link to="/about">About Us</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        
        <div className="nav-actions">
          {token ? (
            <Link to="/editor" className="btn-nav-cta">Go to Studio</Link>
          ) : (
            <button onClick={openSignup} className="btn-nav-cta">Try For Free</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
