const express = require('express');
const dotenv = require('dotenv');
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
const Otp = require('./models/validation'); // Import the OTP model

const app = express();

dotenv.config();

app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json());
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', cartRouter);
app.use('/api', orderRouter);
app.use('/api', paymentRouter);
app.use('/api', reviewRouter);
app.use('/api', searchRouter);

// Send OTP
app.post('/send-otp', async (req, res) => {
  const { mobileNumber } = req.body;

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  console.log('Generated OTP:', otp);
  try {
    // Save OTP to MongoDB
    const otpEntry = await Otp.findOneAndUpdate(
      { mobileNumber },
      { 
        otp, 
        date: Date.now() + (10 * 60 * 1000) // OTP valid for 10 minutes
      },
      { 
        new: true, 
        upsert: true 
      }
    );    

    console.log('OTP saved to MongoDB:', otpEntry);

    res.status(200).json({ message: 'OTP sent successfully'});

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
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
});

// Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { mobileNumber, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ message: 'OTP is required' });
  }

  if (!mobileNumber) {
    return res.status(400).json({ message: 'Mobile number is required' });
  }

  try {
    // Find OTP in MongoDB
    const otpEntry = await Otp.findOne({ mobileNumber, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: 'Invalid OTP' });
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});