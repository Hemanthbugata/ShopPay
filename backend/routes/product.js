const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const Counter = require('../models/counter'); 
const Otp = require('../models/validation'); 
// Create a new product

// Create a new product with auto-incremented ID
router.post('/products', async (req, res) => {
    const { name, description, price, variantOil, variantSpicy, mobileNumber, otp, variantType, variantWeight} = req.body;
    
    console.log('Received data:', req.body); // Log the received data for debugging
    try {
      // Validate OTP and mobile number
      const otpEntry = await Otp.findOne({ mobileNumber, otp });
      if (!otpEntry) {
        return res.status(401).json({ error: 'Invalid OTP or mobile number' });
      }
  
      // Check if OTP is expired
      if (otpEntry.expiry < Date.now()) {
        await Otp.deleteOne({ _id: otpEntry._id }); // Delete expired OTP
        return res.status(401).json({ error: 'OTP has expired' });
      }
  
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'productId' },
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Create the counter if it doesn't exist
      );
        const nextId = counter.seq;

      // Create a new product with the next ID
      const product = new Product({
        Id: nextId,
        name,
        description,
        price,
        variantOil,
        variantWeight,
        mobileNumber,
        variantSpicy,
        variantType
      });
  
      await product.save();
      res.status(201).json({ message: `Product created successfully with id: ${product.Id}`, product });
    } catch (error) {
        if (error.code === 11000) {
          // Handle duplicate key error
          return res.status(400).json({ error: 'Duplicate key error', details: error.message });
        }
        console.error('Error creating product:', error);
        res.status(400).json({ error: 'Error creating product', details: error.message });
      }
    });

// Get all products

router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ message: 'Products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// Get product by ID

router.get('/products/:Id', async (req, res) => {
    const Importd = req.params.Id;
    try {
        const product = await Product.findById(Id);
        if (product) {
            res.json({ message: 'Product fetched successfully', product });
        }
        else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error fetching product', details: error.message });
    } 
});

// Update product by ID
router.put('/products/:Id', async (req, res) => {
    const Id = req.params.Id; // Extract the product Id from the request parameters
    try {
        // Find the product by its Id and update it
        const product = await Product.findOneAndUpdate(
            { Id: Id }, // Query to find the product by Id
            req.body,   // Update the product with the request body
            { upsert: true } // Return the updated document
        );

        if (product) {
            res.json({ message: 'Product updated successfully', product });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating product', details: error.message });
    }
});

// Delete product by custom field Id
router.delete('/products/:Id', async (req, res) => {
    const Id = req.params.Id; // Extract the product Id from the request parameters
    try {
        // Find the product by its custom Id field and delete it
        const product = await Product.findOneAndDelete({ Id: Id });

        if (product) {
            res.json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product', details: error.message });
    }
});

module.exports = router;