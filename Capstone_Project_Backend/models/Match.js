const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchName: { type: String, required: true },
    teams: [{ type: String }], // e.g., ["Team A", "Team B"]
    venue: String,
    status: { type: String, enum: ['upcoming', 'live', 'completed', 'paused'], default: 'upcoming' },
    scores: {
        team1: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 },
            extras: { type: Number, default: 0 }
        },
        team2: {
            runs: { type: Number, default: 0 },
            wickets: { type: Number, default: 0 },
            overs: { type: Number, default: 0 },
            extras: { type: Number, default: 0 }
        }
    },
    battingTeam: { type: String }, // Name of the team currently batting
    result: { type: String, default: '' }, // e.g. "Team A won by 20 runs"
    playingXI: {
        team1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }],
        team2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Player' }]
    },
    scorer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);