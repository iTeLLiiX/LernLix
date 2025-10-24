const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const sequelize = require('./config/database');
const logger = require('./config/logger');
const { authenticateJWT } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const modulesRoutes = require('./routes/modules');
const progressRoutes = require('./routes/progress');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', modulesRoutes);
app.use('/api/progress', authenticateJWT, progressRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected');

    await sequelize.sync({ alter: false });
    logger.info('Models synchronized');

    app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

module.exports = app;
