const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const Otp = require('../models/validation'); // Import the Otp model

// Create a new product

// Create a new product with auto-incremented ID
router.post('/products', async (req, res) => {
    const { name, description, price, variantOil, variantSpicy, mobileNumber, otp } = req.body;

    try {

        // Validate OTP and mobile number
        const otpEntry = await Otp.findOne({ mobileNumber, otp });
        if (!otpEntry) {
            return res.status(401).json({ error: 'Invalid OTP or mobile number' });
        }

        // Check if OTP is expired
        if (otpEntry.expiry < Date.now()) {
            return res.status(401).json({ error: 'OTP has expired' });
        }

        // Find the highest existing product ID
        const lastProduct = await Product.findOne().sort({ id: -1 }); // Sort by ID in descending order
        const nextId = lastProduct && lastProduct.id ? lastProduct.id + 1 : 1; // Ensure nextId is a valid number            
        
        // Create a new product with the next ID
        const product = new Product({
            id: nextId,
            name,
            description,
            price,
            variantOil,
            variantSpicy
        });

        await product.save();
        console.log('Product saved to MongoDB:', product);
        res.status(201).json({ message: 'Product created successfully with id: ${product.id}', product });
    } catch (error) {
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

router.get('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findById(id);
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
router.put('/products/:id',  async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (product) {
            res.json({ message: 'Product updated successfully', product });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(400).json({ error: 'Error updating product', details: error.message });
    }
});


// Delete product by ID
router.delete('/products/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByIdAndDelete(id);
        if (product) {
            res.json({ message: 'Product deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product', details: error.message });
    }
});

// Get products by categoryid
router.get('/products/category/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const products = await Product.find({ category: id });
        res.json({ message: 'Products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// Get products by brandname

router.get('/products/brand/:name', async (req, res) => {
    const name = req.params.name;
    try {
        const products = await Product.find({ brand: name });
        res.json({ message: 'Products fetched successfully', products });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching products', details: error.message });
    }
});

// udpate product stock
router.put('/products/:id/stock', async (req, res) => {
    const id = req.params.id;
    const { stock } = req.body;
    try {
        const product = await Product.findByIdAndUpdate(id, { stock }, { new: true });
        if (product) {
            res.json({ message: 'Product stock updated successfully', product });
        } else {
            res.status(404).json({ error: 'Product not found' });
        }   
    } catch (error) {
        res.status(400).json({ error: 'Error updating product stock', details: error.message });
    }
});


module.exports = router;