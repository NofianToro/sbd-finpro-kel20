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

  getAllUser: async () => {
    const query = `SELECT * FROM master_user ORDER BY user_id ASC;`;
    try {
      const result = await db.query(query);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
  getUserById: async (user_id) => {
    const query = `SELECT * FROM master_user WHERE user_id = $1;`;

    try {
      const result = await db.query(query, [user_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  updateSaldo: async (user_id, saldo) => {
    const query = `
            UPDATE master_user
            SET saldo = saldo+$1
            WHERE user_id = $2
            RETURNING *;
        `;

    try {
      const result = await db.query(query, [saldo, user_id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },
  updateUserProfileImage: async (user_id, newUrlImg) => {
        const query = `
            UPDATE master_user
            SET url_profile = $1
            WHERE user_id = $2
            RETURNING user_id, display_name, url_profile;
        `;
        try {
            const result = await db.query(query, [newUrlImg, user_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
};

module.exports = userRepository;
