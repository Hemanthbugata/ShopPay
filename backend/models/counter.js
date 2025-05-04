const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Name of the counter (e.g., 'productId')
  seq: { type: Number, required: true, default: 0 }, // Current sequence value
});

module.exports = mongoose.model('Counter', counterSchema);