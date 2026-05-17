const { Pool } = require("pg");
require("dotenv").config({ path: '.env.new' });

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: { rejectUnauthorized: false }
});

const connect = async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database at Neon");
    client.release();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const query = async (text, params) => {
  return await pool.query(text, params);
};

module.exports = { connect, query, pool, };
