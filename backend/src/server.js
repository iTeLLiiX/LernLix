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
const questsRoutes = require('./routes/quests');
const skillsRoutes = require('./routes/skills');
const statsRoutes = require('./routes/stats');
const challengesRoutes = require('./routes/challenges');
const { authenticateJWT } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.set('trust proxy', 1);
app.use(helmet());
app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost', 'http://45.133.9.167', 'http://telliix.de', 'https://telliix.de'],
  credentials: true
}));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('db', sequelize);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/progress', authenticateJWT, progressRoutes);
app.use('/api/quests', questsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/challenges', challengesRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(errorHandler);

const start = async () => {
  try {
    console.log('[BOOT] Starting CodeSnap Backend...');
    await sequelize.authenticate();
    console.log('[BOOT] ✅ Database connected');
    
    const { DataTypes } = require('sequelize');
    require('./models/User')(sequelize);
    require('./models/Module')(sequelize);
    require('./models/LearningModule')(sequelize);
    require('./models/UserProgress')(sequelize);
    require('./models/Certificate')(sequelize);
    require('./models/Quest')(sequelize);
    require('./models/Skill')(sequelize);
    require('./models/UserStats')(sequelize);
    require('./models/Achievement')(sequelize);
    require('./models/UserQuest')(sequelize);
    require('./models/CodeChallenge')(sequelize);
    require('./models/UserChallenge')(sequelize);

    await sequelize.sync({ alter: process.env.NODE_ENV !== 'production' });
    console.log('[BOOT] ✅ Database synchronized');

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
