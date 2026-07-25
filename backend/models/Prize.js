const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Cash', 'Cars', 'Vacations', 'Dream Rewards'],
    required: true
  },
  image: {
    type: String,
    required: false
  },
  value: {
    type: Number,
    required: false
  },
  quantity: {
    type: Number,
    default: 1
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prize', prizeSchema);
