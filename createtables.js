require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Bypass SSL certificate validation
    },
  });

const createTables = async () => {
  try {
    const query = `
      ALTER TABLE users ADD COLUMN bio TEXT DEFAULT NULL;


    `;

    await pool.query(query);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    pool.end();
  }
};

createTables();
