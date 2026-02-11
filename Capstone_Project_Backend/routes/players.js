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

// @desc    Get all players
// @route   GET /api/players
router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        res.json(players);
    } catch (err) {
        res.status(500).json({ message: err.message });
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

// @desc    Update player (Admin only)
// @route   PUT /api/players/:id
router.put('/:id', protect, authorize('admin', 'scorer'), async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        const updatedPlayer = await Player.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(updatedPlayer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete player (Admin only)
// @route   DELETE /api/players/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({ message: 'Player not found' });
        }

        await player.deleteOne();
        res.json({ message: 'Player removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;