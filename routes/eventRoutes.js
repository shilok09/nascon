const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getEventsPage);
router.get('/', eventController.getAllEvents);

// Protected routes (require authentication)
// router.post('/register', eventController.registerForEvent);
// router.get('/my-registrations/:userId', ensureAuthenticated, eventController.getUserRegistrations);

module.exports = router;



