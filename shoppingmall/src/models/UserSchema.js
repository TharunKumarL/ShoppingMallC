const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  password: { type: String, required: function() { return !this.googleId; } },  // Only required if Google ID is not present
  role: { type: String, default: 'user' },
});

const User = mongoose.model('User', userSchema);

module.exports = User;  // Export the model directly
