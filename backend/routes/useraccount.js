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

module.exports = router;