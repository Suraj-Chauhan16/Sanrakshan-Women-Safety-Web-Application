import React, { useState } from 'react';
import './Pages.css';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.subject.trim()) {
      errors.subject = 'Please enter a subject';
    }

    if (!formData.message.trim()) {
      errors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      errors.message = 'Message should be at least 10 characters';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setFieldErrors({});

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    try {
      console.log('Contact form submitted:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailClick = () => {
    window.location.href = 'mailto:info@womensafety.com';
  };

  const handlePhoneClick = () => {
    window.location.href = 'tel:+18007239839';
  };

  return (
    <div className="page contact-page">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Get in touch with our team.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <div className="contact-info-grid">
            <div className="contact-info-card" onClick={handleEmailClick}>
              <div className="info-icon">📧</div>
              <h3>Email</h3>
              <p>info@womensafety.com</p>
              <p className="info-description">We'll respond to your inquiry within 24 hours</p>
            </div>

            <div className="contact-info-card" onClick={handlePhoneClick}>
              <div className="info-icon">📱</div>
              <h3>Hotline</h3>
              <p>1-800-SAFETY (1-800-723-3839)</p>
              <p className="info-description">Available 24/7 for emergencies</p>
            </div>

            <div className="contact-info-card">
              <div className="info-icon">🌐</div>
              <h3>Website</h3>
              <p>www.womensafety.com</p>
              <p className="info-description">Visit our website for more resources</p>
            </div>

            <div className="contact-info-card">
              <div className="info-icon">📍</div>
              <h3>Address</h3>
              <p>Sanrakshan Tech Park Tower Borivali Mumbai, Maharashtra 400068</p>
              <p className="info-description">Dedicated to empowering women worldwide</p>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            {error && <div className="error-message">❌ {error}</div>}
            {success && (
              <div className="success-message">
                ✅ Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={fieldErrors.name ? 'input-error' : ''}
              />
              {fieldErrors.name && (
                <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={fieldErrors.email ? 'input-error' : ''}
                />
                {fieldErrors.email && (
                  <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone (optional)"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject">Subject *</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                className={fieldErrors.subject ? 'input-error' : ''}
              />
              {fieldErrors.subject && (
                <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  {fieldErrors.subject}
                </p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="6"
                className={fieldErrors.message ? 'input-error' : ''}
              ></textarea>
              {fieldErrors.message && (
                <p style={{ color: '#c33', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? '✉️ Sending...' : '📧 Send Message'}
            </button>
          </form>
        </div>
      </div>

      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>❓ How can I report an emergency?</h3>
            <p>If you're in immediate danger, please call your local emergency services or use our SOS feature (if logged in) to alert your emergency contacts instantly.</p>
          </div>

          <div className="faq-item">
            <h3>🔒 Is my information confidential?</h3>
            <p>Yes, we take your privacy very seriously. All personal information is encrypted and protected according to industry standards.</p>
          </div>

          <div className="faq-item">
            <h3>👥 How do I add emergency contacts?</h3>
            <p>Log in to your account and go to Emergency Contacts page to add trusted people who will be notified in case of emergency.</p>
          </div>

          <div className="faq-item">
            <h3>❌ Can I delete my account?</h3>
            <p>Yes, you can delete your account anytime from your profile settings. Please note this action is permanent.</p>
          </div>

          <div className="faq-item">
            <h3>📝 How do I submit a report?</h3>
            <p>Visit our Reports page and fill out the form with details about your concern. Our team will review and respond promptly.</p>
          </div>

          <div className="faq-item">
            <h3>💬 Who can I talk to for support?</h3>
            <p>You can reach out to us via email, phone, or this contact form. Our team is available 24/7 to assist you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
