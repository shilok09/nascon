const db = require('../db/connection');
// const { v4: uuidv4 } = require('uuid');

exports.getEventsPage = (req, res) => {
    console.log('Rendering Event page...'); // Debug log
    try {
        res.render('Events', {  
            title: 'Events - NASCON',
        });
    } catch (err) {
        console.error('Render error:', err);
        res.status(500).send('Error loading sponsor page');
    }
};

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM events');
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
    const { userId, eventId, teamSize, specialRequirements, needsAccommodation } = req.body;
    
    try {
        // Check if user is already registered
        const [existing] = await db.query(
            'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
            [userId, eventId]
        );
        
        if (existing.length > 0) {
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        
        // Generate registration code
        const registrationCode = `NAS-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Create registration
        await db.query(
            'INSERT INTO registrations (user_id, event_id, team_size, special_requirements, needs_accommodation, registration_code) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, eventId, teamSize, specialRequirements, needsAccommodation, registrationCode]
        );
        
        res.json({ 
            success: true,
            registrationCode,
            message: 'Registration successful' 
        });
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Failed to register for event' });
    }
};

// Get user's registrations
exports.getUserRegistrations = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const [registrations] = await db.query(
            `SELECT r.*, e.title, e.date, e.time, e.location 
             FROM registrations r
             JOIN events e ON r.event_id = e.id
             WHERE r.user_id = ?`,
            [userId]
        );
        
        res.json(registrations);
    } catch (error) {
        console.error('Error fetching user registrations:', error);
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
}; 