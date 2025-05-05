const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard page
router.get('/', dashboardController.getDashboardPage);

// Dashboard statistics API
router.get('/stats', dashboardController.getDashboardStats);

// Simplified Dashboard statistics API (fallback)
router.get('/simple-stats', dashboardController.getSimpleDashboardStats);

// Current sponsorships API
router.get('/sponsorships', dashboardController.getCurrentSponsorships);

module.exports = router; 