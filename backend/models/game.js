const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    playerHand: [{ rank: String, suit: String, value: Number }],
    dealerHand: [{ rank: String, suit: String, value: Number }],
    playerTotal: { type: Number, default: 0 },
    dealerTotal: { type: Number, default: 0 },
    winner: String,
    status: { type: String, default: 'ongoing' }
});

module.exports = mongoose.model('Game', gameSchema);