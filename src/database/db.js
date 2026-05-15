const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
  ssl: {
    rejectUnauthorized: false,
  },
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log("Connected to PostgreSQL database at Neon");
  } catch (err) {
    console.error(err);
  }
};

connectDB();
module.exports = pool;
