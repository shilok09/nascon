const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');

// Get available packages
router.get('/packages', sponsorController.getAvailablePackages);

// Get sponsor's contracts
router.get('/contracts', sponsorController.getMyContracts);

// Submit new sponsorship
router.post('/submit', sponsorController.submitSponsorship);

// Add this if you need a sponsor page route
router.get('/', sponsorController.getSponsorPage);

module.exports = router;