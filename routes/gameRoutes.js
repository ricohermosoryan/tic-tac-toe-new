const express = require("express");
const gameSession = require("../models/gameSession");

const router = express.Router();

// List Previous Games
router.get("/games", async (req, res) => {
  try {
    const games = await gameSession.find();
    res.json(games);
  } catch (err) {
    console.error("Error fetching games:", err);
    res.status(500).send(err);
  }
});

// Get Specific Game Session
router.get("/games/:id", async (req, res) => {
  try {
    const game = await gameSession.findById(req.params.id);
    res.json(game);
  } catch (err) {
    console.error("Error fetching game session:", err);
    res.status(500).send(err);
  }
});

// Start New Game Session
router.post("/games", async (req, res) => {
  try {
    const newGame = new gameSession({
      player1: { name: req.body.player1, wins: 0, losses: 0, draws: 0 },
      player2: { name: req.body.player2, wins: 0, losses: 0, draws: 0 },
      rounds: [],
    });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    console.error("Error creating new game session:", err);
    res.status(500).send(err);
  }
});

// Update Game Session
router.put("/games/:id", async (req, res) => {
  try {
    // Assuming req.body contains the entire updated game state
    const updatedGameState = {
      player1: req.body.player1,
      player2: req.body.player2,
      rounds: req.body.rounds,
    };

    const game = await gameSession.findByIdAndUpdate(
      req.params.id,
      { $set: updatedGameState },
      { new: true }
    );

    if (!game) {
      return res.status(404).send("Game session not found.");
    }

    res.json(game);
  } catch (err) {
    console.error("Error updating game session:", err);
    res.status(500).send(err);
  }
});

// Export the router
module.exports = router;
