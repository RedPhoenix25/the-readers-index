const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerEmail: { type: String, required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true, default: 1 },
    priceAtPurchase: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending' 
  },
  shippingAddress: {
    fullName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, default: 'USA' }
  },
  paymentMethod: { type: String, default: 'Mock Checkout' },
  trackingNumber: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
