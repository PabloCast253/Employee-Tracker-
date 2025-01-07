// db/connection.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',          // <-- Your actual username
  host: 'localhost',
  database: 'employee_db',   // <-- Your actual database name
  password: 'Lovetv253', // <-- Your actual password
  port: 5432,
});

module.exports = pool;