const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(bodyParser.json());

let otpStore = {}; 

// Send OTP API
app.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  // Generate a 4-digit OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  // Store the OTP temporarily for that mobile number
  otpStore[mobileNumber] = otp;

  try {
    // Send OTP via SMSIndiaHub API using POST method with JSON data
    const response = await axios.post('http://cloud.smsindiahub.in/api/mt/SendSMS', {
      account: {
        user: 'myfcoin',
        password: 'myfcoin@sms01',
        senderid: 'SMSHUB',
        channel: 'Trans',
        DCS: '0',
        flashsms: '0'
      },
      messages: [{
        number: mobileNumber,
        text: `Welcome to the nxlgames powered by SMSINDIAHUB. Your OTP for registration is: ${otp}`
      }]
    });

     console.log('SMSIndiaHub Response:', response.data);

     if (response.data.ErrorCode === '000') {  
        res.status(200).json({ message: 'OTP sent successfully' });
      } else {
        res.status(500).json({ message: 'Error sending OTP', error: response.data.ErrorMessage });
      }
    } 
catch (error) {
      console.error('Error sending OTP:', error);
      res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
});

app.post('/verify-otp', (req, res) => {
    const { mobileNumber, otp } = req.body;
  
    if (!mobileNumber || !otp) {
      return res.status(400).json({ message: 'Mobile number and OTP are required' });
    }
  
    // Check if the OTP is valid
    if (otpStore[mobileNumber] && otpStore[mobileNumber] === parseInt(otp)) {
      // OTP matched, return success
      res.status(200).json({ message: 'OTP verified successfully' });
      // Optionally, delete OTP after successful verification
      delete otpStore[mobileNumber];
    } else {
      // OTP did not match
      res.status(400).json({ message: 'Invalid OTP' });
    }
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
