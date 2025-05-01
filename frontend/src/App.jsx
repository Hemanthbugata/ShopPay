import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import LoginPage from './components/Loginpage';
import Dashboard from './components/Dashboard';
import { Navigate } from 'react-router-dom';
import './App.css';

// AppContent component that uses hooks within the CookiesProvider context
const AppContent = () => {
  const [cookies, removeCookie] = useCookies(['otp']);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    let isMounted = true;
    
    // Check if the user is authenticated
    if (cookies.otp && isMounted) {
      setIsAuthenticated(true);
    }
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [cookies]);
  
  const handleLogout = () => {
    removeCookie('otp');
    setIsAuthenticated(false);
  };
  
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/login" />} />
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