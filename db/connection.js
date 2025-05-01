// Import mysql2 library
const mysql = require('mysql2');

// Create a database connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'shilu123',
  database: 'nascon',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the promise-based pool
module.exports = pool.promise();
