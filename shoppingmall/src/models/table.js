const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true, min: 1 }, // Ensure capacity is at least 1
  location: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
});

const Table = mongoose.model('Table', tableSchema);
