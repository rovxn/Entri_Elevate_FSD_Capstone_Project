const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchName: { type: String, required: true },
    teams: [{ type: String }], // e.g., ["Team A", "Team B"]
    venue: String,
    status: { type: String, enum: ['upcoming', 'live', 'completed'], default: 'upcoming' },
    score: {
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        overs: { type: Number, default: 0 },
        extras: { type: Number, default: 0 }
    },
    scorer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);