const db = require('../db/connection');

// Get the sponsor page
exports.getSponsorPage = (req, res) => {
    res.render('Sponsor', {
        title: 'Sponsor NASCON'
    });
};

// Get available sponsorship packages
exports.getAvailablePackages = async (req, res) => {
    try {
        const [packages] = await db.query(`
            SELECT packageId, packagename, cost
            FROM sponsorpackage
        `);
        res.json(packages);
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ message: 'Failed to fetch sponsorship packages' });
    }
};

// Submit a new sponsorship
exports.submitSponsorship = async (req, res) => {
    try {
        const { categoryType, amount, contractDate, description, sponsorType } = req.body;
        
        // Get sponsorId from authenticated user or request
        // For now, using a placeholder - you would get this from auth session
        const sponsorId = req.body.sponsorId || 1; // Placeholder
        
        // Map category types to categoryIds (1-6 for simplicity)
        let categoryId = 1; // Default to 1
        switch(categoryType) {
            case 'Platinum': categoryId = 1; break;
            case 'Gold': categoryId = 2; break;
            case 'Silver': categoryId = 3; break;
            case 'Bronze': categoryId = 4; break;
            case 'Event Specific': categoryId = 5; break;
            case 'Custom': categoryId = 6; break;
        }
        
        // Begin transaction
        await db.query('START TRANSACTION');
        
        // Insert contract details
        const [contractResult] = await db.query(
            'INSERT INTO sponsorcontract (sponsorId, contractdate, contractdetails) VALUES (?, ?, ?)',
            [sponsorId, contractDate, description]
        );
        
        const contractId = contractResult.insertId;
        
        // Create package for the sponsor - including both categoryId and sponsorcategoryID fields
        const [packageResult] = await db.query(
            'INSERT INTO sponsorpackage (category_Id, sponsorId, packagename, cost) VALUES (?, ?, ?, ?)',
            [categoryId,sponsorId, `${categoryType} Package (${sponsorType})`, amount]
        );
        
        await db.query('COMMIT');
        
        res.status(201).json({ 
            success: true, 
            message: 'Sponsorship submitted successfully',
            contractId,
            packageId: packageResult.insertId
        });
        
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Error submitting sponsorship:', error);
        res.status(500).json({ 
            message: 'Failed to submit sponsorship', 
            error: error.message,
            errorCode: error.code, 
            sqlState: error.sqlState,
            sqlMessage: error.sqlMessage
        });
    }
};

// Get contracts for a specific sponsor
exports.getMyContracts = async (req, res) => {
    try {
        // In a real app, get sponsorId from authenticated user session
        const sponsorId = req.query.sponsorId || 1; // Default for testing
        
        const [contracts] = await db.query(`
            SELECT sc.contractId, sc.contractdate, sc.contractdetails,
                   sp.packagename, sp.cost
            FROM sponsorcontract sc
            JOIN sponsorpackage sp ON sc.sponsorId = sp.sponsorId
            WHERE sc.sponsorId = ?
        `, [sponsorId]);
        
        res.json(contracts);
    } catch (error) {
        console.error('Error fetching contracts:', error);
        res.status(500).json({ message: 'Failed to fetch contracts' });
    }
};
