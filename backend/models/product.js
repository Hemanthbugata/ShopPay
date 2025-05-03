const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    Id: {
        type: Number,
        required: true,
        unique: true,
        match: /^[0-9]{3}$/, // Ensures the productId is exactly 3 digits
    },
    name: String,
    description: String,
    price: Number,
    image: String,
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    stock: Number,
    rating: {
        type: Number,
        default: 0,
    },    
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);