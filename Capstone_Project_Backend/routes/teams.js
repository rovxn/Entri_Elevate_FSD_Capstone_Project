const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const { protect, authorize } = require('../middleware/authMiddleware');

// @desc    Get all teams
// @route   GET /api/teams
router.get('/', async (req, res) => {
    try {
        const teams = await Team.find();
        res.json(teams);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @desc    Add new team (Admin only)
// @route   POST /api/teams
router.post('/', protect, authorize('admin'), async (req, res) => {
    try {
        const team = await Team.create(req.body);
        res.status(201).json(team);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Get team by ID
// @route   GET /api/teams/:id
router.get('/:id', async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        res.json(team);
    } catch (err) {
        res.status(400).json({ message: 'Invalid Team ID' });
    }
});

// @desc    Update team (Admin only)
// @route   PUT /api/teams/:id
router.put('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        const updatedTeam = await Team.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.json(updatedTeam);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @desc    Delete team (Admin only)
// @route   DELETE /api/teams/:id
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }

        await team.deleteOne();
        res.json({ message: 'Team removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
