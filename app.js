const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');


// Route imports
const authRoutes = require('./routes/authRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
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
    res.render('sponsor', {
        title: 'NaSCon - National Solutions Convention',
    });
});
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
