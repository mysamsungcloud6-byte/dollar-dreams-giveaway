const express = require('express');
const router = express.Router();
const Entry = require('../models/Entry');
const Prize = require('../models/Prize');
const auth = require('../middleware/auth');

// Get analytics (admin only)
router.get('/analytics', auth, async (req, res) => {
  try {
    const totalEntries = await Entry.countDocuments();
    const selectedEntries = await Entry.countDocuments({ selected: true });
    const entriesByDay = await Entry.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    const prizeCounts = await Prize.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      totalEntries,
      selectedEntries,
      entriesByDay,
      prizeCounts
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Select random winner (admin only)
router.post('/select-winner', auth, async (req, res) => {
  try {
    const entries = await Entry.find({ selected: false });
    
    if (entries.length === 0) {
      return res.status(400).json({ error: 'No eligible entries' });
    }
    
    const randomIndex = Math.floor(Math.random() * entries.length);
    const winner = entries[randomIndex];
    
    winner.selected = true;
    await winner.save();
    
    res.json({ message: 'Winner selected', winner });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export all entries (admin only)
router.get('/export/entries', auth, async (req, res) => {
  try {
    const entries = await Entry.find().lean();
    
    // Convert to CSV format
    const headers = ['Name', 'Email', 'Phone', 'Submitted At', 'Selected'];
    const csvData = entries.map(entry => 
      `"${entry.name}","${entry.email}","${entry.phone}","${entry.createdAt.toISOString()}",${entry.selected}`
    ).join('\n');
    
    const csv = headers.join(',') + '\n' + csvData;
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=entries.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
