import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Dashboard.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
});

function Dashboard() {
  const [location, setLocation] = useState({ lat: 40.7128, lng: -74.0060 }); // Default: New York
  const [locationName, setLocationName] = useState('New York, NY');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mapReady, setMapReady] = useState(false);

  // Get user's live location on component mount
  useEffect(() => {
    getLocationFromGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocationFromGeolocation = () => {
    setLoading(true);
    setError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          reverseGeocode(latitude, longitude);
          setLoading(false);
          setMapReady(true);
        },
        (error) => {
          setError('Unable to access your location. Using default location.');
          setMapReady(true);
          setLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setMapReady(true);
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      const address = data.address || {};
      const city = address.city || address.town || address.county || 'Unknown';
      const state = address.state || '';
      setLocationName(`${city}${state ? ', ' + state : ''}`);
    } catch (err) {
      setLocationName('Location coordinates not available');
    }
  };

  const openGoogleMapsSafetyRoute = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=your+location', '_blank');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1>Welcome to Sanrakshan</h1>
          <p>View your location and stay connected with the Women Safety community</p>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="stat-card">
            <h3>📍 Current Location</h3>
            <p className="stat-value">{locationName}</p>
            {loading ? (
              <p className="loading-text">Loading your location...</p>
            ) : (
              <p className="stat-info">
                Coordinates: {location.lat.toFixed(4)}°, {location.lng.toFixed(4)}°
              </p>
            )}
          </div>

          <div className="stat-card">
            <h3>🔒 Safety Status</h3>
            <p className="stat-value">Active</p>
            <p className="stat-info">Your profile is secure and up to date</p>
          </div>

          <div className="stat-card">
            <h3>💬 Community</h3>
            <p className="stat-value">2,543</p>
            <p className="stat-info">Active members nearby</p>
          </div>

          <div className="stat-card">
            <h3>📚 Resources</h3>
            <p className="stat-value">127</p>
            <p className="stat-info">Safety articles and guides</p>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <div className="map-header">
            <h2>Your Live Location Map</h2>
            <button 
              className="btn btn-secondary btn-small" 
              onClick={getLocationFromGeolocation}
              disabled={loading}
            >
              🔄 {loading ? 'Updating...' : 'Refresh Location'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}

          {mapReady ? (
            <div className="map-container">
              <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    <div className="marker-popup">
                      <p><strong>Your Current Location</strong></p>
                      <p>{locationName}</p>
                      <p className="small-text">Lat: {location.lat.toFixed(6)}</p>
                      <p className="small-text">Lng: {location.lng.toFixed(6)}</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="map-loading">Loading map...</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <div className="action-card">
              <div className="action-icon">🆘</div>
              <h3>Emergency Alert</h3>
              <p>Send an emergency alert to trusted contacts</p>
              <button className="btn btn-primary">Send Alert</button>
            </div>

            <div className="action-card">
              <div className="action-icon">📞</div>
              <h3>Support Hotline</h3>
              <p>Call our 24/7 support team</p>
              <button className="btn btn-primary" onClick={() => window.location.href = 'tel:+919324696429'}>Call Now</button>
            </div>

            <div className="action-card">
              <div className="action-icon">🗺️</div>
              <h3>Google Maps Routes</h3>
              <p>Find nearby safe places and best walking routes</p>
              <button className="btn btn-primary" onClick={openGoogleMapsSafetyRoute}>Open Google Maps</button>
            </div>

            <div className="action-card">
              <div className="action-icon">👥</div>
              <h3>Community</h3>
              <p>Connect with other members</p>
              <button className="btn btn-primary" onClick={() => window.open('https://t.me/ACgamingwar', '_blank')}>Join Chat</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-details">
                <p className="activity-text">Profile updated successfully</p>
                <span className="activity-time">2 hours ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📖</div>
              <div className="activity-details">
                <p className="activity-text">Completed "Know Your Rights" module</p>
                <span className="activity-time">1 day ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-details">
                <p className="activity-text">Joined community forum discussion</p>
                <span className="activity-time">3 days ago</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-details">
                <p className="activity-text">Registered for self-defense workshop</p>
                <span className="activity-time">1 week ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
