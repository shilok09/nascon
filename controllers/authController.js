const pool = require('../db/connection');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Hard-coded admin check (as specified by the user)
        if (email === 'admin@gmail.com' && password === '12345678') {
            return res.json({
                message: 'Login successful',
                user: {
                    id: 1,
                    name: 'admin',
                    email: 'admin@gmail.com',
                    phone: '03001234567',
                    userType: 'admin'
                },
                redirect: '/dashboard'
            });
        }

        // Regular user login flow for non-admin users
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?', 
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                field: 'email'
            });
        }

        const user = users[0];

        // 2. Compare passwords (assuming passwords are stored in plain text)
        if (password !== user.password) {
            return res.status(401).json({ 
                error: 'Invalid credentials',
                field: 'password'
            });
        }

        // 3. Successful login - return user data (excluding password)
        const { password: _, ...userData } = user;
        
        // Define redirect URLs based on user type
        let redirectUrl = '/';
        if (user.userType === 'admin') {
            redirectUrl = '/dashboard';
        } else if (user.userType === 'sponsor') {
            redirectUrl = '/sponsor';
        } else if (user.userType === 'participant') {
            redirectUrl = '/events'; // This will match the route in eventRoutes.js
        }
        
        res.json({
            message: 'Login successful',
            user: userData,
            redirect: redirectUrl
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        var { name, email, phone, password, role, companyName } = req.body;
        
        // Validate input
        if (role === 'sponsor' && !companyName) {
            return res.status(400).json({ error: 'Company name is required for sponsors' });
        }
        name = (role === 'sponsor') ? companyName : name;
        // Create user
        const [userResult] = await pool.query(
            'INSERT INTO users (name, email, phone, password, userType) VALUES (?, ?, ?, ?, ?)',
            [name, email, phone, password, role]
        );

        // If sponsor, create sponsor record
        if (role === 'sponsor'){
            await pool.query(
                'INSERT INTO sponsors (companyname, contactno, user_id) VALUES (?, ?, ?)',
                [companyName, phone, userResult.insertId]
            );
        }
        
        // Define redirect URL based on role (not user, since it doesn't exist here)
        let redirectUrl = '/';
        if (role === 'sponsor') {
            redirectUrl = '/sponsor';
        } else if (role === 'participant') {
            redirectUrl = '/events';
        }
        
        res.status(201).json({
            message: 'Registration successful',
            userId: userResult.insertId,
            role: role,
            redirect: redirectUrl
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};