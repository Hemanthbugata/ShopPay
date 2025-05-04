import React, { useState } from 'react';
import { useCookies } from 'react-cookie'; // Import useCookies
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

const Loginpage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cookies, setCookie] = useCookies(['otp', 'role']); // Use useCookies to handle cookies
  const navigate = useNavigate(); // Initialize navigate function

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      setErrorMessage('Mobile number is required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/send-otp', { mobileNumber });
      if (response.data.message === 'OTP sent successfully') {
        alert('OTP sent successfully. Please enter the OTP.');                
        setCookie('role', response.data.role, { path: '/', maxAge: 60 * 60 * 24 * 365 * 1000 }); // Save role
        setErrorMessage('send otp successfully');               
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
        role
      });
  
      if (response.data.message === 'OTP verified successfully') {
        setCookie('otp', otp, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // Set the OTP cookie
        setCookie('mobileNumber', mobileNumber, { path: '/', maxAge: 60 * 60 * 24 * 365 }); // Save mobile number  
        alert('Login successfully. Redirecting to dashboard...');
        if (role === 'admin') {
          navigate('/dashboard'); // Redirect to admin dashboard
        } else {  
          alert('Login successfully. Redirecting to dashboard...'); // Alert for successful login
        navigate('/userhomepage'); // Redirect to dashboard
        }
      } 
    } catch (error) {
     // setErrorMessage(`Invalid OTP. Role: ${role}`); // Set error message for invalid OTP
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

export default Loginpage;