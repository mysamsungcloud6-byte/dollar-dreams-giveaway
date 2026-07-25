const express = require('express');
const Entry = require('../models/Entry');
const Prize = require('../models/Prize');
const authMiddleware = require('../middleware/auth');
const { Parser } = require('json2csv');

const router = express.Router();

// Get analytics
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const totalEntries = await Entry.countDocuments();
    const selectedEntries = await Entry.countDocuments({ selected: true });
    const prizeCounts = await Prize.find({ active: true });
    
    res.json({
      totalEntries,
      selectedEntries,
      prizeCounts: prizeCounts || []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Select random winner
router.post('/select-winner', authMiddleware, async (req, res) => {
  try {
    // Find all entries that haven't been selected
    const eligibleEntries = await Entry.find({ selected: false });
    
    if (eligibleEntries.length === 0) {
      return res.status(400).json({ error: 'No eligible entries for selection' });
    }
    
    // Select random entry
    const randomIndex = Math.floor(Math.random() * eligibleEntries.length);
    const winner = eligibleEntries[randomIndex];
    
    // Update winner status
    winner.selected = true;
    winner.selectedDate = new Date();
    winner.status = 'winner';
    await winner.save();
    
    res.json({
      message: 'Winner selected successfully',
      winner
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export entries as CSV
router.get('/export/entries', authMiddleware, async (req, res) => {
  try {
    const entries = await Entry.find().lean();
    
    if (entries.length === 0) {
      return res.status(400).json({ error: 'No entries to export' });
    }
    
    // Define CSV fields
    const fields = ['name', 'email', 'phone', 'selected', 'status', 'createdAt'];
    
    try {
      const parser = new Parser({ fields });
      const csv = parser.parse(entries);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="entries.csv"');
      res.send(csv);
    } catch (parseError) {
      // Fallback: create CSV manually if json2csv fails
      let csv = fields.join(',') + '\n';
      entries.forEach(entry => {
        csv += `"${entry.name}","${entry.email}","${entry.phone}",${entry.selected},"${entry.status}","${entry.createdAt}"\n`;
      });
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="entries.csv"');
      res.send(csv);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const stats = {
      totalEntries: await Entry.countDocuments(),
      pendingEntries: await Entry.countDocuments({ status: 'pending' }),
      winners: await Entry.countDocuments({ selected: true }),
      totalPrizes: await Prize.countDocuments({ active: true }),
      totalPrizeValue: 0
    };
    
    const prizes = await Prize.find({ active: true });
    stats.totalPrizeValue = prizes.reduce((sum, prize) => sum + (prize.value * prize.quantity), 0);
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
