const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    shortName: { type: String, required: true }, // e.g., "CSK", "MI"
    city: { type: String },
    logo: { type: String }, // URL to logo
    captain: { type: String }, // Could be a Player ID later, but string for now is easier
    coach: { type: String },
    homeGround: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Team', teamSchema);
