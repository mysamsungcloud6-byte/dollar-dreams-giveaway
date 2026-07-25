const express = require('express');
const Entry = require('../models/Entry');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all entries
router.get('/', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find().sort({ createdAt: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new entry
router.post('/', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    // Check for duplicate email
    const existingEntry = await Entry.findOne({ email });
    if (existingEntry) {
      return res.status(409).json({ error: 'Email already entered' });
    }
    
    const entry = new Entry({ name, email, phone });
    await entry.save();
    
    res.status(201).json({
      message: 'Entry submitted successfully',
      entry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update entry
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { selected, status, notes } = req.body;
    
    const entry = await Entry.findByIdAndUpdate(
      req.params.id,
      {
        selected,
        status,
        notes,
        selectedDate: selected ? new Date() : null,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete entry
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const entry = await Entry.findByIdAndDelete(req.params.id);
    
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    
    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
