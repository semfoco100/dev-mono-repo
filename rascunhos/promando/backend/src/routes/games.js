const express = require("express");
const router = express.Router();

const games = [
  { id: 1, title: "Elden Ring", platform: "Nuuvem" },
  { id: 2, title: "Cyberpunk 2077", platform: "Green Man Gaming" },
  { id: 3, title: "Hades", platform: "Gamers Gate" },
  { id: 4, title: "The Witcher 3", platform: "Instant Gaming" },
  { id: 5, title: "Resident Evil 4", platform: "Hype Games" },
];

// GET /api/games - List all games
router.get("/", (req, res) => {
  res.json({
    games,
  });
});

// GET /api/games/:id - Get game details
router.get("/:id", (req, res) => {
  const game = games.find((item) => item.id === parseInt(req.params.id, 10));

  if (!game) {
    return res.status(404).json({ message: "Game not found" });
  }

  res.json({
    game,
  });
});

// POST /api/games - Create new game
router.post("/", (req, res) => {
  const newGame = {
    id: games.length + 1,
    ...req.body,
  };

  games.push(newGame);

  res.status(201).json({
    game: newGame,
  });
});

module.exports = router;
