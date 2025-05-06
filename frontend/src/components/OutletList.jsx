import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OutletList = () => {
  const [outlets, setOutlets] = useState([]); // State to store outlets
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mobileNumberOutlet: '', // Input field for the outlet's mobile number
    otpOutlet: '', // Input field for OTP
    roleOutlet: 'Outlet', // Default role for outlets
    date: '',
    name: '',
    address: '',
    email: '',
  });
  const [isEditing, setIsEditing] = useState(false); // Track if editing mode is active
  const [cookies] = useCookies(['otp', 'mobileNumber', 'role']); // Read cookies

  useEffect(() => {
    fetchOutlets();
  }, []);

  const fetchOutlets = async () => {
    try {
      const response = await axios.get('http://localhost:5000/Outlets', {
        params: {
          mobileNumber: cookies.mobileNumber, // Read mobileNumber from cookies
          otp: cookies.otp,
          role: cookies.role,
        },
      });
      setOutlets(response.data); // Set the fetched outlets
    } catch (error) {
      console.error('Error fetching Outlets:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error fetching outlets');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        mobileNumber: cookies.mobileNumber, // Add mobileNumber from cookies
        otp: cookies.otp,
        role: cookies.role,
      };

      if (isEditing) {
        // Update outlet
        await axios.put(`http://localhost:5000/Outlets`, payload);
        alert('Outlet updated successfully');
      } else {
        // Create new outlet
        await axios.post('http://localhost:5000/Outlets', payload);
        alert('Outlet created successfully');
      }

      setFormData({
        mobileNumberOutlet: '',
        otpOutlet: '',
        date: '',
        roleOutlet: 'Outlet',
        name: '',
        address: '',
        email: '',
      });
      setIsEditing(false);
      fetchOutlets();
    } catch (error) {
      console.error('Error saving Outlet:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error saving Outlet');
    }
  };

  const handleEdit = (outlet) => {
    setFormData({
      mobileNumberOutlet: outlet.mobileNumberOutlet,
      otpOutlet: outlet.otpOutlet,
      roleOutlet: outlet.roleOutlet,
      date: outlet.date,
      name: outlet.name,
      address: outlet.address,
      email: outlet.email,
    });
    setIsEditing(true);
  };

  const handleDelete = async (mobileNumberOutlet) => {
    try {
      await axios.delete(`http://localhost:5000/Outlets`, {
        data: {
          mobileNumber: cookies.mobileNumber, // Add mobileNumber from cookies
          otp: cookies.otp,
          role: cookies.role,
          mobileNumberOutlet, // Add mobileNumberOutlet from input field
        },
      });
      alert('Outlet deleted successfully');
      fetchOutlets();
    } catch (error) {
      console.error('Error deleting Outlet:', error.response?.data || error.message);
      alert(error.response?.data?.error || 'Error deleting Outlet');
    }
  };

  return (
    <div className="outlet-entry-container">
      <h2>Outlet List</h2>

      {/* Form for creating/updating outlets */}
      <form onSubmit={handleSubmit} className="outlet-form">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="mobileNumberOutlet" // Input field for outlet's mobile number
          placeholder="Mobile Number (Outlet)"
          value={formData.mobileNumberOutlet}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="otpOutlet" // Input field for OTP
          placeholder="OTP"
          value={formData.otpOutlet}
          onChange={handleInputChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="submit-button">
          {isEditing ? 'Update Outlet' : 'Create Outlet'}
        </button>
      </form>

      {/* List of outlets */}
      <ul className="outlet-list">
        {outlets.map((outlet) => (
          <li key={outlet.mobileNumberOutlet} className="outlet-item">
            <div>
              <strong>
                {outlet.mobileNumberOutlet} - {outlet.name}
              </strong>
            </div>
            <div>
              <button onClick={() => handleEdit(outlet)} className="edit-button">
                Edit
              </button>
              <button onClick={() => handleDelete(outlet.mobileNumberOutlet)} className="delete-button">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OutletList;