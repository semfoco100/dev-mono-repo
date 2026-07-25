const express = require('express');
const router = express.Router();

const deals = [
  {
    id: 1,
    title: 'Elden Ring',
    platformId: 1,
    platform: 'Nuuvem',
    image: '/images/elden-ring.jpg',
    originalPrice: 59.99,
    salePrice: 29.99,
    discount: 50,
    affiliateLink: 'https://www.nuuvem.com/catalog/game/elden-ring?partner=seu_afiliado'
  },
  {
    id: 2,
    title: 'Far Cry 3',
    platformId: 2,
    platform: 'Green Man Gaming',
    image: '/images/far-cry-3.jpg',
    originalPrice: 49.99,
    salePrice: 19.99,
    discount: 60,
    affiliateLink: 'https://www.greenmangaming.com/games/far-cry-3/?affiliate=seu_afiliado'
  },
  {
    id: 3,
    title: 'Far Cry 5',
    platformId: 3,
    platform: 'Gamers Gate',
    image: '/images/far-cry-5.jpg',
    originalPrice: 24.99,
    salePrice: 9.99,
    discount: 60,
    affiliateLink: 'https://www.gamersgate.com/DD-XXXX/hades?affiliate=seu_afiliado'
  },
  {
    id: 4,
    title: 'Far Cry 4',
    platformId: 4,
    platform: 'Instant Gaming',
    image: '/images/far-cry-4.jpg',
    originalPrice: 39.99,
    salePrice: 14.99,
    discount: 62,
    affiliateLink: 'https://www.instant-gaming.com/en/10/affiliate/?igr=seu_afiliado&productID=12345'
  },
  {
    id: 5,
    title: 'Battlefield 4',
    platformId: 5,
    platform: 'Hype Games',
    image: '/images/battlefield-4.jpg',
    originalPrice: 44.99,
    salePrice: 17.99,
    discount: 60,
    affiliateLink: 'https://www.hypegames.com/pt/game/battlefield-4?affiliate=seu_afiliado'
  },
  {
    id: 6,
    title: 'Call of Duty: Modern Warfare III',
    platformId: 5,
    platform: 'Hype Games',
    image: '/images/cod-mw3.jpg',
    originalPrice: 44.99,
    salePrice: 17.99,
    discount: 60,
    affiliateLink: 'https://www.hypegames.com/pt/game/battlefield-4?affiliate=seu_afiliado'
  },
  {
    id: 7,
    title: 'Borderlands',
    platformId: 5,
    platform: 'Hype Games',
    image: '/images/borderlands.jpg',
    originalPrice: 44.99,
    salePrice: 17.99,
    discount: 60,
    affiliateLink: 'https://www.hypegames.com/pt/game/battlefield-4?affiliate=seu_afiliado'
  }
];

// GET /api/deals - List all active deals
router.get('/', (req, res) => {
  const platformId = parseInt(req.query.platformId, 10);
  const filteredDeals = Number.isInteger(platformId)
    ? deals.filter(deal => deal.platformId === platformId)
    : deals;

  res.json({
    deals: filteredDeals
  });
});

// GET /api/deals/trending - List trending deals
router.get('/trending', (req, res) => {
  const trendingDeals = [...deals]
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 3);

  res.json({
    deals: trendingDeals
  });
});

module.exports = router;
