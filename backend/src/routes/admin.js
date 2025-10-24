const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsersWithStats,
  getUserReport,
  deactivateUser,
  reactivateUser,
  getModuleAnalytics,
  resetUserProgress,
  getSystemInfo
} = require('../controllers/adminController');
const { authenticateJWT } = require('../middleware/auth');

// All admin routes require authentication
router.use(authenticateJWT);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Users management
router.get('/users', getAllUsersWithStats);
router.get('/users/:userId/report', getUserReport);
router.post('/users/:userId/deactivate', deactivateUser);
router.post('/users/:userId/reactivate', reactivateUser);
router.post('/users/:userId/reset-progress', resetUserProgress);

// Analytics
router.get('/analytics/modules', getModuleAnalytics);

// System info
router.get('/system/info', getSystemInfo);

module.exports = router;
