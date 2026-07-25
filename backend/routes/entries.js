const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const auth = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Submit giveaway entry (public)
router.post('/', 
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('phone').trim().notEmpty(),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      
      const { name, email, phone } = req.body;
      const ipAddress = req.ip;
      
      const entry = new Entry({ name, email, phone, ipAddress });
      await entry.save();
      
      res.status(201).json({ message: 'Entry submitted successfully', entryId: entry._id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get all entries (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    const count = await Entry.countDocuments();
    res.json({ count, entries });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single entry (admin only)
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete entry (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
