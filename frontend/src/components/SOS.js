import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './SOS.css';

function SOS() {
  const { user } = useAuth();
  const [emergencyNumbers, setEmergencyNumbers] = useState({});
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [showSOS, setShowSOS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [location, setLocation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('India');

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
        setTimeout(() => {
          setShowSOS(false);
          setMessage('');
        }, 3000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('Error sending SOS alert: ' + error.message);
    }
    setLoading(false);
  };

  // Call emergency number
  const handleCallEmergency = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="sos-container">
      {/* SOS Floating Button */}
      <button 
        className="sos-button"
        onClick={() => {
          setShowSOS(!showSOS);
          if (!showSOS) getLocation();
        }}
        title="Send SOS Alert"
      >
        🆘 SOS
      </button>

      {/* SOS Modal */}
      {showSOS && (
        <div className="sos-modal-overlay" onClick={() => setShowSOS(false)}>
          <div className="sos-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="close-btn"
              onClick={() => setShowSOS(false)}
            >
              ✕
            </button>

            <div className="sos-modal-content">
              <h2>🚨 Emergency SOS</h2>
              <p className="sos-warning">You are about to send an emergency alert to your family members and contacts.</p>

              {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              {/* Location Status */}
              <div className="location-status">
                {location ? (
                  <p className="location-found">✅ Location found and will be shared</p>
                ) : (
                  <p className="location-not-found">📍 Location: Not available</p>
                )}
              </div>

              {/* Send SOS Button */}
              <button 
                className="send-sos-btn"
                onClick={handleSendSOS}
                disabled={loading}
              >
                {loading ? 'Sending...' : '🚨 Send SOS Alert to Family'}
              </button>

              <div className="divider">OR</div>

              {/* Emergency Numbers Section */}
              <div className="emergency-numbers-section">
                <h3>📞 Call Emergency Services</h3>
                
                <div className="country-selector">
                  <label>Select Country:</label>
                  <select 
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                  >
                    {Object.keys(emergencyNumbers).map(country => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="numbers-grid">
                  {emergencyNumbers[selectedCountry] && 
                    Object.entries(emergencyNumbers[selectedCountry]).map(([type, number]) => (
                      <button
                        key={type}
                        className="emergency-number-btn"
                        onClick={() => handleCallEmergency(number)}
                      >
                        <div className="number-type">
                          {type.replace(/([A-Z])/g, ' $1').toUpperCase()}
                        </div>
                        <div className="number">{number}</div>
                        <div className="tap">TAP TO CALL</div>
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Tips */}
              <div className="sos-tips">
                <h4>💡 Safety Tips:</h4>
                <ul>
                  <li>Ensure your emergency contacts are updated</li>
                  <li>Your location will be shared if available</li>
                  <li>Stay in a safe place if possible</li>
                  <li>Contact police immediately for urgent situations</li>
                </ul>
              </div>

              <button 
                className="close-modal-btn"
                onClick={() => setShowSOS(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SOS;
