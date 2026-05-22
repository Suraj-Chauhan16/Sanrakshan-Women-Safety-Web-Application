import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Pages.css';

function AdminLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      await login(formData.email, formData.password, 'admin');
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page login-page">
      <div className="form-container">
        <div className="form-box">
          <h1>Admin Login</h1>
          <p>Sign in to your Women Safety Admin account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <div style={{
              padding: '1rem',
              backgroundColor: '#FFF3E0',
              borderRadius: '5px',
              marginBottom: '1rem',
              border: '1px solid #FFB74D',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{ fontSize: '1.2rem' }}>🔐</span>
              <span style={{ color: '#E65100', fontWeight: 'bold', fontSize: '0.9rem' }}>
                Admin-Only Access Required
              </span>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Admin Login'}
            </button>
          </form>

          <div className="form-footer">
            <p>
              Don't have an admin account?{' '}
              <Link to="/admin-register">Create Admin Account</Link>
            </p>
            <p>
              User login?{' '}
              <Link to="/login">User Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
