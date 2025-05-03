const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    mobileNumber: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{10}$/, // Ensures the mobile number is exactly 10 digits
    },
    otp: {
        type: String,
        required: true,
        match: /^\d{4}$/, // Ensures the OTP is exactly 4 digits
    },
    date: {
        type: Date,
        default: Date.now, // Automatically sets the current date
    },
});

module.exports = mongoose.model("Otp", otpSchema);