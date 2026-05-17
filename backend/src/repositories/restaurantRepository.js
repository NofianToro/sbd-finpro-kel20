const db = require("../database/db");

const restaurantRepository = {
    createRestaurant: async (restoData) => {
        const { username, display_name, url_img, password, phone } = restoData;
        const query = `
            INSERT INTO master_restaurant (username, display_name, url_img, password, phone)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING restaurant_id, username, display_name;
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
        const query = `SELECT * FROM master_restaurant WHERE username = $1;`;
        try {
            const result = await db.query(query, [username]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    updateRestaurantImage: async (restaurantId, newUrlImg) => {
        const query = `
            UPDATE master_restaurant
            SET url_img = $1
            WHERE restaurant_id = $2
            RETURNING restaurant_id, display_name, url_img;
        `;
        try {
            const result = await db.query(query, [newUrlImg, restaurantId]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    getAllRestaurant: async() =>{
        const query = `SELECT * FROM master_restaurant;`;
        try {
            const result = await db.query(query);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = restaurantRepository;
