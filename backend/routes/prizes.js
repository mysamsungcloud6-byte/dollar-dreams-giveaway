const express = require('express');
const router = express.Router();
const Prize = require('../models/Prize');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all prizes
router.get('/', async (req, res) => {
  try {
    const prizes = await Prize.find({ active: true });
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get prizes by category
router.get('/category/:category', async (req, res) => {
  try {
    const prizes = await Prize.find({ category: req.params.category, active: true });
    res.json(prizes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single prize
router.get('/:id', async (req, res) => {
  try {
    const prize = await Prize.findById(req.params.id);
    if (!prize) return res.status(404).json({ error: 'Prize not found' });
    res.json(prize);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create prize (admin only)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, value, quantity } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }
    
    const prize = new Prize({
      title,
      description,
      category,
      value,
      quantity,
      image: req.file ? `/uploads/${req.file.filename}` : null
    });
    
    await prize.save();
    res.status(201).json({ message: 'Prize created', prize });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update prize (admin only)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
  try {
    const { title, description, category, value, quantity, active } = req.body;
    const updateData = { title, description, category, value, quantity, active, updatedAt: Date.now() };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }
    
    const prize = await Prize.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!prize) return res.status(404).json({ error: 'Prize not found' });
    
    res.json({ message: 'Prize updated', prize });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete prize (admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const prize = await Prize.findByIdAndDelete(req.params.id);
    if (!prize) return res.status(404).json({ error: 'Prize not found' });
    
    res.json({ message: 'Prize deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
