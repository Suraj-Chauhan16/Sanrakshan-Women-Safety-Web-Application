import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SOS from './components/SOS';
import Home from './pages/Home';
import About from './pages/About';
import ContactUs from './pages/ContactUs';
import EmergencyContact from './pages/EmergencyContact';
import KnowYourRights from './pages/KnowYourRights';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import UserProfile from './pages/UserProfile';
import Admin from './pages/Admin';
import SOSPage from './pages/SOSPage';
import './App.css';

// Protected Route for User Pages
function ProtectedUserRoute({ element }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return element;
}

// Protected Route for Admin Pages
function ProtectedAdminRoute({ element }) {
  const { user, isAdmin } = useAuth();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return element;
}

function AppContent() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <SOS />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/emergency-contact" element={<ProtectedUserRoute element={<EmergencyContact />} />} />
            <Route path="/know-your-rights" element={<KnowYourRights />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/sos" element={<ProtectedUserRoute element={<SOSPage />} />} />
            
            {/* User Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-register" element={<AdminRegister />} />
            
            {/* Protected User Routes */}
            <Route path="/profile" element={<ProtectedUserRoute element={<UserProfile />} />} />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute element={<Admin />} />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
