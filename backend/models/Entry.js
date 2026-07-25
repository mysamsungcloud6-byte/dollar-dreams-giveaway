const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: false
  },
  selected: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Entry', entrySchema);
