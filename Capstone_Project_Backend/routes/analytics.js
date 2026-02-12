const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Match = require('../models/Match');
const Team = require('../models/Team');

// @desc    Get Top 10 Run Scorers
// @route   GET /api/analytics/top-scorers
// @access  Public
router.get('/top-scorers', async (req, res) => {
    try {
        const players = await Player.find().sort({ 'stats.runs': -1 }).limit(10);
        res.status(200).json({ success: true, count: players.length, data: players });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get Top 10 Wicket Takers
// @route   GET /api/analytics/top-wicket-takers
// @access  Public
router.get('/top-wicket-takers', async (req, res) => {
    try {
        const players = await Player.find().sort({ 'stats.wickets': -1 }).limit(10);
        res.status(200).json({ success: true, count: players.length, data: players });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// @desc    Get Overall Platform Stats
// @route   GET /api/analytics/overview
// @access  Public
router.get('/overview', async (req, res) => {
    try {
        const totalPlayers = await Player.countDocuments();
        const totalTeams = await Team.countDocuments();
        const totalMatches = await Match.countDocuments();
        const liveMatches = await Match.countDocuments({ status: 'live' });
        const completedMatches = await Match.countDocuments({ status: 'completed' });

        res.status(200).json({
            success: true,
            data: {
                totalPlayers,
                totalTeams,
                totalMatches,
                liveMatches,
                completedMatches
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

module.exports = router;
