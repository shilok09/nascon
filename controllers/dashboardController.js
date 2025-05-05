const db = require('../db/connection');

// Get dashboard page
exports.getDashboardPage = (req, res) => {
    res.render('dashboard', {
        title: 'Admin Dashboard - NASCON'
    });
};

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
    try {
        console.log("Fetching dashboard statistics...");
        
        // Get total number of events (not just active ones)
        const [eventsResult] = await db.query(`
            SELECT COUNT(*) as count 
            FROM events
        `);
        console.log("Events count result:", eventsResult);
        
        // Get total registrations
        const [registrationsResult] = await db.query(`
            SELECT COUNT(*) as count 
            FROM registrations
        `);
        console.log("Registrations count result:", registrationsResult);
        
        // Get total sponsorship revenue
        const [sponsorshipResult] = await db.query(`
            SELECT COALESCE(SUM(cost), 0) as total 
            FROM sponsorpackage
        `);
        console.log("Sponsorship revenue result:", sponsorshipResult);
        
        // Check if accommodationrequest table exists and get count
        const [accommodationRequestCheck] = await db.query(`
            SELECT COUNT(*) as count
            FROM information_schema.tables
            WHERE table_schema = 'nascon'
            AND table_name = 'accommodationrequest'
        `);
        console.log("Accommodation request table check:", accommodationRequestCheck);
        
        let accommodationCount = 0;
        
        if (accommodationRequestCheck[0].count > 0) {
            // Table exists, get the count
            const [accommodationRequests] = await db.query(`
                SELECT COUNT(*) as count FROM accommodationrequest
            `);
            console.log("Accommodation requests count:", accommodationRequests);
            accommodationCount = accommodationRequests[0].count;
        }
        
        // Check if payment_amount column exists in registrations
        const [registrationColumnsCheck] = await db.query(`
            SELECT COUNT(*) as count 
            FROM information_schema.columns 
            WHERE table_schema = 'nascon' 
            AND table_name = 'registrations' 
            AND column_name = 'payment_amount'
        `);
        console.log("Registration payment_amount column check:", registrationColumnsCheck);
        
        // Check if payment_amount column exists in accommodationrequest
        let accommodationColumnsCheck = [{count: 0}];
        if (accommodationRequestCheck[0].count > 0) {
            [accommodationColumnsCheck] = await db.query(`
                SELECT COUNT(*) as count 
                FROM information_schema.columns 
                WHERE table_schema = 'nascon' 
                AND table_name = 'accommodationrequest' 
                AND column_name = 'payment_amount'
            `);
            console.log("Accommodation payment_amount column check:", accommodationColumnsCheck);
        }
        
        // Financial summary with conditional queries based on column existence
        let registrationRevenue = 0;
        let accommodationRevenue = 0;
        
        if (registrationColumnsCheck[0].count > 0) {
            const [regResult] = await db.query(`
                SELECT COALESCE(SUM(payment_amount), 0) as total 
                FROM registrations
            `);
            console.log("Registration revenue result:", regResult);
            registrationRevenue = regResult[0].total;
        }
        
        if (accommodationColumnsCheck[0].count > 0) {
            const [accomResult] = await db.query(`
                SELECT COALESCE(SUM(payment_amount), 0) as total 
                FROM accommodationrequest
            `);
            console.log("Accommodation revenue result:", accomResult);
            accommodationRevenue = accomResult[0].total;
        }
        
        // Prepare response data
        const responseData = {
            activeEvents: eventsResult[0].count,
            totalRegistrations: registrationsResult[0].count,
            sponsorshipRevenue: sponsorshipResult[0].total || 0,
            accommodationUsed: accommodationCount,
            pendingActions: 0, // Set to 0, we don't need this anymore
            financialData: {
                registrationRevenue: registrationRevenue,
                sponsorshipRevenue: sponsorshipResult[0].total || 0,
                accommodationRevenue: accommodationRevenue
            }
        };
        
        console.log("Sending dashboard stats response:", responseData);
        
        // Return all data
        res.json(responseData);
        
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch dashboard statistics', 
            details: error.message,
            // Provide default values to prevent NaN in the UI
            activeEvents: 0,
            totalRegistrations: 0,
            sponsorshipRevenue: 0,
            accommodationUsed: 0,
            pendingActions: 0,
            financialData: {
                registrationRevenue: 0,
                sponsorshipRevenue: 0,
                accommodationRevenue: 0
            }
        });
    }
};

