import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['otp', 'mobileNumber', 'role']);
  const navigate = useNavigate(); // Initialize navigate function

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setErrorMessage('Mobile number is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { mobileNumber });
      if (response.data.message === 'OTP sent successfully') {
        let role = response.data.role; // Get the role from the response
        setCookie('role', role, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // Set the role cookie
        alert('OTP sent successfully. Please enter the OTP.');
        setErrorMessage('Otp sent successfully');              
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
      const role = cookies.role; // Get the role from cookies
      const response = await axios.post('http://localhost:5000/verify-otp', {
        mobileNumber,
        otp,
        role, // Include the role in the request
      });

      if (response.data.message === 'OTP verified successfully') {
        setCookie('otp', otp, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // Set the OTP cookie
        setCookie('mobileNumber', mobileNumber, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // Set the mobile number cookie
        alert('Login successfully. Redirecting to dashboard...');
        if (role === 'admin') {
          navigate('/dashboard'); // Redirect to admin dashboard
        } else if (role === 'user') {
          navigate('/userhomepage'); // Redirect to user dashboard
        }
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('Invalid OTP');
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login User</h2>
        <div>
          <input
            type="text"
            placeholder="Enter mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
        {mobileNumber && (
          <div>
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