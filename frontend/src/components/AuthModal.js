import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: '',
  });

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    city: '',
    agreeTerms: false,
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleRegisterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setRegisterForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!loginForm.email || !loginForm.password) {
      setError('Please fill in all fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const userRole = isAdminMode ? 'admin' : 'user';
      await login(loginForm.email, loginForm.password, userRole);
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (
      !registerForm.fullName ||
      !registerForm.email ||
      !registerForm.password ||
      !registerForm.confirmPassword
    ) {
      setError('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!registerForm.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      console.log('🔐 AuthModal registering with:', {
        name: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
        role: 'user'
      });
      await register(registerForm.fullName, registerForm.email, registerForm.password, 'user');
      navigate('/');
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {error && <div className="error-message">{error}</div>}

        {isLogin ? (
          // Login Form
          <div className="auth-form-container">
            <h2>Welcome Back</h2>
            <p>Login to your Women Safety account</p>

            {/* Admin Toggle */}
            <div className="admin-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={isAdminMode}
                  onChange={(e) => setIsAdminMode(e.target.checked)}
                />
                <span>Admin Login</span>
              </label>
            </div>

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group password-group">
                <label htmlFor="password">Password</label>
                <div className="password-field-wrapper">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowLoginPassword((prev) => !prev)}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setIsAdminMode(false);
                  }}
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        ) : (
          // Register Form
          <div className="auth-form-container">
            <h2>Create Account</h2>
            <p>Join Women Safety community</p>

            <form onSubmit={handleRegisterSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    placeholder="Enter your phone"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dateOfBirth">Date of Birth</label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={registerForm.dateOfBirth}
                    onChange={handleRegisterChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={registerForm.city}
                    onChange={handleRegisterChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group password-group">
                  <label htmlFor="password">Password</label>
                  <div className="password-field-wrapper">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={registerForm.password}
                      onChange={handleRegisterChange}
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                <div className="form-group password-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <div className="password-field-wrapper">
                    <input
                      type={showRegisterPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={registerForm.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirm password"
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowRegisterPassword((prev) => !prev)}
                      aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                    >
                      {showRegisterPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={registerForm.agreeTerms}
                    onChange={handleRegisterChange}
                    required
                  />
                  I agree to the Terms and Conditions
                </label>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  className="toggle-link"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                  }}
                >
                  Login here
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;
