const db = require("../database/db");


const restaurantRepository = {
    createRestaurant: async (restaurantData) => {
        const { username, display_name, url_img, password, phone } = restaurantData;
        const query = `
                INSERT INTO master_restoran (username, display_name, url_img, password, phone)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING restoran_id, username, display_name;
            `;
        const values = [username, display_name, url_img, password, phone];

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getRestaurantByUsername: async (username) => {
        const query = `SELECT * FROM master_restoran WHERE username = $1;`;
        try {
            const result = await db.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getAllRestaurant: async (params) => {
        const query = `SELECT * FROM master_restoran;`;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
};

module.exports = restaurantRepository;