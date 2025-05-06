const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/validation'); // Assuming you have a User model for MongoDB

// GET method to fetch user details
router.get('/users', async (req, res) => {
  try {
    const mobileNumber = req.query.mobileNumber; // Assuming mobileNumber is passed as a parameter
    const user = await User.findOne( { mobileNumber } ); // Find user by mobile number

    console.log('Received mobile number:', mobileNumber); // Log the received mobile number for debugging

    if (!user.mobileNumber) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User details:', user); // Log user details for debugging

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT method to update user details
router.put('/users', async (req, res) => {
    try {
      const { mobileNumber, name, address, email } = req.body;
  
      const user = await User.findOneAndUpdate(
        { mobileNumber },
        { name, address, email },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User details updated successfully', user });
    } catch (error) {
      console.error('Error updating user details:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/users', async (req, res) => {
  try {
    const { mobileNumber, role } = req.query; // Extract mobileNumber and role from query parameters

    // Build the query object dynamically
    const query = {};
    if (mobileNumber) query.mobileNumber = mobileNumber;
    if (role) query.role = role;

    const users = await User.find(query); // Find users based on the query

    console.log('Query parameters:', query); // Log the query parameters for debugging

    if (users.length === 0) {
      return res.status(404).json({ error: 'No users found' });
    }

    console.log('Fetched users:', users); // Log the fetched users for debugging

    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET method to fetch user details
router.get('/Outlets', async (req, res) => {
  try {
    const { mobileNumber, otp, role } = req.query; // Extract query parameters
    // Validate admin credentials

    const admin = await User.findOne({ mobileNumber, otp, role });
    if (!admin || admin.role !== 'admin') {
      return res.status(401).json({ error: 'Unauthorized access' });
    }

    // Fetch users with role 'Outlet'
    const outlets = await User.find({ role: 'outlet' });
    // if (outlets.length === 0) {
    //   return res.status(404).json({ error: 'No outlets found' });
    // }

    // Add new fields to the output
    const updatedOutlets = outlets.map((outlet) => ({
      ...outlet._doc, // Spread the existing fields from the MongoDB document
      mobileNumberOutlet: outlet.mobileNumber, // Map mobileNumber to mobileNumberOutlet
      otpOutlet: outlet.otp, // Map otp to otpOutlet
    }));

    res.status(200).json(updatedOutlets);
  } catch (error) {
    console.error('Error fetching outlets:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST method to create a user with role 'Outlet'
router.post('/Outlets', async (req, res) => {
  try {
    const { mobileNumber, otp, date, name, email, address, role , mobileNumberOutlet, otpOutlet } = req.body;

    console.log('Received data:', req.body); // Log the received data for debugging
    // Validate admin credentials
    // Validate required fields
    if ( !mobileNumber || !otp ){
      return res.status(400).json({ error: 'Mobile number and otp required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ mobileNumberOutlet });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this mobile number already exists' });
    }

    // Create a new user with role 'Outlet'
    const newUser = new User({
      name,
      mobileNumber: mobileNumberOutlet,
      otp: otpOutlet,
      email,
      date,
      address,
      role: 'outlet',
    });

    // Save the user to the database
    await newUser.save();
    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT method to update a user with role 'Outlet'
router.put('/Outlets', async (req, res) => {
  try {
    const { mobileNumber, name, email, address, otp, date, mobileNumberOutlet, otpOutlet } = req.body;

    // Validate required fields
    if (!mobileNumber) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    // Find and update the user with the role 'Outlet'
    const updatedUser = await User.findOneAndUpdate(
      { mobileNumber: mobileNumberOutlet, role: 'outlet' }, // Ensure the user has the role 'Outlet'
      { name, email, address, otp: otpOutlet, date }, // Fields to update
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User with role Outlet not found' });
    }

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});
module.exports = router;