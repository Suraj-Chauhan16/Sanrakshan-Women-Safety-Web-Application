import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/know-your-rights">Know Your Rights</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Resources</h3>
          <ul>
            <li><Link to="/know-your-rights">Get Help</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/contact">FAQ</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <ul>
            <li>📧 info@womensafety.com</li>
            <li>📱 Hotline: 1-800-SAFETY</li>
            <li>🌐 www.womensafety.com</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Women Safety. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
