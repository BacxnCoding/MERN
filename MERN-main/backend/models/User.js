// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  items: [{ itemName: String, quantity: Number }],
 bankAccount: Number,
  isAdmin: Boolean,
  nation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Nation',
    default: null,
  },
  roles: {
    type: [String],  // Array of roles
    default: null,  
}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
