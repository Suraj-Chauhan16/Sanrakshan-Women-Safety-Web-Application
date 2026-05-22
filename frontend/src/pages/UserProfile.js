import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Dashboard.css';

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    dateOfBirth: '',
    profileImage: null,
    joinDate: '',
    bio: '',
    role: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        localStorage.removeItem('userProfile'); // clear oversized saved image payload
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Please login to view profile');
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/auth/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await response.json();
        const profileData = data.user;

        // Format the date if available
        const joinDate = profileData.createdAt 
          ? new Date(profileData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
          : 'Recently joined';

        // Format date of birth as ISO for date input
        const dateOfBirthISO = profileData.dateOfBirth
          ? new Date(profileData.dateOfBirth).toISOString().split('T')[0]
          : '';

        const userProfile = {
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || 'Not provided',
          city: profileData.city || 'Not provided',
          dateOfBirth: dateOfBirthISO,
          profileImage: profileData.profileImage || null,
          joinDate: joinDate,
          bio: profileData.bio || 'Add your bio here',
          role: profileData.role || 'user'
        };

        setUser(userProfile);
        setEditedUser(userProfile);
        setImagePreview(userProfile.profileImage);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Function to mask email
  const maskEmail = (email) => {
    if (!email) return '';
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) return email;
    const maskedLocal = localPart.charAt(0) + '*'.repeat(Math.max(0, localPart.length - 2)) + localPart.charAt(localPart.length - 1);
    return `${maskedLocal}@${domain}`;
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setEditedUser((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('Please login to update profile');

      const response = await fetch('http://localhost:5000/api/auth/updateprofile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: editedUser.name,
          phone: editedUser.phone,
          city: editedUser.city,
          dateOfBirth: editedUser.dateOfBirth,
          bio: editedUser.bio,
          profileImage: editedUser.profileImage
        })
      });

      if (!response.ok) {
        let errData = {};
        try {
          errData = await response.json();
        } catch {
          // ignore JSON parse error
        }
        const msg = errData.message || `Failed to update profile (status ${response.status})`;
        console.error('Profile update failed:', msg, errData);
        throw new Error(msg);
      }

      const data = await response.json();
      const updatedUser = data.user;
      if (updatedUser) {
        const formattedDateOfBirth = updatedUser.dateOfBirth
          ? new Date(updatedUser.dateOfBirth).toISOString().split('T')[0]
          : '';
        // store response profile image as well
        if (data.user.profileImage) {
          localStorage.setItem('authUser', JSON.stringify({ ...JSON.parse(localStorage.getItem('authUser') || '{}'), profileImage: data.user.profileImage }));
        }

        const mergedUser = {
          ...editedUser,
          profileImage: updatedUser.profileImage || editedUser.profileImage,
          dateOfBirth: formattedDateOfBirth,
          joinDate: user.joinDate
        };

        setUser(mergedUser);
        setEditedUser(mergedUser);
      }

      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (saveErr) {
      setError(saveErr.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setImagePreview(user.profileImage);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="user-profile-page">
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-profile-page">
        <div className="profile-container">
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-image-section">
            {isEditing ? (
              <div className="image-upload-box">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile Preview" className="profile-image-preview" />
                ) : (
                  <div className="image-placeholder">📷</div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                  id="imageInput"
                />
                <label htmlFor="imageInput" className="upload-label">
                  Change Photo
                </label>
              </div>
            ) : (
              <div className="profile-image-display">
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="profile-image" />
                ) : (
                  <div className="image-placeholder-large">👤</div>
                )}
              </div>
            )}
          </div>

          <div className="profile-info-section">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="edit-input-large"
              />
            ) : (
              <h1 className="profile-name">{user.name}</h1>
            )}
            <p className="profile-email">{maskEmail(user.email)}</p>
            <p className="join-date">Member since {user.joinDate}</p>
            <p style={{ 
              marginTop: '0.5rem', 
              display: 'inline-block', 
              padding: '0.4rem 0.8rem',
              backgroundColor: user.role === 'admin' ? '#FF5E89' : '#9c27b0',
              color: 'white',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold',
              textTransform: 'capitalize'
            }}>
              {user.role} Account
            </p>
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn btn-primary edit-btn" onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn btn-primary save-btn" onClick={handleSaveProfile}>
                  💾 Save
                </button>
                <button className="btn btn-secondary cancel-btn" onClick={handleCancel}>
                  ✕ Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="profile-details">
          <h2>Personal Information</h2>

          <div className="details-grid">
            <div className="detail-item">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.name}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.email}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={editedUser.phone}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.phone}</p>
              )}
            </div>

            <div className="detail-item">
              <label>City</label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={editedUser.city}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.city}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editedUser.dateOfBirth}
                  onChange={handleInputChange}
                  className="edit-input"
                />
              ) : (
                <p>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
              )}
            </div>

            <div className="detail-item">
              <label>Member Since</label>
              <p>{user.joinDate}</p>
            </div>
          </div>

          <div className="bio-section">
            <label>Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                value={editedUser.bio}
                onChange={handleInputChange}
                className="edit-textarea"
                rows="4"
              />
            ) : (
              <p>{user.bio}</p>
            )}
          </div>
        </div>

        {/* Settings Section */}
        
        {/* Dashboard Stats Section */}
        <div className="dashboard-stats">
          <h2>Your Safety Dashboard</h2>
          <div className="stats-grid">
            {/* Current Location Card */}
            <div className="stat-card">
              <div className="stat-icon">📍</div>
              <h3>Current Location</h3>
              <p className="stat-value">Unknown, Maharashtra</p>
              <p className="stat-detail">Coordinates: 19.2448°, 72.8704°</p>
            </div>

            {/* Safety Status Card */}
            <div className="stat-card">
              <div className="stat-icon">🔒</div>
              <h3>Safety Status</h3>
              <p className="stat-value active">Active</p>
              <p className="stat-detail">Your profile is secure and up to date</p>
            </div>

            {/* Community Card */}
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <h3>Community</h3>
              <p className="stat-value">2,543</p>
              <p className="stat-detail">Active members nearby</p>
            </div>

            {/* Resources Card */}
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <h3>Resources</h3>
              <p className="stat-value">127</p>
              <p className="stat-detail">Safety articles and guides</p>
            </div>
          </div>
        </div>

        {/* Location Map Section */}
        <div className="location-map-section">
          <h2>Your Live Location Map</h2>
          <button className="refresh-location-btn">
            🔄 Refresh Location
          </button>
          <div className="map-container">
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.82%2C19.07%2C72.92%2C19.27&layer=mapnik&marker=19.2248%2C72.8704"
              style={{ borderRadius: '8px' }}
              title="User Location Map"
            ></iframe>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="recent-activity-section">
          <h2>Recent Activity</h2>
          <div className="activity-timeline">
            <div className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-content">
                <h4>Profile updated successfully</h4>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <h4>Completed "Know Your Rights" module</h4>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">💬</div>
              <div className="activity-content">
                <h4>Joined community forum discussion</h4>
                <p className="activity-time">3 days ago</p>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon">📱</div>
              <div className="activity-content">
                <h4>Registered for self-defense workshop</h4>
                <p className="activity-time">1 week ago</p>
              </div>
            </div>
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default UserProfile;
