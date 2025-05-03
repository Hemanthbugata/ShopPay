import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';

// AppContent component that uses hooks within the CookiesProvider context
const AppContent = () => {
  const [cookies, removeCookie] = useCookies(['otp']);
  const isAuthenticated = !!cookies.otp; // Check if the user is authenticated

  const handleLogout = () => {
    removeCookie('otp');
  };

  return (
    <Router>
      <Routes>
        {/* Redirect to dashboard if authenticated, otherwise show login */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />

        {/* Show dashboard if authenticated, otherwise redirect to login */}
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />

        {/* Default route redirects to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch-all route for undefined paths */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

// Main App component that provides the CookiesProvider context
const App = () => {
  return (
    <CookiesProvider>
      <AppContent />
    </CookiesProvider>
  );
};

export default App;