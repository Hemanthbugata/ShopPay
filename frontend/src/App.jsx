import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { CookiesProvider, useCookies } from 'react-cookie';
import Dashboard from './components/Dashboard';
import LoginPage from './components/Loginpage'; // Import the LoginPage component
import Userhomepage from './components/Userhomepage'; // Import the UserhomePage component
import ProductEntry from './components/ProductEntry';
import ProductList from './components/ProductList'; 
import './App.css';

// AppContent component that uses hooks within the CookiesProvider context
const AppContent = () => {
  const [cookies, removeCookie] = useCookies(['otp', 'mobileNumber', 'role']); // Use useCookies to handle cookies
  const isAuthenticated =  cookies.otp; // Check if the user is authenticated
  const userRole = cookies.role; // Get the user's role from cookies
  const isMobileNumber = cookies.mobileNumber; // Get the mobile number from cookies

  const handleLogout = () => {
    removeCookie('otp');
    removeCookie('role'); 
    removeCookie('mobileNumber');
  };

  return (
    <Router>  
      <Routes>
        {/* Redirect to dashboard if authenticated, otherwise show login */}
        <Route
          path="/login"
          element={
            isMobileNumber === undefined ? (
              isAuthenticated ? (
                userRole === 'admin' ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/userhomepage" />
                )
              ) : (
                <LoginPage />
              )
            ) : (
              <LoginPage />
            )
          }
        />      

        {/* Admin dashboard */}
        <Route
          path="/dashboard"
          element={isAuthenticated && userRole === 'admin' 
            ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* User homepage */}
        <Route
          path="/userhomepage"
          element={isAuthenticated && userRole === 'user'
             ? <Userhomepage onLogout={handleLogout} /> : <Navigate to="/login" />}
        />

        {/* Product list and entry routes */}
        <Route
          path="/product-list"
          element={isAuthenticated && userRole === 'admin' 
            ? <ProductList /> : <Navigate to="/login" />}
        />
        <Route
          path="/product-entry"
          element={isAuthenticated && userRole === 'admin' 
            ? <ProductEntry /> : <Navigate to="/login" />}
        />

        {/* Default route */}
        <Route
          path="/"
          element={
            isAuthenticated
              ? userRole === 'admin'
                ? <Navigate to="/dashboard" />
                : <Navigate to="/userhomepage" />
              : <Navigate to="/login" />
          }
        />

        {/* Catch-all route */}
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