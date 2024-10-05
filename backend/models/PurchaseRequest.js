const mongoose = require('mongoose');

// Schema for purchase requests
const purchaseRequestSchema = new mongoose.Schema({
  username: { type: String, required: true },
  item: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' },  // "pending", "approved", "denied"
  adminResponse: { type: String, default: '' },  // Admin's message on approval/denial
  price: { type: Number, required: true },
});

const PurchaseRequest = mongoose.model('PurchaseRequest', purchaseRequestSchema);

module.exports = PurchaseRequest;
