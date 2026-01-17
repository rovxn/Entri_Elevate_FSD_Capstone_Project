const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    team: { type: String, required: true },
    stats: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        matchesPlayed: { type: Number, default: 0 }
    }
});

module.exports = mongoose.model('Player', playerSchema);