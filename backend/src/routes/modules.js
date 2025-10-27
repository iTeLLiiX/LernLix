const express = require('express');
const logger = require('../config/logger');

const router = express.Router();

// Get all published modules
router.get('/', async (req, res) => {
  try {
    const modules = await req.app.get('db').models.Module.findAll({
      where: { isPublished: true },
      order: [['createdAt', 'DESC']],
    });

    res.json(modules);
  } catch (error) {
    logger.error('Get modules error:', error.message);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
});

// Get module by ID
router.get('/:id', async (req, res) => {
  try {
    const module = await req.app.get('db').models.Module.findByPk(req.params.id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    logger.error('Get module error:', error.message);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
});

module.exports = router;

