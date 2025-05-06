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
    role: {
        type: String,
        enum: ["user", "admin" , "outlet", "employee" ],  // Only allows 'user' or 'admin'
        required: false,
        default: "user",
    },
    name: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
        match: /^\S+@\S+\.\S+$/, // Basic email format validation
    },
});

module.exports = mongoose.model("Otp", otpSchema);