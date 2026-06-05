const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, enum: ['NGN', 'USD', 'GBP'], default: 'NGN' },
  images: [{ type: String }], // Array of image URLs
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'Merch' },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
