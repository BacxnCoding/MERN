const mongoose = require('mongoose');

// Define the Role schema
const roleSchema = new mongoose.Schema({
  role_Name: {
    type: String,
    required: true
  },
  role_Id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
    index: true,
    unique: true
  },
  nation_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Nation'  // This will link the role to a specific nation
  },
  description: {
    type: String,
    required: true
  },
  permissions: [{
    action: String,
    scope: String
  }]
});

// Middleware to automatically generate the role name as "NationName_ROLE"
roleSchema.pre('save', async function (next) {
  const nation = await mongoose.model('Nation').findById(this.nation_id);
  if (!nation) {
    return next(new Error('Nation not found'));
  }
  this.role_Name = `${nation.name.replace(/\s+/g, '_')}_${this.description.toUpperCase()}`;
  next();
});

module.exports = mongoose.model('Role', roleSchema);
