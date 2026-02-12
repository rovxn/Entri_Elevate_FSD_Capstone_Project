const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    team: { type: String, required: true },
    role: {
        type: String,
        required: true,
        enum: ['Batsman', 'Bowler', 'All-Rounder', 'Wicket Keeper'],
        default: 'Batsman'
    },
    stats: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        matchesPlayed: { type: Number, default: 0 },
        ballsFaced: { type: Number, default: 0 },
        ballsBowled: { type: Number, default: 0 },
        average: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Player', playerSchema);