import express from 'express';
import { Module } from '../models/Module.js';
import logger from '../config/logger.js';

const router = express.Router();

// Alle Module abrufen (mit optionalem Category-Filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where = category ? { category } : {};
    const modules = await Module.findAll({ where, order: [['orderInCategory', 'ASC']] });
    res.json(modules);
  } catch (err) {
    logger.error('Fetch modules error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Einzelnes Modul abrufen
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.id);
    if (!module) return res.status(404).json({ error: 'Module not found' });
    res.json(module);
  } catch (err) {
    logger.error('Fetch module error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;

