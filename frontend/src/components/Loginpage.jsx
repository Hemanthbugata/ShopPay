import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/LoginPage.css'; // Add a CSS file for better styling

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false); // Track OTP sent status
  const [cookies, setCookie] = useCookies(['otp', 'mobileNumber', 'role']);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setErrorMessage('Mobile number is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { mobileNumber });
      if (response.data.message === 'OTP sent successfully') {
        let role = response.data.role;
        setCookie('role', role, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        setIsOtpSent(true); // Show the OTP verification section
        setErrorMessage('OTP sent successfully');
      }
    } catch (error) {
      setErrorMessage('Error sending OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMessage('OTP is required');
      return;
    }

    try {
      const role = cookies.role;
      const response = await axios.post('http://localhost:5000/verify-otp', {
        mobileNumber,
        otp,
        role,
      });

      if (response.data.message === 'OTP verified successfully') {
        setCookie('otp', otp, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        setCookie('mobileNumber', mobileNumber, { path: '/', maxAge: 60 * 60 * 24 * 365 });
        alert('Login successful. Redirecting...');
        if (role === 'admin') {
          navigate('/dashboard');
        } else if (role === 'user') {
          navigate('/userhomepage');
        }
      }
    } catch (error) {
      setErrorMessage('Invalid OTP');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login User</h2>
        <div className="form-group">
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
        {isOtpSent && (
          <div className="form-group">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        )}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </div>
  );
};

export default LoginPage;