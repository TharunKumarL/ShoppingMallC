const bookingSchema = require("./bookingSchema");

// models/User.js
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings:{
    sport_bookings: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: bookingSchema
    }
  },
  role: {  type: String,  enum: ['user', 'admin'] ,default:'user'}
});

module.exports = mongoose.model('user', UserSchema);