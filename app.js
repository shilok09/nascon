const express = require('express');
const path = require('path');
const app = express();

// Set up EJS as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('Sponsor', {
        title: 'NaSCon - National Solutions Convention',
        stats: {
            attendees: '5k+',
            speakers: '50+',
            sessions: '100+'
        }
    });
});
//In your Express route
app.get('/login-register', (req, res) => {
    const mode = req.query.mode || 'login';  // Default to 'login' if no mode is passed
    res.render('login-register', {
        title: mode === 'login' ? 'Login' : 'Create Your Account',
        mode: mode
    });
});
;

//   app.get('/login', (req, res) => {
//     res.render('login-register',{ title: 'Create Your Account - Modern Registration' },{ mode: 'login' });
//   });
  
//   app.get('/register', (req, res) => {
//     res.render('login-register', { title: 'Create Your Account - Modern Registration' },{ mode: 'register' });
//   });
  
 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});