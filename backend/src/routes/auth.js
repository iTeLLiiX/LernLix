import express from 'express';
import bcryptjs from 'bcryptjs';
import joi from 'joi';
import { User } from '../models/User.js';
import { generateToken, generateRefreshToken } from '../config/jwt.js';
import logger from '../config/logger.js';

const router = express.Router();

// Registrierung
router.post('/register', async (req, res) => {
  try {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      firstName: joi.string().required(),
      lastName: joi.string().required()
    });

    const { error, value } = schema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const user = await User.create({
      email: value.email,
      password: value.password,
      firstName: value.firstName,
      lastName: value.lastName
    });

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.status(201).json({ user: user.getPublicData(), token, refreshToken });
  } catch (err) {
    logger.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !await user.comparePassword(password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.json({ user: user.getPublicData(), token, refreshToken });
  } catch (err) {
    logger.error('Login error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Token erneuern
router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ error: 'No refresh token' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const token = generateToken(decoded.id);
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;

