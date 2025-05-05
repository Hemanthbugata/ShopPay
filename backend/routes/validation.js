const express = require('express');
const router = express.Router();
const Otp = require('../models/validation'); // Assuming you have a User model for MongoDB
const mongoose = require('mongoose');

router.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;
  let role = 'user'; // Default role

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }
  if ( mobileNumber === '8860881255') { 
     role = 'admin'; 
  } else { role = 'user'; } 

  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log('Generated OTP:', otp);
  try {
    // Save OTP to MongoDB
    const otpEntry = await Otp.findOneAndUpdate(
      { mobileNumber },
      { 
        otp,         
        date: Date.now() + (365 * 24 * 60 * 60 * 1000), // OTP valid for 10 minutes
        role, 
      },
      { 
        new: true, 
        upsert: true 
      }
    );    

    console.log('OTP saved to MongoDB:', otpEntry);

    res.status(200).json({ message: 'OTP sent successfully', role: role });

    // Send OTP via SMS
    // const response = await axios.post('http://cloud.smsindiahub.in/api/mt/SendSMS', {
    //   account: {
    //     user: process.env.SMS_USER,
    //     password: process.env.SMS_PASSWORD,
    //     senderid: 'SMSHUB',
    //     channel: 'Trans',
    //     DCS: '0',
    //     flashsms: '0',
    //   },
    //   messages: [
    //     {
    //       number: mobileNumber,
    //       text: `Welcome to ShopPay. Your OTP is: ${otp}`,
    //     },
    //   ],
    // });

    // if (response.data.ErrorCode === '000') {
    //   res.status(200).json({ message: 'OTP sent successfully' });
    // } else {
    //    res.status(500).json({ message: 'Error sending OTP', error: response.data.ErrorMessage });
    // }
  } catch (error) {
    console.error('Error saving OTP to MongoDB:', error);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp, role } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    // Find OTP in MongoDB
    // const otpEntry = await Otp.findOne({ mobileNumber, otp, role });
    const otpEntry = await Otp.findOne({ mobileNumber });

    console.log('OTP entry:', otpEntry);
    if ( otpEntry.otp != otp ) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if ( otpEntry.role != role ) {
      return res.status(400).json({ message: 'Invalid Login ' });
    }

    if (Date.now() > otpEntry.expiry) {
      await Otp.deleteOne({ _id: otpEntry._id }); // Delete expired OTP
      return res.status(400).json({ message: 'Session expired, Please login again' });
    }

    // OTP is valid
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
});

module.exports = router;