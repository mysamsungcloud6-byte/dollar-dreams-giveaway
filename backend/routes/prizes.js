const express = require('express');
const Prize = require('../models/Prize');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all prizes
router.get('/', async (req, res) => {
  try {
    const prizes = await Prize.find({ active: true }).sort({ createdAt: -1 });
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new prize
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, value, quantity } = req.body;
    
    if (!title || !category || !value) {
      return res.status(400).json({ error: 'Title, category, and value are required' });
    }
    
    const prize = new Prize({
      title,
      category,
      description,
      value,
      quantity: quantity || 1
    });
    
    await prize.save();
    
    res.status(201).json({
      message: 'Prize created successfully',
      prize
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prize
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const prize = await Prize.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }
    
    res.json(prize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete prize
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const prize = await Prize.findByIdAndUpdate(
      req.params.id,
      { active: false, updatedAt: new Date() },
      { new: true }
    );
    
    if (!prize) {
      return res.status(404).json({ error: 'Prize not found' });
    }
    
    res.json({ message: 'Prize deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
