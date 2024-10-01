const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  item: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',  // Either 'pending', 'approved', or 'denied'
  },
  adminResponse: {
    type: String,
    default: '',
  },
  price: {
    type: Number,  // Optional if admin sets a price for custom items
    required: false,
  },
});

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

module.exports = PurchaseRequest;
