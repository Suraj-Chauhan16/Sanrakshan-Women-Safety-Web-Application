import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ReportForm from '../components/ReportForm';
import './Pages.css';

function Reports() {
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#f5f3ff',
          padding: '40px 20px',
          borderRadius: '8px',
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#7c3aed', marginBottom: '10px' }}>📋 Report an Issue</h1>
          <p style={{ color: '#666', fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
            Help us maintain a safe and respectful community. Your feedback and reports are important to us.
          </p>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {!showForm ? (
            <>
              {/* Info Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  border: '2px solid #7c3aed',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>🛡️</div>
                  <h3 style={{ color: '#7c3aed', marginBottom: '10px' }}>Safety Concerns</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Report any safety concerns or threats you've witnessed or experienced.
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  border: '2px solid #ec4899',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>⚠️</div>
                  <h3 style={{ color: '#ec4899', marginBottom: '10px' }}>Inappropriate Content</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Report inappropriate, offensive, or harmful content on our platform.
                  </p>
                </div>

                <div style={{
                  backgroundColor: 'white',
                  padding: '30px',
                  borderRadius: '8px',
                  border: '2px solid #06b6d4',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <div style={{ fontSize: '40px', marginBottom: '15px' }}>🐛</div>
                  <h3 style={{ color: '#06b6d4', marginBottom: '10px' }}>Technical Issues</h3>
                  <p style={{ color: '#666', fontSize: '14px' }}>
                    Report bugs, technical problems, or feature requests.
                  </p>
                </div>
              </div>

              {/* Report Instructions */}
              <div style={{
                backgroundColor: '#f9fafb',
                padding: '30px',
                borderRadius: '8px',
                marginBottom: '40px'
              }}>
                <h2 style={{ color: '#333', marginBottom: '20px' }}>Why Report?</h2>
                <ul style={{ color: '#666', lineHeight: '1.8', fontSize: '15px' }}>
                  <li><strong>Help the Community:</strong> Your reports help us create a safer space for everyone</li>
                  <li><strong>Confidentiality:</strong> Reports can be submitted anonymously if you prefer</li>
                  <li><strong>Swift Action:</strong> We take all reports seriously and respond promptly</li>
                  <li><strong>No Retaliation:</strong> We protect reporters and maintain confidentiality</li>
                </ul>
              </div>

              {/* CTA Button */}
              <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: '15px 40px',
                    backgroundColor: '#7c3aed',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s'
                  }}
                  onMouseOver={(e) => (e.target.style.backgroundColor = '#6d28d9')}
                  onMouseOut={(e) => (e.target.style.backgroundColor = '#7c3aed')}
                >
                  📝 Submit a Report
                </button>
              </div>

              {/* FAQ Section */}
              <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <h2 style={{ color: '#333', marginBottom: '20px' }}>Frequently Asked Questions</h2>
                
                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: '#7c3aed', marginBottom: '8px' }}>Can I submit a report anonymously?</h4>
                  <p style={{ color: '#666', margin: 0 }}>Yes! You can leave the "Your Name" and "Email Address" fields blank to submit anonymously. However, providing your email helps us follow up with you.</p>
                </div>

                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: '#7c3aed', marginBottom: '8px' }}>How long does it take for reports to be reviewed?</h4>
                  <p style={{ color: '#666', margin: 0 }}>Our team reviews reports within 24-48 hours. Urgent safety concerns are prioritized and reviewed immediately.</p>
                </div>

                <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #e5e7eb' }}>
                  <h4 style={{ color: '#7c3aed', marginBottom: '8px' }}>What happens after I submit a report?</h4>
                  <p style={{ color: '#666', margin: 0 }}>We assess the report, take appropriate action, and if you provided your email, we'll update you on the status. All reports are handled confidentially.</p>
                </div>

                <div>
                  <h4 style={{ color: '#7c3aed', marginBottom: '8px' }}>Is my information kept confidential?</h4>
                  <p style={{ color: '#666', margin: 0 }}>Yes, your information is kept strictly confidential and only shared with authorized team members who need it to handle your report.</p>
                </div>
              </div>
            </>
          ) : (
            <ReportForm onClose={() => setShowForm(false)} onSuccess={() => {
              setShowForm(false);
              // Could show a success message or redirect
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;
