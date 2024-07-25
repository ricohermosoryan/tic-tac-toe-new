const mongoose = require("mongoose");

const gameSessionSchema = new mongoose.Schema(
  {
    player1: { name: String, wins: Number, losses: Number, draws: Number },
    player2: { name: String, wins: Number, losses: Number, draws: Number },
    rounds: [{ winner: String, loser: String, draw: Boolean }],
  },
  { timestamps: true }
);

const GameSession = mongoose.model("GameSession", gameSessionSchema);

module.exports = GameSession;
