# NASCON Event Management System

![NASCON](https://images.unsplash.com/photo-1656283384093-1e227e621fad?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3)

## Project Overview

NASCON (National Solutions Convention) is an annual tech and business event by FAST-NUCES Islamabad, one of Pakistan's largest inter-university competitions. This web application provides a comprehensive event management system that includes event registration, sponsorship management, accommodation requests, and administrative dashboard.

## Features

### User Management
- **Multiple User Roles**: Admin, Participant, Sponsor
- **Authentication**: Secure login and registration
- **Role-Based Access**: Different views and features for each role

### Admin Dashboard
- **Analytics Dashboard**: View KPIs including event statistics, registration numbers, sponsorship revenue, and accommodation requests
- **Financial Overview**: Track revenue from registrations, sponsorships, and accommodations
- **Sponsorship Management**: Track and manage sponsorship packages and contracts
- **Data Visualization**: Charts and visual representations of key metrics

### Event Management
- **Event Listing**: Browse and search for events
- **Event Registration**: Register for events individually or in teams
- **Event Categories**: Computing, Concerts, and Sports

### Sponsorship
- **Sponsor Registration**: Companies can register as sponsors
- **Sponsorship Packages**: Various tiers (Platinum, Gold, Silver, Bronze)
- **Sponsor Dashboard**: For sponsors to manage their participation

### Accommodation
- **Accommodation Requests**: Participants can request accommodation
- **Accommodation Management**: Admin approval and tracking

## Tech Stack

- **Frontend**:
  - HTML5, CSS3, JavaScript
  - Tailwind CSS for styling
  - Chart.js for data visualization
  - ECharts for advanced charts (heatmaps)

- **Backend**:
  - Node.js
  - Express.js
  - EJS templating

- **Database**:
  - MySQL

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8 or higher)

### Steps to Run Locally

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/nascon-event-management.git
   cd nascon-event-management
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Configure database**
   - Create a MySQL database named `nascon`
   - Update the database credentials in `db/connection.js` if needed

4. **Set up database tables**
   - Run the following command to set up database tables and add the admin user:
   ```
   node db/setup.js
   ```

5. **Start the application**
   ```
   npm start
   ```
   The application will be available at http://localhost:3000

## Admin Access

- **Email**: admin@gmail.com
- **Password**: 12345678

## Project Structure

```
nascon/
├── controllers/             # Request handlers
│   ├── authController.js    # Authentication logic
│   ├── dashboardController.js # Admin dashboard logic
│   ├── eventController.js   # Event management logic
│   └── sponsorController.js # Sponsorship logic
├── db/                      # Database-related files
│   ├── connection.js        # Database connection
│   └── setup.js             # Database initialization
├── public/                  # Static assets
│   ├── css/                 # Stylesheets
│   ├── js/                  # Client-side JavaScript
│   └── images/              # Images
├── routes/                  # Express routes
│   ├── authRoutes.js        # Authentication routes
│   ├── dashboardRoutes.js   # Dashboard routes
│   ├── eventRoutes.js       # Event routes
│   └── sponsorRoutes.js     # Sponsorship routes
├── views/                   # EJS templates
│   ├── partials/            # Reusable components
│   ├── dashboard.ejs        # Admin dashboard view
│   ├── events.ejs           # Events listing view
│   ├── index.ejs            # Homepage
│   ├── login-register.ejs   # Login/Registration page
│   └── sponsor.ejs          # Sponsor dashboard
├── app.js                   # Main application file
└── README.md                # This file
```

## Key Pages

- **Home**: `/` - Landing page with event information
- **Login/Register**: `/login-register` - User authentication
- **Events**: `/events` - Event listings and registration
- **Sponsor**: `/sponsor` - Sponsor dashboard
- **Admin Dashboard**: `/dashboard` - Admin control panel
- **Accommodation**: `/accommodation` - Accommodation requests

## Database Schema

The application uses several interconnected tables:

- **users**: User information and authentication
- **events**: Event details including name, date, venue
- **registrations**: Event registration records
- **sponsorpackage**: Sponsorship packages and pricing
- **sponsorcontract**: Contracts between sponsors and events
- **accommodationrequest**: Accommodation requests from participants

## Future Enhancements

- Payment gateway integration
- Email notifications
- Mobile application
- Advanced analytics
- QR code-based event check-in

## Contributors

- [Shilok Kumar](https://github.com/shilok09)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- FAST-NUCES Islamabad for the inspiration
- All contributors and participants of NASCON 