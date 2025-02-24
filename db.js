require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Bypass SSL certificate validation
    },
  });

pool.connect()
  .then(() => console.log("Connected to prac6 database"))
  .catch(err => console.error("Database connection error", err));

module.exports = pool;