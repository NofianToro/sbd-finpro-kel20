const db = require("../database/db");

const foodRepository = {
  createFood: async (foodData) => {
    const {
      restaurant_id,
      url_img,
      url_video,
      price,
      category,
      description,
      stok,
    } = foodData;
    const query = `
            INSERT INTO food (restaurant_id, url_img, url_video, price, category, description, stok)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
    const values = [
      restaurant_id,
      url_img,
      url_video,
      price,
      category,
      description,
      stok,
    ];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  },

  getAllFood: async (searchQuery = null, category = null) => {
    let query = `
            SELECT f.*, r.display_name as nama_restaurant
            FROM food f
            JOIN master_restaurant r ON f.restaurant_id = r.restaurant_id
            WHERE 1=1
        `;
    const values = [];
    let index = 1;

    if (searchQuery) {
      query += ` AND (f.description ILIKE $${index} OR f.category ILIKE $${index} OR r.display_name ILIKE $${index})`;
      values.push(`%${searchQuery}%`);
      index++;
    }

    if (category) {
      query += ` AND f.category = $${index}`;
      values.push(category);
      index++;
    }

    query += ` ORDER BY f.total_likes DESC;`;

    try {
      const result = await db.query(query, values);
      return result.rows;
    } catch (error) {
      throw error;
    }
  },
};

module.exports = foodRepository;
