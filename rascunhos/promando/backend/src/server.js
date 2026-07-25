require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const gameRoutes = require('./routes/games');
const platformRoutes = require('./routes/platforms');
const dealsRoutes = require('./routes/deals');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Localize onde o helmet() está sendo chamado no src/server.js e substitua por:
app.use(
  helmet({
    crossOriginResourcePolicy: false, // 👈 Desativa a barreira que causa o erro NotSameOrigin
    crossOriginEmbedderPolicy: false, 
  })
);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/games', gameRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/deals', dealsRoutes);

app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
});
