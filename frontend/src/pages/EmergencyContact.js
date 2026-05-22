import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Pages.css';
import './EmergencyContact.css';

function EmergencyContact() {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const MAX_CONTACTS = 5;

  // Load contacts from localStorage on mount
  useEffect(() => {
    if (user) {
      const storedContacts = localStorage.getItem(`emergency-contacts-${user.id}`);
      if (storedContacts) {
        setContacts(JSON.parse(storedContacts));
      }
    }
  }, [user]);

  // Save contacts to localStorage
  const saveContactsToLocalStorage = (updatedContacts) => {
    if (user) {
      localStorage.setItem(`emergency-contacts-${user.id}`, JSON.stringify(updatedContacts));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage('Name is required');
      return false;
    }
    if (!formData.relationship.trim()) {
      setErrorMessage('Relationship is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Phone number is required');
      return false;
    }
    // Basic phone number validation
    const phoneRegex = /^[0-9\-+\s()]{10,}$/;
    if (!phoneRegex.test(formData.phone)) {
      setErrorMessage('Please enter a valid phone number');
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleAddContact = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) {
      return;
    }

    if (contacts.length >= MAX_CONTACTS && !editingId) {
      setErrorMessage(`You can only add up to ${MAX_CONTACTS} emergency contacts`);
      return;
    }

    if (editingId) {
      const updatedContacts = contacts.map(contact =>
        contact.id === editingId
          ? { ...contact, ...formData, updatedAt: new Date().toISOString() }
          : contact
      );
      setContacts(updatedContacts);
      saveContactsToLocalStorage(updatedContacts);
      setSuccessMessage('Contact updated successfully!');
      setEditingId(null);
    } else {
      const newContact = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      const updatedContacts = [...contacts, newContact];
      setContacts(updatedContacts);
      saveContactsToLocalStorage(updatedContacts);
      setSuccessMessage('Contact added successfully!');
    }

    // Reset form
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: ''
    });
    setShowForm(false);

    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleEditContact = (contact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      phone: contact.phone,
      email: contact.email
    });
    setEditingId(contact.id);
    setShowForm(true);
    setErrorMessage('');
  };

  const handleDeleteContact = (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      saveContactsToLocalStorage(updatedContacts);
      setSuccessMessage('Contact deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      relationship: '',
      phone: '',
      email: ''
    });
    setErrorMessage('');
  };

  const relationshipOptions = [
    'Friend',
    'Family',
    'Parent',
    'Sibling',
    'Spouse',
    'Relative',
    'Colleague',
    'Neighbor',
    'Other'
  ];

  if (!user) {
    return (
      <div className="page emergency-contact-page">
        <div className="hero">
          <h1>Emergency Contacts</h1>
          <p>Manage your emergency contacts for quick assistance</p>
        </div>
        <div className="login-prompt-section">
          <p>Please log in to manage your emergency contacts.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page emergency-contact-page">
      <div className="hero">
        <h1>Emergency Contacts</h1>
        <p>Save up to 5 trusted contacts for quick assistance in emergencies</p>
      </div>

      <section className="content-section emergency-contact-section">
        {/* Messages */}
        {errorMessage && (
          <div className="alert alert-error">
            <span className="alert-icon">⚠️</span>
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="alert alert-success">
            <span className="alert-icon">✓</span>
            {successMessage}
          </div>
        )}

        {/* Contact Count */}
        <div className="contact-counter">
          <p>Contacts saved: <strong>{contacts.length}/{MAX_CONTACTS}</strong></p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(contacts.length / MAX_CONTACTS) * 100}%` }}></div>
          </div>
        </div>

        {/* Add Contact Button */}
        {!showForm && contacts.length < MAX_CONTACTS && (
          <button
            className="btn btn-primary btn-add-contact"
            onClick={() => setShowForm(true)}
          >
            + Add Emergency Contact
          </button>
        )}

        {/* Form */}
        {showForm && (
          <div className="contact-form-container">
            <form className="contact-form" onSubmit={handleAddContact}>
              <h3>{editingId ? 'Edit Contact' : 'Add New Emergency Contact'}</h3>

              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  maxLength="50"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="relationship">Relationship *</label>
                <select
                  id="relationship"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a relationship</option>
                  {relationshipOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  maxLength="20"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email (Optional)</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  maxLength="50"
                />
              </div>

              <div className="form-buttons">
                <button type="submit" className="btn btn-primary">
                  {editingId ? 'Update Contact' : 'Add Contact'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contacts List */}
        {contacts.length > 0 && (
          <div className="contacts-list">
            <h3>Your Emergency Contacts</h3>
            <div className="contacts-grid">
              {contacts.map(contact => (
                <div key={contact.id} className="contact-card">
                  <div className="contact-header">
                    <h4>{contact.name}</h4>
                    <span className="relationship-badge">{contact.relationship}</span>
                  </div>
                  <div className="contact-details">
                    <div className="contact-item">
                      <span className="label">📱 Phone:</span>
                      <a href={`tel:${contact.phone}`} className="phone-link">{contact.phone}</a>
                    </div>
                    {contact.email && (
                      <div className="contact-item">
                        <span className="label">📧 Email:</span>
                        <a href={`mailto:${contact.email}`} className="email-link">{contact.email}</a>
                      </div>
                    )}
                  </div>
                  <div className="contact-actions">
                    <a
                      href={`tel:${contact.phone}`}
                      className="btn btn-small btn-call"
                      title="Call now"
                    >
                      📞 Call
                    </a>
                    <button
                      className="btn btn-small btn-edit"
                      onClick={() => handleEditContact(contact)}
                      title="Edit contact"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-small btn-delete"
                      onClick={() => handleDeleteContact(contact.id)}
                      title="Delete contact"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {contacts.length === 0 && !showForm && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No Emergency Contacts Yet</h3>
            <p>Add trusted contacts to reach out in case of emergencies</p>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add Your First Contact
            </button>
          </div>
        )}
      </section>

      {/* Tips Section */}
      <section className="content-section tips-section">
        <h2>Tips for Emergency Contacts</h2>
        <div className="tips-grid">
          <div className="tip-card">
            <div className="tip-icon">✅</div>
            <h4>Choose Reliable People</h4>
            <p>Select people you trust completely and who are likely to be available in emergencies.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">📱</div>
            <h4>Keep Numbers Updated</h4>
            <p>Regularly update contact numbers to ensure they are current and reachable.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🔔</div>
            <h4>Inform Your Contacts</h4>
            <p>Let your emergency contacts know that they are listed and why you chose them.</p>
          </div>
          <div className="tip-card">
            <div className="tip-icon">🌐</div>
            <h4>Diverse Network</h4>
            <p>Have a mix of family, friends, and neighbors to ensure you can reach someone anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EmergencyContact;
