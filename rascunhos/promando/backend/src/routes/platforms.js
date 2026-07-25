const express = require('express');
const router = express.Router();

// GET /api/platforms - List all platforms
router.get('/', (req, res) => {
  res.json({
    platforms: [
      { id: 1, name: 'Nuuvem', url: 'https://www.nuuvem.com' },
      { id: 2, name: 'Green Man Gaming', url: 'https://www.greenmangaming.com' },
      { id: 3, name: 'Gamers Gate', url: 'https://www.gamersgate.com' },
      { id: 4, name: 'Instant Gaming', url: 'https://www.instant-gaming.com' },
      { id: 5, name: 'Hype Games', url: 'https://www.hypegames.com' }
    ]
  });
});

// GET /api/platforms/:id - Get platform details
router.get('/:id', (req, res) => {
  res.json({
    message: `Get platform with id ${req.params.id}`,
    platform: null
  });
});

module.exports = router;
