import logger from '../config/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Error occurred:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  if (err.name === 'ValidationError' || err.isJoi) {
    const message = err.details ? err.details[0].message : err.message;
    return res.status(400).json({ error: message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ error: 'Resource already exists' });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: err.errors[0].message });
  }

  res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandler;
