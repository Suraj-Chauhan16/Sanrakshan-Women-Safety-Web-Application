import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from '../components/AuthModal';
import sanrakshan from '../assets/sanrakshan-logo.svg';
import './Pages.css';

function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('mission');
  const { user } = useAuth();
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Check if site is in maintenance mode
  useEffect(() => {
    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/admin/settings');
        const data = await response.json();
        if (data.success && data.settings) {
          setMaintenanceMode(data.settings.maintenanceMode);
        }
      } catch (err) {
        console.log('Could not fetch maintenance status');
      }
    };

    checkMaintenanceMode();
    // Check every 30 seconds for maintenance mode changes
    const interval = setInterval(checkMaintenanceMode, 30000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'mission', label: 'Our Mission', icon: '🎯' },
    { id: 'vision', label: 'Our Vision', icon: '👁️' },
    { id: 'values', label: 'Our Values', icon: '💖' }
  ];

  const tabContent = {
    mission: "We are committed to creating a safe environment for women by providing them with essential information, resources, and support systems. Our platform aims to raise awareness about women's rights and provide guidance on safety measures.",
    vision: "To build a society where every woman feels empowered, protected, and supported in her journey towards equality and dignity.",
    values: "Safety, Empowerment, Education, Community, Trust, and Accountability are the core values that guide us."
  };

  const openGoogleMapsSafePlaces = () => {
    window.open(
      'https://www.google.com/maps/search/?api=1&query=your+location',
      '_blank'
    );
  };

  return (
    <div className="page home-page">
      {/* Maintenance Mode Alert */}
      {maintenanceMode && (
        <div style={{
          backgroundColor: '#fff3cd',
          border: '2px solid #ffc107',
          color: '#856404',
          padding: '20px',
          marginBottom: '20px',
          borderRadius: '5px',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          marginTop: '10px'
        }}>
          ⚠️ Site is Under Maintenance
          <p style={{ fontSize: '14px', marginTop: '10px', fontWeight: 'normal' }}>
            We are currently performing scheduled maintenance. Please try again later.
          </p>
        </div>
      )}

      {/* Hero Section with Logo */}
      <div className="hero">
        <img src={sanrakshan} alt="Sanrakshan" className="hero-logo" />
        <h1>Welcome to Sanrakshan</h1>
        <h3 className="hero-tagline">Naari Ki Suraksha hamari Zimmedari</h3>
        <p>Your trusted platform for women's safety, rights, and empowerment.</p>
      </div>

      {/* Interactive Tab Section */}
      <section className="content-section">
        <div className="tab-container">
          <div className="tab-buttons">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
          <div className="tab-content">
            <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
            <p>{tabContent[activeTab]}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions Section - Show only when logged in */}
      {user && (
        <section className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="quick-actions-grid">
            <div className="quick-action-card">
              <div className="action-icon">🆘</div>
              <h3>Emergency Alert</h3>
              <p>Send an emergency alert to trusted contacts</p>
              <Link to="/sos" className="btn btn-primary action-btn">Send Alert</Link>
            </div>

            <div className="quick-action-card">
              <div className="action-icon">📞</div>
              <h3>Support Hotline</h3>
              <p>Call our 24/7 support team</p>
              <button className="btn btn-primary action-btn" onClick={() => window.location.href = 'tel:+919324696429'}>Call Now</button>
            </div>

            <div className="quick-action-card">
              <div className="action-icon">👥</div>
              <h3>Community</h3>
              <p>Connect with other members</p>
              <button className="btn btn-primary action-btn" onClick={() => window.open('https://t.me/ACgamingwar', '_blank')}>Join Chat</button>
            </div>

            <div className="quick-action-card">
              <div className="action-icon">🗺️</div>
              <h3>Find Safe Routes</h3>
              <p>Safe places and best routes</p>
              <button className="btn btn-primary action-btn" onClick={openGoogleMapsSafePlaces}>Open Google Maps</button>
            </div>
          </div>
        </section>
      )}

      <section className="features">
        <h2>What We Offer</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>📚 Know Your Rights</h3>
            <p>Learn about your legal rights and protections.</p>
            <Link to="/know-your-rights" className="feature-link">Learn More</Link>
          </div>
          <div className="feature-card">
            <h3>🔐 Safe Community</h3>
            <p>Join a supportive community of women helping women.</p>
            <Link to="/about" className="feature-link">About Us</Link>
          </div>
          <div className="feature-card">
            <h3>📞 24/7 Support</h3>
            <p>Access helplines and resources anytime.</p>
            <p className="phone">Hotline: 1-800-SAFETY</p>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <h2>Get Started Today</h2>
        <p>Join our community and stay informed about women's safety and rights.</p>
        {!user ? (
          <>
            <button 
              className="btn btn-primary"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Login or Sign Up
            </button>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
          </>
        )}
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default Home;