// Get current sponsorships for dashboard
exports.getCurrentSponsorships = async (req, res) => {
    try {
        console.log("Fetching current sponsorships...");
        
        // Check if sponsorcontract table exists
        const [contractTableCheck] = await db.query(`
            SELECT COUNT(*) as count
            FROM information_schema.tables
            WHERE table_schema = 'nascon'
            AND table_name = 'sponsorcontract'
        `);
        console.log("Contract table check:", contractTableCheck);
        
        // Check if the sponsorcategory table exists
        const [categoryTableCheck] = await db.query(`
            SELECT COUNT(*) as count
            FROM information_schema.tables
            WHERE table_schema = 'nascon'
            AND table_name = 'sponsorcategory'
        `);
        console.log("Category table check:", categoryTableCheck);
        
        let sponsorships = [];
        
        // Base query - always query the sponsorpackage table which should exist
        if (contractTableCheck[0].count > 0 && categoryTableCheck[0].count > 0) {
            // Both tables exist, use the full join
            [sponsorships] = await db.query(`
                SELECT 
                    sp.packageId AS id,
                    COALESCE(scat.categoryName, 'Unknown') AS category,
                    CASE 
                        WHEN sp.packagename LIKE '%Platinum%' THEN 'Platinum'
                        WHEN sp.packagename LIKE '%Gold%' THEN 'Gold'
                        WHEN sp.packagename LIKE '%Silver%' THEN 'Silver'
                        WHEN sp.packagename LIKE '%Bronze%' THEN 'Bronze'
                        WHEN sp.packagename LIKE '%Event%' THEN 'Event Specific'
                        ELSE 'Custom'
                    END AS type,
                    sc.contractdate AS contractDate,
                    sp.cost AS amount
                FROM sponsorpackage sp
                LEFT JOIN sponsorcontract sc ON sp.sponsorId = sc.sponsorId
                LEFT JOIN sponsorcategory scat ON sp.category_Id = scat.categoryId
                ORDER BY sp.cost DESC
                LIMIT 10
            `);
        } else if (contractTableCheck[0].count > 0) {
            // Only contract table exists, no category table
            [sponsorships] = await db.query(`
                SELECT 
                    sp.packageId AS id,
                    'N/A' AS category,
                    CASE 
                        WHEN sp.packagename LIKE '%Platinum%' THEN 'Platinum'
                        WHEN sp.packagename LIKE '%Gold%' THEN 'Gold'
                        WHEN sp.packagename LIKE '%Silver%' THEN 'Silver'
                        WHEN sp.packagename LIKE '%Bronze%' THEN 'Bronze'
                        WHEN sp.packagename LIKE '%Event%' THEN 'Event Specific'
                        ELSE 'Custom'
                    END AS type,
                    sc.contractdate AS contractDate,
                    sp.cost AS amount
                FROM sponsorpackage sp
                LEFT JOIN sponsorcontract sc ON sp.sponsorId = sc.sponsorId
                ORDER BY sp.cost DESC
                LIMIT 10
            `);
        } else {
            // Minimal query if no other tables exist
            [sponsorships] = await db.query(`
                SELECT 
                    sp.packageId AS id,
                    'N/A' AS category,
                    CASE 
                        WHEN sp.packagename LIKE '%Platinum%' THEN 'Platinum'
                        WHEN sp.packagename LIKE '%Gold%' THEN 'Gold'
                        WHEN sp.packagename LIKE '%Silver%' THEN 'Silver'
                        WHEN sp.packagename LIKE '%Bronze%' THEN 'Bronze'
                        WHEN sp.packagename LIKE '%Event%' THEN 'Event Specific'
                        ELSE 'Custom'
                    END AS type,
                    CURRENT_DATE() AS contractDate,
                    sp.cost AS amount
                FROM sponsorpackage sp
                ORDER BY sp.cost DESC
                LIMIT 10
            `);
        }
        
        console.log("Sponsorships result:", sponsorships);
        res.json(sponsorships);
    } catch (error) {
        console.error('Error fetching sponsorships:', error);
        res.status(500).json({ error: 'Failed to fetch sponsorships', details: error.message });
    }
};

// Get simplified dashboard statistics (fallback endpoint)
exports.getSimpleDashboardStats = async (req, res) => {
    try {
        console.log("Fetching simplified dashboard statistics...");
        
        // Test direct queries without all the checks
        let eventsCount = 0;
        let registrationsCount = 0;
        let sponsorshipTotal = 0;
        let accommodationCount = 0;
        
        try {
            const [eventsResult] = await db.query('SELECT COUNT(*) as count FROM events');
            eventsCount = eventsResult[0].count;
            console.log("Events count:", eventsCount);
        } catch (err) {
            console.error("Error querying events:", err.message);
        }
        
        try {
            const [registrationsResult] = await db.query('SELECT COUNT(*) as count FROM registrations');
            registrationsCount = registrationsResult[0].count;
            console.log("Registrations count:", registrationsCount);
        } catch (err) {
            console.error("Error querying registrations:", err.message);
        }
        
        try {
            const [sponsorshipResult] = await db.query('SELECT COALESCE(SUM(cost), 0) as total FROM sponsorpackage');
            sponsorshipTotal = sponsorshipResult[0].total;
            console.log("Sponsorship total:", sponsorshipTotal);
        } catch (err) {
            console.error("Error querying sponsorpackage:", err.message);
        }
        
        try {
            const [accommodationResult] = await db.query('SELECT COUNT(*) as count FROM accommodationrequest');
            accommodationCount = accommodationResult[0].count;
            console.log("Accommodation count:", accommodationCount);
        } catch (err) {
            console.error("Error querying accommodationrequest:", err.message);
        }
        
        // Create response with only the data we successfully gathered
        const responseData = {
            activeEvents: eventsCount,
            totalRegistrations: registrationsCount,
            sponsorshipRevenue: sponsorshipTotal,
            accommodationUsed: accommodationCount,
            pendingActions: 0,
            financialData: {
                registrationRevenue: 0, // Default to 0 for simplified version
                sponsorshipRevenue: sponsorshipTotal,
                accommodationRevenue: 0 // Default to 0 for simplified version
            }
        };
        
        console.log("Sending simplified dashboard stats response:", responseData);
        res.json(responseData);
        
    } catch (error) {
        console.error('Error fetching simplified dashboard stats:', error);
        res.status(500).json({ 
            error: 'Failed to fetch dashboard statistics', 
            details: error.message,
            activeEvents: 0,
            totalRegistrations: 0,
            sponsorshipRevenue: 0,
            accommodationUsed: 0,
            pendingActions: 0,
            financialData: {
                registrationRevenue: 0,
                sponsorshipRevenue: 0,
                accommodationRevenue: 0
            }
        });
    }
}; 