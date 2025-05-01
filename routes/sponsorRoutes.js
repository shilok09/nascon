const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');

router.use((req, res, next) => {
    console.log('Sponsor route accessed:', req.url);
    next();
});

router.get('/', sponsorController.getSponsorPage);

module.exports = router;