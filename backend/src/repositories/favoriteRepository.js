const db = require('../database/db');

const favoriteRepository = {

    addFavorite: async (user_id, food_id) => {
        const query = `
            INSERT INTO favorit_user
            (user_id, food_id)
            VALUES ($1, $2)
            RETURNING *;
        `;
        try {
            const result =
                await db.query(query, [user_id, food_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    removeFavorite: async (user_id, food_id) => {
        const query = `
            DELETE FROM favorit_user
            WHERE user_id = $1
            AND food_id = $2
            RETURNING *;
        `;
        try {
            const result = await db.query(query, [user_id, food_id]);
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    },

    getFavoritesByUserId: async (user_id) => {
        const query = `
            SELECT
                f.*
            FROM favorit_user fu
            JOIN food f
            ON fu.food_id = f.food_id
            WHERE fu.user_id = $1;
        `;

        try {
            const result = await db.query(query, [user_id]);
            return result.rows;
        } catch (error) {
            throw error;
        }
    }
};

module.exports = favoriteRepository;