# NASCON Admin Dashboard Access

## Admin Credentials
- **Email:** admin@gmail.com
- **Password:** 12345678

## Implementation Details

The admin authentication system works in two ways:

1. **Database Authentication:** 
   - The admin user is stored in the database with userType='admin'
   - When an admin logs in, they are redirected to the admin dashboard at `/dashboard`

2. **Hardcoded Authentication:**
   - For reliability, we've also implemented a hardcoded check in the authentication controller
   - This ensures admin access even if there are database connectivity issues

## Files Modified

1. **controllers/authController.js**
   - Added special handling for admin credentials
   - Updated redirect logic to route admins to dashboard

2. **public/js/login.js** 
   - Simplified redirect logic to always follow server-provided routes
   - Ensures admin users are properly directed to the dashboard

3. **db/setup_admin_user.sql**
   - SQL script to ensure admin user exists in the database
   - Creates users table if it doesn't exist
   - Inserts admin user if not already present

4. **db/setup_admin.js**
   - JavaScript utility to execute the SQL script
   - Makes creating/updating the admin user easy

## Dashboard Access

After logging in with admin credentials, you'll be automatically redirected to the admin dashboard at `/dashboard` where you can:

- View event statistics 
- Monitor registrations
- Track sponsorship revenue
- View accommodation requests
- Access quick actions for event management

## Troubleshooting

If you encounter login issues:
1. Ensure the database is properly connected
2. Verify the admin user exists in the users table
3. Run the setup script: `node db/setup_admin.js` 