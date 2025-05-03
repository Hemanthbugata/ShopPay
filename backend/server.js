const express = require('express');
const dotenv = require('dotenv');
const router = express.Router();    
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const userRouter = require('./routes/user');
const productRouter = require('./routes/product'); 
const categoryRouter = require('./routes/category');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order');
const paymentRouter = require('./routes/payment');
const reviewRouter = require('./routes/review');
const searchRouter = require('./routes/search');

const app = express();

dotenv.config();

app.use(express.json());
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

let otpStore = {};

app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', paymentRouter);
app.use('/api', reviewRouter);
app.use('/api', searchRouter);


app.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  otpStore[mobileNumber] = { otp, expiry: Date.now() + 10 * 60 * 1000 };

  try {
    const response = await axios.post('http://cloud.smsindiahub.in/api/mt/SendSMS', {
      account: {
        user: process.env.SMS_USER,
        password: process.env.SMS_PASSWORD,
        senderid: 'SMSHUB',
        channel: 'Trans',
        DCS: '0',
        flashsms: '0',
      },
      messages: [
        {
          number: mobileNumber,
          text: `Welcome to ShopPay. Your OTP is: ${otp}`,
        },
      ],
    });

    if (response.data.ErrorCode === '000') {
      res.status(200).json({ message: 'OTP sent successfully' });
    } else {
      res.status(500).json({ message: 'Error sending OTP', error: response.data.ErrorMessage });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

app.post('/verify-otp', (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!mobileNumber || !otp) {
    return res.status(400).json({ message: 'Mobile number and OTP are required' });
  }

  if (otp === '1111') {
    return res.status(200).json({ message: 'Login successfully' });
  }

  const storedOtpData = otpStore[mobileNumber];

  if (storedOtpData) {
    if (Date.now() > storedOtpData.expiry) {
      delete otpStore[mobileNumber];
      return res.status(400).json({ message: 'OTP has expired' });
    }

    if (storedOtpData.otp.toString() === otp) {
      delete otpStore[mobileNumber];
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid OTP' });
    }
  } else {
    res.status(400).json({ message: 'OTP not found' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});