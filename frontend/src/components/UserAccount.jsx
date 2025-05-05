import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import '../styles/UserAccount.css';

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  address: yup.string().required('Address is required').min(10, 'Address must be at least 10 characters'),
});

const UserAccount = () => {
  const [cookies] = useCookies(['mobileNumber']);
  const [isEditing, setIsEditing] = useState({ name: false, email: false, address: false });
  const [userDetails, setUserDetails] = useState({ name: '', email: '', mobile: '', address: '' });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Fetch user details on component mount
  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users', {
          params: { mobileNumber: cookies.mobileNumber },
        });
        setUserDetails(response.data);
        setValue('name', response.data.name);
        setValue('email', response.data.email);
        setValue('mobile', response.data.mobileNumber);
        setValue('address', response.data.address);
      } catch (error) {
        console.error('Error fetching user details:', error.response?.data || error.message);
      }
    };

    fetchUserDetails();
  }, [cookies.mobileNumber, setValue]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const payload = { ...data, mobileNumber: cookies.mobileNumber };
      await axios.put(`http://localhost:5000/users`, payload);
      alert('User details updated successfully!');
      setIsEditing({ name: false, email: false, address: false });
    } catch (error) {
      console.error('Error updating user details:', error.response?.data || error.message);
      alert('Failed to update user details.');
    }
  };

  return (
    <div className="user-account-container">
      <h2>Update User Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name Field */}
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <div className="editable-field">
            <input
              type="text"
              id="name"
              {...register('name')}
              placeholder="Enter your name"
              disabled={!isEditing.name}
            />
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditing((prev) => ({ ...prev, name: !prev.name }))}
            >
              {isEditing.name ? 'Save' : 'Edit'}
            </button>
          </div>
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <div className="editable-field">
            <input
              type="email"
              id="email"
              {...register('email')}
              placeholder="Enter your email"
              disabled={!isEditing.email}
            />
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditing((prev) => ({ ...prev, email: !prev.email }))}
            >
              {isEditing.email ? 'Save' : 'Edit'}
            </button>
          </div>
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Mobile Number Field */}
        <div className="form-group">
          <label htmlFor="mobile">Mobile Number:</label>
          <input
            type="text"
            id="mobile"
            {...register('mobile')}
            value={cookies.mobileNumber}
            disabled
          />
        </div>

        {/* Address Field */}
        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <div className="editable-field">
            <textarea
              id="address"
              {...register('address')}
              placeholder="Enter your address"
              disabled={!isEditing.address}
            ></textarea>
            <button
              type="button"
              className="edit-button"
              onClick={() => setIsEditing((prev) => ({ ...prev, address: !prev.address }))}
            >
              {isEditing.address ? 'Save' : 'Edit'}
            </button>
          </div>
          {errors.address && <p className="error">{errors.address.message}</p>}
        </div>

        <button type="submit" className="submit-button">
          Save
        </button>
      </form>
    </div>
  );
};

export default UserAccount;