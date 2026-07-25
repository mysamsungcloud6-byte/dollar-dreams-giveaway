const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  image: {
    type: String,
    default: null
  },
  claimed: {
    type: Number,
    default: 0
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
