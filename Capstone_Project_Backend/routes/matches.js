const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all matches (Viewer access)
// @route   GET /api/matches
router.get('/', async (req, res) => {
    try {
        const matches = await Match.find();
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Get single match by ID
// @route   GET /api/matches/:id
router.get('/:id', async (req, res) => {
    try {
        const match = await Match.findById(req.params.id);
        if (match) {
            res.json(match);
        } else {
            res.status(404).json({ message: 'Match not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Create match (Admin only)
// @route   POST /api/matches
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Update live score (Scorer/Admin only)
// @route   PUT /api/matches/:id/score
router.put('/:id/score', protect, authorize('admin', 'scorer'), async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!match) {
            return res.status(404).json({ message: 'Match not found' });
        }
        res.json(match);
    } catch (err) {
        res.status(400).json({ message: 'Invalid Match ID' });
    }
});

module.exports = router;    