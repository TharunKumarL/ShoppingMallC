import React from 'react';
import '../components/css/Footer.css';
import FAQ from './FAQ';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="logo">
          <h2>ShoppingMall</h2>
        </div>
        <div className="footer-links">
          <a href="/">Home</a>

          <a href='/AboutUs'> About Us</a>
          <a href="/FAQ">FAQ</a>
          <a href="/feedback">FEEDBACK</a>
          
        </div>
        <div className="footer-socials">
          <a href="#facebook" className="social-link">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#twitter" className="social-link">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#instagram" className="social-link">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShoppingMall. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
