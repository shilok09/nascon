const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


// Route imports
const authRoutes = require('./routes/authRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
// const sponsorRoutes = require('./routes/sponsorRoutes');

// Database connection
require('./db/connection');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'NASCON - National Solutions Convention' });
});

app.get('/index', (req, res) => {
    res.render('index', { title: 'NASCON - National Solutions Convention' });
});

// Routes


// app.get('/sponsor', (req, res) => {
//     res.render('sponsor', {
//         title: 'Sponsor-NASCON',
//     });
// });

app.get('/login-register', (req, res) => {
    const mode = req.query.mode || 'login';
    res.render('login-register', {
        title: mode === 'login' ? 'Login' : 'Create Your Account',
        mode: mode
    });
});

// API Routes
app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/sponsor', sponsorRoutes);
app.use('/events', eventRoutes);
app.use('/sponsors', sponsorRoutes);
app.use('/dashboard', dashboardRoutes);

// Add a test route for database connection
const db = require('./db/connection');
app.get('/test-db', async (req, res) => {
    try {
        // Test simple queries for each table
        console.log("Testing database connection...");
        
        // Test events table
        try {
            const [events] = await db.query('SELECT COUNT(*) as count FROM events');
            console.log("Events count:", events[0].count);
        } catch (err) {
            console.error("Error querying events:", err.message);
        }
        
        // Test sponsorpackage table
        try {
            const [sponsors] = await db.query('SELECT COUNT(*) as count FROM sponsorpackage');
            console.log("Sponsorpackage count:", sponsors[0].count);
        } catch (err) {
            console.error("Error querying sponsorpackage:", err.message);
        }
        
        // Test registrations table
        try {
            const [registrations] = await db.query('SELECT COUNT(*) as count FROM registrations');
            console.log("Registrations count:", registrations[0].count);
        } catch (err) {
            console.error("Error querying registrations:", err.message);
        }
        
        // Test accommodationrequest table
        try {
            const [accommodations] = await db.query('SELECT COUNT(*) as count FROM accommodationrequest');
            console.log("Accommodationrequest count:", accommodations[0].count);
        } catch (err) {
            console.error("Error querying accommodationrequest:", err.message);
        }
        
        res.json({ message: "Database connection test complete. Check server logs." });
    } catch (error) {
        console.error("Database test failed:", error);
        res.status(500).json({ error: "Database test failed" });
    }
});

// Error handling middleware (add this)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { 
        title: 'Error',
        message: 'Something went wrong!' 
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});