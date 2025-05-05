const pool = require('../db/connection');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
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
        
        res.json({
            message: 'Login successful',
            user: userData,
            redirect: user.userType === 'sponsor' 
            ? '/sponsor' 
            : user.userType === 'participant' 
              ? '/events' 
              : '/'
          
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

        res.status(201).json({
            message: 'Registration successful',
            userId: userResult.insertId,
            role: role
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};