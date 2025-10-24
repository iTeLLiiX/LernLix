const { Module } = require('../models');
const logger = require('../config/logger');

// Get all modules
exports.getAllModules = async (req, res) => {
  try {
    const modules = await Module.findAll({
      attributes: ['id', 'title', 'category', 'description', 'difficulty', 'duration', 'order', 'createdAt']
    });

    res.json(modules);
  } catch (error) {
    logger.error('Get all modules error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};

// Get single module
exports.getModule = async (req, res) => {
  try {
    const { id } = req.params;

    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    res.json(module);
  } catch (error) {
    logger.error('Get module error:', error);
    res.status(500).json({ error: 'Failed to fetch module' });
  }
};

// Create module (Admin only)
exports.createModule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { title, category, description, content, difficulty, duration, order } = req.body;

    if (!title || !category) {
      return res.status(400).json({ error: 'Title and category required' });
    }

    const module = await Module.create({
      title,
      category,
      description,
      content,
      difficulty: difficulty || 'beginner',
      duration: duration || 60,
      order: order || 0
    });

    logger.info(`Module created: ${module.id}`);

    res.status(201).json({
      message: 'Module created successfully',
      module
    });
  } catch (error) {
    logger.error('Create module error:', error);
    res.status(500).json({ error: 'Failed to create module' });
  }
};

// Update module (Admin only)
exports.updateModule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, category, description, content, difficulty, duration, order } = req.body;

    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.update({
      title: title || module.title,
      category: category || module.category,
      description: description || module.description,
      content: content || module.content,
      difficulty: difficulty || module.difficulty,
      duration: duration || module.duration,
      order: order !== undefined ? order : module.order
    });

    logger.info(`Module updated: ${module.id}`);

    res.json({
      message: 'Module updated successfully',
      module
    });
  } catch (error) {
    logger.error('Update module error:', error);
    res.status(500).json({ error: 'Failed to update module' });
  }
};

// Delete module (Admin only)
exports.deleteModule = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const { id } = req.params;

    const module = await Module.findByPk(id);

    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }

    await module.destroy();

    logger.info(`Module deleted: ${id}`);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    logger.error('Delete module error:', error);
    res.status(500).json({ error: 'Failed to delete module' });
  }
};

// Get modules by category
exports.getModulesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const modules = await Module.findAll({
      where: { category },
      attributes: ['id', 'title', 'category', 'description', 'difficulty', 'duration', 'order']
    });

    res.json(modules);
  } catch (error) {
    logger.error('Get modules by category error:', error);
    res.status(500).json({ error: 'Failed to fetch modules' });
  }
};
