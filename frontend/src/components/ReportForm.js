import React, { useState } from 'react';
import '../pages/Pages.css';

function ReportForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    type: 'Safety Concern',
    description: '',
    reporterName: '',
    reporterEmail: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const reportTypes = [
    'Safety Concern',
    'Inappropriate Content',
    'Account Issue',
    'Bug Report',
    'Feature Request',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.description.trim()) {
        setError('Please provide a description');
        setLoading(false);
        return;
      }

      if (formData.description.trim().length < 10) {
        setError('Description must be at least 10 characters');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: formData.type,
          description: formData.description.trim(),
          reporterName: formData.reporterName || 'Anonymous',
          reporterEmail: formData.reporterEmail
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      setSuccess(true);
      setFormData({
        type: 'Safety Concern',
        description: '',
        reporterName: '',
        reporterEmail: ''
      });

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error submitting report:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{
        backgroundColor: '#f0f7ff',
        border: '2px solid #4CAF50',
        borderRadius: '8px',
        padding: '30px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '20px auto'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>✅</div>
        <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>Report Submitted!</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Thank you for reporting this issue. Our team will review it shortly.
        </p>
        <p style={{ color: '#999', fontSize: '12px' }}>
          Reference ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: '0 auto',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#7c3aed', margin: 0 }}>📋 Submit a Report</h2>
        {onClose && (
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '12px',
          borderRadius: '4px',
          marginBottom: '20px',
          border: '1px solid #ef5350'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Report Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Report Type *
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit'
            }}
          >
            {reportTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Description * (minimum 10 characters)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Please provide detailed information about your report..."
            rows={6}
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#999', display: 'block', marginTop: '4px' }}>
            {formData.description.length}/2000 characters
          </small>
        </div>

        {/* Reporter Name */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Your Name (Optional - leave blank to remain anonymous)
          </label>
          <input
            type="text"
            name="reporterName"
            value={formData.reporterName}
            onChange={handleChange}
            placeholder="Your name"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Reporter Email */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
            Email Address (Optional)
          </label>
          <input
            type="email"
            name="reporterEmail"
            value={formData.reporterEmail}
            onChange={handleChange}
            placeholder="your.email@example.com"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#999', display: 'block', marginTop: '4px' }}>
            We'll use this to follow up on your report
          </small>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: loading ? '#ccc' : '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#6d28d9')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#7c3aed')}
          >
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#f3f4f6',
                color: '#333',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = '#e5e7eb')}
              onMouseOut={(e) => (e.target.style.backgroundColor = '#f3f4f6')}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <p style={{ color: '#999', fontSize: '12px', marginTop: '20px', textAlign: 'center' }}>
        Your report helps us maintain a safe community. All reports are treated confidentially.
      </p>
    </div>
  );
}

export default ReportForm;
