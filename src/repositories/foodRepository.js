const db = require("../database/db");


const foodRepository ={
    createFood: async (foodData) => {
        const { restoran_id, food_name, url_img, url_video, price, category, description, stok } = foodData;
        const query =`
                INSERT INTO food (restoran_id, food_name, url_img, url_video, price, category, description, stok)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING food_id, food_name, url_img, url_video, price, category, description, stok;
            `;
        const values = [restoran_id, food_name, url_img, url_video, price, category, description, stok]

        try {
            const result = await db.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw(error);
        }
    },
    getFoodbyName: async (food_name) => { // this is not exclusive to one food, prob need to add regex later
         const query = `SELECT * FROM food WHERE food_name = $1;`;
        try {
            const result = await db.query(query, [food_name]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    },
    getFoodbyId: async (food_id) => {
        const query = `SELECT * FROM food WHERE food_id = $1;`;
        try {
            const result = await db.query(query, [food_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },
    getFoodbyRestaurantId: async (restoran_id) => {
        const query = `SELECT * FROM food WHERE restoran_id = $1;`;
        try {
            const result = await db.query(query, restoran_id);
            result.rows;
        } catch (error) {
            throw error;
        }
        
    }
};

module.exports = foodRepository;