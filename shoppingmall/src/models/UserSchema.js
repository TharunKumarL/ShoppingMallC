const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Ensure unique constraint
  password: { type: String, required: true },
  role: { type: String, default: 'user' },  // Optional
});


const User = mongoose.model('User', userSchema);

module.exports = User;  // Export the model directly
