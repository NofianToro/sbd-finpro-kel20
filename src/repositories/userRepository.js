const db = require("../database/db");

const userRepository = {
  createUser: async (userData) => {
    const { username, display_name, url_profile, phone, password } = userData;
    const query = `
            INSERT INTO master_user (username, display_name, url_profile, phone, password)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING user_id, username, display_name, saldo;
        `;
    const values = [username, display_name, url_profile, phone, password];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getUserByUsername: async (username) => {
    const query = `SELECT * FROM master_user WHERE username = $1;`;
    try {
      const result = await db.query(query, [username]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
};

module.exports = userRepository;
