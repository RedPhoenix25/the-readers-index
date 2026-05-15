const mongoose = require('mongoose');

const currentlyReadingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  cover: { type: String },
  progress: { type: Number, default: 0 },
  thoughts: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CurrentlyReading', currentlyReadingSchema);
