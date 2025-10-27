const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const logger = require('./config/logger');
const authRoutes = require('./routes/auth');
const modulesRoutes = require('./routes/modules');
const progressRoutes = require('./routes/progress');
const { authenticateJWT } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Store database in app for controller access
app.set('db', sequelize);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/progress', authenticateJWT, progressRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use(errorHandler);

// Initialize database and start server
const start = async () => {
  try {
    console.log('[BOOT] Starting LernLix Backend...');

    // Test database connection
    await sequelize.authenticate();
    console.log('[BOOT] ✅ Database connected');

    // Define models
    const { DataTypes } = require('sequelize');
    require('./models/User')(sequelize);
    require('./models/Module')(sequelize);
    require('./models/UserProgress')(sequelize);
    require('./models/Certificate')(sequelize);
    require('./models/Quest')(sequelize);
    require('./models/Skill')(sequelize);
    require('./models/UserStats')(sequelize);
    require('./models/Achievement')(sequelize);
    require('./models/UserQuest')(sequelize);

    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('[BOOT] ✅ Database synchronized');

    // Start server
    app.listen(PORT, () => {
      console.log(`[BOOT] ✅ Server running on port ${PORT}`);
      logger.info(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error('[BOOT] ❌ Failed to start:', error.message);
    logger.error('Startup error:', error.message);
    process.exit(1);
  }
};

start();

module.exports = app;
