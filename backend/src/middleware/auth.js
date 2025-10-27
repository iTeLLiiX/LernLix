const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticateJWT = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

    if (!token) {
      return res.status(401).json({ error: 'Token missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired' });
      }
      logger.warn('Invalid token:', err.message);
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = { authenticateJWT, authorize };
