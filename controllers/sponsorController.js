exports.getSponsorPage = (req, res) => {
    console.log('Rendering sponsor page...'); // Debug log
    try {
        res.render('Sponsor', {  
            title: 'Sponsor - NASCON',
        });
    } catch (err) {
        console.error('Render error:', err);
        res.status(500).send('Error loading sponsor page');
    }
};