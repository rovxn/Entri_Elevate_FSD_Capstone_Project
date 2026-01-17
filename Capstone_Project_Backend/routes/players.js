const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Add new player (Admin only)
// @route   POST /api/players
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const player = await Player.create(req.body);
        res.status(201).json(player);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Get player stats
// @route   GET /api/players/:id
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }
        res.json(player);
    } catch (err) {
        res.status(400).json({ message: 'Invalid Player ID' });
    }
});

module.exports = router;