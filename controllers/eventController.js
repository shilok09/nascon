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
// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query(`
            SELECT 
                id,
                title,
                description,
                date,
                time,
                location,
                category,
                CASE 
                    WHEN category = 'Competition' THEN 'bg-purple-800'
                    WHEN category = 'Workshop' THEN 'bg-blue-800'
                    WHEN category = 'Talk' THEN 'bg-green-800'
                    WHEN category = 'Social' THEN 'bg-yellow-800'
                END AS category_color,
                CASE 
                    WHEN category = 'Competition' THEN 'bg-indigo-900'
                    WHEN category = 'Workshop' THEN 'bg-blue-900'
                    WHEN category = 'Talk' THEN 'bg-green-900'
                    WHEN category = 'Social' THEN 'bg-yellow-900'
                END AS bgColor,
                is_featured AS featured,
                'Register Now' AS buttonText
            FROM events
        `);
        res.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
};

// Register for an event
exports.registerForEvent = async (req, res) => {
    const { userId, eventId, teamSize, specialRequirements, needsAccommodation, accommodation } = req.body;
    
    if (!userId || !eventId) {
        return res.status(400).json({ error: 'Missing required fields: userId and eventId' });
    }
    
    // Start transaction for database consistency
    let connection;
    
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();
        
        // Check if user is already registered
        const [existing] = await connection.query(
            'SELECT * FROM registrations WHERE user_id = ? AND event_id = ?',
            [userId, eventId]
        );
        
        if (existing.length > 0) {
            await connection.release();
            return res.status(400).json({ error: 'You are already registered for this event' });
        }
        
        // Generate registration code
        const registrationCode = `NAS-${Math.floor(100000 + Math.random() * 900000)}`;
        
        // Create registration
        const [registrationResult] = await connection.query(
            'INSERT INTO registrations (user_id, event_id, team_size, special_requirements, needs_accommodation, registration_code) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, eventId, teamSize, specialRequirements, needsAccommodation, registrationCode]
        );
        
        let accommodationRequestId = null;
        
        // If accommodation is needed, create accommodation request
        if (needsAccommodation && accommodation) {
            // Default accommodation ID (assuming there's a default accommodation option)
            // In a real app, you'd have logic to select an appropriate accommodation based on availability
            const defaultAccommodationId = 1;
            
            // Create accommodation request record
            const [accommodationResult] = await connection.query(
                'INSERT INTO accommodationrequest (reqDate, noOfPeople, userID) VALUES (?, ?, ?)',
                [
                    accommodation.reqDate || new Date().toISOString().split('T')[0], // Today's date if not provided
                    accommodation.noOfPeople || teamSize, // Use team size if not specified
                    userId
                ]
            );
            
            accommodationRequestId = accommodationResult.insertId;
        }
        
        // Commit the transaction
        await connection.commit();
        connection.release();
        
        // Create response object
        const response = { 
            success: true,
            registrationCode,
            registrationId: registrationResult.insertId,
            message: 'Registration successful'
        };
        
        // Add accommodation details to response if applicable
        if (accommodationRequestId) {
            response.accommodationRequestId = accommodationRequestId;
            response.accommodationMessage = 'Accommodation request has been processed';
        }
        
        res.json(response);
        
    } catch (error) {
        // Rollback transaction if error occurs
        if (connection) {
            await connection.rollback();
            connection.release();
        }
        
        console.error('Error registering for event:', error);
        res.status(500).json({ 
            error: 'Failed to register for event',
            details: error.message
        });
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