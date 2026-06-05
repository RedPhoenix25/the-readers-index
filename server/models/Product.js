const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // Array of image URLs
  stock: { type: Number, default: 0 },
  category: { type: String, default: 'Merch' },
  weight: { type: Number }, // For shipping purposes (lbs/kg)
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
