const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    items: [{ itemName: String, quantity: Number }],
    bankAccount: { type: Number, default: 1000 },
    isAdmin: { type: Boolean, default: false },
    nation: { type: String, default: null }, 
    nation_id: { type: String, default: null },
    roles: [{type: String}]
});

const User = mongoose.model('User', userSchema);
module.exports = User;
