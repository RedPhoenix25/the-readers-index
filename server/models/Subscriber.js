const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true },
  source: { type: String, default: 'Newsletter' }
}, { timestamps: true });

// Ensure unique combination of email and source
subscriberSchema.index({ email: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('Subscriber', subscriberSchema);
