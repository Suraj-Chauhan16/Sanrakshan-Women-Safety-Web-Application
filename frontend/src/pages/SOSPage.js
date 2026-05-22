import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Pages.css';
import './SOS.css';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function SOSPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [emergencyNumbers, setEmergencyNumbers] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [showAlert, setShowAlert] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Load emergency contacts from localStorage
  useEffect(() => {
    if (user) {
      const storedContacts = localStorage.getItem(`emergency-contacts-${user.id}`);
      if (storedContacts) {
        setEmergencyContacts(JSON.parse(storedContacts));
      }
    }
  }, [user]);

  // Fetch emergency numbers
  useEffect(() => {
    const fetchEmergencyNumbers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/sos/emergency-numbers');
        const data = await response.json();
        if (data.success) {
          setEmergencyNumbers(data.emergencyNumbers);
        }
      } catch (error) {
        console.error('Error fetching emergency numbers:', error);
        // Set default emergency numbers if API fails
        setEmergencyNumbers({
          India: {
            police: '100',
            ambulance: '102',
            womenHelpline: '1091',
            crisisHotline: '1800-180-1111',
            cybercrime: '1930'
          },
          USA: {
            emergency: '911',
            womenHotline: '1-800-799-7233'
          },
          UK: {
            emergency: '999',
            womenSupport: '0808-2000-247'
          },
          Canada: {
            emergency: '911',
            womenHotline: '1-800-363-9010'
          }
        });
      }
    };
    fetchEmergencyNumbers();
  }, []);

  // Get user's current location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocation(null);
        }
      );
    }
  };

  // Send SOS Alert
  const handleSendSOS = async () => {
    if (!user) {
      setMessage('Please login to send SOS alert');
      return;
    }

    if (emergencyContacts.length === 0) {
      setMessage('❌ No emergency contacts added. Please add emergency contacts first.');
      setShowAlert(true);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/sos/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id,
          emergencyContacts: emergencyContacts,
          latitude: location?.latitude,
          longitude: location?.longitude
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage(`✅ SOS Alert sent to ${data.contactsNotified} emergency contacts!`);
        setShowAlert(true);
        setTimeout(() => {
          setMessage('');
          setShowAlert(false);
        }, 4000);
      } else {
        setMessage(`❌ ${data.message}`);
        setShowAlert(true);
      }
    } catch (error) {
      setMessage('Error sending SOS alert: ' + error.message);
      setShowAlert(true);
    }
    setLoading(false);
  };

  // Call emergency number
  const handleCallEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  if (!user) {
    return null;
  }

  return (
    <div className="page sos-page">
      <div className="sos-page-container">
        {/* Header */}
        <div className="sos-page-header">
          <h1>🚨 Emergency SOS</h1>
          <p className="sos-page-tagline">Quick access to emergency help</p>
        </div>

        {/* Alert Message */}
        {showAlert && (
          <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-error'}`}>
            <span className="alert-icon">{message.includes('✅') ? '✅' : '❌'}</span>
            {message}
          </div>
        )}

        {/* Main Content */}
        <div className="sos-page-content">
          {/* Left Section - Send Alert */}
          <div className="sos-section send-alert-section">
            <div className="section-icon">📤</div>
            <h2>Send Emergency Alert</h2>
            <p className="section-description">
              Alert your family members and trusted contacts that you need immediate help.
            </p>

            {/* Location Status */}
            <div className="location-info">
              <button 
                className="btn-get-location"
                onClick={getLocation}
              >
                📍 {location ? 'Location Found ✓' : 'Get My Location'}
              </button>
              {location && (
                <small className="location-details">
                  Lat: {location.latitude.toFixed(4)}, Lon: {location.longitude.toFixed(4)}
                </small>
              )}
            </div>
            {/* Map Display */}
            {location && (
              <div className="map-container">
                <MapContainer 
                  center={[location.latitude, location.longitude]} 
                  zoom={15} 
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.latitude, location.longitude]}>
                    <Popup>
                      Your Location<br />Lat: {location.latitude.toFixed(4)}<br />Lon: {location.longitude.toFixed(4)}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
            {/* Send Alert Button */}
            <button 
              className="btn btn-sos-send"
              onClick={handleSendSOS}
              disabled={loading}
            >
              {loading ? '⏳ Sending Alert...' : '🚨 SEND SOS ALERT TO FAMILY'}
            </button>

            {/* Tips */}
            <div className="alert-tips">
              <h4>💡 Before You Send:</h4>
              <ul>
                <li>Make sure your emergency contacts are up to date</li>
                <li>Your location will be shared (if available)</li>
                <li>Family members will receive email alerts</li>
                <li>Stay in a safe place if possible</li>
              </ul>
            </div>
          </div>

          {/* Right Section - Emergency Numbers */}
          <div className="sos-section emergency-section">
            <div className="section-icon">📞</div>
            <h2>Emergency Services</h2>
            <p className="section-description">
              Call emergency services in your country immediately for critical situations.
            </p>

            {/* Country Selector */}
            <div className="country-selector-container">
              <label>Select Your Country:</label>
              <select 
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="country-select"
              >
                {Object.keys(emergencyNumbers).map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* Emergency Numbers Grid */}
            <div className="emergency-numbers-container">
              {emergencyNumbers[selectedCountry] && 
                Object.entries(emergencyNumbers[selectedCountry]).map(([type, number]) => (
                  <button
                    key={type}
                    className="emergency-btn"
                    onClick={() => handleCallEmergency(number)}
                  >
                    <div className="emergency-type">
                      {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </div>
                    <div className="emergency-number">{number}</div>
                    <div className="tap-to-call">📞 TAP TO CALL</div>
                  </button>
                ))
              }
            </div>

            {/* Emergency Info */}
            <div className="emergency-info">
              <h4>⚠️ Important:</h4>
              <ul>
                <li>Call emergency services immediately in critical situations</li>
                <li>This app is a supplementary safety tool</li>
                <li>Always contact police for crimes in progress</li>
                <li>Share your location with emergency responders</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Tips */}
        <div className="sos-safety-tips">
          <h3>🛡️ Safety Tips</h3>
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-icon">🚗</div>
              <h4>Trust Your Instincts</h4>
              <p>If something feels wrong, it probably is. Leave the situation immediately.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">👥</div>
              <h4>Stay with People</h4>
              <p>Avoid isolated places. Stay in populated areas when possible.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">📱</div>
              <h4>Keep Your Phone Charged</h4>
              <p>Always keep your phone with sufficient battery for emergencies.</p>
            </div>
            <div className="tip-card">
              <div className="tip-icon">🗣️</div>
              <h4>Tell Someone</h4>
              <p>Inform a trusted person about your whereabouts and plans.</p>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button 
          className="btn btn-back"
          onClick={() => navigate('/')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

export default SOSPage;
