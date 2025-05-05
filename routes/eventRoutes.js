const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
// const { ensureAuthenticated } = require('../middleware/authMiddleware');

// Public routes
router.get('/', eventController.getEventsPage);
router.get('/events', eventController.getAllEvents);
router.post('/register', eventController.registerForEvent);

// Protected routes (require authentication)

// router.get('/my-registrations/:userId', ensureAuthenticated, eventController.getUserRegistrations);

module.exports = router;



